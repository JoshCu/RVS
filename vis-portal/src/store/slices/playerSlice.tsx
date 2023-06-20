import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Player {
  player_id: string;
  player_name: string;
}

interface PlayerState {
  players: Player[];
}

const initialState: PlayerState = {
  players: [],
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    }
  }
});

export const { setPlayers } = playerSlice.actions;

export default playerSlice.reducer;
