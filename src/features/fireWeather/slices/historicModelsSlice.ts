import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { HistoricModel, getHistoricModels, HistoricModelSummary } from 'api/modelAPI'
import { AppThunk } from 'app/store'

interface State {
  loading: boolean
  error: string | null
  historicModelsByStation: Record<number, HistoricModel[] | undefined>
}

const initialState: State = {
  loading: false,
  error: null,
  historicModelsByStation: {}
}

const historicModelsSlice = createSlice({
  name: 'historicModels',
  initialState,
  reducers: {
    getHistoricModelsStart(state: State) {
      state.error = null
      state.loading = true
    },
    getHistoricModelsFailed(state: State, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    getHistoricModelsSuccess(
      state: State,
      action: PayloadAction<HistoricModelSummary[]>
    ) {
      state.error = null
      action.payload.forEach(summary => {
        if (summary.station) {
          const code = summary.station.code
          state.historicModelsByStation[code] = summary.values
        }
      })
      state.loading = false
    }
  }
})

export const {
  getHistoricModelsStart,
  getHistoricModelsFailed,
  getHistoricModelsSuccess
} = historicModelsSlice.actions

export default historicModelsSlice.reducer

export const fetchHistoricModels = (
  stationCodes: number[]
): AppThunk => async dispatch => {
  try {
    dispatch(getHistoricModelsStart())
    const historicModels = await getHistoricModels(stationCodes, 'GDPS')
    dispatch(getHistoricModelsSuccess(historicModels))
  } catch (err) {
    dispatch(getHistoricModelsFailed(err))
  }
}
