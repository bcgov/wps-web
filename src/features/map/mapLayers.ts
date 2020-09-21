import L from 'leaflet'

// Base map layers for Leaflet
const getArcGISMapUrl = (service: string): string =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`
const arcGISMapAttr = {
  attribution:
    'Sources: <a href="https://server.arcgisonline.com/arcgis/rest/services/">ArcGIS Map Servers</a>'
}
export const topoLayer = L.tileLayer(getArcGISMapUrl('World_Topo_Map'), arcGISMapAttr)
const terrainLayer = L.tileLayer(getArcGISMapUrl('World_Terrain_Base'), arcGISMapAttr)
const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
})
const satelliteLayer = L.tileLayer(getArcGISMapUrl('World_Imagery'), arcGISMapAttr)
export const baseMaps = {
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
const stationMarker = { fillColor: '#bfbfbf', radius: 4 }
export const stationOverlay = L.geoJSON(undefined, {
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
})

export const overlays = {
  Station: stationOverlay,
  'Temperature Model': tempModelOverlay,
  'RH Model': rhModelOverlay
}
