// @ts-nocheck
import React from 'react'
import { storiesOf } from '@storybook/react'

import NoonForecastDisplay from 'features/fireWeather/components/NoonForecastDisplay'
import { forecastValues, modelValues } from 'utils/storybook'

storiesOf('NoonForecastDisplay', module).add('default', () => {
  const modelTableTitle = 'Interpolated global model noon values (PST, UTC−08:00): '
  const forecastTableTitle = 'Weather forecast noon values (PST, UTC−08:00): '

  return (
    <>
      <NoonForecastDisplay values={modelValues} title={modelTableTitle} testId="" />
      <NoonForecastDisplay values={forecastValues} title={forecastTableTitle} testId="" />
    </>
  )
})
