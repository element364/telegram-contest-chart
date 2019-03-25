import { h } from "../utils/vdom";

export default function ZoomControl({
  nightMode,
  height,
  value,
  onchange,
  onMousedownLeft,
  onMouseDown,
  onMouseDownRight
}) {
  return (
    <g>
      <rect
        x={value[0]}
        y={0}
        width={value[1] - value[0]}
        height={height}
        fill="hsla(200, 100%, 50%, .5)"
        class="hover-cursor"
        onmousedown={onMouseDown}
        ontouchstart={onMouseDown}
      />
      <rect
        x={value[0] - 5}
        y={0}
        width={5}
        height={height}
        fill={nightMode ? "#41556d" : "#deeaf4"}
        class="resize-cursor"
        onmousedown={onMousedownLeft}
        ontouchstart={onMousedownLeft}
      />
      <rect
        x={value[1]}
        y={0}
        width={5}
        height={height}
        fill={nightMode ? "#41556d" : "#deeaf4"}
        class="resize-cursor"
        onmousedown={onMouseDownRight}
        ontouchstart={onMouseDownRight}
      />
    </g>
  );
}
