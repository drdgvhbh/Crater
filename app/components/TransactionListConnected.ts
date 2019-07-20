import { connect } from 'react-redux';
import { RootState } from '../store/configureStore';
import { detailedTransactions } from '../store/selectors';
import TransactionList from './TransactionList';

const mapStateToProps = (state: RootState) => ({
  transactions: detailedTransactions(state),
});

const dispatchProps = {};

export const TransactionListConnected = connect(
  mapStateToProps,
  dispatchProps,
)(TransactionList);
