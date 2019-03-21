import React, { useState } from "react";
import LinesChart from "./LinesChart";
import ZoomControl from "./ZoomControl";

export default function Chart({ data, width = 960, height = 225 }) {
  const [prevData, setPrevData] = useState({});
  const [visibleLines, setVisibleLines] = useState({});
  const [zoom, setZoom] = useState([100, 220]);

  if (data !== prevData) {
    const visible = {};

    for (const dataFrame of data) {
      visible[dataFrame.name] = true;
    }

    setPrevData(data);
    setVisibleLines(visible);
  }

  return (
    <div>
      <div>
        <LinesChart
          data={data.filter(chart => visibleLines[chart.name])}
          width={width}
          height={height - 40}
          showAxis
          margins={{ top: 50, right: 0, bottom: 50, left: 50 }}
          zoom={zoom}
        />
        <LinesChart
          data={data}
          width={width}
          height={40}
          margins={{ top: 0, right: 0, bottom: 0, left: 50 }}
          zoom={[50, 960]}
        >
          <ZoomControl
            width={width}
            height={height}
            margins={{ top: 0, right: 0, bottom: 0, left: 50 }}
            value={zoom}
            onChange={setZoom}
          />
        </LinesChart>
      </div>

      <div style={{ display: "flex" }}>
        {Object.keys(visibleLines).map(line => (
          <span
            key={line}
            style={{
              margin: "0 5px",
              padding: 10,
              border: "1px solid gray",
              borderRadius: 15,
              backgroundColor: visibleLines[line] ? "green" : "red"
            }}
            onClick={() => {
              setVisibleLines({
                ...visibleLines,
                [line]: !visibleLines[line]
              });
            }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
