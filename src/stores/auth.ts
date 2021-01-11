import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '.';
import { AuthUser } from '../models/AuthUser';

export interface AuthState {
  loading: boolean;
  user?: AuthUser | null;
  error?: any;
}

const initialState: AuthState = {
  loading: true,
};

export const authenticateUser = createAsyncThunk<
  AuthUser,
  void,
  {
    dispatch: AppDispatch;
    state: AuthState;
  }
>('auth/authenticateUser', async () => {
  return { id: 'id', name: 'name' } as AuthUser;
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: (state) => ({
      ...state,
      user: null,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(authenticateUser.pending, (state) => {
      return {
        ...state,
        loading: true,
        user: null,
        error: null,
      };
    });
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    });
    builder.addCase(authenticateUser.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        user: null,
        error: action.error.message,
      };
    });
  },
});

export default slice.reducer;
