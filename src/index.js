import Plotly from 'plotly.js-dist'

import data from '../docs/chart_data.json'

var data2 = [
  {
    x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
    y: [1, 3, 6],
    type: 'scatter'
  }
];

Plotly.newPlot('app', data2);

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
        color
      }
    })
  }

  console.log('chartData', chartData)

  const id = `chart-${idx}`
  const el = document.createElement('div')
  el.setAttribute('id', id)
  document.getElementById('app').appendChild(el)

  Plotly.newPlot(id, chartData, {
    xaxis: {
      rangeslider: {}
    }
  });
}

