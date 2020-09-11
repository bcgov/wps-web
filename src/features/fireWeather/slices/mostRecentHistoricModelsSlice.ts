import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ModelValue,
  getMostRecentHistoricModelPredictions,
  HistoricModelsForStation
} from 'api/modelAPI'
import { AppThunk } from 'app/store'
import { logError } from 'utils/error'

interface State {
  loading: boolean
  error: string | null
  mostRecentHistoricModelsByStation: Record<number, ModelValue[] | undefined>
}

const initialState: State = {
  loading: false,
  error: null,
  mostRecentHistoricModelsByStation: {}
}

const mostRecentHistoricModelsSlice = createSlice({
  name: 'mostRecentHistoricModels',
  initialState,
  reducers: {
    getMostRecentHistoricModelsStart(state: State) {
      state.error = null
      state.loading = true
    },
    getMostRecentHistoricModelsFailed(state: State, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    getMostRecentHistoricModelsSuccess(
      state: State,
      action: PayloadAction<HistoricModelsForStation[]>
    ) {
      state.error = null
      action.payload.forEach(historic_model => {
        if (historic_model.station) {
          const code = historic_model.station.code
          if (state.mostRecentHistoricModelsByStation[code]) {
            state.mostRecentHistoricModelsByStation[code]?.push(historic_model.values[0])
          } else {
            state.mostRecentHistoricModelsByStation[code] = [historic_model.values[0]]
          }
        }
      })

      state.loading = false
    }
  }
})

export const {
  getMostRecentHistoricModelsStart,
  getMostRecentHistoricModelsFailed,
  getMostRecentHistoricModelsSuccess
} = mostRecentHistoricModelsSlice.actions

export default mostRecentHistoricModelsSlice.reducer

export const fetchMostRecentHistoricModels = (
  stationCodes: number[]
): AppThunk => async dispatch => {
  try {
    dispatch(getMostRecentHistoricModelsStart())
    const mostRecentHistoricModels = await getMostRecentHistoricModelPredictions(
      stationCodes,
      'GDPS'
    )
    dispatch(getMostRecentHistoricModelsSuccess(mostRecentHistoricModels))
  } catch (err) {
    dispatch(getMostRecentHistoricModelsFailed(err.toString()))
    logError(err)
  }
}
