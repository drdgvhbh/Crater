import React from 'react';
import NumberFormat from 'react-number-format';

interface CurrencyFormatProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;
  assetType: string;
  assetAmount: number;
}

const CurrencyFormat = (props: CurrencyFormatProps) => {
  const { inputRef, onChange, assetType, assetAmount, ...other } = props;

  return (
    <NumberFormat
      {...other}
      isAllowed={(values) => values.floatValue <= assetAmount}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      suffix={` ${(assetType || '').toUpperCase()}`}
    />
  );
};

export default CurrencyFormat;
