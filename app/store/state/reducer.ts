import produce from 'immer';
import StellarSdk from 'stellar-sdk';
import * as fromActions from './actions';
import { signatureReducer } from './signature';

export interface AssetWithUSDValue extends Asset {
  usd: number;
}

export interface Asset {
  type: string;
  amount: number;
}

interface Accounts {
  [key: number]: string;
}

interface Assets {
  [key: number]: Asset[];
}

interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  };
}

export type TransactionRecord = Omit<
  StellarSdk.Server.TransactionRecord,
  'operations'
> & { operations: string[] };

export interface TransactionRecords {
  [key: string]: TransactionRecord[];
}

export type OperationRecord = Omit<
  StellarSdk.Server.OperationRecord,
  'asset_type'
> & {
  asset_type?: string;
};

export interface OperationRecords {
  [key: string]: OperationRecord;
}

export type PaymentOperationRecord = Omit<
  StellarSdk.Server.PaymentOperationRecord,
  'asset_type'
> & {
  asset_type: string;
};

export const initialState = {
  mnemonic: '',
  isValid: true,
  selectedAccountNumber: 0,
  baseFee: 0,
  accounts: {} as Accounts,
  assets: {} as Assets,
  exchangeRates: {} as ExchangeRates,
  operations: {} as OperationRecords,
  transactions: {} as TransactionRecords,
};
export type State = typeof initialState;

export const walletReducer = (
  state: State,
  action: fromActions.Actions,
): State =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_MNEMONIC:
        draft.mnemonic = action.payload;
        break;
      case fromActions.VALIDATE_MNEMONIC_FAILED:
        draft.isValid = false;
        break;
      case fromActions.VALIDATE_MNEMONIC_SUCCEEDED:
        draft.isValid = true;
        break;
      case fromActions.SET_ACCOUNTS:
        const accounts: Accounts = {};
        const assets: Assets = {};
        action.payload.accounts.forEach(
          ({ accountNumber, publicKey, ...args }) => {
            accounts[accountNumber] = publicKey;
            assets[accountNumber] = args.assets;
          },
        );
        draft.accounts = accounts;
        draft.assets = assets;
        break;
      case fromActions.SET_EXCHANGE_RATES:
        const { rates } = action.payload;
        rates.forEach((pair) => {
          const [currency1, currency2, rate] = pair;
          draft.exchangeRates[currency1] = draft.exchangeRates[currency1] || {};
          draft.exchangeRates[currency1][currency2] = rate;
        });
        break;
      case fromActions.SET_TRANSACTIONS:
        const { publicKey, transactions } = action.payload;
        draft.transactions[publicKey] = transactions;
        break;
      case fromActions.SET_TRANSACTION_OPERATIONS:
        draft.operations = action.payload;
        break;
      case fromActions.SET_BASE_FEE:
        draft.baseFee = action.payload;
        break;
      default:
        break;
    }
  });

type CombinedState = State & { signature: ReturnType<typeof signatureReducer> };

export const reducer = (
  state = { ...initialState } as CombinedState,
  action: fromActions.Actions,
): CombinedState => {
  return {
    ...walletReducer(state, action),
    signature: signatureReducer(state.signature, action as any),
  };
};
