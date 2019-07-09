import { createStyles, Icon, withStyles, WithStyles } from '@material-ui/core';
import XLM from 'cryptocoins-icons/SVG/XLM.svg';
import React from 'react';

const styles = () =>
  createStyles({
    imageIcon: {
      height: '100%',
    },
    iconRoot: {
      display: 'flex',
      textAlign: 'center',
    },
  });

interface CryptoCurrencyIconProps {
  cryptoCurrencyAcronym: string;
}

const CryptoCurrencyIcon = (
  props: CryptoCurrencyIconProps & WithStyles<typeof styles>,
) => {
  const { classes, cryptoCurrencyAcronym } = props;

  const iconPath = (() => {
    switch (cryptoCurrencyAcronym.toUpperCase()) {
      case 'XLM':
        return XLM;
      default:
        return '';
    }
  })();

  return (
    <Icon classes={{ root: classes.iconRoot }}>
      <img className={classes.imageIcon} src={iconPath} />
    </Icon>
  );
};

export default withStyles(styles)(CryptoCurrencyIcon);
