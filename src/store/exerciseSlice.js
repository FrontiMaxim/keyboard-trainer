import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    text: '',
    acceptable_count_errors: 0,
    time: '',
    level: {}
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    installExercise: (state, action) => {
        const {id,  text, acceptable_count_errors, time, level} = action.payload;
        state.id = id;
        state.text = text;
        state.acceptable_count_errors = acceptable_count_errors;
        state.time = time;
        state.level = level;
    }
  },
});


export const { installExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;