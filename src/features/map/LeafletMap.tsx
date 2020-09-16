import React, { useRef, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { makeStyles } from '@material-ui/core/styles'

import WeatherStationsGeoJson from 'features/map/weather_stations.json'

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
const stationLayer = L.geoJSON(WeatherStationsGeoJson, {
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 3,
      fillColor: 'gray',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
  }
})
const getEnvCanadaModelLayer = (layers: string) =>
  L.tileLayer.wms('https://geo.weather.gc.ca/geomet?', {
    layers,
    version: '1.3.0',
    opacity: 0.5
  })
const tempModelLayer = getEnvCanadaModelLayer('RDPS.ETA_TT') // 'HRDPS.CONTINENTAL_TT'
const rhModelLayer = getEnvCanadaModelLayer('RDPS.ETA_HR') // 'HRDPS.CONTINENTAL_TT'
// RH legend img: https://geo.weather.gc.ca/geomet?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=RDPS.ETA_HR&format=image/png&STYLE=HUMIDITYREL-LINEAR

const baseMaps = {
  Topographic: topoLayer,
  Terrain: terrainLayer,
  Streets: streetLayer,
  Satellite: satelliteLayer
}
const overlayMaps = {
  Stations: stationLayer,
  'Temperature Model': tempModelLayer,
  'RH Model': rhModelLayer
}

const useStyles = makeStyles({
  map: {
    height: '500px'
  }
})

export const LeafletMap = () => {
  const classes = useStyles()
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    mapRef.current = L.map('map-id', {
      center: [48.4484, -123.6],
      zoom: 9,
      maxZoom: 19,
      zoomAnimation: true,
      layers: [topoLayer, stationLayer]
    })
    L.control.layers(baseMaps, overlayMaps).addTo(mapRef.current)
  }, []) // Render the base tile only once

  useEffect(() => {
    // if (mapRef.current) {}
  })

  return <div id="map-id" className={classes.map} />
}
