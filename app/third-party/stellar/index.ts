import {
  OperationRecord,
  PaymentOperationRecord
} from '../../store/state/reducer';

export function isPaymentOperation(
  operation: OperationRecord
): operation is PaymentOperationRecord {
  switch (operation.type) {
    case 'payment':
      return true;
    default:
      return false;
  }
}
