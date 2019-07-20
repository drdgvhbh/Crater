import {
  Box,
  Collapse,
  createStyles,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import startcase from 'lodash.startcase';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { detailedTransactions } from '../store/selectors';
import { TransactionOperationDetailsConnected } from './TransactionOperationDetailsConnected';

const styles = (theme: Theme) =>
  createStyles({
    transaction: {
      border: `thin solid ${theme.palette.grey[300]}`,
    },
  });

export interface TransactionListProps extends WithStyles<typeof styles> {
  transactions: ReturnType<typeof detailedTransactions>;
}

const TransactionList = ({ transactions, classes }: TransactionListProps) => {
  const [openIndex, setOpenIndex] = useState(-1);

  const setOrToggleTransactionDetail = (idx: number) => {
    if (openIndex === idx) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(idx);
    }
  };

  return (
    <React.Fragment>
      <List>
        {transactions.map((trx, idx) => {
          const operationPerformed = startcase(
            trx.opsPerformed.length === 1
              ? trx.opsPerformed[0]
              : 'mutliple operations',
          );

          return (
            <div key={trx.id} className={classes.transaction}>
              <ListItem
                button
                onClick={() => setOrToggleTransactionDetail(idx)}
              >
                <div>
                  <ListItemText
                    primary={operationPerformed}
                    secondary={trx.createdAt.format('YYYY/MM/DD — HH:mm:ss')}
                  />
                  <ListItemSecondaryAction>
                    <Typography>
                      {new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(trx.costInUSD)}
                    </Typography>
                  </ListItemSecondaryAction>
                </div>
              </ListItem>
              <Collapse in={openIndex === idx}>
                <TransactionOperationDetailsConnected
                  operationIDs={trx.operations}
                />
              </Collapse>
            </div>
          );
        })}
      </List>
    </React.Fragment>
  );
};

export default withStyles(styles)(TransactionList);
