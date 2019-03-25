import { h, mount } from "./utils/vdom";

import LinesChart from "./components/LinesChart";
import LegendButton from "./components/LegendButton";
import ZoomControl from "./components/ZoomControl";

import data from "../docs/chart_data.json";

/*
import lagRadar from './utils/lag-radar';

const destroyLagRadar = lagRadar({
  frames: 50, // number of frames to draw, more = worse performance
  speed: 0.0017, // how fast the sweep moves (rads per ms)
  size: 300, // outer frame px
  inset: 3, // circle inset px
  parent: document.getElementById('lagRadar'), // DOM node to attach to
});
*/

const root = document.getElementById("app");

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

  const id1 = `chart-o-${idx}`;
  const el1 = document.createElement("div");
  el1.setAttribute("id", id1);
  root.appendChild(el1);

  const id2 = `chart-c-${idx}`;
  const el2 = document.createElement("div");
  el2.setAttribute("id", id2);
  root.appendChild(el2);

  const visibleLines = {};

  for (const dataFrame of chartData) {
    visibleLines[dataFrame.name] = true;
  }

  const state = {
    nightMode: false,
    width: 640,
    height: 320,
    zoomMargins: { top: 0, right: 0, bottom: 0, left: 50 },
    data: chartData,
    zoom: [50, 150],
    startX: 0,
    moving: false,
    lMoving: false,
    rMoving: false,
    visibleLines,
    popupIdx: -1
  };

  const actions = {
    toggleNightMode: () => state => ({
      ...state,
      nightMode: !state.nightMode
    }),
    toggleLineVisibility: line => state => ({
      ...state,
      visibleLines: {
        ...state.visibleLines,
        [line]: !state.visibleLines[line]
      }
    }),
    setPopupIdx: idx => state => ({
      ...state,
      popupIdx: idx
    }),
    startMoveLeft: e => (state, acts) => {
      addEventListener("mousemove", acts.mouseMove);
      addEventListener("touchmove", acts.mouseMove);
      addEventListener("mouseup", acts.mouseUp);
      addEventListener("touchend", acts.mouseUp);

      return {
        ...state,
        lMoving: true,
        startX: e.pageX
      };
    },
    startMove: e => (state, acts) => {
      addEventListener("mousemove", acts.mouseMove);
      addEventListener("touchmove", acts.mouseMove);
      addEventListener("mouseup", acts.mouseUp);
      addEventListener("touchend", acts.mouseUp);

      return {
        ...state,
        moving: true,
        startX: e.pageX
      };
    },
    startMoveRight: e => (state, acts) => {
      addEventListener("mousemove", acts.mouseMove);
      addEventListener("touchmove", acts.mouseMove);
      addEventListener("mouseup", acts.mouseUp);
      addEventListener("touchend", acts.mouseUp);

      return {
        ...state,
        rMoving: true,
        startX: e.pageX
      };
    },
    mouseMove: e => state => {
      if (state.moving) {
        const dx = state.startX - e.pageX;

        const lXNew = state.zoom[0] - dx;
        const rXNew = state.zoom[1] - dx;

        if (
          lXNew >= state.zoomMargins.left &&
          lXNew < rXNew &&
          rXNew <= state.width - state.zoomMargins.right
        ) {
          return {
            ...state,
            startX: e.pageX,
            zoom: [lXNew, rXNew]
          };
        }
      } else if (state.lMoving) {
        const x = state.zoom[0] - state.startX + e.pageX;

        if (x >= state.zoomMargins.left && x < state.zoom[1]) {
          return {
            ...state,
            startX: e.pageX,
            zoom: [x, state.zoom[1]]
          };
        }
      } else if (state.rMoving) {
        const x = state.zoom[1] - state.startX + e.pageX;

        if (x > state.zoom[0] && x <= state.width - state.zoomMargins.right) {
          return {
            ...state,
            startX: e.pageX,
            zoom: [state.zoom[0], x]
          };
        }
      }
    },
    mouseUp: () => (state, acts) => {
      removeEventListener("mousemove", acts.mouseMove);
      removeEventListener("mouseup", acts.mouseUp);

      return {
        ...state,
        lMoving: false,
        moving: false,
        rMoving: false
      };
    }
  };

  const view = (state, actions) => (
    <div style={{ backgroundColor: state.nightMode ? "#252f3f" : "#fff" }}>
      <div>
        <LinesChart
          nightMode={state.nightMode}
          data={state.data.filter(chart => state.visibleLines[chart.name])}
          zoom={state.zoom}
          popupIdx={state.popupIdx}
          width={state.width}
          height={state.height - 40}
          margins={{ top: 50, right: 0, bottom: 50, left: 50 }}
          onSetPopupIdx={actions.setPopupIdx}
          clipId="large-clip"
          showAxis
        />
      </div>
      <div>
        <LinesChart
          nightMode={state.nightMode}
          data={state.data}
          width={state.width}
          height={40}
          margins={state.zoomMargins}
          zoom={[state.zoomMargins.left, state.width]}
          clipId="zoom-clip"
        >
          <ZoomControl
            nightMode={state.nightMode}
            width={state.width}
            height={40}
            margins={state.zoomMargins}
            value={state.zoom}
            onchange={(state, zoom) => ({
              ...state,
              zoom
            })}
            onMousedownLeft={actions.startMoveLeft}
            onMouseDown={actions.startMove}
            onMouseDownRight={actions.startMoveRight}
          />
        </LinesChart>
      </div>

      <div className="legend">
        {Object.keys(state.visibleLines).map(line => (
          <LegendButton
            nightMode={state.nightMode}
            toggled={state.visibleLines[line]}
            onclick={() => actions.toggleLineVisibility(line)}
          >
            {line}
          </LegendButton>
        ))}
      </div>

      <div className="hover-cursor" style={{ textAlign: "center" }}>
        <span
          onclick={actions.toggleNightMode}
          style={{ color: state.nightMode ? "#3f9dea" : "#2d8cea" }}
          className="no-user-select"
        >
          {state.nightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
        </span>
      </div>
    </div>
  );

  mount(state, actions, view, document.getElementById(id2));
}
