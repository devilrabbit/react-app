import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '@src/models/Items';
import { ThunkApi } from './index';
import { Job } from '@src/models/Job';
import { toDataUrl } from '@src/utils/images';
import { UUID } from '@src/utils/uuid';
import { createOperationSet } from '@src/models/Operation';
import { createResultSet } from '@src/models/Result';

export interface JobState {
  loading: boolean;
  jobs: Job[];
  selectedJob?: Job;
  error?: any;
}

const initialState: JobState = {
  loading: true,
  jobs: [],
};

export const fetchJobs = createAsyncThunk<Job[]>('jobs/fetchJobs', async () => {
  return [];
});

export const createJob = createAsyncThunk<Job, File, ThunkApi>('jobs/createJob', async (file) => {
  const id = UUID.generateShort();
  const data = await toDataUrl(file);
  return {
    id,
    name: file.name,
    image: data,
    operations: createOperationSet(id),
    results: createResultSet(id),
  };
});

export const deleteJob = createAsyncThunk<string, Item>('jobs/deleteJob', async (item) => {
  console.log(item);
  return item.id;
});

const slice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    selectJob: (state, action: PayloadAction<Job | undefined>) => {
      return {
        ...state,
        selectedJob: action.payload,
      };
    },
    saveJob: (state, action: PayloadAction<Job>) => {
      const newJob = action.payload;
      return {
        ...state,
        jobs: state.jobs.map((job) => (job.id == newJob.id ? newJob : job)),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobs.pending, (state) => {
      return {
        ...state,
        loading: true,
        jobs: [],
        error: null,
      };
    });
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        jobs: action.payload,
        error: null,
      };
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        jobs: [],
        error: action.error.message,
      };
    });
    builder.addCase(createJob.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });
    builder.addCase(createJob.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        jobs: state.jobs.concat(action.payload),
        selectedJob: action.payload,
        error: null,
      };
    });
    builder.addCase(createJob.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.error.message,
      };
    });
    builder.addCase(deleteJob.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        jobs: state.jobs.filter((x) => x.id !== action.payload),
        error: null,
      };
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.error.message,
      };
    });
  },
});

export default slice.reducer;
export const { selectJob, saveJob } = slice.actions;
