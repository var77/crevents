import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  creatorContract: null
}

export const creatorContractSlice = createSlice({
  name: 'creatorContract',
  initialState,
  reducers: {
    setCreatorContract: (state, action) => {
      state.creatorContract = action.payload
    }
  }
})

export const { setCreatorContract } = creatorContractSlice.actions

export const selectCreatorContract = (state: any) => state.creatorContract.creatorContract

export const creatorContractReducer = creatorContractSlice.reducer
