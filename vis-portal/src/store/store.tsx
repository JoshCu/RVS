import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import scoreReducer from './slices/scoreSlice';
import playerReducer from './slices/playerSlice';

export const store = configureStore({
  reducer: {
      game: gameReducer,
      score: scoreReducer,
      player: playerReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export const selectGame = (state: RootState) => state.game.games;

export const selectSelectedGameId = (state: RootState) => state.game.selectedGameId;

export const selectScores = (state: RootState) => state.score;

export const selectPlayers = (state: RootState) => state.player.players;
