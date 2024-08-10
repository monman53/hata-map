import { app } from './main'
import { gaussianRandom, hataMap, vec, Vec, vecRad } from './math'
import { displayParameter, displayProps, parameter, parameterProps } from './parameters'

export const humanReadable = (x: number) => {
  return x.toPrecision(4)
}

export const resetParameter = (category: any) => {
  for (const prop of category.props) {
    if (prop.name in parameter.value) {
      if (prop.default instanceof Vec) {
        parameter.value[prop.name as keyof typeof parameter.value] = prop.default.copy()
      } else {
        parameter.value[prop.name as keyof typeof parameter.value] = prop.default
      }
    }else{
      if (prop.default instanceof Vec) {
        displayParameter.value[prop.name as keyof typeof displayParameter.value] = prop.default.copy()
      } else {
        displayParameter.value[prop.name as keyof typeof displayParameter.value] = prop.default
      }
    }
  }

  fitView()
}

export const resetAllParameter = () => {
  for (const category of displayProps.value) {
    for (const prop of category.props) {
      displayParameter.value[prop.name as keyof typeof displayParameter.value] = prop.default
    }
  }
  for (const category of parameterProps.value) {
    for (const prop of category.props) {
      parameter.value[prop.name as keyof typeof parameter.value] = prop.default.copy()
    }
  }

  fitView()
  fitView()
}


export const getHataMapRect = (z0: Vec, a: Vec, b: Vec, c: Vec, d: Vec, n: number) => {
  let left = Infinity
  let top = -Infinity
  let right = -Infinity
  let bottom = Infinity
  const f = (z: Vec, depth: number) => {
    if (depth === n) {
      left = Math.min(z.x, left)
      top = Math.max(z.y, top)
      right = Math.max(z.x, right)
      bottom = Math.min(z.y, bottom)
    } else {
      const z1 = hataMap(z, a, b, c, d, 0)
      const z2 = hataMap(z, a, b, c, d, 1)
      f(z1, depth + 1)
      f(z2, depth + 1)
    }
  }
  f(z0, 0)
  return [left, top, right, bottom]
}

export const fitView = () => {
  const a = parameter.value.a
  const b = parameter.value.b
  const c = parameter.value.c
  const d = parameter.value.d
  const [left, top, right, bottom] = getHataMapRect(vec(0, 0), a, b, c, d, 10)

  app.value.prevC = app.value.c
  app.value.c = vec((left + right) / 2, (top + bottom) / 2)

  const width = right - left
  const height = top - bottom

  app.value.prevScale = app.value.scale
  const aspect = app.value.width / app.value.height
  const nextAspect = width / height
  const fitRatio = 1.8
  if (aspect < nextAspect) {
    app.value.scale = (app.value.width / width) * fitRatio
  } else {
    app.value.scale = (app.value.height / height) * fitRatio
  }
}

export const randomParameter = () => {
  parameter.value.a = vec(0, 0)
  parameter.value.b = vec(0, 0)
  parameter.value.c = vec(0, 0)
  parameter.value.d = vec(0, 0)

  const majorParams = []
  const minorParams = []
  const rand = Math.random()
  if (rand < 1 / 4) {
    majorParams.push(parameter.value.a)
    majorParams.push(parameter.value.c)
    minorParams.push(parameter.value.b)
    minorParams.push(parameter.value.d)
  } else if (rand < 2 / 4) {
    majorParams.push(parameter.value.a)
    majorParams.push(parameter.value.d)
    minorParams.push(parameter.value.b)
    minorParams.push(parameter.value.c)
  } else if (rand < 3 / 4) {
    majorParams.push(parameter.value.b)
    majorParams.push(parameter.value.c)
    minorParams.push(parameter.value.a)
    minorParams.push(parameter.value.d)
  } else {
    majorParams.push(parameter.value.b)
    majorParams.push(parameter.value.d)
    minorParams.push(parameter.value.a)
    minorParams.push(parameter.value.c)
  }

  majorParams.forEach((param) => {
    const theta = Math.random() * 2 * Math.PI
    const radius =
      displayParameter.value.majorR + Math.abs(gaussianRandom(0, displayParameter.value.majorStd))
    const n = vecRad(theta).mul(radius)
    param.x = n.x
    param.y = n.y
  })
  minorParams.forEach((param) => {
    const theta = Math.random() * 2 * Math.PI
    const radius =
      displayParameter.value.minorR + Math.abs(gaussianRandom(0, displayParameter.value.minorStd))
    const n = vecRad(theta).mul(radius)
    param.x = n.x
    param.y = n.y
  })

  // Add history
  app.value.randomHistory.push({
    a: parameter.value.a.copy(),
    b: parameter.value.b.copy(),
    c: parameter.value.c.copy(),
    d: parameter.value.d.copy()
  })
  if (app.value.randomHistory.length > app.value.randomHistoryMax) {
    app.value.randomHistory.shift()
  }
  app.value.randomHistoryPtr = app.value.randomHistory.length - 1

  app.value.t = 0
  fitView()
}