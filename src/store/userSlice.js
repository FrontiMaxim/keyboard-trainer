import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 0,
    role: undefined,
    username: '',
    password: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    installUser: (state, action) => {
        const {id, role, username, password} = action.payload;
        state.id = id;
        state.username = username;
        state.role = role;
        state.password = password;
    }
  },
});


export const { installUser } = userSlice.actions;
export default userSlice.reducer;