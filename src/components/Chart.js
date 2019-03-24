import React, {useState} from 'react';
import LinesChart from './LinesChart';
import ZoomControl from './ZoomControl';
import LegendButton from './LegendButton';

export default function Chart({data, width = 960, height = 225}) {
  const [nightMode, setNightMode] = useState(false);
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
    <div style={{backgroundColor: nightMode ? '#252f3f' : '#fff'}}>
      <div>
        <LinesChart
          data={data.filter(chart => visibleLines[chart.name])}
          width={width}
          height={height - 40}
          margins={{top: 50, right: 0, bottom: 50, left: 50}}
          zoom={zoom}
          nightMode={nightMode}
          showAxis
        />
        <LinesChart
          data={data}
          width={width}
          height={40}
          margins={{top: 0, right: 0, bottom: 0, left: 50}}
          zoom={[50, 960]}
          nightMode={nightMode}>
          <ZoomControl
            width={width}
            height={height}
            margins={{top: 0, right: 0, bottom: 0, left: 50}}
            nightMode={nightMode}
            value={zoom}
            onChange={setZoom}
          />
        </LinesChart>
      </div>

      <div className="legend">
        {Object.keys(visibleLines).map(line => (
          <LegendButton
            key={line}
            toggled={visibleLines[line]}
            nightMode={nightMode}
            onClick={() => {
              setVisibleLines({
                ...visibleLines,
                [line]: !visibleLines[line],
              });
            }}>
            {line}
          </LegendButton>
        ))}
      </div>

      <div className="hover-cursor" style={{textAlign: 'center'}}>
        <span
          onClick={() => setNightMode(!nightMode)}
          style={{color: nightMode ? '#3f9dea' : '#2d8cea'}}>
          {nightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
        </span>
      </div>
    </div>
  );
}
