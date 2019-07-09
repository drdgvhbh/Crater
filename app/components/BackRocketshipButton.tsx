import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      maxWidth: '28px',
      maxHeight: '28px',
    },
  });

const BackRocketshipButton = (
  props: IconButtonProps & WithStyles<typeof styles>,
) => {
  const { classes } = props;

  return (
    <IconButton {...props}>
      <img className={classes.icon} src={'./rocketship-back-icon.png'} />
    </IconButton>
  );
};

export default withStyles(styles)(BackRocketshipButton);
