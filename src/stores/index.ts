import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import shopsReducer from './shops';
import jobsReducer from './jobs';

const reducer = combineReducers({
  auth: authReducer,
  shops: shopsReducer,
  jobs: jobsReducer,
});

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkApi = {
  dispatch: AppDispatch;
  state: RootState;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
