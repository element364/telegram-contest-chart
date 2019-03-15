import Plotly from 'plotly.js-dist'

import { renderChart } from './chart'
import { h } from './vdom'

import data from '../docs/chart_data.json'

console.log(data)

for (let idx = 0; idx < data.length; idx++) {
  const dataSet = data[idx]

  console.log('=====')
  console.log(dataSet)

  let xType

  for (const type of Object.keys(dataSet.types)) {
    if (dataSet.types[type] === 'x') {
      xType = type
    }
  }

  if (typeof xType === 'undefined') {
    throw new Error('Missing x type')
  }
  
  const columnsByName = {}

  for (let i = 0; i < dataSet.columns.length; i++) {
    columnsByName[ dataSet.columns[i][0] ] = dataSet.columns[i].slice(1)
  }

  columnsByName[xType] = columnsByName[xType].map(unixTimestamp => new Date(unixTimestamp))

  const chartData = []

  for (const color of Object.keys(dataSet.colors)) {
    chartData.push({
      x: columnsByName.x,
      y: columnsByName[color],
      mode: 'lines',
      name: dataSet.names[color],
      line: {
        color: dataSet.colors[color]
      }
    })
  }

  console.log('chartData', chartData)

  const id1 = `chart-o-${idx}`
  const id2 = `chart-c-${idx}`

  document.getElementById('app').appendChild(
    h('div', {}, [
      h('div', { id: id1 }),
      h('div', { id: id2 }),
      h('hr')
    ])
  )

  Plotly.newPlot(id1, chartData, {
    xaxis: {
      rangeslider: {}
    }
  });

  renderChart(id2, chartData)
}

