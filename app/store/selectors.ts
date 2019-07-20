import BigNumber from 'bignumber.js';
import gradstop from 'gradstop';
import moment, { Moment } from 'moment';
import { createSelector } from 'reselect';
import StellarHDWallet from 'stellar-hd-wallet';
import { Keypair } from 'stellar-sdk';
import { isPaymentOperation } from '../third-party/stellar';
import { RootState } from './configureStore';

const STROOP_TO_XLM_EXCHANGE_RATE = 0.0000001;

export function stroopToXLM(stroop: number): number {
  return stroop * STROOP_TO_XLM_EXCHANGE_RATE;
}

export function deriveExchangeRate(
  currency1: string,
  currency2: string,
  map: { [key: string]: { [key: string]: number } },
): number {
  const currency1Rates = map[currency1];
  if (!currency1Rates) {
    return 0;
  }

  const exchangeRate = currency1Rates[currency2];
  if (!exchangeRate || isNaN(Number(exchangeRate))) {
    return 0;
  }

  return exchangeRate;
}

export const wallet = (state: RootState) => state.wallet;
export const mnemonic = createSelector(
  wallet,
  (w) => w.mnemonic || '',
);
export const isMnemonicValid = createSelector(
  wallet,
  (w) => w.isValid || false,
);
export const accountNumber = createSelector(
  wallet,
  (w) => w.selectedAccountNumber || 0,
);
export const accounts = createSelector(
  wallet,
  (w) => (w.accounts ? w.accounts : {}),
);
export const signingKeypair = createSelector(
  mnemonic,
  accountNumber,
  (m, n) => {
    const accountKP = StellarHDWallet.fromMnemonic(m).getKeypair(n);

    return Keypair.fromSecret(accountKP.secret());
  },
);
export const publicKey = createSelector(
  accounts,
  accountNumber,
  (a, n) => a[n] || '',
);
export const assets = createSelector(
  wallet,
  (w) => w.assets || {},
);
export const accountAssets = createSelector(
  assets,
  accountNumber,
  (a, n) => a[n] || [],
);
export const exchangeRates = createSelector(
  wallet,
  (w) => w.exchangeRates || {},
);
export const accountAssetsInUSD = createSelector(
  accountAssets,
  exchangeRates,
  (a, r) =>
    a.map((asset) => ({
      ...asset,
      usd: asset.amount * deriveExchangeRate(asset.type, 'usd', r),
    })),
);
export const totalAccountValueInUSD = createSelector(
  accountAssetsInUSD,
  (assets) => assets.reduce((acum, val) => acum + val.usd, 0),
);
export const account = createSelector(
  accountNumber,
  publicKey,
  accountAssetsInUSD,
  totalAccountValueInUSD,
  (n, k, a, t) => ({
    number: n,
    publicKey: k,
    assets: a,
    totalAccountValueInUSD: t,
  }),
);
export const assetTypes = createSelector(
  accountAssets,
  (assets) => Array.from(new Set(assets.map((a) => a.type))),
);
export const colorPalette = createSelector(
  accountAssetsInUSD,
  (a) =>
    gradstop({
      stops: Math.max(a.length, 2),
      inputFormat: 'hex',
      colorArray: ['#313A4F', '#7DB2E3'],
    }),
);
export const allTransactions = createSelector(
  wallet,
  (w) => w.transactions || {},
);
export const transactions = createSelector(
  allTransactions,
  publicKey,
  (trxs, pubKey) => trxs[pubKey] || [],
);
export const allOperations = createSelector(
  wallet,
  (w) => w.operations,
);

export const netTrxEarningsInUSD = createSelector(
  transactions,
  exchangeRates,
  allOperations,
  publicKey,
  (trxs, rates, o, pk) => {
    const trxCosts = trxs.map((trx) => {
      const exchangeRate = deriveExchangeRate('xlm', 'usd', rates);
      const feeCost = stroopToXLM(trx.fee_paid) * exchangeRate;
      const totalOpCost = trx.operations
        .map((opID) => {
          const op = o[opID];
          let netEarnings = new BigNumber(0);
          if (isPaymentOperation(op)) {
            const amount = new BigNumber(op.amount).times(
              new BigNumber(exchangeRate),
            );
            if (op.from === pk) {
              netEarnings = netEarnings.minus(amount);
            }
            if (op.to === pk) {
              netEarnings = netEarnings.plus(amount);
            }
          }

          return netEarnings;
        })
        .reduce((bn, val) => bn.plus(val), new BigNumber(-feeCost));
      return totalOpCost;
    });

    return trxs.reduce(
      (map, trx, idx) => {
        map[trx.id] = trxCosts[idx].toNumber();

        return map;
      },
      {} as { [key: string]: number },
    );
  },
);

export const transactionOperationsPerformed = createSelector(
  transactions,
  allOperations,
  (trxs, ops) => {
    const opsPerformed = trxs.map((trx) => {
      const trxOps = trx.operations.map((opId) => ops[opId]);
      return trxOps.map((op) => op.type);
    });

    return trxs.reduce(
      (map, trx, idx) => {
        map[trx.id] = opsPerformed[idx];

        return map;
      },
      {} as { [key: string]: string[] },
    );
  },
);

export const detailedTransactions = createSelector(
  transactions,
  netTrxEarningsInUSD,
  transactionOperationsPerformed,
  (trxs, earnings, opsPerformed) =>
    trxs.map((trx) => {
      const { created_at, ...args } = trx;

      return {
        ...args,
        createdAt: moment(trx.created_at),
        costInUSD: earnings[trx.id],
        opsPerformed: opsPerformed[trx.id],
      };
    }),
);

export const baseFee = createSelector(
  wallet,
  (w) => w.baseFee,
);

export const baseFeeInXLM = createSelector(
  wallet,
  (w) => stroopToXLM(w.baseFee),
);

export const baseFeeWithUSD = createSelector(
  baseFeeInXLM,
  exchangeRates,
  (fee, rates) => ({
    xlm: fee,
    usd: fee * deriveExchangeRate('xlm', 'usd', rates),
  }),
);

const signatureState = createSelector(
  wallet,
  (w) => w.signature,
);

export const pendingTransaction = createSelector(
  signatureState,
  exchangeRates,
  (s, rates) => ({
    ...s.transaction,
    timebounds: s.transaction.timebounds.map((datetime) =>
      moment(datetime),
    ) as [Moment, Moment],
    fee: {
      stroops: s.transaction.fee,
      xlm: stroopToXLM(s.transaction.fee),
      usd:
        stroopToXLM(s.transaction.fee) *
        deriveExchangeRate('xlm', 'usd', rates),
    },
  }),
);

export const horizon = (state: RootState) => state.horizon;

export const horizonServerURL = createSelector(
  horizon,
  (h) => h.serverURL,
);
