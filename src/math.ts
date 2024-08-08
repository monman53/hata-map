//================================
// Liner algebra
//================================

import { app } from './main'
import { displayParameter, parameter } from './parameters'

export const vec = (x: number, y: number) => {
  return new Vec(x, y)
}

export const vecRad = (theta: number) => {
  return vec(Math.cos(theta), Math.sin(theta))
}

export class Vec {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  copy() {
    return vec(this.x, this.y)
  }

  inplaceAdd(v: Vec) {
    this.x += v.x
    this.y += v.y
    return this
  }

  inplaceSub(v: Vec) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  inplaceMul(a: number) {
    this.x *= a
    this.y *= a
    return this
  }

  inplaceDiv(a: number) {
    this.x /= a
    this.y /= a
    return this
  }

  inplaceMinus() {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  inplaceRotate(theta: number) {
    const x = this.x
    const y = this.y
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)
    this.x = cos * x - sin * y
    this.y = sin * x + cos * y
    return this
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  inplaceNormalize() {
    return this.inplaceDiv(this.length())
  }

  add(v: Vec) {
    return this.copy().inplaceAdd(v)
  }

  sub(v: Vec) {
    return this.copy().inplaceSub(v)
  }

  mul(a: number) {
    return this.copy().inplaceMul(a)
  }

  div(a: number) {
    return this.copy().inplaceDiv(a)
  }

  minus() {
    return this.copy().inplaceMinus()
  }

  normalize() {
    return this.copy().inplaceNormalize()
  }

  rotate(theta: number) {
    return this.copy().inplaceRotate(theta)
  }

  static add(a: Vec, b: Vec) {
    return a.add(b)
  }

  static sub(a: Vec, b: Vec) {
    return a.sub(b)
  }

  static mul(v: Vec, a: number) {
    return v.mul(a)
  }

  static div(v: Vec, a: number) {
    return v.div(a)
  }

  static normalize(v: Vec) {
    return v.normalize()
  }

  static rotate(v: Vec, theta: number) {
    return v.rotate(theta)
  }

  // TODO: toString
}

export const dot = (p: Vec, q: Vec) => {
  return p.x * q.x + p.y * q.y
}

// export const dotAngle = (x1: number, y1: number, x2: number, y2: number) => {
//     const norm1 = Math.sqrt(x1 * x1 + y1 * y1);
//     const norm2 = Math.sqrt(x2 * x2 + y2 * y2);
//     return Math.acos((x1 * x2 + y1 * y2) / (norm1 * norm2));
// };

export const cross = (p: Vec, q: Vec) => {
  return p.x * q.y - q.x * p.y
}

export const crossAngle = (p: Vec, q: Vec) => {
  return Math.asin(cross(p, q) / (p.length() * q.length()))
}

// Standard Normal variate using Box-Muller transform.
export const gaussianRandom = (mean = 0, stdev = 1) => {
  const u = 1 - Math.random() // Converting [0,1) to (0,1]
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean
}

const cMul = (a: Vec, b: Vec) => {
  return vec(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x)
}

const cComp = (a: Vec) => {
  return vec(a.x, -a.y)
}

export const hataMap = (z: Vec, a: Vec, b: Vec, c: Vec, d: Vec, type: 0 | 1) => {
  if (type === 0) {
    return cMul(a, z).add(cMul(b, cComp(z)))
  } else {
    return cMul(c, vec(z.x - 1, z.y))
      .add(cMul(d, vec(z.x - 1, -z.y)))
      .add(vec(1.0, 0.0))
  }
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

  app.value.c = vec((left + right) / 2, (top + bottom) / 2)

  const width = right - left
  // TODO:
  // const height = top - bottom
  displayParameter.value.scale = app.value.width / width
}
