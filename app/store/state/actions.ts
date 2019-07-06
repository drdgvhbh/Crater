import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import BigNumber from 'bignumber.js';
import StellarSDK from 'stellar-sdk';
import { OperationRecords, TransactionRecord } from './reducer';

export const LOGIN = 'LOGIN';
export const VALIDATE_MNEMONIC = 'VALIDATE_MNEMONIC';
export const VALIDATE_MNEMONIC_FAILED = 'VALIDATE_MNEMONIC_FAILED';
export const VALIDATE_MNEMONIC_SUCCEEDED = 'VALIDATE_MNEMONIC_SUCCEEDED';
export const SET_MNEMONIC = 'SET_MNEMONIC';
export const ADD_MNEMONIC_TO_STORAGE = 'ADD_MNEMONIC_TO_STORAGE';
export const FETCH_PREEXISTING_MNEMONIC = 'FETCH_PREEXISTING_MNEMONIC';
export const ADD_MNEMONIC_TO_STORAGE_SUCCEEDED =
  'ADD_MNEMONIC_TO_STORAGE_SUCCEEDED';
export const ADD_MNEMONIC_TO_STORAGE_FAILED = 'ADD_MNEMONIC_TO_STORAGE_FAILED';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';
export const UPDATE_EXCHANGE_RATES = 'UPDATE_EXCHANGE_RATES';
export const SET_EXCHANGE_RATES = 'SET_EXCHANGE_RATES';
export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_TRANSACTION_OPERATIONS = 'SET_TRANSACTION_OPERATIONS';
export const FETCH_BASE_FEE = 'FETCH_BASE_FEE';
export const SET_BASE_FEE = 'SET_BASE_FEE';
export const SEND_TRANSACTION = 'SEND_TRANSACTION';
export const SEND_TRANSACTION_SUCCEEDED = 'SEND_TRANSACTION_SUCCEEDED';
export const SEND_TRANSACTION_FAILED = 'SEND_TRANSACTION_FAILED';
export const SETUP_EVENT_LISTENERS = 'SETUP_EVENT_LISTENERS';
export const DO_NOTHING = 'DO_NOTHING';

export interface SetAccountsPayload {
  accounts: Array<{
    accountNumber: number;
    publicKey: string;
    assets: Array<{ type: string; amount: number }>;
  }>;
}

export interface SetExchangeRatesPayload {
  rates: Array<[string, string, number]>;
}

export interface LoadTransactionsPayload {
  count: number;
}

export interface SetTransactionsPayload {
  publicKey: string;
  transactions: TransactionRecord[];
}

export interface SendTransactionPayload {
  recipient: string;
  asset: {
    type: string;
    amount: BigNumber;
  };
  memo?: string;
}

export const Actions = {
  login: (mnemonic: string) => createAction(LOGIN, mnemonic),
  fetchPreexistingMnemonic: () => createAction(FETCH_PREEXISTING_MNEMONIC),
  validateMnemonic: (mnemonic: string) =>
    createAction(VALIDATE_MNEMONIC, mnemonic),
  validateMnemonicFailed: () => createAction(VALIDATE_MNEMONIC_FAILED),
  validateMnemonicSucceeded: () => createAction(VALIDATE_MNEMONIC_SUCCEEDED),
  addMnemonicToStorage: (mnemonic: string) =>
    createAction(ADD_MNEMONIC_TO_STORAGE, mnemonic),
  setMnemonic: (mnemonic: string) => createAction(SET_MNEMONIC, mnemonic),
  addMnemonicToStorageSucceeded: () =>
    createAction(ADD_MNEMONIC_TO_STORAGE_SUCCEEDED),
  addMnemonicToStorageFailed: () =>
    createAction(ADD_MNEMONIC_TO_STORAGE_FAILED),
  setAccounts: (accounts: SetAccountsPayload) =>
    createAction(SET_ACCOUNTS, accounts),
  updateExchangeRates: () => createAction(UPDATE_EXCHANGE_RATES),
  setExchangeRates: (rates: SetExchangeRatesPayload) =>
    createAction(SET_EXCHANGE_RATES, rates),
  loadTransactions: (payload: LoadTransactionsPayload) =>
    createAction(LOAD_TRANSACTIONS, payload),
  setTransactions: (payload: SetTransactionsPayload) =>
    createAction(SET_TRANSACTIONS, payload),
  setTransactionOperations: (operations: OperationRecords) =>
    createAction(SET_TRANSACTION_OPERATIONS, operations),
  fetchBaseFee: () => createAction(FETCH_BASE_FEE),
  setBaseFee: (baseFee: number) => createAction(SET_BASE_FEE, baseFee),
  sendTransaction: (payload: SendTransactionPayload) =>
    createAction(SEND_TRANSACTION, payload),
  sendTransactionSucceeded: (record: StellarSDK.Server.TransactionRecord) =>
    createAction(SEND_TRANSACTION_SUCCEEDED, record),
  sendTransactionFailed: (err: any) =>
    createAction(SEND_TRANSACTION_FAILED, err),
  setupEvenListeners: () => createAction(SETUP_EVENT_LISTENERS),
  doNothing: () => createAction(DO_NOTHING),
};

export type Actions = ActionsUnion<typeof Actions>;
