import Chart from "./components/Chart";
import { createComponent, mount } from "./vdom";

export function renderChart(id, data, { width = 960, height = 225 } = {}) {
  const lines = {};

  for (const dataSet of data) {
    lines[dataSet.name] = true;
  }

  const root = document.getElementById(id);
  mount(root, createComponent(Chart, { data, lines, width, height }));
}
