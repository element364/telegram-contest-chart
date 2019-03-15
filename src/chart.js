import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

import { h, render } from "./vdom";

export function renderChart(id, data, { width = 960, height = 225 } = {}) {
  const previewHeight = 40;
  const chartHeight = height - previewHeight;

  console.log(`[+] Rendering to ${id}`, data);

  console.log({ chartHeight });

  let moving = false;
  let coords = {};
  let x = 100;

  const lines = {};

  for (const dataSet of data) {
    lines[dataSet.name] = true;
  }

  function LineChart({ width, height, data, xs = 0, xf = 1, children }) {
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

    return h(
      "svg",
      {
        width,
        height,
        viewBox: `${xs * width} 0 ${xf * width} ${height}`
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
        }),
        children
      ]
    );
  }

  function Chart() {
    return h("div", {}, [
      LineChart({
        width,
        height: chartHeight,
        data: data.filter(dataSet => lines[dataSet.name]),
        xs: x / width,
        xf: (x + 100) / width
      }),
      LineChart({
        width,
        height: previewHeight,
        data,
        children: h("rect", {
          x,
          y: 0,
          width: 100,
          height: height,
          fill: "hsla(200, 100%, 50%, .5)",
          onMouseDown(e) {
            console.log("onMouseDown", e);
            coords = {
              x: e.pageX
            };
            moving = true;
          },
          onMouseMove(e) {
            if (moving) {
              console.log("onMouseMove", e.pageX, e.pageY);

              const xDiff = coords.x - e.pageX;

              coords.x = e.pageX;

              x -= xDiff;

              if (x < 0) {
                x = 0;
              }

              if (x + 100 > width) {
                x = width - 100;
              }

              replaceDom();
            }
          },
          onMouseUp(e) {
            console.log("onMouseUp", e);
            moving = false;
            coords = {};
          }
        })
      }),
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
