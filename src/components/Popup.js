import {h} from '../utils/vdom';

export default function Popup({
  x,
  height,
  xLabel,
  yLabels,
  margins,
  nightMode,
}) {
  const charWidth = 9;
  const between = 2;

  let maxLabel = Number.MIN_VALUE;

  for (const yLabel of yLabels) {
    maxLabel = Math.max(
      maxLabel,
      Math.max(yLabel.name.length, yLabel.value.toString().length),
    );
  }

  const legendWidth =
    margins.left +
    margins.right +
    Math.max(
      xLabel.length * charWidth,
      (maxLabel + between) * yLabels.length * charWidth,
    );

  const legendHeight = margins.top + 50 + margins.bottom;

  return (
    <g>
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={nightMode ? '#3c495b' : '#dfe6ec'}
      />
      <rect
        x={x - legendWidth / 2}
        y={0}
        width={legendWidth}
        height={legendHeight}
        rx={5}
        ry={5}
        stroke={nightMode ? '#212a38' : '#e3e3e3'}
        strokeWidth={2}
        fill={nightMode ? '#263242' : '#fff'}
      />
      <g transform={`translate(${x - legendWidth / 2}, 0)`}>
        <text
          dx={margins.left}
          dy={margins.top + 10}
          fill={nightMode ? '#fff' : '#222'}>
          {xLabel}
        </text>
      </g>
      {yLabels.map((label, idx) => (
        <g key={label.name} transform={`translate(${x - legendWidth / 2}, 0)`}>
          <text
            dx={margins.left + (maxLabel + between) * charWidth * idx}
            dy={margins.top + 30}
            fill={label.color}>
            {label.value}
          </text>
          <text
            dx={margins.left + (maxLabel + between) * charWidth * idx}
            dy={margins.top + 50}
            fill={label.color}>
            {label.name}
          </text>
        </g>
      ))}
    </g>
  );
}
