import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Game {
  _id: string;
  name: string;
  score_requirements: Object;
  creator_id: string;
}

interface GameState {
  games: Game[];
  selectedGameId: string | "";
}

const initialState: GameState = {
  games: [],
  selectedGameId: "",
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    setSelectedGameId: (state, action: PayloadAction<string>) => {
      state.selectedGameId = action.payload;
    }
  }
});

export const { setGames, setSelectedGameId } = gameSlice.actions;

export default gameSlice.reducer;
