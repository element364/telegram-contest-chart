import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

import { createDomElement } from "./vdom";

export function renderChart(id, data, { width = 960, height = 225 } = {}) {
  console.log(`[+] Rendering to ${id}`, data);

  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;

  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;

  for (const dataSet of data) {
    minX = Math.min(minX, ...dataSet.x);
    maxX = Math.max(maxX, ...dataSet.x);

    minY = Math.min(minY, ...dataSet.y);
    maxY = Math.max(maxY, ...dataSet.y);
  }

  const xScale = scaleLinear()
    .domain([minX, maxX])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain([minY, maxY])
    .range([height, 0]);

  const chart = createDomElement(
    "svg",
    {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      style: `width: 100%;`
    },
    data.map(dataSet => {
      const l = line().x((x, i) => {
        return xScale(x)
      })
      .y((y, i) => {
        return yScale(dataSet.y[i])
      })

      const d = l(dataSet.x)

      console.log('d', d)

      return createDomElement("g", {}, [
        createDomElement('path', { d, stroke: dataSet.line.color, fill: 'none' }),
        ...dataSet.x.map((x, idx) =>
          createDomElement("circle", {
            cx: xScale(x),
            cy: yScale(dataSet.y[idx]),
            r: 1,
            fill: dataSet.line.color
          })
        )
      ])
    })
  );

  document.getElementById(id).appendChild(chart);

  return chart;
}
