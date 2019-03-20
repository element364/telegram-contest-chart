import Plotly from "plotly.js-dist";

import { renderChart } from "./chart";
import { h } from "./vdom";

import data from "../docs/chart_data.json";

for (let idx = 0; idx < data.length; idx++) {
  const dataSet = data[idx];

  let xType;

  for (const type of Object.keys(dataSet.types)) {
    if (dataSet.types[type] === "x") {
      xType = type;
    }
  }

  if (typeof xType === "undefined") {
    throw new Error("Missing x type");
  }

  const columnsByName = {};

  for (let i = 0; i < dataSet.columns.length; i++) {
    columnsByName[dataSet.columns[i][0]] = dataSet.columns[i].slice(1);
  }

  columnsByName[xType] = columnsByName[xType].map(unixTimestamp => new Date(unixTimestamp));

  const chartData = [];

  for (const color of Object.keys(dataSet.colors)) {
    chartData.push({
      x: columnsByName.x,
      y: columnsByName[color],
      mode: "lines",
      name: dataSet.names[color],
      line: {
        color: dataSet.colors[color]
      }
    });
  }

  console.log("chartData", chartData);

  const id1 = `chart-o-${idx}`;
  const id2 = `chart-c-${idx}`;

  const vApp = h("div", {}, [
    h("div", { id: id1 }),
    h("div", { id: id2, style: "text-align: center;" }),
    h("hr")
  ]);

  document.getElementById("app").appendChild(vApp);

  Plotly.newPlot(id1, chartData, {
    xaxis: {
      rangeslider: {}
    }
  });

  renderChart(id2, chartData);
}

// Example
// export function MyComponent(props) {
//   const { title = 'empty title', last = false } = props;
//   const [getState, setState] = withState(0);
//   const count = getState();
//   return createElement('ul', {
//     class: 'test'
//   },
//     [
//       createElement('li', {}, [title]),
//       String(Math.random()),
//       String('|'),
//       String(count),
//       createElement('input'),
//       createElement('button', {
//         onClick: () => {
//           setState(count + 1);
//         }
//       }, ['Click me']),
//       last ? createElement('div', {}, ['last'])
//            : createComponent(MyComponent, {last: true})
//     ]
//   )
// }

// mount(document.getElementById('app'),
//   createElement('div',
//     {},
//     [
//       createElement('img',
//         {
//           src: 'data:image/jpeg;base64,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'
//         }),
//       createComponent(MyComponent, {title: 'Hello, world'})
//     ])

// );
