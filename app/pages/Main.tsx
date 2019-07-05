import { Button, Icon, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import Home from '@material-ui/icons/Home';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import XLM from 'cryptocoins-icons/SVG/XLM.svg';
import React, { useState } from 'react';
import StellarHDWallet from 'stellar-hd-wallet';
import { CryptoCurrencyIcon } from '../components';
import CopyToClipboardTooltip from '../components/CopyToClipboardButton';
import TruncatedPublicKey from '../components/TruncatedPublicKey';
import { account } from '../store/state/selectors';
import HomePage from './HomePage';
import { MoneyPageConnected } from './MoneyPageConnected';

const styles = () =>
  createStyles({
    topNav: {
      textAlign: 'left',
    },
    imageIcon: {
      height: '100%',
    },
    iconRoot: {
      display: 'flex',
      textAlign: 'center',
    },
  });

export interface MainProps extends WithStyles<typeof styles> {
  mnemonic: string;
  account: ReturnType<typeof account>;
}

const MainPage = ({
  account: { number: accountNumber, publicKey },
  mnemonic,
  classes,
}: MainProps) => {
  console.log(StellarHDWallet.fromMnemonic(mnemonic).getSecret(0));

  const [tab, setTab] = useState(0);

  return (
    <div>
      <Paper>
        <Tabs value={tab} onChange={(_, idx) => setTab(idx)}>
          <Tab icon={<Home />} />
          <Tab icon={<CryptoCurrencyIcon cryptoCurrencyAcronym={'xlm'} />} />
        </Tabs>
      </Paper>
      <div className={classes.topNav}>
        <CopyToClipboardTooltip clipboardContent={publicKey}>
          <Button>
            <div>
              <Typography variant="caption">
                {`Account ${accountNumber} — `}
                <TruncatedPublicKey publicKey={publicKey} />
              </Typography>
            </div>
          </Button>
        </CopyToClipboardTooltip>
      </div>
      {tab === 0 && <HomePage />}
      {tab === 1 && <MoneyPageConnected />}
    </div>
  );
};

export default withStyles(styles)(MainPage);
