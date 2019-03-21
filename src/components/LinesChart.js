import React from "react";

import { scaleLinear, line } from "../utils/chart";

import Axis from "./Axis";

export default function LineChart({
  data,
  margins,
  zoom,
  showAxis = false,
  width,
  height,
  children
}) {
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

  const preScale = scaleLinear({
    domain: [margins.left, width - margins.right],
    range: [minX, maxX]
  });

  const xScale = scaleLinear({
    domain: [preScale(zoom[0]), preScale(zoom[1])],
    range: [margins.left, width - margins.right]
  });

  const yScale = scaleLinear({
    domain: [minY, maxY],
    range: [height - margins.top, margins.bottom]
  });

  return (
    <svg width={width} height={height}>
      {showAxis && (
        <Axis
          orient="Bottom"
          translate={`translate(0, ${height - margins.bottom})`}
          scale={xScale}
          format={v => {
            const d = new Date(v);
            const month = d.getMonth() + 1;
            const date = d.getDate();
            return `${date < 10 ? "0" : ""}${date}.${
              month < 10 ? "0" : ""
            }${month}.${d.getFullYear()}`;
          }}
        />
      )}
      {showAxis && (
        <Axis orient="Left" translate={`translate(${margins.left}, 0)`} scale={yScale} />
      )}
      {data.map(dataSet => {
        const d = line({
          x: x => xScale(x),
          y: (y, i) => yScale(dataSet.y[i]),
          data: dataSet.x
        });
        return <path key={dataSet.name} d={d} stroke={dataSet.line.color} fill="none" />;
      })}
      {children}
    </svg>
  );
}
