import React from 'react'
import { useSelector } from 'react-redux'
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import HourlyReadingsDisplay from 'features/fireWeather/components/HourlyReadingsDisplay'
import DailyForecastDisplay from 'features/fireWeather/components/DailyForecastDisplay'
import WxDataGraph from 'features/fireWeather/components/WxDataGraph'
import { Station } from 'api/stationAPI'
import {
  selectReadings,
  selectModels,
  selectHistoricModels,
  selectForecasts,
  selectWxDataLoading
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

const modelsTableTitle = '10 days of interpolated GDPS noon (12pm PST) values: '
const forecastTableTitle = 'Forecast noon values: '

const WxDataDisplays = ({ requestedStations }: Props) => {
  const classes = useStyles()

  const { readingsByStation } = useSelector(selectReadings)
  const { noonModelsByStation, modelsByStation } = useSelector(selectModels)
  const { historicModelsByStation } = useSelector(selectHistoricModels)
  const { noonForecastsByStation } = useSelector(selectForecasts)
  const wxDataLoading = useSelector(selectWxDataLoading)

  return (
    <div className={classes.displays}>
      {!wxDataLoading &&
        requestedStations.map(s => {
          const readingValues = readingsByStation[s.code]
          const modelValues = modelsByStation[s.code]
          const noonModelValues = noonModelsByStation[s.code]
          const historicModels = historicModelsByStation[s.code]
          const noonForecastValues = noonForecastsByStation[s.code]
          const nothingToDisplay =
            !readingValues && !modelValues && !historicModels && !noonForecastValues

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
              <HourlyReadingsDisplay values={readingValues} />
              <DailyForecastDisplay
                values={noonModelValues}
                testId={`noon-models-table-` + s.code}
                title={modelsTableTitle}
              />
              <DailyForecastDisplay
                values={noonForecastValues}
                testId={`noon-forecasts-table-` + s.code}
                title={forecastTableTitle}
              />
              <WxDataGraph
                modelValues={modelValues}
                readingValues={readingValues}
                historicModels={historicModels}
                forecastValues={noonForecastValues}
              />
            </Paper>
          )
        })}
    </div>
  )
}

export default React.memo(WxDataDisplays)
