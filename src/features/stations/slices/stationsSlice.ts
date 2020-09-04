import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Station, getStations } from 'api/stationAPI'
import { AppThunk } from 'app/store'
import { logError } from 'utils/error'

interface initialState {
  loading: boolean
  error: string | null
  stations: Station[]
}

const initialState: initialState = {
  loading: false,
  error: null,
  stations: []
}

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    getStationsStart(state: initialState) {
      state.loading = true
    },
    getStationsFailed(state: initialState, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    getStationsSuccess(state: initialState, action: PayloadAction<Station[]>) {
      state.loading = false
      state.stations = action.payload
      state.error = null
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
