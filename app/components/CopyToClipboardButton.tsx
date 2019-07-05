import { Button, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import CopyToClipBoard from 'react-copy-to-clipboard';

export interface CopyToClipboardButtonProps {
  clipboardContent: string;
  children: React.ReactElement;
}

const CopyToClipboardTooltip = (props: CopyToClipboardButtonProps) => {
  const { clipboardContent, children } = props;

  return (
    <CopyToClipBoard text={clipboardContent}>
      <Tooltip title="Copy to Clipboard">{children}</Tooltip>
    </CopyToClipBoard>
  );
};

export default CopyToClipboardTooltip;
