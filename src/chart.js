import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

import { h, render } from "./vdom";

export function renderChart(id, data, { width = 960, height = 225 } = {}) {
  console.log(`[+] Rendering to ${id}`, data);

  const lines = {};

  for (const dataSet of data) {
    lines[dataSet.name] = true;
  }

  function Chart() {
    let minX = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;

    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;

    for (const dataSet of data) {
      if (lines[dataSet.name]) {
        minX = Math.min(minX, ...dataSet.x);
        maxX = Math.max(maxX, ...dataSet.x);

        minY = Math.min(minY, ...dataSet.y);
        maxY = Math.max(maxY, ...dataSet.y);
      }
    }

    const xScale = scaleLinear()
      .domain([minX, maxX])
      .range([0, width]);
    const yScale = scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);

    return h("div", {}, [
      h(
        "svg",
        {
          width,
          height,
          viewBox: `0 0 ${width} ${height}`,
          style: `width: 100%;`
        },
        data.map(dataSet => {
          if (!lines[dataSet.name]) {
            return null;
          }
          const l = line()
            .x((x, i) => {
              return xScale(x);
            })
            .y((y, i) => {
              return yScale(dataSet.y[i]);
            });
          const d = l(dataSet.x);
          return h("g", {}, [
            h("path", { d, stroke: dataSet.line.color, fill: "none" }),
            ...dataSet.x.map((x, idx) =>
              h("circle", {
                cx: xScale(x),
                cy: yScale(dataSet.y[idx]),
                r: 1,
                fill: dataSet.line.color
              })
            )
          ]);
        })
      ),
      h(
        "div",
        {},
        data.map(dataSet =>
          h(
            "span",
            {
              style: `margin: 0 5px; padding: 10px; border: 1px solid gray; border-radius: 15px; background-color: ${
                lines[dataSet.name] ? "green" : "red"
              };`,
              onClick() {
                lines[dataSet.name] = !lines[dataSet.name];
                console.log(lines);
                replaceDom();
              }
            },
            dataSet.name
          )
        )
      )
    ]);
  }

  const root = document.getElementById(id);

  function replaceDom() {
    while (root.lastChild) {
      root.removeChild(root.lastChild);
    }

    root.appendChild(Chart());
  }

  replaceDom();
}
