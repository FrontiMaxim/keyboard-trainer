import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 1,
    text: 'Говори со мной, держи глаза открытыми - брат, не засыпай.',
    allowedCountError: 3,
    time: 29
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    installExercise: (state, action) => {
        const {id,  text, allowedCountError, time} = action.payload;
        state.id = id;
        state.text = text;
        state.allowedCountError = allowedCountError;
        state.time = time;
    }
  },
});


export const { installUser } = exerciseSlice.actions;
export default exerciseSlice.reducer;