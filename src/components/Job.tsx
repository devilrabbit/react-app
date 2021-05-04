import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Job } from '@src/models/Job';
import ImageViewer from './ImageViewer';
import OperationsLayer from './OperationsLayer';
import ToolBox from './ToolBox';
import Results from './Results';
import { RootState } from '@src/stores';
import { saveJob } from '@src/stores/jobs';
import { setOperations } from '@src/stores/operations';
import { setResults } from '@src/stores/results';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      position: 'absolute',
      bottom: 0,
      background: theme.palette.background.default,
    },
  }),
);

interface JobProps {
  match?: { params: { id: string } };
}

const Job: React.FC<JobProps> = (props: JobProps) => {
  const [job, setJob] = useState<Job>();

  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const operations = useSelector((state: RootState) => state.operations.operations);
  const results = useSelector((state: RootState) => state.results.results);
  const classes = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!props || !props.match || !props.match.params) {
      return;
    }
    const id = props.match.params.id;
    const job = jobs.find((x) => x.id === id);
    setJob(job);
  }, [props, jobs]);

  useEffect(() => {
    if (job?.id != operations?.id) {
      dispatch(setOperations(job?.operations));
    }
    if (job?.id != results?.id) {
      dispatch(setResults(job?.results));
    }

    if (
      job &&
      job.id === operations?.id &&
      job.id === results?.id &&
      (job?.operations?.updatedAt !== operations?.updatedAt ||
        job?.results.updatedAt !== results?.updatedAt)
    ) {
      dispatch(saveJob({ ...job, operations, results }));
    }
  }, [job, operations, results, dispatch]);

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <ImageViewer image={job?.image}>
            <OperationsLayer operations={operations} />
          </ImageViewer>
          <div className={classes.toolbar}>
            <ToolBox job={job} />
          </div>
        </Grid>
        <Grid item xs={3}>
          <Results results={results} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Job;
