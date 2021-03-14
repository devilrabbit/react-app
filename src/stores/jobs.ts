import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Item } from '@src/models/Item';
import { ThunkApi } from './index';
import { Job } from '@src/models/Job';
import { toDataUrl } from '@src/utils/images';

export interface JobState {
  loading: boolean;
  jobs: Job[];
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
  const data = await toDataUrl(file);
  return Promise.resolve({
    id: 'j0001',
    name: file.name,
    image: data,
  });
});

export const deleteJob = createAsyncThunk<string, Item>('jobs/deleteJob', async (item) => {
  console.log(item);
  return item.id;
});

const slice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
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
