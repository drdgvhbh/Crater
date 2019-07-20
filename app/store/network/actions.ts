import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';

export const USE_TESTNET = 'USE_TESTNET';

export const Actions = {
  useTestnet: () => createAction(USE_TESTNET),
};

export type Actions = ActionsUnion<typeof Actions>;
