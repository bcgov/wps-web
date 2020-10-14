import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import MoreCastPage from 'features/fireWeather/pages/MoreCastPage'
import { PercentileCalculatorPageWithDisclaimer } from 'features/percentileCalculator/pages/PercentileCalculatorPageWithDisclaimer'
import { HIDE_DISCLAIMER } from 'utils/constants'

const shouldShowDisclaimer = HIDE_DISCLAIMER === 'false' || HIDE_DISCLAIMER === undefined

const NoMatch = () => <div>Page not found.</div>

export const Routes: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Redirect exact from="/" to="/percentile-calculator/" />

        <Route path="/percentile-calculator/">
          <PercentileCalculatorPageWithDisclaimer showDisclaimer={shouldShowDisclaimer} />
        </Route>

        <Redirect from="/fire-weather/" to="/morecast/" />
        <Route path="/morecast/">
          <MoreCastPage />
        </Route>

        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  )
}
