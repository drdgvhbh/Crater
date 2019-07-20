import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import { Sticky, StickyContainer } from 'react-sticky';
import { UnverifiedTransaction } from '../components';
import { SigningPageActions, SigningPageState } from './SigningPageConnected';

export const SigningPage = (props: SigningPageState & SigningPageActions) => {
  return (
    <StickyContainer>
      <Box paddingLeft={2} paddingRight={2}>
        <Typography variant="h6">Sign a Transaction</Typography>
        <Box marginTop={2}>
          <UnverifiedTransaction transaction={props.transaction} />
        </Box>
      </Box>
      <Sticky>
        {({
            style,
          }) => (
            <Button style={style} variant="contained">Sign</Button>

        )}
      </Sticky>
    </StickyContainer>
  );
};

export default SigningPage;
