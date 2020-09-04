import React, { useState } from 'react'

import { ModelSummary, ModelValue } from 'api/modelAPI'
import { ReadingValue } from 'api/readingAPI'
import { NoonForecastValue, ForecastSummary } from 'api/forecastAPI'
import TempRHGraph from 'features/fireWeather/components/graphs/TempRHGraph'
import WxDataGraphToggles from 'features/fireWeather/components/graphs/WxDataGraphToggles'

interface Props {
  readingValues: ReadingValue[] | undefined
  modelValues: ModelValue[] | undefined
  modelSummaries: ModelSummary[] | undefined
  forecastValues: NoonForecastValue[] | undefined
  pastForecastValues: NoonForecastValue[] | undefined
  forecastSummaries: ForecastSummary[] | undefined
}

const WxDataGraph = ({
  readingValues = [],
  modelValues = [],
  modelSummaries = [],
  forecastValues = [],
  pastForecastValues = [],
  forecastSummaries = []
}: Props) => {
  const noReadings = readingValues.length === 0
  const noForecasts = forecastValues.length === 0
  const noModels = modelValues.length === 0
  const noModelSummaries = modelSummaries.length === 0
  const noPastForecasts =
    pastForecastValues.length === 0 && forecastSummaries.length === 0
  // Show hourly readings and models initially, and let users manipulate the view
  const [showReadings, setShowReadings] = useState<boolean>(!noReadings)
  const [showPastForecasts, setShowPastForecasts] = useState<boolean>(!noPastForecasts)
  const [showModelSummaries, setShowModelSummaries] = useState<boolean>(!noModelSummaries)
  const [showModels, setShowModels] = useState<boolean>(false)
  const [showForecasts, setShowForecasts] = useState<boolean>(false)

  if (noReadings && noModels && noModelSummaries && noForecasts && noPastForecasts) {
    return null
  }

  return (
    <>
      <WxDataGraphToggles
        noReadings={noReadings}
        showReadings={showReadings}
        setShowReadings={setShowReadings}
        noModels={noModels}
        showModels={showModels}
        setShowModels={setShowModels}
        noModelSummaries={noModelSummaries}
        showModelSummaries={showModelSummaries}
        setShowModelSummaries={setShowModelSummaries}
        noForecasts={noForecasts}
        showForecasts={showForecasts}
        setShowForecasts={setShowForecasts}
        noPastForecasts={noPastForecasts}
        showPastForecasts={showPastForecasts}
        setShowPastForecasts={setShowPastForecasts}
      />

      <TempRHGraph
        readingValues={showReadings ? readingValues : []}
        modelValues={showModels ? modelValues : []}
        modelSummaries={showModelSummaries ? modelSummaries : []}
        forecastValues={showForecasts ? forecastValues : []}
        pastForecastValues={showPastForecasts ? pastForecastValues : []}
        forecastSummaries={showPastForecasts ? forecastSummaries : []}
      />
    </>
  )
}

export default React.memo(WxDataGraph)
