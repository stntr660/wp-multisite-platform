import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isConversationLoading: false,
    openHistoryDrawer: false,
    openDocsDrawer: false,
    openWebDrawer: false,
    layout: null,
    initDocWebChatStay: true,
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setConversationLoading: (state, action) => {
            state.isConversationLoading = action.payload;
        },
        setLayout: (state, action) => {
            state.layout = action.payload;
        },
        handleHistoryDrawerOpen: (state) => {
            state.openHistoryDrawer = !state.openHistoryDrawer;
        },
        handleHistoryDrawerClose: (state) => {
            state.openHistoryDrawer = false;
        },
        handleDocsDrawerOpen: (state) => {
            state.openDocsDrawer = !state.openDocsDrawer;
        },
        handleDocsDrawer: (state, action) => {
            state.openDocsDrawer = action.payload;
        },
        handleWebDrawer: (state, action) => {
            state.openWebDrawer = action.payload;
        },
        stayDocWebChat: (state, action) => {
            state.initDocWebChatStay = action.payload;
        },
    },
});

export const {
    setConversationLoading,
    setLayout,
    handleDocsDrawerOpen,
    handleHistoryDrawerOpen,
    handleHistoryDrawerClose,
    handleDocsDrawer,
    handleWebDrawer,
    stayDocWebChat,
} = uiSlice.actions;
export default uiSlice.reducer;
