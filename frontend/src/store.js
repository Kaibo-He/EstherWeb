// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const homeTitleSlice = createSlice({
    name: 'homeTitle',
    initialState: { title: '魔法风火轮', title_en: 'MAGIC CHARIOT' },
    reducers: {
        updateTitle(state, action) {
            state.title = action.payload.title;
            state.title_en = action.payload.title_en;
        },
    },
});

export const { updateTitle } = homeTitleSlice.actions;

const store = configureStore({
    reducer: {
        homeTitle: homeTitleSlice.reducer,
    },
});

export default store;
