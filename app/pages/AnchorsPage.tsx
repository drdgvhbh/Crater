import { AnchorPageActions, AnchorPageState } from './AnchorPageConnected';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  List,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

const AnchorsPage = (props: AnchorPageState & AnchorPageActions) => {
  const [isAddingAnchor, setIsAddingAnchor] = useState(false);
  const [anchorURL, setAnchorURL] = useState('');

  return (
    <Box padding={2}>
      <Typography variant="h2">Anchors</Typography>
      <List></List>
      <Button variant="outlined" onClick={() => setIsAddingAnchor(true)}>
        Add New Anchor
      </Button>
      <Dialog open={isAddingAnchor} onClose={() => setIsAddingAnchor(false)}>
        <Box padding={2}>
          <DialogTitle>Add an Anchor</DialogTitle>
          <TextField label="Anchor URL" value={anchorURL} onChange={(e) => setAnchorURL(e.target.value)}/>
        </Box>
        <Button variant="outlined" onClick={() => props.addAnchor({ anchorURL })}>Confirm</Button>
      </Dialog>
    </Box>
  );
};

export default AnchorsPage;
