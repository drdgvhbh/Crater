import React from 'react';

export interface TruncatedTextProps {
  text: string;
  start: number;
  end: number;
}

const TruncatedText = ({ text, start, end }: TruncatedTextProps) => {
  return (
    <span>{`${text.slice(0, start)}...${text.slice(text.length - end)}`}</span>
  );
};

export default TruncatedText;
