// How oftet Object.keys will be executed ???

export function h(tag, props = {}, children = []) {
  const isSvgTag = tag === "svg" || tag === "g" || tag === "circle" || tag === "path";

  const el = isSvgTag
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);

  for (const prop of Object.keys(props)) {
    const propValue = props[prop];

    if (prop.indexOf("on") === 0) {
      el.addEventListener(prop.substring(2).toLowerCase(), propValue);
    } else {
      el.setAttribute(prop, propValue);
    }
  }

  if (typeof children === "string") {
    el.innerText = children;
  } else {
    for (const child of children) {
      if (child) {
        el.appendChild(child);
      }
    }
  }

  return el;
}

export function render(node, vdom) {}
