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
  const [selectedType, setSelectedType] = useState('file');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [jobId, setJobId] = useState<string>('');
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

  const handleTypeChange = (e: any) => {
    setSelectedType(e.target.value);
  };

  const handleIdChange = (e: any) => {
    setJobId(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSubmit = useCallback(() => {
    switch (selectedType) {
      case 'file':
        if (!selectedFile) {
          return;
        }
        dispatch(createJob(selectedFile));
        break;
      case 'input':
        if (!jobId) {
          return;
        }
        //dispatch(submitAsync({ jobId, profile }));
        break;
      default:
        break;
    }
    props.onClose(true);
  }, [props, dispatch]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Add image</DialogTitle>
      <DialogContent>
        <Grid>
          <Box>
            <Radio
              checked={selectedType === 'file'}
              onChange={handleTypeChange}
              value="file"
              name="input-radio-button"
            />
            <Input
              type="file"
              disabled={selectedType !== 'file'}
              onChange={handleFileChange}
              inputRef={(el) => setInputElement(el)}
            />
          </Box>
          <Box>
            <Radio
              checked={selectedType === 'input'}
              onChange={handleTypeChange}
              value="input"
              name="input-radio-button"
            />
            <TextField
              label="Enter Id"
              disabled={selectedType !== 'input'}
              onChange={handleIdChange}
              value={jobId}
              margin="normal"
            />
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={!selectedFile && !jobId} onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobDialog;
