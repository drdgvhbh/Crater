import {
  AppBar,
  Button,
  createStyles,
  FormLabel,
  InputBase,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StellarHDWallet from 'stellar-hd-wallet';
import { BackRocketshipButton } from '../components';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      flex: 1,
    },
    inputMultiline: {
      fontFamily: 'monospace',
      padding: '0.5rem',
      fontSize: '1rem',
    },
    inputContainer: {
      borderWidth: '0.125rem',
      borderColor: theme.palette.primary.light,
      borderStyle: 'ridge',
    },
    infoTextContainer: {
      marginTop: '1rem',
    },
    continueButtonContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    spacing: {
      flex: 1,
    },
    warning: {
      color: '#DD1122',
    },
  });

const NewWallet = (props: WithStyles<typeof styles>) => {
  const { classes } = props;

  const [mnemonic] = useState(
    StellarHDWallet.generateMnemonic({ entropyBits: 128 }),
  );

  useEffect(() => {
    const account0 = StellarHDWallet.fromMnemonic(mnemonic).getPublicKey(0);
    axios.get('https://horizon-testnet.stellar.org/friendbot', {
      params: {
        addr: account0,
      },
    });
  }, [mnemonic]);

  return (
    <React.Fragment>
      <AppBar position="relative" color="primary">
        <Toolbar>
          <Tooltip title="Go Back">
            <Link to="/">
              <BackRocketshipButton />
            </Link>
          </Tooltip>

          <Typography variant="h6">New Stellar Wallet</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        <FormLabel>
          <Typography variant="overline">Mnemonic</Typography>
        </FormLabel>
        <div className={classes.inputContainer}>
          <InputBase
            classes={{
              inputMultiline: classes.inputMultiline,
            }}
            value={mnemonic}
            fullWidth
            multiline
            rows={6}
          />
        </div>
        <div className={classes.infoTextContainer}>
          <Typography variant="body1">
            Copy the mnemonic and store it somewhere safe.
          </Typography>
          <br />
          <Typography className={classes.warning} variant="body1">
            If you lose this mnemonic, you will lose access to your funds.
          </Typography>
          <br />
          <Typography className={classes.warning} variant="body1">
            <b>It will not be shown again.</b>
          </Typography>
        </div>
        <div className={classes.continueButtonContainer}>
          <div className={classes.spacing} />
          <Link to="/">
            <Button variant="contained" color="primary" fullWidth>
              Continue
            </Button>
          </Link>

          <div className={classes.spacing} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(NewWallet);
