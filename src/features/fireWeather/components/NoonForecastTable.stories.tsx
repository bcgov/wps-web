// @ts-nocheck
import React from 'react'
import { storiesOf } from '@storybook/react'

import NoonForecastTable from 'features/fireWeather/components/NoonForecastTable'
import { forecastValues, modelValues } from 'utils/storybook'

storiesOf('NoonForecastTable', module).add('default', () => {
  const modelTableTitle = 'Interpolated global model noon values (PST, UTC−08:00): '
  const forecastTableTitle = 'Weather forecast noon values (PST, UTC−08:00): '

  return (
    <>
      <NoonForecastTable values={modelValues} title={modelTableTitle} testId="" />
      <NoonForecastTable values={forecastValues} title={forecastTableTitle} testId="" />
    </>
  )
})
