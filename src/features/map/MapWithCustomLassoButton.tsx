import React, { useRef, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { CircleMarker } from 'leaflet'
import { FeatureCollection } from 'geojson'
import 'leaflet-lasso'
import { LassoHandlerFinishedEvent } from 'leaflet-lasso'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import { Button } from 'components'
import WeatherStationsGeoJson from 'features/map/weather_stations.json'
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
  selectBtn: {
    marginBottom: 8
  },
  chips: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  chip: {
    margin: 4
  }
})

const MapWithCustomOverlay: React.FunctionComponent = () => {
  const classes = useStyles()
  const mapRef = useRef<L.Map | null>(null)
  const lassoBtnRef = useRef<HTMLButtonElement>(null)
  const [stationMarkers, setStationMarkers] = useState<CircleMarker[]>([])

  useEffect(() => {
    /* Create a Leaflet map with a layers control */
    mapRef.current = L.map('map-with-custom-lasso-button', {
      center: [48.4484, -123.6],
      zoom: 9,
      zoomAnimation: true,
      scrollWheelZoom: false,
      layers: [topoLayer, stationOverlay]
    })
    L.control.layers(baseMaps, overlays).addTo(mapRef.current)

    /* Initialize a lasso tool and attach a click event listener */
    const lasso = L.lasso(mapRef.current)
    const lassoBtnCallback = () => {
      lasso.enable()
    }
    if (lassoBtnRef.current) {
      lassoBtnRef.current.addEventListener('click', lassoBtnCallback)
    }
    mapRef.current.on('lasso.finished', event => {
      // Set all the stations markers to default styling
      stationOverlay.resetStyle()

      const sMarkers = (event as LassoHandlerFinishedEvent).layers
        .filter(m => Boolean((m as CircleMarker).feature?.properties?.STATION_CODE))
        .map(m => {
          const marker = m as CircleMarker
          marker.setStyle({
            fillColor: 'red'
          })

          return marker
        })
      // Update selected stations
      setStationMarkers(sMarkers)
    })

    // Destroy the map and clear all related event listeners when the component unmounts
    return () => {
      mapRef.current?.remove()
    }
  }, []) // Run this code block only once

  useEffect(() => {
    if (mapRef.current) {
      stationOverlay.clearLayers()
      stationOverlay.addData(WeatherStationsGeoJson as FeatureCollection)
      stationOverlay.bindTooltip(
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
  }, [WeatherStationsGeoJson])

  const handleMarkerDelete = (markerToDelete: CircleMarker) => () => {
    // Set this particular marker to default styling
    stationOverlay.resetStyle(markerToDelete)

    // And remove it from the selected marker list
    setStationMarkers(markers => {
      return markers.filter(
        marker => marker.getLatLng().toString() !== markerToDelete.getLatLng().toString()
      )
    })
  }

  return (
    <>
      <Button
        className={classes.selectBtn}
        ref={lassoBtnRef}
        variant="contained"
        color="primary"
      >
        Select stations
      </Button>

      {stationMarkers.length > 0 && (
        <div className={classes.chips}>
          <Typography variant="body2">Selected stations:</Typography>
          {stationMarkers.map(marker => {
            const station = marker.feature?.properties as Station
            return (
              <Chip
                className={classes.chip}
                key={station.STATION_CODE}
                label={station.STATION_NAME}
                onDelete={handleMarkerDelete(marker)}
              />
            )
          })}
        </div>
      )}

      <div id="map-with-custom-lasso-button" className={classes.map} />
    </>
  )
}

export default React.memo(MapWithCustomOverlay)
