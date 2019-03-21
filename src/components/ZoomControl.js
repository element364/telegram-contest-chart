import React, { useState, useEffect, useCallback } from "react";

export default class ZoomControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moving: false,
      lMoving: false,
      rMoving: false,
      startX: 0
    };

    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }

  mouseMoveHandler(e) {
    const { value, onChange, width, margins } = this.props;
    const { moving, lMoving, rMoving, startX } = this.state;

    if (moving) {
      const dx = startX - e.pageX;

      const lXNew = value[0] - dx;
      const rXNew = value[1] - dx;

      if (lXNew >= margins.left && lXNew < rXNew && rXNew <= width - margins.right) {
        this.setState({ startX: e.pageX }, () => onChange([lXNew, rXNew]));
      }
    } else if (lMoving) {
      const x = value[0] - startX + e.pageX;

      if (x >= margins.left && x < value[1]) {
        this.setState({ startX: e.pageX }, () => onChange([x, value[1]]));
      }
    } else if (rMoving) {
      const x = value[1] - startX + e.pageX;

      if (x > value[0] && x <= width - margins.right) {
        this.setState({ startX: e.pageX }, () => onChange([value[0], x]));
      }
    }
  }

  mouseUpHandler() {
    this.setState({
      moving: false,
      lMoving: false,
      rMoving: false
    });
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.mouseUpHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  render() {
    const { value, height } = this.props;

    return (
      <g>
        <rect
          x={value[0]}
          y={0}
          width={value[1] - value[0]}
          height={height}
          fill="hsla(200, 100%, 50%, .5)"
          className="hover-cursor"
          onMouseDown={e =>
            this.setState({
              startX: e.pageX,
              moving: true
            })
          }
        />
        <rect
          x={value[0]}
          y={0}
          width={2}
          height={height}
          fill="red"
          className="resize-cursor"
          onMouseDown={e =>
            this.setState({
              startX: e.pageX,
              lMoving: true
            })
          }
        />
        <rect
          x={value[1]}
          y={0}
          width={2}
          height={height}
          fill="red"
          className="resize-cursor"
          onMouseDown={e =>
            this.setState({
              startX: e.pageX,
              rMoving: true
            })
          }
        />
      </g>
    );
  }
}
