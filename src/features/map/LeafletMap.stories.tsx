import React from 'react'
import { storiesOf } from '@storybook/react'

import LeafletMapWithGeoJson from 'features/map/LeafletMapWithGeoJson'

storiesOf('LeafletMap', module).add('Map with GeoJson', () => {
  return <LeafletMapWithGeoJson />
})
