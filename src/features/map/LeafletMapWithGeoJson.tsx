import React, { useRef, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { CircleMarker } from 'leaflet'
import { FeatureCollection } from 'geojson'
import 'leaflet-lasso'
import { LassoHandlerFinishedEvent } from 'leaflet-lasso'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import WeatherStationsGeoJson from 'features/map/weather_stations.json'
import { Button } from 'components'

interface Station {
  STATION_CODE: number
  STATION_NAME: string
  ELEVATION: number
  STATION_ACRONYM: string
}

// Base map layers for Leaflet
const getArcGISMapUrl = (service: string): string =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`
const arcGISMapAttr = {
  attribution:
    'Sources: <a href="https://server.arcgisonline.com/arcgis/rest/services/">ArcGIS Map Servers</a>'
}
const terrainLayer = L.tileLayer(getArcGISMapUrl('World_Terrain_Base'), arcGISMapAttr)
const topoLayer = L.tileLayer(getArcGISMapUrl('World_Topo_Map'), arcGISMapAttr)
const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
})
const satelliteLayer = L.tileLayer(getArcGISMapUrl('World_Imagery'), arcGISMapAttr)
const baseMaps = {
  Topographic: topoLayer,
  Terrain: terrainLayer,
  Streets: streetLayer,
  Satellite: satelliteLayer
}

// Overlays for Leaflet
const getEnvCanadaModelLayer = (layers: string) =>
  L.tileLayer.wms('https://geo.weather.gc.ca/geomet?', {
    layers,
    version: '1.3.0',
    opacity: 0.5
  })
const tempModelOverlay = getEnvCanadaModelLayer('RDPS.ETA_TT') // 'HRDPS.CONTINENTAL_TT'
const rhModelOverlay = getEnvCanadaModelLayer('RDPS.ETA_HR') // 'HRDPS.CONTINENTAL_TT'
// TODO: Render legend img: https://geo.weather.gc.ca/geomet?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=RDPS.ETA_HR&format=image/png&STYLE=HUMIDITYREL-LINEAR
const stationMarker = { fillColor: 'gray', radius: 3 }
const selectedStationMarker = { fillColor: 'red', radius: 4 }
const stationOverlay = L.geoJSON(WeatherStationsGeoJson as FeatureCollection, {
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: stationMarker.radius,
      fillColor: stationMarker.fillColor,
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
  }
}).bindPopup(
  layer => {
    const station = (layer as CircleMarker)?.feature?.properties as Station
    const text = `
      <div>Name: ${station.STATION_NAME}</div>
      <div>Code: ${station.STATION_CODE}</div>
      <div>Elevation: ${station.ELEVATION}</div>
    `
    return text
  },
  { offset: L.point(0, -5) }
)
// .bindTooltip(
//   layer => {
//     const station = (layer as CircleMarker)?.feature?.properties as Station
//     return `${station.STATION_NAME}`
//   },
//   { direction: 'top', offset: L.point(0, -5) }
// )
// .eachLayer()
const overlays = {
  Station: stationOverlay,
  'Temperature Model': tempModelOverlay,
  'RH Model': rhModelOverlay
}

const useStyles = makeStyles({
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

const LeafletMapWithGeoJson: React.FunctionComponent = () => {
  const classes = useStyles()
  const mapRef = useRef<L.Map | null>(null)
  const lassoBtnRef = useRef<HTMLButtonElement>(null)
  const [stationMarkers, setStationMarkers] = useState<CircleMarker[]>([])

  useEffect(() => {
    /* Create a Leaflet map with a layers control */
    mapRef.current = L.map('map-id', {
      center: [48.4484, -123.6],
      zoom: 9,
      maxZoom: 19,
      zoomAnimation: true,
      layers: [topoLayer, stationOverlay]
    })
    L.control.layers(baseMaps, overlays).addTo(mapRef.current)

    /* Initialize a lasso tool and attach a click event listener */
    // L.control.lasso({ position: 'topleft', intersect: true }).addTo(mapRef.current)
    const lasso = L.lasso(mapRef.current)
    const lassoBtnCallback = () => {
      lasso.enable()
    }
    if (lassoBtnRef.current) {
      lassoBtnRef.current.addEventListener('click', lassoBtnCallback)
    }
    mapRef.current.on('lasso.finished', event => {
      // Set all the stations markers to default styling
      stationOverlay.eachLayer(layer => {
        const marker = layer as CircleMarker
        marker.setStyle({
          fillColor: stationMarker.fillColor
        })
        marker.setRadius(stationMarker.radius)
      })
      const sMarkers = (event as LassoHandlerFinishedEvent).layers
        .filter(m => Boolean((m as CircleMarker).feature?.properties?.STATION_CODE))
        .map(m => {
          const marker = m as CircleMarker
          marker.setStyle({
            fillColor: selectedStationMarker.fillColor
          })
          marker.setRadius(selectedStationMarker.radius)

          return marker
        })
      // Update selected stations
      setStationMarkers(sMarkers)
    })

    /* Clean up attached listeners when the component unmounts */
    return () => {
      mapRef.current?.off('lasso.finished')
      lassoBtnRef.current?.removeEventListener('click', lassoBtnCallback)
    }
  }, []) // Run this code block only once

  const handleMarkerDelete = (markerToDelete: CircleMarker) => () => {
    // Set this particular marker to default styling
    markerToDelete.setStyle({ fillColor: stationMarker.fillColor })
    markerToDelete.setRadius(stationMarker.radius)

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

      <div id="map-id" className={classes.map} />
    </>
  )
}

export default React.memo(LeafletMapWithGeoJson)
