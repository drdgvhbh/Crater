import { TextField } from '@material-ui/core';
import React from 'react';
import CurrencyFormat from './CurrencyFormat';
import { FeeActions, FeeState } from './FeeConnected';

interface FeeProps {
  stroops: number;
}

const Fee = ({
  stroops,
  xlmToUsd,
  stroopToXLM,
}: FeeProps & FeeState & FeeActions) => {
  const xlm = stroopToXLM(stroops);
  console.log(stroops, xlm);
  return (
    <TextField
      id="fee-input"
      fullWidth
      InputProps={{
        readOnly: true,
        inputComponent: CurrencyFormat as any,
        inputProps: {
          assetAmount: xlm,
          assetType: 'XLM',
        },
      }}
      value={xlm}
      helperText={new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'USD',
      }).format(xlmToUsd(xlm))}
    />
  );
};

export default Fee;
