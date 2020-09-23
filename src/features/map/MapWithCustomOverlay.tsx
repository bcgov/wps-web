import React, { useRef, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { CircleMarker } from 'leaflet'
import { FeatureCollection } from 'geojson'
import 'leaflet-lasso'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import WeatherStationsGeoJson from 'features/map/weather_stations.json'
import { Button } from 'components'
import { baseMaps, overlays, topoLayer, stationOverlay } from 'features/map/mapLayers'

interface Station {
  STATION_CODE: number
  STATION_NAME: string
  ELEVATION: number
  STATION_ACRONYM: string
}

const useStyles = makeStyles({
  mapWrapper: { position: 'relative' },
  map: {
    height: '500px'
  },
  customOverlay: {
    position: 'absolute',
    right: 5,
    top: 0,
    bottom: 0,
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: 10,
    zIndex: 2000,
    width: 400,
    height: '94%',
    background: 'white',
    overflow: 'auto'
  }
})

const MapWithCustomOverlay: React.FunctionComponent = () => {
  const classes = useStyles()
  const mapRef = useRef<L.Map | null>(null)
  const [clickedStation, setClickedStation] = useState<Station | undefined>()

  useEffect(() => {
    /* Create a Leaflet map with a layers control */
    mapRef.current = L.map('map-with-custom-overlay', {
      center: [48.4484, -123.6],
      zoom: 9,
      maxZoom: 19,
      zoomAnimation: true,
      scrollWheelZoom: false,
      layers: [topoLayer, stationOverlay]
    })
    L.control.layers(baseMaps, overlays).addTo(mapRef.current)

    // Destroy the map and clear all related event listeners when the component unmounts
    return () => {
      mapRef.current?.remove()
    }
  }, []) // Run this code block only once

  useEffect(() => {
    if (mapRef.current) {
      stationOverlay.clearLayers()
      stationOverlay.addData(WeatherStationsGeoJson as FeatureCollection)
      stationOverlay
        .addEventListener('click', e => {
          const marker = e.sourceTarget as CircleMarker
          setClickedStation(marker.feature?.properties)
        })
        .bindTooltip(
          layer => {
            const station = (layer as CircleMarker<Station>)?.feature?.properties
            let text = 'N/A'
            if (station) {
              text = `${station.STATION_NAME} (${station.STATION_CODE})`
            }
            return text
          },
          { direction: 'top', offset: L.point(0, -5) }
        )
    }

    return () => {
      stationOverlay.unbindTooltip()
    }
  }, [setClickedStation, WeatherStationsGeoJson])

  const handleCloseOverlay = () => {
    setClickedStation(undefined)
  }

  return (
    <>
      <div className={classes.mapWrapper}>
        <div id="map-with-custom-overlay" className={classes.map} />
        {clickedStation && (
          <Paper className={classes.customOverlay}>
            This is React Component!
            <pre>{JSON.stringify(clickedStation, null, 4)}</pre>
            <Button variant="outlined" onClick={handleCloseOverlay}>
              Close
            </Button>
          </Paper>
        )}
      </div>
    </>
  )
}

export default React.memo(MapWithCustomOverlay)
