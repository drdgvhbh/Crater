import {
  Button,
  createStyles,
  ListItem,
  ListItemText,
  Typography,
  withStyles,
} from '@material-ui/core';
import { TypographyProps } from '@material-ui/core/Typography';
import { WithStyles } from '@material-ui/styles';
import moment from 'moment';
import React from 'react';
import { PaymentOperationRecord } from '../store/state/reducer';
import CopyToClipboardTooltip from './CopyToClipboardButton';
import TruncatedPublicKey from './TruncatedPublicKey';

const styles = () =>
  createStyles({
    publicKey: {
      padding: 0,
      fontWeight: 400,
    },
    importantText: {
      fontWeight: 500,
    },
  });

export interface PaymentOperationProps extends WithStyles<typeof styles> {
  walletPublicKey: string;
  operation: PaymentOperationRecord;
}

const PaymentOperation = (props: PaymentOperationProps & TypographyProps) => {
  const { operation, classes, walletPublicKey, ...args } = props;

  const amount = new Intl.NumberFormat('en-CA', {}).format(
    Number(operation.amount),
  );
  const createdAt = moment(operation.created_at);

  return (
    <ListItem>
      <ListItemText
        primary={
          <React.Fragment>
            {(() => {
              if (operation.to === walletPublicKey) {
                return (
                  <Typography variant="body2" component={'span'} {...args}>
                    {`Received `}
                  </Typography>
                );
              }
              return (
                <Typography variant="body2" component={'span'} {...args}>
                  {`Sent `}
                </Typography>
              );
            })()}
            <Typography
              className={classes.importantText}
              variant="body2"
              component={'span'}
            >
              {`${amount} ${operation.asset_type.toUpperCase()}`}
            </Typography>
            {(() => {
              if (operation.to === walletPublicKey) {
                return (
                  <Typography variant="body2" component={'span'} {...args}>
                    {` from `}
                  </Typography>
                );
              }
              return (
                <Typography variant="body2" component={'span'} {...args}>
                  {` to `}
                </Typography>
              );
            })()}
            {(() => {
              if (operation.from === operation.to) {
                return (
                  <Typography
                    className={classes.importantText}
                    variant="body2"
                    component={'span'}
                  >
                    yourself
                  </Typography>
                );
              }

              return (
                <CopyToClipboardTooltip clipboardContent={operation.to}>
                  <Button className={classes.publicKey} size="small">
                    <TruncatedPublicKey publicKey={operation.to} />
                  </Button>
                </CopyToClipboardTooltip>
              );
            })()}

            <Typography variant="body2" component={'span'}>{` at `}</Typography>
            <Typography
              className={classes.importantText}
              variant="body2"
              component={'span'}
            >
              {createdAt.format('HH:mm')}
            </Typography>
            <Typography variant="body2" component={'span'}>{` on `}</Typography>
            <Typography
              className={classes.importantText}
              variant="body2"
              component={'span'}
            >
              {createdAt.format('MM/DD/YY')}
            </Typography>
            <Typography
              variant="body2"
              component={'span'}
              {...args}
            >{`.`}</Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default withStyles(styles)(PaymentOperation);
