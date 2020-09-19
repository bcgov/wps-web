import React, { useRef, useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import 'leaflet/dist/leaflet.css'
import L, { CircleMarker } from 'leaflet'
import 'leaflet-lasso'
import { LassoHandlerFinishedEvent } from 'leaflet-lasso'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import { Station } from 'api/stationAPI'
import lassoToolImg from 'features/map/lasso-control.png'

// Base map layers from ArcGIS & OpenStreetMap
const getArcGISMapUrl = (service: string): string =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`
const arcGISMapAttr = {
  attribution:
    'Sources: <a href="https://server.arcgisonline.com/arcgis/rest/services/">ArcGIS Map Servers</a>'
}
const topoLayer = L.tileLayer(getArcGISMapUrl('World_Topo_Map'), arcGISMapAttr)
const terrainLayer = L.tileLayer(getArcGISMapUrl('World_Terrain_Base'), arcGISMapAttr)
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

// Overlays sourced from Env canada & DataBC
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
const selectedStationMarker = { fillColor: 'red', radius: 4.5 }
const stationOverlay = L.geoJSON(undefined, {
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
}).bindTooltip(
  layer => {
    const station = (layer as CircleMarker<Station>)?.feature?.properties
    let text = 'N/A'
    if (station) {
      text = `${station.name} (${station.code})`
    }
    return text
  },
  { direction: 'top', offset: L.point(0, -5) }
)
const overlays = {
  Station: stationOverlay,
  'Temperature Model': tempModelOverlay,
  'RH Model': rhModelOverlay
}

const useStyles = makeStyles({
  map: {
    height: '450px'
  },
  selectText: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: '1.15rem',
    marginBottom: 2
  },
  chips: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    marginRight: 8,
    marginBottom: 8
  },
  lassoToolImage: {
    width: 25,
    verticalAlign: 'middle',
    padding: 4,
    marginLeft: 2,
    marginRight: 2,
    border: '1px solid lightgray',
    borderRadius: 5
  }
})

interface Props {
  onStationsChange: (stations: React.SetStateAction<Station[]>) => void
  stationsGeoJSON: FeatureCollection | null
}

const WxStationsMap: React.FunctionComponent<Props> = ({
  stationsGeoJSON,
  onStationsChange
}: Props) => {
  const classes = useStyles()
  const mapRef = useRef<L.Map | null>(null)
  const [stationMarkers, setStationMarkers] = useState<CircleMarker[]>([])

  /* Create a Leaflet map with a layers control */
  useEffect(() => {
    mapRef.current = L.map('map-id', {
      center: [49.1, -123.6],
      minZoom: 5,
      zoom: 8,
      maxZoom: 11,
      scrollWheelZoom: false,
      zoomAnimation: true,
      layers: [topoLayer, stationOverlay]
    })
    L.control.layers(baseMaps, overlays).addTo(mapRef.current)
  }, []) // Initialize the map only once

  /* Update the station overlay once the station data is fetched */
  useEffect(() => {
    if (stationsGeoJSON) {
      stationOverlay.clearLayers()
      stationOverlay.addData(stationsGeoJSON)
    }
  }, [stationsGeoJSON])

  /* Setup a lasso tool and attach a click event listener from API */
  useEffect(() => {
    if (mapRef.current) {
      L.control.lasso({ position: 'topleft', intersect: true }).addTo(mapRef.current)
      mapRef.current.on('lasso.finished', event => {
        // Set all the stations markers to default styling
        stationOverlay.eachLayer(layer => {
          const marker = layer as CircleMarker
          marker.setStyle({
            fillColor: stationMarker.fillColor
          })
          marker.setRadius(stationMarker.radius)
        })
        const sMarkers: CircleMarker[] = []
        const stations: Station[] = []
        const markers = (event as LassoHandlerFinishedEvent).layers
        markers
          .filter(m => Boolean((m as CircleMarker).feature?.properties?.code))
          .forEach(m => {
            const marker = m as CircleMarker<Station>
            marker.setStyle({
              fillColor: selectedStationMarker.fillColor
            })
            marker.setRadius(selectedStationMarker.radius)
            sMarkers.push(marker)

            const station = marker.feature?.properties
            if (station) {
              stations.push(station)
            }
          })

        onStationsChange(stations)
        setStationMarkers(sMarkers)
      })
    }

    /* Clean up attached listeners when the component unmounts */
    return () => {
      mapRef.current?.off('lasso.finished')
    }
  }, [onStationsChange])

  const handleMarkerDelete = (markerToDelete: CircleMarker<Station>) => () => {
    // Set this particular marker to default styling
    markerToDelete.setStyle({ fillColor: stationMarker.fillColor })
    markerToDelete.setRadius(stationMarker.radius)

    // And remove it from the selected marker list & selected station list
    setStationMarkers(markers => {
      return markers.filter(
        marker => marker.getLatLng().toString() !== markerToDelete.getLatLng().toString()
      )
    })
    onStationsChange(stations => {
      return stations.filter(
        station => station.code !== markerToDelete.feature?.properties.code
      )
    })
  }

  return (
    <>
      <Typography className={classes.selectText} variant="subtitle1">
        Select weather stations with the lasso tool (
        <img
          className={classes.lassoToolImage}
          src={lassoToolImg}
          alt="lasso tool icon"
        />
        )
      </Typography>

      {stationMarkers.length > 0 && (
        <div className={classes.chips}>
          {stationMarkers.map(marker => {
            const station = marker.feature?.properties as Station
            return (
              <Chip
                className={classes.chip}
                key={station.code}
                label={`${station.name} (${station.code})`}
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

export default React.memo(WxStationsMap)
