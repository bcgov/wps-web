import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { ModelSummary, ModelValue } from 'api/modelAPI'
import { ReadingValue } from 'api/readingAPI'
import { NoonForecastValue, ForecastSummary } from 'api/forecastAPI'
import TempRHGraph from 'features/fireWeather/components/graphs/TempRHGraph'
import WxDataGraphToggles from 'features/fireWeather/components/graphs/WxDataGraphToggles'
import { useGraphToggles } from 'features/fireWeather/components/graphs/useGraphToggles'

const useStyles = makeStyles({
  display: {
    paddingTop: 8
  }
})

interface Props {
  readingValues: ReadingValue[] | undefined
  allModelValues: ModelValue[] | undefined
  pastModelValues: ModelValue[] | undefined
  modelValues: ModelValue[] | undefined
  modelSummaries: ModelSummary[] | undefined
  pastForecastValues: NoonForecastValue[] | undefined
  forecastValues: NoonForecastValue[] | undefined
  allForecasts: NoonForecastValue[] | undefined
  forecastSummaries: ForecastSummary[] | undefined
  pastHighResModelValues: ModelValue[] | undefined
  highResModelValues: ModelValue[] | undefined
  allHighResModelValues: ModelValue[] | undefined
  highResModelSummaries: ModelSummary[] | undefined
}

const WxDataGraph = ({
  readingValues = [],
  allModelValues = [],
  pastModelValues = [],
  modelValues = [],
  modelSummaries = [],
  allForecasts = [],
  pastForecastValues = [],
  forecastValues = [],
  forecastSummaries = [],
  allHighResModelValues = [],
  pastHighResModelValues = [],
  highResModelValues = [],
  highResModelSummaries = []
}: Props) => {
  const classes = useStyles()

  const noReadings = readingValues.length === 0
  const noModels = allModelValues.length === 0 && modelSummaries.length === 0
  const noForecasts = allForecasts.length === 0 && forecastSummaries.length === 0
  const noBiasAdjustedModels = allModelValues.length === 0
  const noHighResModels =
    allHighResModelValues.length === 0 && highResModelSummaries.length === 0

  const [toggleValues, setToggleValues] = useGraphToggles({
    showReadings: !noReadings,
    showModels: false,
    showForecasts: false,
    showBiasAdjustedModels: false,
    showHighResModels: false,
    timeOfInterest: 'past'
  })

  if (noReadings && noForecasts && noModels && noBiasAdjustedModels && noHighResModels) {
    return null
  }

  const {
    showReadings,
    showModels,
    showForecasts,
    showBiasAdjustedModels,
    showHighResModels,
    timeOfInterest
  } = toggleValues
  let askedModelValues = []
  let askedForecastValues = []
  let askedHighResModelValues = []
  let askedBiasAdjModelValues = []
  if (timeOfInterest === 'past') {
    askedModelValues = pastModelValues
    askedForecastValues = pastForecastValues
    askedHighResModelValues = pastHighResModelValues
    askedBiasAdjModelValues = pastModelValues
  } else if (timeOfInterest === 'future') {
    askedModelValues = modelValues
    askedForecastValues = forecastValues
    askedHighResModelValues = highResModelValues
    askedBiasAdjModelValues = modelValues
  } else {
    askedModelValues = allModelValues
    askedForecastValues = allForecasts
    askedHighResModelValues = allHighResModelValues
    askedBiasAdjModelValues = allModelValues
  }

  return (
    <div className={classes.display}>
      <WxDataGraphToggles
        toggleValues={toggleValues}
        setToggleValues={setToggleValues}
        noReadings={noReadings}
        noForecasts={noForecasts}
        noModels={noModels}
        noBiasAdjustedModels={noBiasAdjustedModels}
        noHighResModels={noHighResModels}
      />

      <TempRHGraph
        readingValues={showReadings && timeOfInterest !== 'future' ? readingValues : []}
        modelValues={showModels ? askedModelValues : []}
        modelSummaries={showModels && timeOfInterest !== 'future' ? modelSummaries : []}
        forecastValues={showForecasts ? askedForecastValues : []}
        forecastSummaries={
          showForecasts && timeOfInterest !== 'future' ? forecastSummaries : []
        }
        biasAdjustedModelValues={showBiasAdjustedModels ? askedBiasAdjModelValues : []}
        highResModelValues={showHighResModels ? askedHighResModelValues : []}
        highResModelSummaries={
          showHighResModels && timeOfInterest !== 'future' ? highResModelSummaries : []
        }
      />
    </div>
  )
}

export default React.memo(WxDataGraph)
