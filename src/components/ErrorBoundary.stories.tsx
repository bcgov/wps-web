// @ts-nocheck
import React from 'react'
import { storiesOf } from '@storybook/react'

import HourlyReadingsTable from 'features/fireWeather/components/HourlyReadingsTable'
import { ErrorBoundary } from 'components'

storiesOf('ErrorBoundary', module).add('default', () => {
  return (
    <ErrorBoundary>
      <HourlyReadingsTable title="this is title" values={{}} />
    </ErrorBoundary>
  )
})
