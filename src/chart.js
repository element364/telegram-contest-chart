import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

import { render, createComponent, createElement, mount, withState } from "./vdom";


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

  function LineChart({ width, height, data, xs = 0, xf = 1 }, children) {
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

    return createElement(
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

  function Chart() {
    const [getState, setState] = withState({ coords: null, moving: false, x: 100});
    const state = getState();
    let x = state.x;
    console.log('state: ', state);
    let coords = state.coords;
    let moving = state.moving;

    return createElement("div", {}, [
      createComponent(LineChart, {
        width,
        height: chartHeight,
        data: data.filter(dataSet => lines[dataSet.name]),
        xs: state.x / width,
        xf: (state.x + 100) / width
      }),
      createComponent(LineChart, {
        width,
        height: previewHeight,
        data
      },
        [createElement("rect",
          {
            x,
            y: 0,
            width: 100,
            height: height,
            fill: "hsla(200, 100%, 50%, .5)",
            onMouseDown(e) {
              console.log("onMouseDown", e);
              // coords = {
              //   x: e.pageX
              // };
              // moving = true;
              setState({
                ...state,
                coords: {
                  x: e.pageX
                },
                moving: true
              });
            },
            onMouseMove(e) {
              if (state.moving) {
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
                setState({
                  coords: {
                    x: e.pageX
                  },
                  moving: true,
                  x
                });
              }
            },
            onMouseUp(e) {
              console.log("onMouseUp", e);
              setState({
                ...state,
                moving: false,
                coords: {},
              });
            }
          })
        ]),
      createElement(
        "div",
        {},
        data.map(dataSet =>
          createElement(
            "span",
            {
              style: `margin: 0 5px; padding: 10px; border: 1px solid gray; border-radius: 15px; background-color: ${
                lines[dataSet.name] ? "green" : "red"
                };`,
              onClick() {
                lines[dataSet.name] = !lines[dataSet.name];
                console.log(lines);
              }
            },
            dataSet.name
          )
        )
      )
    ]);
  }

  const root = document.getElementById(id);
  mount(root, createComponent(Chart));
}
