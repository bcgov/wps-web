import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { FeatureCollection } from 'geojson'

import MapWithCustomOverlay from 'features/map/MapWithCustomOverlay'
import MapWithSelectableStations from 'features/map/MapWithSelectableStations'
import MapWithWxStations from 'features/map/MapWithWxStations'

storiesOf('Map', module)
  .add('With custom overlay', () => {
    return <MapWithCustomOverlay />
  })
  .add('With selectable stations', () => {
    return <MapWithSelectableStations />
  })
  .add('With fetched stations', () => {
    const stationsGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-123.4744167, 48.7728889] },
          properties: {
            code: 45,
            name: 'SALTSPRING 2',
            lat: 48.7728889,
            long: -123.4744167,
            ecodivision_name: 'COOL HYPERMARITIME AND HIGHLANDS',
            core_season: {
              start_month: 5,
              start_day: 15,
              end_month: 8,
              end_day: 31
            }
          }
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-124.2005556, 48.5711111] },
          properties: {
            code: 944,
            name: 'TS SAN JUAN',
            lat: 48.5711111,
            long: -124.2005556,
            ecodivision_name: 'COOL HYPERMARITIME AND HIGHLANDS',
            core_season: {
              start_month: 5,
              start_day: 15,
              end_month: 8,
              end_day: 31
            }
          }
        }
      ]
    }
    return (
      <MapWithWxStations
        fetchStationsError={null}
        onStationsChange={action('onStationsChange triggered')}
        stationsGeoJSON={stationsGeoJSON}
      />
    )
  })
