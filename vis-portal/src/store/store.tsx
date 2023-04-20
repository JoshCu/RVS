import { configureStore } from '@reduxjs/toolkit';
import gradeReducer from './slices/testSlice';
import gameReducer from './slices/gameSlice';

export const store = configureStore({
  reducer: {
      grade: gradeReducer,
      game: gameReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export const selectGrade = (state: RootState) => state.grade.grades;

export const selectGame = (state: RootState) => state.game.games;

export const selectSelectedGameId = (state: RootState) => state.game.selectedGameId;
