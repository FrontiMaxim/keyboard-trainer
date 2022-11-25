import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import exerciseReducer from './exerciseSlice';


export default configureStore({
  reducer: {
    user: userReducer,
    exercise: exerciseReducer
  },
});