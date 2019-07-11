import {
  Box,
  createStyles,
  Grid,
  InputLabel,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { TypographyProps } from '@material-ui/system';
import React from 'react';

export interface ManageDataOperationProps {
  sourceAccount: string;
  name: string;
  value: string | Buffer;
  headerProps?: TypographyProps;
}

const styles = () =>
  createStyles({
    subfields: {
      fontSize: '0.85rem',
    },
  });

const ManageDataOperation = (
  props: ManageDataOperationProps & WithStyles<typeof styles>,
) => {
  const {
    sourceAccount,
    headerProps,
    classes,
    name: dataName,
    value: dataValue,
  } = props;
  const sourceAccountTruncated = `${sourceAccount.slice(
    0,
    sourceAccount.length * 0.4,
  )}...${sourceAccount.slice(sourceAccount.length - 4)}`;

  return (
    <Box>
      <Box marginBottom={1}>
        <Typography variant="subtitle2" {...headerProps}>
          Manage Data Operation
        </Typography>
      </Box>
      <Box marginTop={1}>
        <TextField
          label="Source Account"
          fullWidth
          InputProps={{
            classes: {
              input: classes.subfields,
            },
          }}
          value={sourceAccountTruncated || ''}
        />
      </Box>
      <Box marginTop={1}>
        <TextField
          label="Data Name"
          fullWidth
          InputProps={{
            classes: {
              input: classes.subfields,
            },
          }}
          value={dataName || ''}
        />
      </Box>
      <Box marginTop={1}>
        <TextField
          label="Data Value"
          fullWidth
          InputProps={{
            classes: {
              input: classes.subfields,
            },
          }}
          multiline
          value={dataValue || ''}
        />
      </Box>
    </Box>
  );
};
export default withStyles(styles)(ManageDataOperation);
