import { app } from './main'
import { gaussianRandom, vec, Vec, vecRad } from './math'
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
    } else {
      if (prop.default instanceof Vec) {
        displayParameter.value[prop.name as keyof typeof displayParameter.value] =
          prop.default.copy()
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

// TODO: Move to math
const cMul = (a: Vec, b: Vec) => {
  return vec(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x)
}

// TODO: Move to math
const cComp = (a: Vec) => {
  return vec(a.x, -a.y)
}

export const hataMap = (z: Vec, p: Parameter, type: 0 | 1) => {
  if (type === 0) {
    return cMul(p.a, z).add(cMul(p.b, cComp(z)))
  } else {
    return cMul(p.c, vec(z.x - 1, z.y))
      .add(cMul(p.d, vec(z.x - 1, -z.y)))
      .add(vec(1.0, 0.0))
  }
}

export const getHataMapRect = (z0: Vec, p: Parameter, n: number) => {
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
      const z1 = hataMap(z, p, 0)
      const z2 = hataMap(z, p, 1)
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
  const [left, top, right, bottom] = getHataMapRect(vec(0, 0), { a, b, c, d }, 10)

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

export const addRandomHistory = (p: Parameter) => {
  // Add history
  app.value.randomHistory.push({
    a: p.a.copy(),
    b: p.b.copy(),
    c: p.c.copy(),
    d: p.d.copy()
  })
  if (app.value.randomHistory.length > app.value.randomHistoryMax) {
    app.value.randomHistory.shift()
  }
  app.value.randomHistoryPtr = app.value.randomHistory.length - 1
}

export const createRandomParameter = (): Parameter => {
  const majorR = displayParameter.value.majorR
  const majorRStd = displayParameter.value.majorStd
  const minorR = displayParameter.value.minorR
  const minorRStd = displayParameter.value.minorStd
  const a = vec(0, 0)
  const b = vec(0, 0)
  const c = vec(0, 0)
  const d = vec(0, 0)

  const majorParams = []
  const minorParams = []
  const rand = Math.random()
  if (rand < 1 / 4) {
    majorParams.push(a)
    majorParams.push(c)
    minorParams.push(b)
    minorParams.push(d)
  } else if (rand < 2 / 4) {
    majorParams.push(a)
    majorParams.push(d)
    minorParams.push(b)
    minorParams.push(c)
  } else if (rand < 3 / 4) {
    majorParams.push(b)
    majorParams.push(c)
    minorParams.push(a)
    minorParams.push(d)
  } else {
    majorParams.push(b)
    majorParams.push(d)
    minorParams.push(a)
    minorParams.push(c)
  }

  majorParams.forEach((param) => {
    const theta = Math.random() * 2 * Math.PI
    const radius = majorR + Math.abs(gaussianRandom(0, majorRStd))
    const n = vecRad(theta).mul(radius)
    param.x = n.x
    param.y = n.y
  })
  minorParams.forEach((param) => {
    const theta = Math.random() * 2 * Math.PI
    const radius = minorR + Math.abs(gaussianRandom(0, minorRStd))
    const n = vecRad(theta).mul(radius)
    param.x = n.x
    param.y = n.y
  })

  return { a, b, c, d }
}

type Parameter = {
  a: Vec
  b: Vec
  c: Vec
  d: Vec
}

export const createAndSetRandomParameter = () => {
  const p = createRandomParameter()
  hardSetParameter(p)
  app.value.t = 0
  fitView()
  addRandomHistory(p)
}

export const setCurrentParameter = (p: Parameter) => {
  parameter.value.a = p.a.copy()
  parameter.value.b = p.b.copy()
  parameter.value.c = p.c.copy()
  parameter.value.d = p.d.copy()
}

export const hardSetParameter = (p: Parameter) => {
  // Prev
  app.value.prevParameter.a = p.a.copy()
  app.value.prevParameter.b = p.b.copy()
  app.value.prevParameter.c = p.c.copy()
  app.value.prevParameter.d = p.d.copy()
  // Current
  parameter.value.a = p.a.copy()
  parameter.value.b = p.b.copy()
  parameter.value.c = p.c.copy()
  parameter.value.d = p.d.copy()
  // Next
  const n = createRandomParameter()
  app.value.nextParameter.a = n.a.copy()
  app.value.nextParameter.b = n.b.copy()
  app.value.nextParameter.c = n.c.copy()
  app.value.nextParameter.d = n.d.copy()
}
