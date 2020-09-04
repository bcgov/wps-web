import React from 'react'
import { useSelector } from 'react-redux'
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import HourlyReadingsDisplay from 'features/fireWeather/components/HourlyReadingsDisplay'
import NoonForecastDisplay from 'features/fireWeather/components/NoonForecastDisplay'
import WxDataGraph from 'features/fireWeather/components/graphs/WxDataGraph'
import { Station } from 'api/stationAPI'
import {
  selectReadings,
  selectModels,
  selectModelSummaries,
  selectForecasts,
  selectWxDataLoading,
  selectForecastSummaries
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
  const { noonModelsByStation, modelsByStation } = useSelector(selectModels)
  const { modelSummariesByStation } = useSelector(selectModelSummaries)
  const {
    noonForecastsByStation,
    pastNoonForecastsByStation,
    allNoonForecastsByStation
  } = useSelector(selectForecasts)
  const { forecastSummariesByStation } = useSelector(selectForecastSummaries)
  const wxDataLoading = useSelector(selectWxDataLoading)

  return (
    <div className={classes.displays}>
      {!wxDataLoading &&
        requestedStations.map(s => {
          const readingValues = readingsByStation[s.code]
          const modelValues = modelsByStation[s.code]
          const noonModelValues = noonModelsByStation[s.code]
          const modelSummaries = modelSummariesByStation[s.code]
          const allForecasts = allNoonForecastsByStation[s.code]
          const forecastValues = noonForecastsByStation[s.code]
          const pastForecastValues = pastNoonForecastsByStation[s.code]
          const forecastSummaries = forecastSummariesByStation[s.code]
          const nothingToDisplay =
            !readingValues &&
            !modelValues &&
            !modelSummaries &&
            !allForecasts &&
            !forecastSummaries

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
              <HourlyReadingsDisplay
                title="Past 5 days of hourly readings from station: "
                values={readingValues}
              />
              <NoonForecastDisplay
                testId={`noon-models-table-${s.code}`}
                title="Interpolated global model noon values (20:00 UTC): "
                values={noonModelValues}
              />
              <NoonForecastDisplay
                testId={`noon-forecasts-table-${s.code}`}
                title="Weather forecast noon values (20:00 UTC): "
                values={allForecasts}
              />
              <WxDataGraph
                modelValues={modelValues}
                readingValues={readingValues}
                modelSummaries={modelSummaries}
                forecastValues={forecastValues}
                pastForecastValues={pastForecastValues}
                forecastSummaries={forecastSummaries}
              />
            </Paper>
          )
        })}
    </div>
  )
}

export default React.memo(WxDataDisplays)
