import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { ModelSummary, ModelValue } from 'api/modelAPI'
import { ObservedValue } from 'api/observationAPI'
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
  observedValues: ObservedValue[] | undefined
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
  observedValues = [],
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

  const noObservations = observedValues.length === 0
  const noModels = allModelValues.length === 0 && modelSummaries.length === 0
  const noForecasts = allForecasts.length === 0 && forecastSummaries.length === 0
  const noBiasAdjustedModels = allModelValues.length === 0
  const noHighResModels =
    allHighResModelValues.length === 0 && highResModelSummaries.length === 0

  const [toggleValues, setToggleValues] = useGraphToggles({
    showObservations: !noObservations,
    showModels: false,
    showForecasts: false,
    showBiasAdjustedModels: false,
    showHighResModels: false,
    timeOfInterest: 'past'
  })

  if (
    noObservations &&
    noForecasts &&
    noModels &&
    noBiasAdjustedModels &&
    noHighResModels
  ) {
    return null
  }

  const {
    showObservations: showObservations,
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
        noObservations={noObservations}
        noForecasts={noForecasts}
        noModels={noModels}
        noBiasAdjustedModels={noBiasAdjustedModels}
        noHighResModels={noHighResModels}
      />

      <TempRHGraph
        observedValues={
          showObservations && timeOfInterest !== 'future' ? observedValues : []
        }
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
