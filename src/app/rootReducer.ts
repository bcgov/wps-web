import { combineReducers } from '@reduxjs/toolkit'

import stationsReducer from 'features/stations/slices/stationsSlice'
import percentilesReducer from 'features/percentileCalculator/slices/percentilesSlice'
import authReducer from 'features/auth/slices/authenticationSlice'
import forecastsReducer from 'features/dailyForecasts/slices/ForecastsSlice'
import hourliesReducer from 'features/hourlies/slices/HourliesSlice'

const rootReducer = combineReducers({
  stations: stationsReducer,
  percentiles: percentilesReducer,
  authentication: authReducer,
  forecasts: forecastsReducer,
  hourlies: hourliesReducer
})

// Infer whatever gets returned from rootReducer and use it as the type of the root state
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

export const selectStations = (state: RootState) => state.stations
export const selectPercentiles = (state: RootState) => state.percentiles
export const selectAuthentication = (state: RootState) => state.authentication
export const selectToken = (state: RootState) => state.authentication.token
export const selectForecasts = (state: RootState) => state.forecasts
export const selectHourlies = (state: RootState) => state.hourlies
