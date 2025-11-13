import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isDocTabSwitch: false,
	selectedFiles: [],
	initialDocChat: [],
};

export const documentSlice = createSlice({
	name: "document",
	initialState,
	reducers: {
		handleDocTabSwitch: (state, action) => {
			state.isDocTabSwitch = action.payload;
		},
		handleSelectedFiles: (state, action) => {
			if (Array.isArray(action.payload)) {
				state.selectedFiles = action.payload;
			} else {
				const existingFiles = state.selectedFiles;
				const newFile = action.payload;
				const isExist = existingFiles.find((file) => file.id === newFile.id);
				if (isExist) {
					state.selectedFiles = existingFiles.filter(
						(file) => file.id !== newFile.id
					);
				} else {
					state.selectedFiles = [...existingFiles, newFile];
				}
			}
		},
		deleteSelectedFileById: (state, action) => {
			state.selectedFiles = state.selectedFiles.filter((file) => file.id !== action.payload);
		},
		handleSelectedFilesByRequest: (state, action) => {
			state.selectedFiles = [...action.payload]
		},
		clearSelectedFiles: (state) => {
			state.selectedFiles = [];
		},
		setInitialDocChat: (state, action) => {
			state.initialDocChat = [...state.initialDocChat, action.payload];
		},
		resetInitialDocChat: (state) => {
			state.initialDocChat = [];
		},
	},
});

export const { 
	handleDocTabSwitch, 
	handleSelectedFiles, 
	deleteSelectedFileById,
	handleSelectedFilesByRequest,
	clearSelectedFiles,
	setInitialDocChat,  
	resetInitialDocChat 
} = documentSlice.actions;
export default documentSlice.reducer;
