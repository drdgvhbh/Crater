import React from 'react';
import TruncatedText from './TruncatedText';

export interface TruncatedPublicKeyProps {
  publicKey: string;
}

const TruncatedPublicKey = ({ publicKey }: TruncatedPublicKeyProps) => (
  <TruncatedText text={publicKey} start={7} end={4} />
);

export default TruncatedPublicKey;
