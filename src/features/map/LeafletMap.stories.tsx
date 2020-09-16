import React from 'react'
import { storiesOf } from '@storybook/react'

import { LeafletMap } from 'features/map/LeafletMap'

storiesOf('LeafletMap', module).add('default', () => {
  return <LeafletMap />
})
