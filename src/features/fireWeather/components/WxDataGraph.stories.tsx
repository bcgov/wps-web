// @ts-nocheck
import React from 'react'
import { storiesOf } from '@storybook/react'

import WxDataGraph from 'features/fireWeather/components/WxDataGraph'
import {
  modelValues,
  forecastValues,
  readingValues,
  historicModels
} from 'utils/storybook'

storiesOf('WxDataGraph', module).add('default', () => {
  return (
    <>
      <WxDataGraph
        modelValues={modelValues}
        readingValues={readingValues}
        historicModels={historicModels}
        forecastValues={forecastValues}
      />
      <h3>When only model values provided</h3>
      <WxDataGraph
        modelValues={modelValues}
        readingValues={[]}
        historicModels={historicModels}
        forecastValues={[]}
      />
    </>
  )
})
