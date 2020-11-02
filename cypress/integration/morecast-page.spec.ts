describe('MoreCast Page', () => {
  const stationCode = 328

  beforeEach(() => {
    cy.server()
    cy.route('GET', 'api/stations/', 'fixture:weather-stations.json').as('getStations')
    cy.visit('/morecast/')
  })

  it('if network errors occurred', () => {
    cy.wait('@getStations')

    cy.selectStationByCode(stationCode)
    cy.getByTestId('get-wx-data-button').click({ force: true })

    cy.checkErrorMessage('Error occurred (while fetching hourly observations).')
    cy.checkErrorMessage('Error occurred (while fetching GDPS).')
    cy.checkErrorMessage('Error occurred (while fetching GDPS summaries).')
    cy.checkErrorMessage('Error occurred (while fetching noon forecasts).')
    cy.checkErrorMessage('Error occurred (while fetching noon forecast summaries).')
    cy.checkErrorMessage('Error occurred (while fetching HRDPS).')
    cy.checkErrorMessage('Error occurred (while fetching HRDPS summaries).')

    cy.contains('Data is not available.')
  })

  it('if all the weather data were successfully fetched', () => {
    cy.route('POST', 'api/hourlies/', 'fixture:weather-data/observations')
    cy.route('POST', 'api/noon_forecasts/', 'fixture:weather-data/noon-forecasts')
    cy.route('POST', 'api/noon_forecasts/summaries/', 'fixture:weather-data/noon-forecast-summaries')
    cy.route('POST', 'api/models/GDPS/predictions/most_recent', 'fixture:weather-data/models-with-bias-adjusted') // prettier-ignore
    cy.route('POST', 'api/models/GDPS/predictions/summaries/', 'fixture:weather-data/model-summaries')
    cy.route('POST', 'api/models/HRDPS/predictions/most_recent', 'fixture:weather-data/hr-models-with-bias-adjusted') // prettier-ignore
    cy.route('POST', 'api/models/HRDPS/predictions/summaries', 'fixture:weather-data/high-res-model-summaries') // prettier-ignore
    cy.wait('@getStations')

    // Request the weather data
    cy.selectStationByCode(stationCode)
    cy.getByTestId('get-wx-data-button').click({ force: true })

    // Check if svg elements are displayed in the graph
    cy.getByTestId('hourly-observed-temp-symbol')
    cy.getByTestId('hourly-observed-temp-path')
    cy.getByTestId('hourly-observed-rh-symbol')
    cy.getByTestId('hourly-observed-rh-path')
    cy.getByTestId('wx-graph-observation-toggle').click()
    cy.getByTestId('hourly-observed-temp-symbol').should('not.exist')
    cy.getByTestId('hourly-observed-rh-symbol').should('not.exist')

    // Test the toggle buttons
    cy.getByTestId('wx-graph-global-model-toggle').click()
    cy.getByTestId('model-summary-temp-area')
    cy.getByTestId('model-temp-symbol')
    cy.getByTestId('wx-graph-global-model-toggle').click()
    cy.getByTestId('model-summary-temp-area').should('not.exist')
    cy.getByTestId('model-temp-symbol').should('not.exist')

    cy.getByTestId('wx-graph-forecast-toggle').click()
    cy.getByTestId('forecast-temp-dot')
    cy.getByTestId('forecast-summary-temp-line')
    cy.getByTestId('wx-graph-forecast-toggle').click()
    cy.getByTestId('forecast-temp-dot').should('not.exist')
    cy.getByTestId('forecast-summary-temp-line').should('not.exist')

    cy.getByTestId('wx-graph-bias-toggle').click()
    cy.getByTestId('bias-adjusted-model-temp-symbol')
    cy.getByTestId('bias-adjusted-model-temp-path')
    cy.getByTestId('wx-graph-bias-toggle').click()
    cy.getByTestId('bias-adjusted-model-temp-symbol').should('not.exist')

    cy.getByTestId('wx-graph-high-res-model-toggle').click()
    cy.getByTestId('high-res-model-summary-temp-area')
    cy.getByTestId('high-res-model-temp-symbol')
    cy.getByTestId('high-res-model-temp-path')
    cy.getByTestId('wx-graph-high-res-model-toggle').click()
    cy.getByTestId('high-res-model-summary-temp-area').should('not.exist')
    cy.getByTestId('high-res-model-temp-symbol').should('not.exist')

    // Hover over the first dot and check if the tooltip shows up with the correct text
    cy.getByTestId('wx-graph-observation-toggle').click()
    cy.getByTestId('hourly-observed-rh-symbol')
      .first()
      .trigger('mousemove', { force: true, x: 3, y: 1 })
    cy.getByTestId('temp-rh-tooltip-text').contains('tspan', /(PDT, UTC-7)/)
    cy.getByTestId('temp-rh-tooltip-text')
      .should('contain', 'Observed Temp: - (°C)')
      .and('contain', 'Observed RH: 61 (%)')
  })
})
