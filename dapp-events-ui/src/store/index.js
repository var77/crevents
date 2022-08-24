import { configureStore } from '@reduxjs/toolkit'
import { eventContractReducer } from './eventContractSlice'
import { creatorContractReducer } from './creatorContractSlice'

export const store = configureStore({
    reducer: {
      eventContract: eventContractReducer,
      creatorContract: creatorContractReducer,
    }
  })
