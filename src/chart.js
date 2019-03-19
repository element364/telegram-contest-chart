import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

import { render, createComponent, createElement, mount, withState } from "./vdom";

export function renderChart(id, data, { width = 960, height = 225 } = {}) {
  const previewHeight = 40;
  const chartHeight = height - previewHeight;

  console.log(`[+] Rendering to ${id}`, data);
  console.log({ chartHeight });

  const lines = {};

  for (const dataSet of data) {
    lines[dataSet.name] = true;
  }

  function LineChart({ width, height, data, lX, rX }, children) {
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

  function Chart({ lines }) {
    const [getState, setState] = withState({
      lines,
      coords: null,
      startX: 0,
      moving: false,
      x: 100,
      lStartX: 0,
      lX: 100,
      lMoving: false,
      rStartX: 0,
      rX: 200,
      rMoving: false
    });
    const state = getState();
    console.log("[*] state: ", state);

    return createElement(
      "div",
      {
        onMouseMove(e) {
          if (state.moving) {
            const xDiff = state.startX - e.pageX;

            const lX = state.lX - xDiff;
            const rX = state.rX - xDiff;

            if (lX >= 0 && lX < rX && rX <= width) {
              setState({
                ...state,
                startX: e.pageX,
                lX,
                rX
              });
            }
          } else if (state.lMoving) {
            const lX = state.lX - state.lStartX + e.pageX;

            if (lX >= 0 && lX < state.rX) {
              setState({
                ...state,
                lStartX: e.pageX,
                lX
              });
            }
          } else if (state.rMoving) {
            const rX = state.rX - state.rStartX + e.pageX;

            if (rX <= width && rX > state.lX) {
              setState({
                ...state,
                rStartX: e.pageX,
                rX
              });
            }
          }
        }
      },
      [
        createComponent(LineChart, {
          width,
          height: chartHeight,
          data: data.filter(dataSet => lines[dataSet.name]),
          lX: state.lX,
          rX: state.rX
        }),
        createComponent(
          LineChart,
          {
            width,
            height: previewHeight,
            data,
            lX: 0,
            rX: width
          },
          [
            createElement("rect", {
              x: state.lX,
              y: 0,
              width: state.rX - state.lX,
              height: height,
              fill: "hsla(200, 100%, 50%, .5)",
              class: "hover-cursor",
              onMouseDown(e) {
                setState({
                  ...state,
                  startX: e.pageX,
                  moving: true
                });
              },
              onMouseUp(e) {
                setState({
                  ...state,
                  moving: false
                });
              }
            }),
            createElement("rect", {
              x: state.lX,
              y: 0,
              width: 2,
              height: height,
              fill: "red",
              class: "resize-cursor",
              onMouseDown(e) {
                setState({
                  ...state,
                  lStartX: e.pageX,
                  lMoving: true
                });
              },
              onMouseUp() {
                setState({
                  ...state,
                  lMoving: false
                });
              }
            }),
            createElement("rect", {
              x: state.rX,
              y: 0,
              width: 2,
              height: height,
              fill: "red",
              class: "resize-cursor",
              onMouseDown(e) {
                setState({
                  ...state,
                  rStartX: e.pageX,
                  rMoving: true
                });
              },
              onMouseUp() {
                setState({
                  ...state,
                  rMoving: false
                });
              }
            })
          ]
        ),
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
                  setState({
                    ...state,
                    lines: {
                      ...lines,
                      [dataSet.name]: !lines[dataSet.name]
                    }
                  });
                }
              },
              dataSet.name
            )
          )
        )
      ]
    );
  }

  const root = document.getElementById(id);
  mount(root, createComponent(Chart, { lines }));
}
