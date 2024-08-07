import { createSlice } from '@reduxjs/toolkit';

const historicPlaysSlice = createSlice({
    name: 'historicPlays',
    initialState: [],
    reducers: {
        setHistoricPlays: (state, action) => {
            return action.payload;
        }
    }
});

export const { setHistoricPlays } = historicPlaysSlice.actions;

export const selectHistoricPlays = (state) => state.historicPlays;

export default historicPlaysSlice.reducer;
