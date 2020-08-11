import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Forecast, getNoonForecasts, NoonForecastValue } from 'api/forecastAPI'
import { AppThunk } from 'app/store'

interface State {
  loading: boolean
  error: string | null
  noonForecastsByStation: Record<number, NoonForecastValue[] | undefined>
}

const initialState: State = {
  loading: false,
  error: null,
  noonForecastsByStation: {}
}

const forecastsSlice = createSlice({
  name: 'forecasts',
  initialState,
  reducers: {
    getForecastsStart(state: State) {
      state.loading = true
    },
    getForecastsFailed(state: State, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    getForecastsSuccess(state: State, action: PayloadAction<Forecast[]>) {
      action.payload.forEach(forecast => {
        if (forecast.station_code) {
          const code = forecast.station_code
          let previousDatetime: string
          const mostRecentForecasts: NoonForecastValue[] = []
          // only add the most recent forecast for the station and datetime
          // (query returns forecasts in order for each datetime, from most recently
          // issued down to first issued)
          forecast.values.forEach(value => {
            if (previousDatetime !== value.datetime) {
              mostRecentForecasts.push(value)
              previousDatetime = value.datetime
            }
          })
          state.noonForecastsByStation[code] = mostRecentForecasts
        }
      })
      state.loading = false
      state.error = null
    }
  }
})

export const {
  getForecastsStart,
  getForecastsFailed,
  getForecastsSuccess
} = forecastsSlice.actions

export default forecastsSlice.reducer

export const fetchForecasts = (stationCodes: number[]): AppThunk => async dispatch => {
  try {
    dispatch(getForecastsStart())
    const forecasts = await getNoonForecasts(stationCodes)
    dispatch(getForecastsSuccess(forecasts))
  } catch (err) {
    dispatch(getForecastsFailed(err))
  }
}
