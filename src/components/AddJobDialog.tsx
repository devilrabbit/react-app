import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Grid,
  Input,
  Radio,
  TextField,
} from '@material-ui/core/';
import { createJob } from '@src/stores/jobs';

interface Props {
  open: boolean;
  onClose: (submit: boolean) => void;
}

const AddJobDialog: React.FC<Props> = (props: Props) => {
  const { onClose, open } = props;
  const [selectedFile, setSelectedFile] = useState<File>();
  const [inputElement, setInputElement] = useState<HTMLInputElement>();

  useEffect(() => {
    if (inputElement) {
      inputElement.value = '';
    }
  }, []);
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!selectedFile) {
      return;
    }
    dispatch(createJob(selectedFile));
    props.onClose(true);
  }, [props, dispatch, selectedFile]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Add image</DialogTitle>
      <DialogContent>
        <Grid>
          <Input type="file" onChange={handleFileChange} inputRef={(el) => setInputElement(el)} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={!selectedFile} onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobDialog;
