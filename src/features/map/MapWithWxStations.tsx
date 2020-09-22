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
import { baseMaps, overlays, topoLayer, stationOverlay } from 'features/map/mapLayers'
import { ErrorMessage } from 'components/ErrorMessage'

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
  fetchStationsError: string | null
  onStationsChange: (stations: React.SetStateAction<Station[]>) => void
  stationsGeoJSON: FeatureCollection | null
}

const MapWithWxStations: React.FunctionComponent<Props> = ({
  fetchStationsError,
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

    // Destroy the map and clear all related event listeners when the component unmounts
    return () => {
      mapRef.current?.remove()
    }
  }, []) // Initialize the map only once

  /* Update the station overlay once the station data is fetched */
  useEffect(() => {
    if (stationsGeoJSON) {
      stationOverlay.clearLayers()
      stationOverlay.addData(stationsGeoJSON).bindTooltip(
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
    }

    return () => {
      stationOverlay.unbindTooltip()
    }
  }, [stationsGeoJSON])

  /* Setup a lasso tool and attach a click event listener from API */
  useEffect(() => {
    if (mapRef.current) {
      L.control.lasso({ position: 'topleft', intersect: true }).addTo(mapRef.current)
      mapRef.current.on('lasso.finished', event => {
        // Set all the stations markers to default styling
        stationOverlay.resetStyle()

        const sMarkers: CircleMarker[] = []
        const stations: Station[] = []
        const markers = (event as LassoHandlerFinishedEvent).layers
        markers
          .filter(m => Boolean((m as CircleMarker).feature?.properties?.code))
          .forEach(m => {
            const marker = m as CircleMarker<Station>
            marker.setStyle({
              fillColor: 'red'
            })
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
  }, [onStationsChange])

  const handleMarkerDelete = (markerToDelete: CircleMarker<Station>) => () => {
    // Set this particular marker to default styling
    stationOverlay.resetStyle(markerToDelete)

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

      {fetchStationsError && (
        <ErrorMessage
          error={fetchStationsError}
          context="while fetching weather stations"
          marginBottom={6}
        />
      )}

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

export default React.memo(MapWithWxStations)
