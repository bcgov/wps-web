import * as d3 from 'd3'

export const getNearestByDate = <T extends { date: Date }>(
  invertedDate: Date,
  arr: T[]
): T | undefined => {
  // What is bisect: https://observablehq.com/@d3/d3-bisect
  const bisect = d3.bisector((d: T) => d.date).left
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
  if (data.length === 0) {
    return
  }
  const dots = svg
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

export const drawSymbols = <T>({
  svg,
  className,
  data,
  x,
  y,
  size = 64,
  symbol = d3.symbolCircle,
  testId
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  className: string
  data: T[]
  x: (d: T) => number
  y: (d: T) => number
  size?: number
  symbol?: d3.SymbolType
  testId?: string
}): void => {
  if (data.length === 0) {
    return
  }
  const symbols = svg
    .selectAll(`.${className}`)
    .data(data)
    .enter()
    .append('path')
    .attr(
      'd',
      d3
        .symbol<T>()
        .type(symbol)
        .size(size)
    )
    .attr('transform', function(d) {
      return `translate(${x(d)},${y(d)})`
    })
    .attr('class', className)

  if (testId) {
    symbols.attr('data-testid', testId)
  }
}

export const drawPath = <T>({
  svg,
  className,
  data,
  x,
  y,
  strokeWidth = 1,
  testId
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  className: string
  data: T[]
  x: (d: T) => number
  y: (d: T) => number
  strokeWidth?: number
  testId?: string
}): void => {
  const path = svg
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<T>()
        .x(x)
        .y(y)
    )
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'none')
    .attr('opacity', 0.8)
    .attr('class', className)

  if (testId) {
    path.attr('data-testid', testId)
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
  if (datum.length === 0) {
    return
  }

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

export const addLegend = ({
  svg,
  shape = 'circle',
  text,
  fill,
  color,
  shapeX,
  shapeY,
  textX,
  textY,
  radius = 2, // circle radius
  length = 8 // rect length
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  shape?: 'circle' | 'rect' | 'diamond' | 'triangle'
  text: string
  color: string
  fill?: string | 'none'
  shapeX: number
  shapeY: number
  textX: number
  textY: number
  radius?: number
  length?: number
}): void => {
  if (shape === 'circle') {
    svg
      .append('circle')
      .attr('cx', shapeX)
      .attr('cy', shapeY)
      .attr('r', radius)
      .style('stroke', color)
      .style('fill', fill || color)
  } else if (shape === 'rect') {
    svg
      .append('rect')
      .attr('x', shapeX)
      .attr('y', shapeY)
      .attr('width', length)
      .attr('height', length)
      .style('stroke', color)
      .attr('fill', fill || color)
  } else if (shape === 'triangle') {
    svg
      .append('path')
      .attr(
        'd',
        d3
          .symbol()
          .type(d3.symbolTriangle)
          .size(10)
      )
      .attr('transform', `translate(${shapeX},${shapeY})`)
      .style('stroke', color)
      .attr('fill', fill || color)
  } else if (shape === 'diamond') {
    svg
      .append('path')
      .attr(
        'd',
        d3
          .symbol()
          .type(d3.symbolDiamond)
          .size(10)
      )
      .attr('transform', `translate(${shapeX},${shapeY})`)
      .style('stroke', color)
      .attr('fill', fill || color)
  }
  svg
    .append('text')
    .attr('x', textX)
    .attr('y', textY)
    .text(text)
    .style('font-size', '9px')
    .style('fill', color)
}

/**
 * Attach a listener to display a tooltip in the graph, inspired by: https://observablehq.com/@d3/line-chart-with-tooltip
 * Note: .tooltip, .tooltip--hidden, and .tooltipCursor classes need to be defined
 * The T is a generic type that captures the type of the given data
 */
export const addTooltipListener = <T extends { date: Date } & { [K in keyof T]: T[K] }>({
  svg,
  xScale,
  width,
  height,
  data,
  getInnerText,
  textTestId,
  bgdTestId
}: {
  svg: d3.Selection<SVGGElement, unknown, null, undefined>
  xScale: d3.ScaleTime<number, number>
  width: number
  height: number
  data: T[]
  getInnerText: (pair: [string, ValueOf<T>], index: number) => string
  textTestId?: string
  bgdTestId?: string
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
    if (textTestId) {
      text.attr('data-testid', textTestId)
    }

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
  if (bgdTestId) {
    svg.attr('data-testid', bgdTestId)
  }
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
    const nearest = getNearestByDate(invertedDate, data)
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
