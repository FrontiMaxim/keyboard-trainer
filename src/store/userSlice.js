import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 0,
    role: undefined,
    login: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    installUser: (state, action) => {
        const {id, role, login} = action.payload;
        state.id = id;
        state.login = login;
        state.role = role;
    }
  },
});


export const { installUser } = userSlice.actions;
export default userSlice.reducer;