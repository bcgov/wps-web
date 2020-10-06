import { Station } from 'api/stationAPI'
import axios from 'api/axios'

export interface ReadingValue {
  datetime: string
  temperature: number | null
  relative_humidity: number | null
  wind_speed: number | null
  wind_direction: number | null
  barometric_pressure: number | null
  precipitation: number | null
  ffmc: number | null
  isi: number | null
  fwi: number | null
}

export interface Reading {
  station: Station
  values: ReadingValue[]
}

export interface ReadingsResponse {
  hourlies: Reading[]
}

export async function getReadings(stationCodes: number[]): Promise<Reading[]> {
  const url = '/hourlies/'
  const { data } = await axios.post<ReadingsResponse>(url, {
    stations: stationCodes
  })

  return data.hourlies
}
