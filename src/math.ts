//================================
// Liner algebra
//================================

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
