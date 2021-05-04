import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core/';
import { setConfig } from '@src/stores/operations';
import { OperationConfig } from '@src/models/Operation';

interface ConfigOperationDialogProps {
  open: boolean;
  onClose: (submit: boolean) => void;
}

const ConfigOperationDialog: React.FC<ConfigOperationDialogProps> = (
  props: ConfigOperationDialogProps,
) => {
  const { onClose, open } = props;

  const [pointSize, setPointSize] = React.useState(10);

  const dispatch = useDispatch();

  const handleClose = () => {
    onClose(false);
  };

  const parseSize = (value: string): number => {
    return parseInt(value, 10);
  };

  const handleSubmit = () => {
    const config: OperationConfig = { pointSize };
    dispatch(setConfig(config));
    onClose(true);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Configuration</DialogTitle>
      <DialogContent>
        <TextField
          value={pointSize}
          onChange={(e) => setPointSize(parseSize(e.target.value))}
          label="Point size"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSubmit}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigOperationDialog;
