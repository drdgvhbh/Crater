import {
  Box,
  Button,
  createStyles,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  TextField as NativeTextField,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Moment } from 'moment';
import React from 'react';
import { Operation } from '../store/state/signature/transaction';
import { Signature } from '../store/state/signature/transaction/reducer';
import CopyToClipboardTooltip from './CopyToClipboardButton';
import { FeeConnected } from './FeeConnected';
import ManageDataOperation from './ManageDataOperation';

const styles = () =>
  createStyles({
    timePicker: {
      padding: '0',
      width: '12rem',
    },
  });

export interface TransactionProps {
  transaction: {
    readonly sourceAccount: string;
    readonly sequenceNumber: number;
    readonly memo: string;
    readonly fee: number;
    readonly timebounds: [Moment, Moment];
    readonly operations: Operation[];
    readonly signatures: Signature[];
  };
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

const truncatePubKey = (pubKey: string, percentage: number = 0.35) =>
  `${pubKey.slice(0, pubKey.length * percentage)}...${pubKey.slice(
    pubKey.length - 10,
  )}`;

const UnverifiedTransaction = (
  props: TransactionProps & WithStyles<typeof styles>,
) => {
  const {
    transaction: {
      operations,
      sourceAccount,
      sequenceNumber,
      memo,
      fee,
      timebounds,
      signatures,
    },
  } = props;
  const sourceAccountTruncated = truncatePubKey(sourceAccount);
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
      {timebounds && (
        <Grid item xs={12}>
          <InputLabel htmlFor="timebounds">Timebounds</InputLabel>
          <Box marginTop={1} id="timebounds">
            <Button variant="outlined">
              <Typography variant="caption">
                {timebounds[0].format('MM/DD/YY hh:mm:a')}
              </Typography>
            </Button>
            <Button variant="outlined">
              <Typography variant="caption">
                {timebounds[1].format('MM/DD/YY hh:mm:a')}
              </Typography>
            </Button>
          </Box>
        </Grid>
      )}
      {memo && (
        <Grid item xs={12}>
          {memo}
        </Grid>
      )}
      <Grid item xs={12}>
        <InputLabel>Operations</InputLabel>
        {operations.map((op) => {
          return (
            <Box padding={2}>
              {(() => {
                switch (op.type) {
                  case 'manageData':
                    return (
                      <ManageDataOperation
                        sourceAccount={op.sourceAccount}
                        value={op.value}
                        name={op.name}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </Box>
          );
        })}
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Signers</InputLabel>
        {signatures.map((sig) => (
          <List>
            <ListItem>
              <TextField
                fullWidth
                multiline
                value={truncatePubKey(sig.hint, 0.3)}
              />
            </ListItem>
          </List>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(UnverifiedTransaction);
