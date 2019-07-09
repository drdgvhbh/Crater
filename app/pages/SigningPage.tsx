import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { UnverifiedTransaction } from '../components';
import { SigningPageActions, SigningPageState } from './SigningPageConnected';

export const SigningPage = (props: SigningPageState & SigningPageActions) => {
  console.log(props.transaction);

  return (
    <Box paddingLeft={2} paddingRight={2}>
      <Typography variant="h6">Sign a Transaction</Typography>
      <Box marginTop={2}>
        <UnverifiedTransaction transaction={props.transaction} />
      </Box>
    </Box>
  );
};

export default SigningPage;
