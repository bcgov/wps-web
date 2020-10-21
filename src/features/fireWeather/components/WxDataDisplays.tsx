import React from 'react'
import { useSelector } from 'react-redux'
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import HourlyReadingsTable from 'features/fireWeather/components/HourlyReadingsTable'
import NoonForecastTable from 'features/fireWeather/components/NoonForecastTable'
import WxDataGraph from 'features/fireWeather/components/graphs/WxDataGraph'
import { ErrorBoundary } from 'components'
import { Station } from 'api/stationAPI'
import {
  selectReadings,
  selectModels,
  selectModelSummaries,
  selectForecasts,
  selectWxDataLoading,
  selectForecastSummaries,
  selectHighResModels,
  selectHighResModelSummaries
} from 'app/rootReducer'

const useStyles = makeStyles({
  displays: {
    marginTop: 16
  },
  paper: {
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 20
  },
  station: {
    fontSize: '1.1rem',
    paddingTop: 8,
    paddingBottom: 8
  },
  noDataAvailable: {
    paddingBottom: 8
  }
})

interface Props {
  requestedStations: Station[]
}

const WxDataDisplays = ({ requestedStations }: Props) => {
  const classes = useStyles()

  const { readingsByStation } = useSelector(selectReadings)
  const {
    allModelsByStation,
    pastModelsByStation,
    modelsByStation,
    noonModelsByStation
  } = useSelector(selectModels)
  const { modelSummariesByStation } = useSelector(selectModelSummaries)
  const {
    allNoonForecastsByStation,
    pastNoonForecastsByStation,
    noonForecastsByStation
  } = useSelector(selectForecasts)
  const { forecastSummariesByStation } = useSelector(selectForecastSummaries)
  const {
    highResModelsByStation,
    pastHighResModelsByStation,
    allHighResModelsByStation
  } = useSelector(selectHighResModels)
  const { highResModelSummariesByStation } = useSelector(selectHighResModelSummaries)
  const wxDataLoading = useSelector(selectWxDataLoading)

  return (
    <div className={classes.displays}>
      {!wxDataLoading &&
        requestedStations.map(s => {
          const readingValues = readingsByStation[s.code]
          const allModelValues = allModelsByStation[s.code]
          const pastModelValues = pastModelsByStation[s.code]
          const modelValues = modelsByStation[s.code]
          const modelSummaries = modelSummariesByStation[s.code]
          const noonModelValues = noonModelsByStation[s.code]
          const allForecasts = allNoonForecastsByStation[s.code]
          const pastForecastValues = pastNoonForecastsByStation[s.code]
          const forecastValues = noonForecastsByStation[s.code]
          const forecastSummaries = forecastSummariesByStation[s.code]
          const highResModelValues = highResModelsByStation[s.code]
          const pastHighResModelValues = pastHighResModelsByStation[s.code]
          const allHighResModelValues = allHighResModelsByStation[s.code]
          const highResModelSummaries = highResModelSummariesByStation[s.code]
          const nothingToDisplay =
            !readingValues && !allForecasts && !allModelValues && !allHighResModelValues

          return (
            <Paper key={s.code} className={classes.paper} elevation={3}>
              <Typography className={classes.station} variant="subtitle1" component="div">
                Weather station: {`${s.name} (${s.code})`}
              </Typography>
              {nothingToDisplay && (
                <Typography className={classes.noDataAvailable} variant="body2">
                  Data is not available.
                </Typography>
              )}
              <ErrorBoundary>
                <HourlyReadingsTable
                  title="Past 5 days of hourly readings from station: "
                  values={readingValues}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <NoonForecastTable
                  testId={`noon-models-table-${s.code}`}
                  title="Interpolated global model noon values (20:00 UTC): "
                  values={noonModelValues}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <NoonForecastTable
                  testId={`noon-forecasts-table-${s.code}`}
                  title="Weather forecast noon values (20:00 UTC): "
                  values={allForecasts}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <WxDataGraph
                  readingValues={readingValues}
                  allModelValues={allModelValues}
                  pastModelValues={pastModelValues}
                  modelValues={modelValues}
                  modelSummaries={modelSummaries}
                  allForecasts={allForecasts}
                  pastForecastValues={pastForecastValues}
                  forecastValues={forecastValues}
                  forecastSummaries={forecastSummaries}
                  allHighResModelValues={allHighResModelValues}
                  pastHighResModelValues={pastHighResModelValues}
                  highResModelValues={highResModelValues}
                  highResModelSummaries={highResModelSummaries}
                />
              </ErrorBoundary>
            </Paper>
          )
        })}
    </div>
  )
}

export default React.memo(WxDataDisplays)
