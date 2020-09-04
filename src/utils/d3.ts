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

export const storeDaysLookup = (
  lookup: { [k: string]: Date },
  datetime: string
): Date => {
  const date = d3.isoParse(datetime) as Date
  const day = formatDateInMonthAndDay(date)
  if (!lookup[day]) {
    lookup[day] = new Date(date)
  }

  return date
}

/**
 * Note: className should be unique
 */
export const drawDots = <T>({
  svg,
  className,
  data,
  cx,
  cy,
  radius = 1,
  testId
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  className: string
  data: T[]
  cx: (d: T) => number
  cy: (d: T) => number
  radius?: number
  testId?: string
}): void => {
  const dots = svg // Hourly reading temp dot
    .selectAll(`.${className}`)
    .data(data)
    .enter()
    .append('circle')
    .attr('class', className)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', radius)

  if (testId) {
    dots.attr('data-testid', testId)
  }
}

export const drawVerticalLine = ({
  svg,
  className,
  x,
  y1,
  y2,
  testId
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  className: string
  x: number
  y1: number
  y2: number
  testId?: string
}): void => {
  const line = svg
    .append('line')
    .attr('x1', x)
    .attr('y1', y1)
    .attr('x2', x)
    .attr('y2', y2)
    .attr('class', className)

  if (testId) {
    line.attr('data-testid', testId)
  }
}

export const drawArea = <T>({
  svg,
  className,
  datum,
  x,
  y0,
  y1,
  curve = d3.curveNatural,
  testId
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  className: string
  datum: T[]
  x: (d: T) => number // x accessor function
  y0: (d: T) => number // y0 accessor function
  y1: (d: T) => number // y1 accessor function
  curve?: d3.CurveFactory
  testId?: string
}): void => {
  const area = svg
    .append('path')
    .datum(datum)
    .attr('class', className)
    .attr(
      'd',
      d3
        .area<T>()
        .curve(curve)
        .x(x)
        .y0(y0)
        .y1(y1)
    )
  if (testId) {
    area.attr('data-testid', testId)
  }
}

/**
 * Render tooltip and attach its listeners inspired by: https://observablehq.com/@d3/line-chart-with-tooltip
 * Note: .tooltip, .tooltip--hidden, and .tooltipCursor classes need to be defined
 */
export const addTooltipListener = <T extends { date: Date }, K extends keyof T>({
  svg,
  xScale,
  width,
  height,
  data,
  getInnerText
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  xScale: d3.ScaleTime<number, number>
  width: number
  height: number
  data: T[]
  getInnerText: (pair: [string, Date], index: number) => string
}): void => {
  const createTooltipCallout = (position?: 'right' | 'left') => (
    // High order function
    g: typeof svg,
    value: string
  ) => {
    if (!value) return g.attr('class', 'tooltip--hidden')

    g.attr('class', 'tooltip')

    const path = g
      .selectAll('path')
      .data([null])
      .join('path')
      .attr('fill', 'white')
      .attr('stroke', 'black')

    const text = g
      .selectAll('text')
      .data([null])
      .join('text')
      .call(txt =>
        txt
          .selectAll('tspan')
          .data((value + '').split(/\n/))
          .join('tspan')
          .attr('x', 0)
          .attr('y', (d, i) => `${i * 1.5}em`)
          .text(d => d)
      )

    // Don't show the tooltip if for some reason getBBox method doesn't exist
    if (!(text.node() as SVGSVGElement).getBBox) {
      return g.attr('class', 'tooltip--hidden')
    }

    const { y: textY, width: w, height: h } = (text.node() as SVGSVGElement).getBBox()
    const padding = 8
    const startX = 13
    let translateX = startX
    let HMove = startX + padding + w
    let MPointX = startX - padding
    const MPointY = textY - 2 * padding
    // Render the tooltip on the left side
    if (position === 'left') {
      translateX = -w - startX
      HMove = -startX + padding
      MPointX = -startX - padding - w
    }
    text.attr('transform', `translate(${translateX}, ${textY})`)
    path.attr(
      'd',
      `M ${MPointX}, ${MPointY}
           H${HMove}
           v${h + 2 * padding}
           h-${w + 2 * padding}
           z
          `
    )
  }
  // Draw a rectangular that covers the whole svg space so that
  // the listener can react to user's mouseover in anywhere within the graph
  svg
    .append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'transparent')
    .attr('data-testid', 'temp-rh-graph-background')
  const tooltipCursor = svg
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', height)
    .attr('class', 'tooltipCursor')
  const tooltip = svg.append('g')
  const removeTooltip = () => {
    tooltip.call(createTooltipCallout(), null)
    tooltipCursor.style('opacity', 0)
  }
  svg.on('touchmove mousemove', function() {
    if (data.length === 0) return

    const mx = d3.mouse(this)[0]
    // if user's mouse is not within the weather value dots range
    if (mx < xScale(data[0].date) || mx > xScale(data[data.length - 1].date)) {
      return removeTooltip()
    }

    const invertedDate = xScale.invert(mx)
    const nearest = getNearestBasedOnDate(invertedDate, data)
    if (!nearest) return // couldn't find the nearest, so don't render the tooltip

    const nearestX = xScale(nearest.date)
    const position = width / 2 > nearestX ? 'right' : 'left'
    const tooltipText = Object.entries(nearest)
      .map(getInnerText)
      .join('\n') // new line after each text
    tooltip
      .attr('transform', `translate(${nearestX}, ${height / 3})`)
      .call(createTooltipCallout(position), tooltipText)
    tooltipCursor.attr('transform', `translate(${nearestX}, 0)`).style('opacity', 1)
  })
  svg.on('touchend mouseleave', removeTooltip)
}
