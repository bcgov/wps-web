// Custom React Hook for the temp & rh graph toggle state
import { useState } from 'react'

export type TimeSelectOption = 'past' | 'future' | 'all'
export interface ToggleValues {
  showReadings: boolean
  showModels: boolean
  showForecasts: boolean
  showBiasAdjustedModels: boolean
  showHighResModels: boolean
  timeOfInterest: TimeSelectOption
}

export type SetToggleValues = (
  key: keyof ToggleValues,
  value: ValueOf<ToggleValues>
) => void

export const useGraphToggles = (
  initialValues: ToggleValues
): [ToggleValues, SetToggleValues] => {
  const [values, setValues] = useState(initialValues)

  return [
    values,
    (key, value) => {
      setValues(prevValues => ({
        ...prevValues,
        [key]: value
      }))
    }
  ]
}
