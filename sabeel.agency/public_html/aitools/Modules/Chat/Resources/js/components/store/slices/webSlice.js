import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isWebTabSwitch: false,
	selectedUrl: [],
	initialWebChat: [],
};

export const webSlice = createSlice({
	name: "web",
	initialState,
	reducers: {
		handleWebTabSwitch: (state, action) => {
			state.isWebTabSwitch = action.payload;
		},
		handleSelectedUrls: (state, action) => {
			if (Array.isArray(action.payload)) {
				state.selectedUrl = action.payload;
			} else {
				const existingUrl = state.selectedUrl;
				const newUrl = action.payload;
				const isExist = existingUrl.find((url) => url.id === newUrl.id);
				if (isExist) {
					state.selectedUrl = existingUrl.filter((url) => url.id !== newUrl.id);
				} else {
					state.selectedUrl = [...existingUrl, newUrl];
				}
			}
		},
		deleteSelectedUrlsById: (state, action) => {
			state.selectedUrl = state.selectedUrl.filter((url) => url.id !== action.payload);
		},
		handleSelectedUrlsByRequest: (state, action) => {
			state.selectedUrl = [...action.payload];
		},
		clearSelectedUrls: (state) => {
			state.selectedUrl = [];
		},
		setInitialWebChat: (state, action) => {
			state.initialWebChat = [...state.initialWebChat, action.payload];
		},
		resetInitialWebChat: (state) => {
			state.initialWebChat = [];
		},
	},
});

export const {
	handleWebTabSwitch,
	handleSelectedUrls,
	deleteSelectedUrlsById,
	handleSelectedUrlsByRequest,
	setInitialWebChat,
	resetInitialWebChat,
	clearSelectedUrls
} = webSlice.actions;
export default webSlice.reducer;
