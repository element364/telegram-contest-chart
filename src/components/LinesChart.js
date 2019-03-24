import {h} from '../utils/vdom';

import {scaleLinear, line} from '../utils/chart';

import Axis from './Axis';
import Popup from './Popup';

export default function LinesChart(
  {
    data,
    popupIdx,
    margins,
    zoom,
    nightMode,
    showAxis = false,
    width,
    height,
    onSetPopupIdx = () => {},
  },
  children,
) {
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
    range: [minX, maxX],
  });

  const xScale = scaleLinear({
    domain: [preScale(zoom[0]), preScale(zoom[1])],
    range: [margins.left, width - margins.right],
  });

  const reverseXScale = scaleLinear({
    domain: [margins.left, width - margins.right],
    range: [preScale(zoom[0]), preScale(zoom[1])],
  });

  const yScale = scaleLinear({
    domain: [minY, maxY],
    range: [height - margins.top, margins.bottom],
  });

  return (
    <svg
      width={width}
      height={height}
      onmousemove={e => {
        const revX = reverseXScale(e.pageX);

        let minD = Math.abs(data[0].x[0] - revX);
        let minIdx = 0;

        for (let i = 1; i < data[0].x.length; i++) {
          const d = Math.abs(data[0].x[i] - revX);

          if (d < minD) {
            minD = d;
            minIdx = i;
          }
        }

        onSetPopupIdx(minIdx);
      }}
      onmouseleave={() => onSetPopupIdx(-1)}>
      {showAxis && (
        <Axis
          orient="Bottom"
          translate={`translate(0, ${height - margins.bottom})`}
          scale={xScale}
          format={v => {
            const d = new Date(v);
            const month = d.getMonth() + 1;
            const date = d.getDate();
            return `${date < 10 ? '0' : ''}${date}.${
              month < 10 ? '0' : ''
            }${month}.${d.getFullYear()}`;
          }}
          nightMode={nightMode}
        />
      )}
      {showAxis && (
        <Axis
          orient="Left"
          translate={`translate(${margins.left}, 0)`}
          scale={yScale}
          nightMode={nightMode}
        />
      )}
      {data.map(dataSet => {
        const d = line({
          x: x => xScale(x),
          y: (y, i) => yScale(dataSet.y[i]),
          data: dataSet.x,
        });
        return (
          <path
            key={dataSet.name}
            d={d}
            stroke={dataSet.line.color}
            fill="none"
          />
        );
      })}
      {children}
      {popupIdx >= 0 && (
        <Popup
          x={xScale(data[0].x[popupIdx])}
          height={height}
          xLabel={new Date(data[0].x[popupIdx]).toDateString()}
          yLabels={data.map(dataSet => ({
            name: dataSet.name,
            color: dataSet.line.color,
            value: dataSet.y[popupIdx],
          }))}
          nightMode={nightMode}
          margins={{top: 10, right: 10, bottom: 10, left: 10}}
        />
      )}
    </svg>
  );
}
