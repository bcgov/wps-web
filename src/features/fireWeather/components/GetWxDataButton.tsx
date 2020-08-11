import React from 'react'
import { useSelector } from 'react-redux'

import { ErrorMessage, Button } from 'components'
import { Station } from 'api/stationAPI'
import {
  selectReadings,
  selectModels,
  selectHistoricModels,
  selectForecasts,
  selectWxDataLoading
} from 'app/rootReducer'

interface Props {
  onBtnClick: () => void
  selectedStations: Station[]
}

const GetWxDataButton = ({ onBtnClick, selectedStations }: Props) => {
  const { error: errFetchingReadings } = useSelector(selectReadings)
  const { error: errFetchingModels } = useSelector(selectModels)
  const { error: errFetchingHistoricModels } = useSelector(selectHistoricModels)
  const { error: errFetchingForecasts } = useSelector(selectForecasts)
  const wxDataLoading = useSelector(selectWxDataLoading)
  const isBtnDisabled = selectedStations.length === 0

  return (
    <>
      <Button
        data-testid="get-wx-data-button"
        onClick={onBtnClick}
        disabled={isBtnDisabled}
        loading={wxDataLoading}
        variant="contained"
        color="primary"
      >
        Get Weather Data
      </Button>

      {errFetchingModels && (
        <ErrorMessage
          error={errFetchingModels}
          context="while fetching global model data"
          marginTop={5}
        />
      )}

      {errFetchingReadings && (
        <ErrorMessage
          error={errFetchingReadings}
          context="while fetching hourly readings"
          marginTop={5}
        />
      )}

      {errFetchingHistoricModels && (
        <ErrorMessage
          error={errFetchingHistoricModels}
          context="while fetching historic global model data"
          marginTop={5}
        />
      )}

      {errFetchingForecasts && (
        <ErrorMessage
          error={errFetchingForecasts}
          context="while fetching forecasts"
          marginTop={5}
        />
      )}
    </>
  )
}

export default React.memo(GetWxDataButton)
