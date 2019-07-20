import {
  Box,
  Button,
  createStyles,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import CompareArrow from '@material-ui/icons/CompareArrows';
import BigNumber from 'bignumber.js';
import first from 'lodash.first';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import StellarSDK from 'stellar-sdk';
import {
  CryptoCurrencyIcon,
  CurrencyFormat,
  FeeConnected,
} from '../components';
import { Asset } from '../store/state/reducer';
import { stroopToXLM } from '../store/selectors';
import { MoneyPageActions, MoneyPageState } from './MoneyPageConnected';

const styles = () =>
  createStyles({
    assetOption: {
      display: 'flex',
      width: '100%',
    },
    assetDominationSwitcher: {
      transform: 'rotate(90deg)',
    },
    maxButton: {
      padding: 0,
    },
  });

const MoneyPage = (
  props: MoneyPageState & MoneyPageActions & WithStyles<typeof styles>,
) => {
  const { classes, assets, exchangeRates, baseFee, sendTransaction } = props;
  const firstAsset = assets.length > 0 ? assets[0] : undefined;
  const [recipientPublicKey, setRecipientPublicKey] = useState('');
  const [asset, setAsset] = useState<Asset | undefined>(firstAsset);
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>('');

  const isRecipientPublicKeyValid = (() => {
    try {
      if (recipientPublicKey) {
        StellarSDK.Keypair.fromPublicKey(recipientPublicKey);
        return true;
      }
      return true;
    } catch (err) {
      return false;
    }
  })();

  const amountInUSD = (() => {
    if (asset) {
      const assetExchangeRates = exchangeRates[asset.type];
      if (assetExchangeRates) {
        return amount * exchangeRates[asset.type].usd || 0;
      } else {
        return 0;
      }
    }
    return 0;
  })();

  const isSendMoneyButtonDisabled =
    !recipientPublicKey || !amount || !asset || !isRecipientPublicKeyValid;

  const recipientOptionSet = new Set<string>([]);
  if (recipientPublicKey) {
    recipientOptionSet.add(recipientPublicKey.toLowerCase());
  }

  const recipientOptions = Array.from(recipientOptionSet).map((opt) => ({
    value: opt.toUpperCase(),
    label: opt.toUpperCase(),
  }));
  const assetOptions = assets.map((asset) => ({
    value: asset,
    label: (
      <div className={classes.assetOption}>
        <CryptoCurrencyIcon cryptoCurrencyAcronym={asset.type} />
        <Box marginLeft={1}>
          <Typography component={'span'}>{`${asset.type.toUpperCase()} (${
            asset.amount
          })`}</Typography>
        </Box>
      </div>
    ),
  }));

  const setAssetValueToMax = () => {
    if (asset) {
      setAmount(asset.amount);
    }
  };

  return (
    <Box padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputLabel htmlFor="recipient-select">Recipient</InputLabel>
          <Box marginTop={1}>
            <Select
              isSearchable
              options={recipientOptions}
              inputId="recipient-select"
              onInputChange={(input) => {
                if (input) {
                  setRecipientPublicKey(input.toUpperCase());
                }
              }}
              onChange={(opt: any) => {
                setRecipientPublicKey(opt.value as string);
              }}
            />
            {!isRecipientPublicKeyValid && (
              <Typography color="error" variant="caption">
                Address is not valid
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="asset-select">Asset</InputLabel>
          <Box marginTop={1}>
            <Select
              isSearchable
              onChange={(opt: any) => setAsset(opt.value)}
              options={assetOptions}
              inputId="asset-select"
              defaultValue={first(assetOptions)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="amount-input">Amount</InputLabel>
          <Box marginTop={1}>
            <TextField
              id="amount-input"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      marginTop={0.5}
                      marginBottom={0.5}
                      marginLeft={1}
                      marginRight={1}
                    >
                      <Button
                        className={classes.maxButton}
                        color="primary"
                        variant="outlined"
                        size="small"
                        onClick={setAssetValueToMax}
                      >
                        Max
                      </Button>
                    </Box>

                    <Button>
                      <CompareArrow
                        className={classes.assetDominationSwitcher}
                      />
                    </Button>
                  </InputAdornment>
                ),
                inputComponent: CurrencyFormat as any,
                inputProps: {
                  assetAmount: (() => {
                    if (asset) {
                      if (asset.type === 'xlm') {
                        return asset.amount - stroopToXLM(baseFee);
                      }

                      return asset.amount;
                    }

                    return Infinity;
                  })(),
                  assetType: asset ? ` ${asset.type.toUpperCase()}` : '',
                },
              }}
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              helperText={
                asset
                  ? new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(amountInUSD)
                  : ''
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="memo-input">Memo</InputLabel>
          <TextField
            id="memo-input"
            fullWidth
            multiline
            rowsMax={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="fee-input">Fee</InputLabel>
          <FeeConnected stroops={baseFee} />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSendMoneyButtonDisabled}
            onClick={() =>
              sendTransaction({
                recipient: recipientPublicKey,
                asset: {
                  type: asset!!.type,
                  amount: new BigNumber(amount),
                },
                memo: memo || undefined,
              })
            }
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withStyles(styles)(MoneyPage);
