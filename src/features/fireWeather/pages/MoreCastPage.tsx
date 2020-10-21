import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { Station } from 'api/stationAPI'
import { PageHeader, PageTitle, Container } from 'components'
import WxStationDropdown from 'features/stations/components/WxStationDropdown'
import WxDataDisplays from 'features/fireWeather/components/WxDataDisplays'
import { setAxiosRequestInterceptors } from 'features/auth/slices/authenticationSlice'
import { fetchWxStations } from 'features/stations/slices/stationsSlice'
import { fetchGlobalModelsWithBiasAdjusted } from 'features/fireWeather/slices/modelsSlice'
import { fetchReadings } from 'features/fireWeather/slices/readingsSlice'
import GetWxDataButton from 'features/fireWeather/components/GetWxDataButton'
import { fetchForecasts } from 'features/fireWeather/slices/forecastsSlice'
import { fetchGlobalModelSummaries } from 'features/fireWeather/slices/modelSummariesSlice'
import { fetchForecastSummaries } from 'features/fireWeather/slices/forecastSummariesSlice'
import { fetchHighResModels } from 'features/fireWeather/slices/highResModelsSlice'
import { fetchHighResModelSummaries } from 'features/fireWeather/slices/highResModelSummariesSlice'

const useStyles = makeStyles({
  stationDropdown: {
    marginBottom: 10
  }
})

const MoreCastPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [selectedStations, setStations] = useState<Station[]>([])
  const [requestedStations, setRequestedStations] = useState<Station[]>([])

  useEffect(() => {
    dispatch(setAxiosRequestInterceptors())
    dispatch(fetchWxStations())
  }, [dispatch])

  const onSubmitClick = () => {
    setRequestedStations(selectedStations)
    const stationCodes = selectedStations.map(s => s.code)
    dispatch(fetchReadings(stationCodes))
    dispatch(fetchForecasts(stationCodes))
    dispatch(fetchForecastSummaries(stationCodes))
    dispatch(fetchGlobalModelsWithBiasAdjusted(stationCodes))
    dispatch(fetchGlobalModelSummaries(stationCodes))
    dispatch(fetchHighResModels(stationCodes))
    dispatch(fetchHighResModelSummaries(stationCodes))
  }

  return (
    <main>
      <PageHeader title="Predictive Services Unit" />
      <PageTitle title="MoreCast - Weather Forecast Validation Tool" />
      <Container>
        <WxStationDropdown
          className={classes.stationDropdown}
          stations={selectedStations}
          onStationsChange={setStations}
        />
        <GetWxDataButton onBtnClick={onSubmitClick} selectedStations={selectedStations} />
        <WxDataDisplays requestedStations={requestedStations} />
      </Container>
    </main>
  )
}

export default React.memo(MoreCastPage)
