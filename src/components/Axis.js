import React from "react";

const tickFontSize = 10;
const tickFont = "sans-serif";

const strokeColor = "grey";
const strokeWidth = 1;
const tickSizeInner = 6;
const tickSizeOuter = 6;
const tickPadding = 3;

function translateX(scale0, scale1, d) {
  const x = scale0(d);
  return `translate(${isFinite(x) ? x : scale1(d)},0)`;
}

function translateY(scale0, scale1, d) {
  const y = scale0(d);
  return `translate(0,${isFinite(y) ? y : scale1(d)})`;
}

export default class Axis extends React.Component {
  render() {
    const { orient, scale, tickCount = 5, translate, format = v => v } = this.props;

    const range = scale.range();
    const values = scale.ticks(tickCount);

    const transform = orient === "Bottom" ? translateX : translateY;
    const tickTransformer = d => transform(scale, scale, d);

    const k = orient === "Left" ? -1 : 1;

    const isHorizontal = orient === "Left";

    const x = isHorizontal ? "x" : "y";
    const y = isHorizontal ? "y" : "x";

    const halfWidth = strokeWidth / 2;

    const range0 = range[0] + halfWidth;
    const range1 = range[range.length - 1] + halfWidth;

    const spacing = Math.max(tickSizeInner, 0) + tickPadding;

    return (
      <g
        fill="none"
        fontSize={tickFontSize}
        fontFamily={tickFont}
        textAnchor={orient === "Left" ? "end" : "middle"}
        strokeWidth={strokeWidth}
        transform={translate}
      >
        <path
          stroke={strokeColor}
          d={
            isHorizontal
              ? `M${k * tickSizeOuter},${range0}H${halfWidth}V${range1}H${k * tickSizeOuter}`
              : `M${range0},${k * tickSizeOuter}V${halfWidth}H${range1}V${k * tickSizeOuter}`
          }
        />
        {values.map((value, idx) => {
          const lineProps = {
            stroke: strokeColor,
            [`${x}2`]: k * tickSizeInner,
            [`${y}1`]: halfWidth,
            [`${y}2`]: halfWidth
          };

          const textProps = {
            fill: strokeColor,
            dy: orient === "Bottom" ? "0.7em" : "0.3em",
            [x]: k * spacing,
            [y]: halfWidth
          };

          return (
            <g key={`t-${idx}`} opacity={1} transform={tickTransformer(value)}>
              <line {...lineProps} />
              <text {...textProps}>{format(value)}</text>
            </g>
          );
        })}
      </g>
    );
  }
}
