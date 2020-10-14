import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { ModelSummary, ModelValue } from 'api/modelAPI'
import { ReadingValue } from 'api/readingAPI'
import { NoonForecastValue, ForecastSummary } from 'api/forecastAPI'
import TempRHGraph from 'features/fireWeather/components/graphs/TempRHGraph'
import WxDataGraphToggles from 'features/fireWeather/components/graphs/WxDataGraphToggles'

const useStyles = makeStyles({
  display: {
    paddingTop: 8
  }
})

interface Props {
  readingValues: ReadingValue[] | undefined
  modelValues: ModelValue[] | undefined
  modelSummaries: ModelSummary[] | undefined
  forecastValues: NoonForecastValue[] | undefined
  pastForecastValues: NoonForecastValue[] | undefined
  forecastSummaries: ForecastSummary[] | undefined
  recentHistoricModelValues: ModelValue[] | undefined
  biasAdjustedModelValues: ModelValue[] | undefined
}

const WxDataGraph = ({
  readingValues = [],
  modelValues = [],
  modelSummaries = [],
  forecastValues = [],
  pastForecastValues = [],
  forecastSummaries = [],
  recentHistoricModelValues = [],
  biasAdjustedModelValues = []
}: Props) => {
  const classes = useStyles()
  const noReadings = readingValues.length === 0
  const noForecasts = forecastValues.length === 0
  const noModels = modelValues.length === 0
  const noModelSummaries = modelSummaries.length === 0
  const noRecentHistoricModels = recentHistoricModelValues.length === 0
  const noPastForecasts =
    pastForecastValues.length === 0 && forecastSummaries.length === 0
  const noBiasAdjustedPredictions = biasAdjustedModelValues.length === 0
  // Show hourly readings and models initially, and let users manipulate the view
  const [showReadings, setShowReadings] = useState<boolean>(!noReadings)
  const [showPastForecasts, setShowPastForecasts] = useState<boolean>(!noPastForecasts)
  const [showHistoricModels, setShowHistoricModels] = useState<boolean>(
    !noModelSummaries || !noRecentHistoricModels
  )
  const [showModels, setShowModels] = useState<boolean>(false)
  const [showForecasts, setShowForecasts] = useState<boolean>(false)
  const [showBiasAdjustedPredictions, setShowBiasAdjustedPredictions] = useState<boolean>(
    false
  )

  if (
    noReadings &&
    noForecasts &&
    noPastForecasts &&
    noModels &&
    noModelSummaries &&
    noRecentHistoricModels &&
    noBiasAdjustedPredictions
  ) {
    return null
  }

  return (
    <div className={classes.display}>
      <WxDataGraphToggles
        noReadings={noReadings}
        showReadings={showReadings}
        setShowReadings={setShowReadings}
        noModels={noModels}
        showModels={showModels}
        setShowModels={setShowModels}
        noHistoricModels={noModelSummaries && noRecentHistoricModels}
        showHistoricModels={showHistoricModels}
        setShowHistoricModels={setShowHistoricModels}
        noForecasts={noForecasts}
        showForecasts={showForecasts}
        setShowForecasts={setShowForecasts}
        noPastForecasts={noPastForecasts}
        showPastForecasts={showPastForecasts}
        setShowPastForecasts={setShowPastForecasts}
        noBiasAdjustedPredictions={noBiasAdjustedPredictions}
        showBiasAdjustedPredictions={showBiasAdjustedPredictions}
        setShowBiasAdjustedPredictions={setShowBiasAdjustedPredictions}
      />

      <TempRHGraph
        readingValues={showReadings ? readingValues : []}
        modelValues={showModels ? modelValues : []}
        modelSummaries={showHistoricModels ? modelSummaries : []}
        forecastValues={showForecasts ? forecastValues : []}
        pastForecastValues={showPastForecasts ? pastForecastValues : []}
        forecastSummaries={showPastForecasts ? forecastSummaries : []}
        recentHistoricModelValues={showHistoricModels ? recentHistoricModelValues : []}
        biasAdjustedModelValues={
          showBiasAdjustedPredictions ? biasAdjustedModelValues : []
        }
      />
    </div>
  )
}

export default React.memo(WxDataGraph)
