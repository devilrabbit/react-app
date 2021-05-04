import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AreaResult, LineResult, PointResult, ResultSet } from '@src/models/Result';
import PointResultPanel from '@src/components/PointResult';
import LineResultPanel from '@src/components/LineResult';
import AreaResultPanel from '@src/components/AreaResult';

interface ResultsProps {
  results?: ResultSet;
}

const APPBAR_HEIGHT = '64px';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: `calc(100vh - ${APPBAR_HEIGHT})`,
      overflow: 'scroll',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

const Results: React.FC<ResultsProps> = (props: ResultsProps) => {
  const classes = useStyles();
  const results = props.results;

  return (
    <div className={classes.root}>
      {results?.points?.map((result: PointResult) => {
        return (
          <Accordion key={result.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{result.type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PointResultPanel result={result} />
            </AccordionDetails>
          </Accordion>
        );
      })}
      {results?.lines?.map((result: LineResult) => {
        return (
          <Accordion key={result.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{result.type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LineResultPanel result={result} />
            </AccordionDetails>
          </Accordion>
        );
      })}
      {results?.areas?.map((result: AreaResult) => {
        return (
          <Accordion key={result.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{result.type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AreaResultPanel result={result} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default Results;
