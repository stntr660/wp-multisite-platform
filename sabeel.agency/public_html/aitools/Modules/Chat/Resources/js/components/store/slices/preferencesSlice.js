import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	model: "",
};

export const preferencesSlice = createSlice({
	name: "preferences",
	initialState,
	reducers: {
		setModel: (state, action) => {
			state.model = action.payload;
		},
	},
});

export const { setModel } = preferencesSlice.actions;

export default preferencesSlice.reducer;
