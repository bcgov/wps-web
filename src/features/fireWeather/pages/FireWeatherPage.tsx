import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Station } from 'api/stationAPI'
import { selectAuthentication } from 'app/rootReducer'
import { PageHeader, PageTitle, Container } from 'components'
import WxDataDisplays from 'features/fireWeather/components/WxDataDisplays'
import {
  authenticate,
  setAxiosRequestInterceptors
} from 'features/auth/slices/authenticationSlice'
import { fetchWxStations } from 'features/stations/slices/stationsSlice'
import { fetchModels } from 'features/fireWeather/slices/modelsSlice'
import { fetchReadings } from 'features/fireWeather/slices/readingsSlice'
import GetWxDataButton from 'features/fireWeather/components/GetWxDataButton'
import { fetchForecasts } from 'features/fireWeather/slices/forecastsSlice'
import { fetchModelSummaries } from 'features/fireWeather/slices/modelSummariesSlice'
import { fetchForecastSummaries } from 'features/fireWeather/slices/forecastSummariesSlice'
import WxStationSelectMap from 'features/map/WxStationSelectMap'
import { fetchMostRecentHistoricModels } from 'features/fireWeather/slices/mostRecentHistoricModelsSlice'

const useStyles = makeStyles({
  stationSelect: {
    marginBottom: 10
  }
})

// TODO: Separate authentication part from this later
const FireWeatherPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [selectedStations, setStations] = useState<Station[]>([])
  const [requestedStations, setRequestedStations] = useState<Station[]>([])
  const { isAuthenticated, authenticating, error } = useSelector(selectAuthentication)

  useEffect(() => {
    dispatch(authenticate())
    dispatch(setAxiosRequestInterceptors())
    dispatch(fetchWxStations())
  }, [dispatch])

  if (error) {
    return <div>{error}</div>
  }

  if (authenticating) {
    return <div>Signing in...</div>
  }

  if (!isAuthenticated) {
    return <div>You are not authenticated!</div>
  }

  const onSubmitClick = () => {
    setRequestedStations(selectedStations)
    const stationCodes = selectedStations.map(s => s.code)
    dispatch(fetchModels(stationCodes))
    dispatch(fetchReadings(stationCodes))
    dispatch(fetchForecasts(stationCodes))
    dispatch(fetchModelSummaries(stationCodes))
    dispatch(fetchForecastSummaries(stationCodes))
    dispatch(fetchMostRecentHistoricModels(stationCodes))
  }

  return (
    <div data-testid="fire-weather-page">
      <PageHeader title="Predictive Services Unit" />
      <PageTitle title="MoreCast - Weather Forecast Validation Tool" />
      <Container>
        <WxStationSelectMap
          className={classes.stationSelect}
          onStationsChange={setStations}
        />

        <GetWxDataButton onBtnClick={onSubmitClick} selectedStations={selectedStations} />
        <WxDataDisplays requestedStations={requestedStations} />
      </Container>
    </div>
  )
}

export default React.memo(FireWeatherPage)
