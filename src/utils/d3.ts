import * as d3 from 'd3'

export const getNearestBasedOnDate = (
  invertedDate: Date,
  arr: { date: Date }[]
): { date: Date } | undefined => {
  // What is bisect: https://observablehq.com/@d3/d3-bisect
  const bisect = d3.bisector((d: { date: Date }) => d.date).left
  const index = bisect(arr, invertedDate, 1)
  const a = arr[index - 1]
  const b = arr[index]
  // Get the nearest value from the user's mouse position
  const value =
    b &&
    invertedDate.valueOf() - a.date.valueOf() > b.date.valueOf() - invertedDate.valueOf()
      ? b
      : a

  return value
}

export const formatDateInMonthAndDay = d3.timeFormat('%b %d') as (
  value: Date | { valueOf(): number }
) => string

export const storeDaysLookup = (lookup: { [k: string]: Date }, datetime: string) => {
  const date = d3.isoParse(datetime) as Date
  const day = formatDateInMonthAndDay(date)
  if (!lookup[day]) {
    lookup[day] = new Date(date)
  }

  return date
}
