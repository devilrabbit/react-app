import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Radio, IconButton, Button } from '@material-ui/core';
import PanTool from '@material-ui/icons/PanTool';
import LooksOne from '@material-ui/icons/LooksOne';
import WbSunny from '@material-ui/icons/WbSunny';
import Adjust from '@material-ui/icons/Adjust';
import ShowChart from '@material-ui/icons/ShowChart';
import CropFree from '@material-ui/icons/CropFree';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Settings from '@material-ui/icons/Settings';
import { OperationType } from '@src/models/Operation';
import { setOperationType, clearOperations } from '@src/stores/operations';
import { calculateAsync, clearResults } from '@src/stores/results';
import ConfigOperationDialog from './ConfigOperationDialog';
import { Job } from '@src/models/Job';

interface ToolBoxProps {
  job?: Job;
}

const ToolBox: React.FC<ToolBoxProps> = (props: ToolBoxProps) => {
  const [selectedValue, setSelectedValue] = React.useState('none');
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleConfig = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    switch (props.job?.operations?.operationType) {
      case OperationType.None:
        setSelectedValue('none');
        break;
      case OperationType.Point:
        setSelectedValue('point');
        break;
      case OperationType.Line:
        setSelectedValue('line');
        break;
      case OperationType.Area:
        setSelectedValue('area');
        break;
      default:
        break;
    }
  }, [props]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedValue(val);
    switch (val) {
      case 'none':
        dispatch(setOperationType(OperationType.None));
        break;
      case 'point':
        dispatch(setOperationType(OperationType.Point));
        break;
      case 'line':
        dispatch(setOperationType(OperationType.Line));
        break;
      case 'area':
        dispatch(setOperationType(OperationType.Area));
        break;
      default:
        break;
    }
  };

  const handleClearAll = useCallback(() => {
    dispatch(clearOperations());
    dispatch(clearResults());
  }, [dispatch]);

  const handleExecute = useCallback(() => {
    const job = props.job;
    if (!job) {
      return;
    }
    dispatch(calculateAsync(job));
  }, [props.job, dispatch]);

  return (
    <div>
      <Radio
        icon={<PanTool color="disabled" />}
        checkedIcon={<PanTool color="action" />}
        checked={selectedValue === 'none'}
        onChange={handleChange}
        value="none"
        name="operation-radio-button"
      />
      <Radio
        icon={<Adjust color="disabled" />}
        checkedIcon={<Adjust color="action" />}
        checked={selectedValue === 'point'}
        onChange={handleChange}
        value="point"
        name="operation-radio-button"
      />
      <Radio
        icon={<ShowChart color="disabled" />}
        checkedIcon={<ShowChart color="action" />}
        checked={selectedValue === 'line'}
        onChange={handleChange}
        value="line"
        name="operation-radio-button"
      />
      <Radio
        icon={<CropFree color="disabled" />}
        checkedIcon={<CropFree color="action" />}
        checked={selectedValue === 'area'}
        onChange={handleChange}
        value="area"
        name="operation-radio-button"
      />
      <IconButton onClick={handleClearAll}>
        <DeleteForever />
      </IconButton>
      <IconButton onClick={handleConfig}>
        <Settings />
      </IconButton>
      <ConfigOperationDialog open={open} onClose={handleClose} />
      <Button onClick={handleExecute}>Execute</Button>
    </div>
  );
};

export default ToolBox;
