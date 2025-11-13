import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedAssistant: null,
};

export const ChatAssistantsSlice = createSlice({
	name: "assistants",
	initialState,
	reducers: {
		storeSelectedAssistant: (state, action) => {
			state.selectedAssistant = action.payload;
		},
	},
});
export const { storeSelectedAssistant } = ChatAssistantsSlice.actions;

export default ChatAssistantsSlice.reducer;
