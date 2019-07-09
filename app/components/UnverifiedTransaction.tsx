import {
  Box,
  Button,
  createStyles,
  Grid,
  InputLabel,
  TextField as NativeTextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import moment from 'moment';
import React from 'react';
import StellarSDK from 'stellar-sdk';
import CopyToClipboardTooltip from './CopyToClipboardButton';
import { FeeConnected } from './FeeConnected';

type StellarTransaction = StellarSDK.Transaction;

const styles = () =>
  createStyles({
    timePicker: {
      padding: '0',
      width: '12rem',
    },
  });

export interface TransactionProps {
  transaction: StellarTransaction;
}

const TextField = (props: TextFieldProps) => {
  return (
    <NativeTextField
      id="source-account"
      InputProps={{
        readOnly: true,
      }}
      {...props}
    />
  );
};

const UnverifiedTransaction = (
  props: TransactionProps & WithStyles<typeof styles>,
) => {
  const {
    transaction: {
      operations,
      memo,
      timeBounds,
      fee,
      sequence: sequenceNumber,
      source: sourceAccount,
    },
  } = props;
  const sourceAccountTruncated = `${sourceAccount.slice(
    0,
    sourceAccount.length * 0.45,
  )}...${sourceAccount.slice(sourceAccount.length - 4)}`;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CopyToClipboardTooltip clipboardContent={sourceAccount}>
          <div>
            <InputLabel htmlFor="source-account">Source Account</InputLabel>
            <Box marginTop={1}>
              <TextField
                id="source-account"
                fullWidth
                value={sourceAccountTruncated || ''}
              />
            </Box>
          </div>
        </CopyToClipboardTooltip>
      </Grid>
      <Grid item xs={12}>
        <InputLabel htmlFor="fee">Fee</InputLabel>
        <Box marginTop={1}>
          <FeeConnected stroops={fee} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <InputLabel htmlFor="sequence-number">Sequence Number</InputLabel>
        <Box marginTop={1}>
          <TextField id="sequence-number" fullWidth value={sequenceNumber} />
        </Box>
      </Grid>
      {timeBounds && (
        <Grid item xs={12}>
          <InputLabel htmlFor="timebounds">Timebounds</InputLabel>
          <Box marginTop={1} id="timebounds">
            <Button variant="outlined">
              <Typography variant="caption">
                {moment
                  .unix(Number(timeBounds.minTime))
                  .format('MM/DD/YY hh:mm:a')}
              </Typography>
            </Button>
            <Button variant="outlined">
              <Typography variant="caption">
                {moment
                  .unix(Number(timeBounds.maxTime))
                  .format('MM/DD/YY hh:mm:a')}
              </Typography>
            </Button>
          </Box>
        </Grid>
      )}
      {memo && (
        <Grid item xs={12}>
          {memo.value}
        </Grid>
      )}
      <Grid item xs={12}>
        <InputLabel>Operations</InputLabel>
        {operations.map((op) => (
          <div>{op.type}</div>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(UnverifiedTransaction);
