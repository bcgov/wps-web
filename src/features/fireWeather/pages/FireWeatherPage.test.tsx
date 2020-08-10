import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { waitForElement, cleanup, fireEvent } from '@testing-library/react'

import { selectStations } from 'app/rootReducer'
import axios from 'api/axios'
import { renderWithRedux } from 'utils/testUtils'
import FireWeatherPage from 'features/fireWeather/pages/FireWeatherPage'
import {
  mockStations,
  mockModelsResponse,
  mockReadingsResponse,
  mockHistoricModelsResponse,
  emptyModelsResponse,
  emptyReadingsResponse,
  emptyHistoricModelsResponse
} from 'features/fireWeather/pages/FireWeatherPage.mock'

const mockAxios = new MockAdapter(axios)

afterEach(() => {
  mockAxios.reset()
  cleanup()
})

it('renders fire weather page', async () => {
  const { getByText, getByTestId } = renderWithRedux(<FireWeatherPage />)
  // before authenticated
  expect(getByText(/Signing in/i)).toBeInTheDocument()

  // Check if all the components are rendered after authenticated
  await waitForElement(() => getByText(/Predictive Services Unit/i))
  expect(getByText(/MoreCast/i)).toBeInTheDocument()
  expect(getByTestId('weather-station-dropdown')).toBeInTheDocument()
})

it('renders weather stations dropdown with data', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })

  const { getByText, getByTestId, store } = renderWithRedux(<FireWeatherPage />)
  expect(selectStations(store.getState()).stations).toEqual([])

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  fireEvent.click(getByTestId('weather-station-dropdown'))

  const [station1] = await waitForElement(() => [
    getByText(`${mockStations[0].name} (${mockStations[0].code})`),
    getByText(`${mockStations[1].name} (${mockStations[1].code})`)
  ])

  fireEvent.click(station1)
  expect(selectStations(store.getState()).stations).toEqual(mockStations)
})

it('renders no data available message if there is no weather data returned', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })
  mockAxios.onPost('/models/GDPS/forecasts/').replyOnce(200, emptyModelsResponse)
  mockAxios.onPost('/hourlies/').replyOnce(200, emptyReadingsResponse)
  mockAxios
    .onPost('/models/GDPS/forecasts/summaries/')
    .replyOnce(200, emptyHistoricModelsResponse)
  const { getByText, getByTestId, queryByText, queryByTestId } = renderWithRedux(
    <FireWeatherPage />
  )

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  // Select a weather station
  fireEvent.click(getByTestId('weather-station-dropdown'))
  const station1 = await waitForElement(() =>
    getByText(`${mockStations[0].name} (${mockStations[0].code})`)
  )
  fireEvent.click(station1)

  // Send the request
  fireEvent.click(getByTestId('get-wx-data-button'))

  // Wait for the response
  await waitForElement(() => queryByText(/Data is not available./i))

  // There shouldn't be any display rendered
  expect(queryByTestId('daily-models-display')).not.toBeInTheDocument()
  expect(queryByTestId('hourly-readings-display')).not.toBeInTheDocument()
  expect(queryByTestId('wx-data-graph')).not.toBeInTheDocument()
})

it('renders error messages in response to network errors', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })
  mockAxios.onPost('/models/GDPS/forecasts/').replyOnce(400)
  mockAxios.onPost('/hourlies/').replyOnce(400)
  mockAxios.onPost('/models/GDPS/forecasts/summaries/').replyOnce(400)

  const { getByText, getByTestId, queryByText } = renderWithRedux(<FireWeatherPage />)

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  // Select a weather station
  fireEvent.click(getByTestId('weather-station-dropdown'))
  const station1 = await waitForElement(() =>
    getByText(`${mockStations[0].name} (${mockStations[0].code})`)
  )
  fireEvent.click(station1)

  // Send the request
  fireEvent.click(getByTestId('get-wx-data-button'))

  // Wait until all the error messages show up
  await waitForElement(() => [
    queryByText(/while fetching global model data/i),
    queryByText(/while fetching hourly readings/i),
    queryByText(/while fetching historic global model data/i),
    queryByText(/Data is not available./i)
  ])
})

it('renders daily model and hourly values in response to user inputs', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })
  mockAxios.onPost('/models/GDPS/forecasts/').replyOnce(200, mockModelsResponse)
  mockAxios.onPost('/hourlies/').replyOnce(200, mockReadingsResponse)
  mockAxios
    .onPost('/models/GDPS/forecasts/summaries/')
    .replyOnce(200, mockHistoricModelsResponse)

  const { getByText, getByTestId, getAllByTestId } = renderWithRedux(<FireWeatherPage />)

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  // Select a weather station
  fireEvent.click(getByTestId('weather-station-dropdown'))
  const station1 = await waitForElement(() =>
    getByText(`${mockStations[0].name} (${mockStations[0].code})`)
  )
  fireEvent.click(station1)

  // Send the request
  fireEvent.click(getByTestId('get-wx-data-button'))

  // Wait until all the displays show up
  await waitForElement(() => [
    getByTestId('daily-models-display'),
    getByTestId('hourly-readings-display'),
    getByTestId('wx-data-graph'),
    getByTestId('wx-data-reading-toggle'),
    getByTestId('wx-data-model-toggle')
  ])

  // Check to see if some of SVG are rendered in the graph (dots, area, and tooltip)
  getAllByTestId('wx-data-model-temp-dot')
  getAllByTestId('wx-data-reading-temp-dot')
  getByTestId('historic-model-temp-area')
  const graphBg = getByTestId('wx-data-graph-background')
  fireEvent.mouseMove(graphBg)
  fireEvent.mouseLeave(graphBg)

  // There should have been 3 post requests (models, hourly readings, and historic models).
  expect(mockAxios.history.post.length).toBe(3)
  // all post requests should include station codes in the body
  mockAxios.history.post.forEach(post => {
    expect(post.data).toBe(
      JSON.stringify({
        stations: [1]
      })
    )
  })
})
