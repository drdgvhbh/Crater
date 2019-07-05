import {
  createStyles,
  List,
  ListItem,
  ListItemText,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import React from 'react';
import { isPaymentOperation } from '../third-party/stellar';
import PaymentOperation from './PaymentOperationListItem';
import { OperationsSelector } from './TransactionOperationDetailsConnected';

const styles = (theme: Theme) =>
  createStyles({
    listItemContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
  });

interface TransactionOperationDetailsProps extends WithStyles<typeof styles> {
  transactionFee: number;
  operationIDs: string[];
  getOperations: OperationsSelector;
  walletPublicKey: string;
}

const TransactionOperationDetails = ({
  getOperations,
  operationIDs,
  walletPublicKey,
  classes,
}: TransactionOperationDetailsProps) => {
  const operations = getOperations(operationIDs);

  return (
    <List>
      <ListItem>
        <div className={classes.listItemContainer}>
          <Typography variant="subtitle2">Operations</Typography>
          <List>
            {operations.map((op) => {
              if (isPaymentOperation(op)) {
                return (
                  <PaymentOperation
                    variant="body2"
                    key={op.id}
                    operation={op}
                    walletPublicKey={walletPublicKey}
                  />
                );
              }
              return null;
            })}
          </List>
        </div>
      </ListItem>
    </List>
  );
};

export default withStyles(styles)(TransactionOperationDetails);
