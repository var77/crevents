import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  eventContract: null
}

export const eventContractSlice = createSlice({
  name: 'eventContract',
  initialState,
  reducers: {
    setEventContract: (state, action) => {
      state.eventContract = action.payload
    }
  }
})

export const { setEventContract } = eventContractSlice.actions

export const selectEventContract = (state) => state.eventContract.eventContract

export const eventContractReducer = eventContractSlice.reducer