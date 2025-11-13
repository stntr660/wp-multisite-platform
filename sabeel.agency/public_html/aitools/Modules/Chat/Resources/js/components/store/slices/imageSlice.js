import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialImage: null,
    preferences: null,
    artStyles: [],
};

export const imageSlice = createSlice({
    name: "image",
    initialState,
    reducers: {
        setInitialImage: (state, action) => {
            state.initialImage = action.payload;
        },
        resetInitialImage: (state) => {
            state.initialImage = null;
        },
        setPreferences: (state, action) => {
            state.preferences = {
                ...state.preferences,
                [action.payload.item?.key]: action.payload.selected?.value,
            };
        },
        updatePreferences: (state, action) => {
            state.preferences = {
                ...state.preferences,
                [action.payload.key]:
                    action.payload.key === "file"
                        ? action.payload.value
                        : action.payload.value,
            };
        },
        setArtStyles: (state, action) => {
            state.artStyles = action.payload;
        },
    },
});

export const {
    setInitialImage,
    resetInitialImage,
    setPreferences,
    setArtStyles,
    updatePreferences
} = imageSlice.actions;
export default imageSlice.reducer;
