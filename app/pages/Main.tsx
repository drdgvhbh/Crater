import {
  Button,
  createStyles,
  Icon,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import Anchor from '@material-ui/icons/AccountBalance';
import Signature from '@material-ui/icons/Edit';
import Home from '@material-ui/icons/Home';
import XLM from 'cryptocoins-icons/SVG/XLM.svg';
import React, { useState } from 'react';
import StellarHDWallet from 'stellar-hd-wallet';
import { CryptoCurrencyIcon } from '../components';
import CopyToClipboardTooltip from '../components/CopyToClipboardButton';
import TruncatedPublicKey from '../components/TruncatedPublicKey';
import { account } from '../store/selectors';
import { AnchorPageConnected } from './AnchorPageConnected';
import HomePage from './HomePage';
import { PaymentPageConnected } from './PaymentPageConnected';
import { SigningPageConnected } from './SigningPageConnected';

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
  // console.log(StellarHDWallet.fromMnemonic(mnemonic).getSecret(0));

  const [tab, setTab] = useState(0);

  return (
    <div>
      <Paper>
        <Tabs value={tab} onChange={(_, idx) => setTab(idx)}>
          <Tooltip title={'Home'}>
            <Tab icon={<Home />} />
          </Tooltip>
          <Tooltip title={'Payment'}>
            <Tab icon={<CryptoCurrencyIcon cryptoCurrencyAcronym={'xlm'} />} />
          </Tooltip>
          <Tooltip title={'Signature'}>
            <Tab icon={<Signature />} />
          </Tooltip>
          <Tooltip title={'Anchors'}>
            <Tab icon={<Anchor />} />
          </Tooltip>
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
      {tab === 1 && <PaymentPageConnected />}
      {tab === 2 && <SigningPageConnected />}
      {tab === 3 && <AnchorPageConnected />}
    </div>
  );
};

export default withStyles(styles)(MainPage);
