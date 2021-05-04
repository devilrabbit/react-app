import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { LineChart, Line, YAxis, Label, ResponsiveContainer } from 'recharts';
import { LineResult } from '@src/models/Result';

interface LineResultProps {
  result?: LineResult;
}

const allKinds = [
  {
    label: 'RGB',
    types: ['r', 'g', 'b'],
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      paddingBottom: theme.spacing(1),
    },
  }),
);

const LineResultPanel: React.FC<LineResultProps> = (props: LineResultProps) => {
  const classes = useStyles();
  const [types, setTypes] = React.useState(allKinds[0].types);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTypes(event.target.value as string[]);
  };

  const result = props.result;
  return (
    <Box width="100%">
      <Box className={classes.heading}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={types}
          onChange={handleChange}
        >
          {allKinds.map((kind) => (
            <MenuItem key={`kind-${kind.label}`} value={kind.types}>
              {kind.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {types.map((type) => {
        return (
          <ResponsiveContainer width="100%" height={100} key={`${result?.id || ''}-${type}`}>
            <LineChart
              width={500}
              height={100}
              data={result?.points}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 10,
              }}
            >
              <YAxis
                type="number"
                width={30}
                tickCount={2}
                interval="preserveStartEnd"
                domain={['auto', 'auto']}
              >
                <Label value={type} angle={-90} position="insideLeft" />
              </YAxis>
              <Line type="monotone" dot={false} dataKey={type} stroke="#8884d8" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        );
      })}
    </Box>
  );
};

export default LineResultPanel;
