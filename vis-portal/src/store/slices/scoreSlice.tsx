import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Record<string, any>[] = [];

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setScores: (state, action: PayloadAction<Record<string, any>[]>) => {
      return [...action.payload];
    }
  }
});

export const { setScores } = scoreSlice.actions;

export default scoreSlice.reducer;
