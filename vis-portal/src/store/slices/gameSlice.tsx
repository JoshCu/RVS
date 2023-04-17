import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Game {
  uuid: string;
  gameName: string;
}

interface GameState {
  games: Game[];
  selectedGame: Game | null;
}

const initialState: GameState = {
  games: [],
  selectedGame: null,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    }
  }
});

export const { setGames } = gameSlice.actions;

export default gameSlice.reducer;
