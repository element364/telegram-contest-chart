import {h} from '../utils/vdom';

export default function LegendButton({toggled, nightMode, onclick}, children) {
  return (
    <div
      className={`legend-item ${
        toggled ? 'legend-item__on' : 'legend-item__off'
      } animated`}
      style={{borderColor: nightMode ? '#354559' : '#e6ecf0'}}
      onclick={onclick}>
      <i className="legend-icon-container">
        <i
          className="legend-icon-circle"
          style={{backgroundColor: toggled ? '#3cc23f' : '#f34c44'}}>
          <svg
            class="legend-icon-circle__img"
            width="32"
            height="32"
            viewBox="0 0 32 32">
            <defs>
              <path
                d="M1.75 19.25c-.14-.19-.28-.45-.4-.79-.19-.52-.34-.61-.35-1.25-.02-.89.17-1.55.55-1.99.86-.97 1.17-1.03 2.29-.98.74.04 1.47.43 2.19 1.19 2.62 2.75 4.27 4.47 4.92 5.16.27.28.7.28.97.01 1.96-1.97 6.86-6.9 14.69-14.79.76-.59 1.47-.86 2.13-.81.99.08 1.62.25 2.34 1.32.36.55.55 1.31.54 2.28 0 .45-.18.88-.49 1.21-3.81 4-13.65 14.35-17.18 18.06-1.02 1.07-2.73 1.09-3.76.03-1.13-1.16-3.94-4.04-8.44-8.65z"
                id="a"
              />
            </defs>
            <use href="#a" fill="#fff" />
          </svg>
        </i>
        <i className="animation-circle" />
      </i>
      <span
        className="legend-item-text no-user-select"
        style={{color: nightMode ? '#d8dde0' : '#525659'}}>
        {children}
      </span>
    </div>
  );
}
