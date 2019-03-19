// How oftet Object.keys will be executed ???

export function h(tag, props = {}, children = []) {
  const isSvgTag =
    tag === "svg" ||
    tag === "g" ||
    tag === "circle" ||
    tag === "path" ||
    tag === "line" ||
    tag === "rect";

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

export function createElement(tagName, props = {}, children = []) {
  return () => {
    return {
      tagName,
      props,
      children
    };
  };
}

export function createComponent(fn, props = {}, children = []) {
  return () => fn(props, children);
}

let prevState;
let currentHook = [
  // 0: hook first parameter
  // 1: hook second parameter
  // 2: lazy VDOM element
  // 3: DOM element
];

export function render(lazyVDom) {
  currentHook = [];
  prevState = lazyVDom.prevState;
  let vdom = typeof lazyVDom === "function" ? lazyVDom() : lazyVDom;
  // Component
  if (typeof vdom === "function") {
    currentHook[2] = lazyVDom;
    vdom = vdom();
  }

  let el;
  if (typeof vdom === "string") {
    el = document.createTextNode(vdom);
    currentHook[3] = el;
    return el;
  }

  const tag = vdom.tagName;
  const isSvgTag =
    tag === "svg" || tag === "g" || tag === "circle" || tag === "path" || tag === "rect";

  el = isSvgTag
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);

  currentHook[3] = el;
  for (let [attr, value] of Object.entries(vdom.props)) {
    if (attr.indexOf("on") === 0) {
      el.addEventListener(attr.substring(2).toLowerCase(), value);
    } else {
      el.setAttribute(attr, value);
    }
  }
  for (let child of vdom.children) {
    el.appendChild(render(child));
  }
  return el;
}

export function mount(target, vDom) {
  const dom = render(vDom);
  target.replaceWith(dom);
}

export function withState(initialState) {
  let state = initialState;
  if (prevState !== undefined) {
    state = prevState;
  }
  let self;
  console.log("withState");
  currentHook = self = [
    () => state,
    newState => {
      state = newState;
      const target = self[3];
      const vDom = self[2];
      vDom.prevState = newState;
      console.log("Prev state: ", vDom.prevState);
      mount(target, vDom);
    }
  ];
  return self;
}
