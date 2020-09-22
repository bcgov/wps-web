import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Station, getStations } from 'api/stationAPI'
import { AppThunk } from 'app/store'
import { logError } from 'utils/error'
import { FeatureCollection } from 'geojson'

interface State {
  loading: boolean
  error: string | null
  stations: Station[]
  stationsGeoJSON: FeatureCollection | null
}

const initialState: State = {
  loading: false,
  error: null,
  stations: [],
  stationsGeoJSON: null
}

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    getStationsStart(state: State) {
      state.loading = true
    },
    getStationsFailed(state: State, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    getStationsSuccess(state: State, action: PayloadAction<Station[]>) {
      state.loading = false
      state.stations = action.payload
      state.stationsGeoJSON = {
        type: 'FeatureCollection',
        features: action.payload.map(station => {
          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [station.long, station.lat]
            },
            properties: station
          }
        })
      }
    }
  }
})

export const {
  getStationsStart,
  getStationsFailed,
  getStationsSuccess
} = stationsSlice.actions

export default stationsSlice.reducer

export const fetchWxStations = (): AppThunk => async dispatch => {
  try {
    dispatch(getStationsStart())
    const stations = await getStations()
    dispatch(getStationsSuccess(stations))
  } catch (err) {
    dispatch(getStationsFailed(err.toString()))
    logError(err)
  }
}
