import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Model, getModels, ModelValue } from 'api/modelAPI'
import { AppThunk } from 'app/store'
import { isNoonInPST } from 'utils/date'

interface State {
  loading: boolean
  error: string | null
  modelsByStation: Record<number, ModelValue[] | undefined>
  noonModelsByStation: Record<number, ModelValue[] | undefined>
  models: Model[]
}

const initialState: State = {
  loading: false,
  error: null,
  modelsByStation: {},
  noonModelsByStation: {},
  models: []
}

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    getModelsStart(state: State) {
      state.error = null
      state.loading = true
    },
    getModelsFailed(state: State, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    getModelsSuccess(state: State, action: PayloadAction<Model[]>) {
      state.error = null
      state.models = action.payload
      action.payload.forEach(model => {
        if (model.station) {
          const code = model.station.code
          state.modelsByStation[code] = model.values
          state.noonModelsByStation[code] = model.values.filter(v =>
            isNoonInPST(v.datetime)
          )
        }
      })
      state.loading = false
    }
  }
})

export const { getModelsStart, getModelsFailed, getModelsSuccess } = modelsSlice.actions

export default modelsSlice.reducer

export const fetchModels = (stationCodes: number[]): AppThunk => async dispatch => {
  try {
    dispatch(getModelsStart())
    const forecasts = await getModels(stationCodes)
    dispatch(getModelsSuccess(forecasts))
  } catch (err) {
    dispatch(getModelsFailed(err))
  }
}
