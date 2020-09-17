// @ts-nocheck
import React from 'react'
import { storiesOf } from '@storybook/react'

import WxDataGraph from 'features/fireWeather/components/graphs/WxDataGraph'
import {
  readingValues,
  modelValues,
  modelSummaries,
  forecastValues,
  forecastSummaries,
  pastForecastValues
} from 'utils/storybook'

storiesOf('WxDataGraph', module).add('default', () => {
  return (
    <>
      <WxDataGraph
        modelValues={modelValues}
        readingValues={readingValues}
        modelSummaries={modelSummaries}
        forecastValues={forecastValues}
        pastForecastValues={pastForecastValues}
        forecastSummaries={forecastSummaries}
      />
    </>
  )
})