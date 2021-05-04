import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Result,
  ResultSet,
  PointResult,
  LineResult,
  AreaResult,
  createResultSet,
} from '@src/models/Result';
import { Job } from '@src/models/Job';
import CalculationService from '@src/services/CalculationService';
import DataManager from '@src/services/DataManager';

interface ResultsState {
  results?: ResultSet;
  selectedResult?: Result;
  error?: string;
}

const initialState: ResultsState = {};

export const calculateAsync = createAsyncThunk('results/calculateAsync', async (job: Job) => {
  const operation = job.operations;
  const points: Promise<Result>[] = operation.points.map((op) => {
    const result = job.results.points.find((r) => r.id == op.id);
    if (result && op.updatedAt < result.updatedAt) {
      return Promise.resolve(result);
    }
    return CalculationService.calcPoint(job, op);
  });
  const lines: Promise<Result>[] = operation.lines
    .filter((op) => op.points.length > 1)
    .map((op) => {
      const result = job.results.lines.find((r) => r.id == op.id);
      if (result && op.updatedAt < result.updatedAt) {
        return Promise.resolve(result);
      }
      return CalculationService.calcLine(job, op);
    });
  const areas: Promise<Result>[] = operation.areas
    .filter((op) => op.points.length > 1)
    .map((op) => {
      const result = job.results.areas.find((r) => r.id == op.id);
      if (result && op.updatedAt < result.updatedAt) {
        return Promise.resolve(result);
      }
      if (result) {
        DataManager.removeWith(result.id);
      }

      return CalculationService.calcArea(job, op).then((result) => {
        result.datum = result.datum.map((r, i) => {
          if (!r.data) {
            return r;
          }
          const id = result.id + `/${i}`;
          DataManager.put(id, r.data);
          return { label: r.label, dataId: id };
        });
        return result;
      });
    });
  const results = await Promise.all(points.concat(lines).concat(areas));
  return results;
});

const updateState = (state: ResultsState, patch: Partial<ResultSet>): ResultsState => {
  const updatedAt = Date.now();
  const oldResults = state.results;
  if (!oldResults) {
    const newResults = patch as ResultSet;
    newResults.updatedAt = updatedAt;
    return { ...state, results: newResults };
  }
  const newResults = { ...oldResults, updatedAt };
  newResults.points = (newResults.points || [])
    .map((r) => {
      return patch.points?.find((pr) => pr.id == r.id) || r;
    })
    .concat(
      patch.points?.filter((r) => {
        return !(oldResults.points?.find((pr) => r.id == pr.id) || false);
      }) || [],
    );
  newResults.lines = (newResults.lines || [])
    .map((r) => {
      return patch.lines?.find((pr) => pr.id == r.id) || r;
    })
    .concat(
      patch.lines?.filter((r) => {
        return !(oldResults.lines?.find((pr) => r.id == pr.id) || false);
      }) || [],
    );
  newResults.areas = (newResults.areas || [])
    .map((r) => {
      return patch.areas?.find((pr) => pr.id == r.id) || r;
    })
    .concat(
      patch.areas?.filter((r) => {
        return !(oldResults.areas?.find((pr) => r.id == pr.id) || false);
      }) || [],
    );
  return {
    ...state,
    results: newResults,
  };
};

const slice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<ResultSet | undefined>) => {
      const results = action.payload;
      return {
        ...state,
        results: results,
      };
    },
    selectResult: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const result =
        state.results?.points.find((r) => r.id === id) ||
        state.results?.lines.find((r) => r.id === id) ||
        state.results?.areas.find((r) => r.id === id);
      if (!result) {
        return state;
      }
      return {
        ...state,
        selectedResult: result,
      };
    },
    clearResults: (state) => {
      const results = state.results;
      if (!results) {
        return state;
      }
      return {
        results: createResultSet(results.id),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calculateAsync.fulfilled, (state, action) => {
      const patch: Partial<ResultSet> = {};
      for (const result of action.payload) {
        switch (result.type) {
          case 'point':
            patch.points = (patch.points || []).concat(result as PointResult);
            break;
          case 'line':
            patch.lines = (patch.lines || []).concat(result as LineResult);
            break;
          case 'area':
            patch.areas = (patch.areas || []).concat(result as AreaResult);
            break;
        }
      }
      return updateState(state, patch);
    });
    builder.addCase(calculateAsync.rejected, (state, action) => {
      return {
        ...state,
        error: action.error.message,
      };
    });
  },
});

export default slice.reducer;
export const { setResults, selectResult, clearResults } = slice.actions;
