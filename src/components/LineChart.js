import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

import { createElement } from "../vdom";

export default function LineChart({ width, height, data, lX, rX }, children) {
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

  const preScale = scaleLinear()
    .domain([0, width])
    .range([minX, maxX]);

  const xScale = scaleLinear()
    .domain([preScale(lX), preScale(rX)])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain([minY, maxY])
    .range([height, 0]);

  return createElement(
    "svg",
    {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`
    },
    [
      ...data.map(dataSet => {
        const l = line()
          .x((x, i) => {
            return xScale(x);
          })
          .y((y, i) => {
            return yScale(dataSet.y[i]);
          });
        const d = l(dataSet.x);
        return createElement("g", {}, [
          createElement("path", { d, stroke: dataSet.line.color, fill: "none" }),
          ...dataSet.x.map((x, idx) =>
            createElement("circle", {
              cx: xScale(x),
              cy: yScale(dataSet.y[idx]),
              r: 1,
              fill: dataSet.line.color
            })
          )
        ]);
      }),
      ...children
    ]
  );
}
