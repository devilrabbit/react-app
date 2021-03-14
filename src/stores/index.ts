import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import shopsReducer from './shops';

const reducer = combineReducers({
  auth: authReducer,
  shops: shopsReducer,
});

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkApi = {
  dispatch: AppDispatch;
  state: RootState;
};

export default store;
