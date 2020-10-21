import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import MoreCastPage from 'features/fireWeather/pages/MoreCastPage'
import { PercentileCalculatorPageWithDisclaimer } from 'features/percentileCalculator/pages/PercentileCalculatorPageWithDisclaimer'
import { HIDE_DISCLAIMER } from 'utils/constants'
import AuthWrapper from 'features/auth/AuthWrapper'

const shouldShowDisclaimer = HIDE_DISCLAIMER === 'false' || HIDE_DISCLAIMER === undefined
const shouldAuthenticate =
  process.env.NODE_ENV === 'production' || window.Cypress === undefined

const NoMatch = () => <div>Page not found.</div>

const Routes: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Redirect exact from="/" to="/percentile-calculator/" />

        <Route path="/percentile-calculator/">
          <PercentileCalculatorPageWithDisclaimer showDisclaimer={shouldShowDisclaimer} />
        </Route>

        <Redirect from="/fire-weather/" to="/morecast/" />
        <Route path="/morecast/">
          <AuthWrapper shouldAuthenticate={shouldAuthenticate}>
            <MoreCastPage />
          </AuthWrapper>
        </Route>

        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  )
}

export default React.memo(Routes)
