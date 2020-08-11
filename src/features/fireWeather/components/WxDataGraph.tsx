import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { HistoricModel, ModelValue } from 'api/modelAPI'
import { ReadingValue } from 'api/readingAPI'
import { NoonForecastValue } from 'api/forecastAPI'
import TempRHGraph from 'features/fireWeather/components/TempRHGraph'
import WxDataGraphToggles from 'features/fireWeather/components/WxDataGraphToggles'

const useStyles = makeStyles({
  title: {
    paddingBottom: 6
  },
  switchWrapper: {
    marginLeft: -5
  },
  switchLabel: {
    marginLeft: 2
  }
})

interface Props {
  readingValues: ReadingValue[] | undefined
  modelValues: ModelValue[] | undefined
  historicModels: HistoricModel[] | undefined
  forecastValues: NoonForecastValue[] | undefined
}

const WxDataGraph = ({
  readingValues = [],
  modelValues = [],
  historicModels = [],
  forecastValues = []
}: Props) => {
  const classes = useStyles()
  const noReadings = readingValues.length === 0
  const noForecasts = forecastValues.length === 0
  const noModels = modelValues.length === 0
  const noHistoricModels = historicModels.length === 0
  const [showReadings, setShowReadings] = useState<boolean>(!noReadings)
  const [showModels, setShowModels] = useState<boolean>(!noModels)
  const [showForecasts, setShowForecasts] = useState<boolean>(!noForecasts)

  if (noReadings && noModels && noHistoricModels && noForecasts) {
    return null
  }

  return (
    <>
      <Typography className={classes.title} component="div" variant="subtitle2">
        Past 5 days of hourly readings and GDPS 3 hourly model with interpolated noon
        values (PDT, UTC-7):
      </Typography>

      <WxDataGraphToggles
        noReadings={noReadings}
        showReadings={showReadings}
        setShowReadings={setShowReadings}
        noModels={noModels}
        showModels={showModels}
        setShowModels={setShowModels}
        noForecasts={noForecasts}
        showForecasts={showForecasts}
        setShowForecasts={setShowForecasts}
      />

      <TempRHGraph
        modelValues={showModels ? modelValues : []}
        readingValues={showReadings ? readingValues : []}
        forecastValues={showForecasts ? forecastValues : []}
        historicModels={historicModels}
      />
    </>
  )
}

export default React.memo(WxDataGraph)
