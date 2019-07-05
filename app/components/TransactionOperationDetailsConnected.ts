import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { RootState } from '../store/configureStore';
import { OperationRecord } from '../store/state/reducer';
import { allOperations, publicKey } from '../store/state/selectors';
import TransactionOperationDetails from './TransactionOperationDetails';

export type OperationsSelector = (operationIDs: string[]) => OperationRecord[];

const mapStateToProps = (state: RootState) => ({
  getOperations: (operationIDs: string[]) =>
    createSelector(
      allOperations,
      (ops) => operationIDs.map((opID) => ops[opID]),
    )(state),
  walletPublicKey: publicKey(state),
});

const dispatchProps = {};

export const TransactionOperationDetailsConnected = connect(
  mapStateToProps,
  dispatchProps,
)(TransactionOperationDetails);
