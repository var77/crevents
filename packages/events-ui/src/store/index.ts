import { configureStore } from '@reduxjs/toolkit'
import { eventContractReducer } from './eventContractSlice'
import { creatorContractReducer, setCreatorContract } from './creatorContractSlice'

export const store = configureStore({
    reducer: {
      eventContract: eventContractReducer,
      creatorContract: creatorContractReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
        ignoreState: true
      },
    }),
  })
