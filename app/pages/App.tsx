import React, { useEffect, useState } from 'react';

import {
  Button,
  createStyles,
  FormControl,
  FormHelperText,
  TextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: '2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    spacing: {
      flex: 1,
    },
    splashImage: {
      width: '8rem',
      height: '8rem',
    },
    header: {
      flex: 3,
    },
    headerTextContainer: {
      marginTop: '1rem',
    },
    secretKeyForm: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    passwordButton: {
      marginTop: '0.5rem',
    },
  });

interface Props extends WithStyles<typeof styles> {
  isMnemonicValid: boolean;
  login: (mnemonic: string) => void;
  fetchPreexistingMnemonic: () => void;
  fetchBaseFee: () => void;
}

const App = (props: Props) => {
  const {
    classes,
    login,
    isMnemonicValid,
    fetchPreexistingMnemonic,
    fetchBaseFee,
  } = props;
  const [mnemonic, setMnemonic] = useState<string>('');

  useEffect(() => {
    fetchPreexistingMnemonic();
    fetchBaseFee();
  }, [fetchPreexistingMnemonic]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    login(mnemonic);
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Crater</title>
      </Helmet>
      <div className={classes.spacing} />
      <div className={classes.header}>
        <img
          className={classes.splashImage}
          src="./crater.png"
          alt="crater-icon"
        />
        <div className={classes.headerTextContainer}>
          <Typography variant="h2">Crater</Typography>
          <Typography variant="subtitle1">
            The safest place to store Stellar Lumens
          </Typography>
        </div>
      </div>
      <form className={classes.secretKeyForm} onSubmit={onSubmitForm}>
        <FormControl>
          <TextField
            id="mnemonic"
            label="Mnemonic"
            error={!isMnemonicValid}
            value={mnemonic}
            onChange={(change) => setMnemonic(change.target.value)}
            margin="normal"
            variant="outlined"
            autoComplete="off"
            aria-describedby="component-error-text"
          />
          {!isMnemonicValid && (
            <FormHelperText id="component-error-text">
              <Typography color="error" variant="caption">
                Mnemonic is invalid
              </Typography>
            </FormHelperText>
          )}
        </FormControl>
        <Button
          type="submit"
          className={classes.passwordButton}
          variant="contained"
          color="primary"
          disabled={mnemonic === ''}
        >
          Log In
        </Button>
      </form>
      <div className={classes.spacing} />
      <Link to="/new-wallet">Create a new wallet</Link>
    </div>
  );
};

export default withStyles(styles)(App);
