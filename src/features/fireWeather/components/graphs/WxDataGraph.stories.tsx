import React from 'react'
import { storiesOf } from '@storybook/react'

import WxDataGraph from 'features/fireWeather/components/graphs/WxDataGraph'
import {
  readingValues,
  pastModelValues,
  modelValues,
  modelSummaries,
  pastForecastValues,
  forecastValues,
  forecastSummaries,
  pastHighResModelValues,
  highResModelValues,
  highResModelSummaries
} from 'utils/storybook'
import { ModelValue } from 'api/modelAPI'
import { NoonForecastValue } from 'api/forecastAPI'

storiesOf('WxDataGraph', module).add('default', () => {
  return (
    <WxDataGraph
      readingValues={readingValues}
      allModelValues={pastModelValues.concat(modelValues) as ModelValue[]}
      pastModelValues={pastModelValues as ModelValue[]}
      modelValues={modelValues as ModelValue[]}
      modelSummaries={modelSummaries}
      allForecasts={pastForecastValues.concat(forecastValues) as NoonForecastValue[]}
      pastForecastValues={pastForecastValues as NoonForecastValue[]}
      forecastValues={forecastValues as NoonForecastValue[]}
      forecastSummaries={forecastSummaries}
      allHighResModelValues={
        pastHighResModelValues.concat(highResModelValues) as ModelValue[]
      }
      pastHighResModelValues={pastHighResModelValues as ModelValue[]}
      highResModelValues={highResModelValues as ModelValue[]}
      highResModelSummaries={highResModelSummaries}
    />
  )
})
