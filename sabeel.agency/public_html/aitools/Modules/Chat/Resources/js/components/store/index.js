import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { promptSlice } from "./slices/promptSlice";
import { chatSlice } from "./slices/chatSlice";
import { themeSlice } from "./slices/themeSlice";
import { uiSlice } from "./slices/uiSlice";
import { imageSlice } from "./slices/imageSlice";
import { documentSlice } from "./slices/documentSlice";
import { webSlice } from "./slices/webSlice";
import { preferencesSlice } from "./slices/preferencesSlice";
import { ChatAssistantsSlice } from "./slices/ChatAssistantsSlice";

export const createStore = (options) =>
    configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
            [promptSlice.name]: promptSlice.reducer,
            [chatSlice.name]: chatSlice.reducer,
            [themeSlice.name]: themeSlice.reducer,
            [uiSlice.name]: uiSlice.reducer,
            [imageSlice.name]: imageSlice.reducer,
            [documentSlice.name]: documentSlice.reducer,
            [preferencesSlice.name]: preferencesSlice.reducer,
            [webSlice.name]: webSlice.reducer,
            [ChatAssistantsSlice.name]: ChatAssistantsSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(apiSlice.middleware),
        ...options,
    });

export const store = createStore();
