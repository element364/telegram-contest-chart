// How oftet Object.keys will be executed ???

export function createDomElement(tag, props = {}, children = []) {
  // console.log('createDomElement', {
  //   tag,
  //   props,
  //   children
  // })

  const isSvgTag = tag === 'svg' || tag === 'g' || tag === 'circle' || tag === 'path'

  const el = isSvgTag ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag)

  for (const prop of Object.keys(props)) {
    const propValue = props[prop]

    el.setAttribute(prop, propValue)
  }

  for (const child of children) {
    if (child) {
      el.appendChild(child)
    }
  }

  return el
}