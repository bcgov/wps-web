import React from 'react'
import { useSelector } from 'react-redux'

import { ErrorMessage, Button } from 'components'
import { Station } from 'api/stationAPI'
import {
  selectReadings,
  selectModels,
  selectModelSummaries,
  selectForecasts,
  selectWxDataLoading,
  selectForecastSummaries
} from 'app/rootReducer'

interface Props {
  onBtnClick: () => void
  selectedStations: Station[]
}

const GetWxDataButton = ({ onBtnClick, selectedStations }: Props) => {
  const { error: errFetchingReadings } = useSelector(selectReadings)
  const { error: errFetchingModels } = useSelector(selectModels)
  const { error: errFetchingModelSummaries } = useSelector(selectModelSummaries)
  const { error: errFetchingForecasts } = useSelector(selectForecasts)
  const { error: errFetchingForecastSummaries } = useSelector(selectForecastSummaries)
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
          context="while fetching global models"
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

      {errFetchingModelSummaries && (
        <ErrorMessage
          error={errFetchingModelSummaries}
          context="while fetching global model summaries"
          marginTop={5}
        />
      )}

      {errFetchingForecasts && (
        <ErrorMessage
          error={errFetchingForecasts}
          context="while fetching noon forecasts"
          marginTop={5}
        />
      )}

      {errFetchingForecastSummaries && (
        <ErrorMessage
          error={errFetchingForecastSummaries}
          context="while fetching noon forecast summaries"
          marginTop={5}
        />
      )}
    </>
  )
}

export default React.memo(GetWxDataButton)
