import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: false,
        email: null,
        uid: null
    },
    reducers: {
        login: (state, action) => {
            state.user = true;
            state.email = action.payload.email;
            state.uid = action.payload.uid;
        },
        logout: (state) => {
            state.user = false;
            state.email = null;
            state.uid = null;
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
