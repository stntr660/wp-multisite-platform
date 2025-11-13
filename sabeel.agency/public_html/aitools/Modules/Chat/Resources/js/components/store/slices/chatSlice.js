import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChat: null,
	lastChat: null,
    initialChat: [],
    isTabSwitch: false,
    isFetchingNew: true,
    chatPage: 1,
    isVisible: true,
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        selectChat: (state, action) => {
			state.selectedChat = action.payload;
		},
        storeLastChat: (state, action) => {
			state.lastChat = action.payload;
		},
        storeTempChat: (state, action) => {
            state.initialChat = [...state.initialChat, action.payload];
        },
        resetTempChat: (state) => {
            state.initialChat = [];
        },
        handleIsTabSwitch: (state, action) => {
            state.isTabSwitch = action.payload;
        },
        handleIsFetchingNew: (state, action) => {
            state.isFetchingNew = action.payload;
        },
        setChatPage: (state, action) => {
            state.chatPage = action.payload;
        },
        handleVisible: (state, action) => {
            state.isVisible = action.payload;
        }
    },
});

export const {
    selectChat,
	storeLastChat,
    storeTempChat,
    resetTempChat,
    handleIsTabSwitch,
    handleIsFetchingNew,
    setChatPage,
    handleVisible
} = chatSlice.actions;
export default chatSlice.reducer;
