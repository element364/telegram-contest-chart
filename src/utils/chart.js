// import { scaleLinear as sl } from "d3-scale";
// import { line as l } from "d3-shape";

const E2 = Math.sqrt(2);
const E5 = Math.sqrt(10);
const E10 = Math.sqrt(50);

export function incrementTick(start, stop, count) {
  const step = (stop - start) / Math.max(0, count);
  const power = Math.floor(Math.log(step) / Math.LN10);
  const error = step / Math.pow(10, power);

  if (power >= 0) {
    return (error >= E10 ? 10 : error >= E5 ? 5 : error >= E2 ? 2 : 1) * Math.pow(10, power);
  }

  return -Math.pow(10, -power) / (error >= E10 ? 10 : error >= E5 ? 5 : error >= E2 ? 2 : 1);
}

export function scaleLinear({ domain, range }) {
  // return sl()
  //   .domain(domain)
  //   .range(range);

  const a = (range[0] - range[1]) / (domain[0] - domain[1]);
  const b = range[0] - domain[0] * a;

  const f = x => a * x + b;

  f.range = () => range;

  f.ticks = count => {
    let start = domain[0];
    let stop = domain[1];

    if (start === stop && count > 0) {
      return [start];
    }

    let reverse = stop < start;

    if (reverse) {
      const t = start;
      start = stop;
      stop = t;
    }

    const step = incrementTick(start, stop, count);

    if (step === 0 || !isFinite(step)) {
      return [];
    }

    const result = [];

    if (step > 0) {
      start = Math.ceil(start / step);
      stop = Math.floor(stop / step);
      const n = Math.ceil(stop - start + 1);

      let i = -1;

      while (++i < n) {
        result.push((start + i) * step);
      }
    } else {
      start = Math.floor(start * step);
      stop = Math.ceil(stop * step);
      const n = Math.ceil(start - stop + 1);

      while (++i < n) {
        result.push((start - i) / step);
      }
    }

    if (reverse) {
      result.reverse();
    }

    return result;
  };

  return f;
}

export function line({ x, y, data }) {
  // const d = l()
  //   .x(x)
  //   .y(y)(data);

  let d = "";

  for (let i = 0; i < data.length; i++) {
    const xCoord = x(data[i], i);
    const yCoord = y(data[i], i);

    if (i === 0) {
      d += "M";
    } else {
      d += "L";
    }
    d += xCoord + "," + yCoord;
  }

  return d;
}
