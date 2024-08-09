import { vec } from './math'

export const parameterTemplates = [
  { name: '0', a: vec(0.7, -0.2), b: vec(0, 0), c: vec(0, 0), d: vec(0.65, 0) },
  { name: 'a', a: vec(2 / 3, -0.5), b: vec(0, 0), c: vec(-0.25, 0.5), d: vec(0, 0) },
  { name: 'b', a: vec(0.4614, 0.4614), b: vec(0, 0), c: vec(-0.622, 0.194), d: vec(0, 0) },
  { name: 'c', a: vec(0.3, 0.7), b: vec(0, 0), c: vec(0, 0), d: vec(0.2, 0.5) },
  { name: 'd', a: vec(0.2, -0.7), b: vec(0, 0), c: vec(0, 0), d: vec(0.2, 0.6) },
  { name: 'e', a: vec(0, 0), b: vec(0.45, 0.5), c: vec(0, 0), d: vec(0.45, -0.5) },
  { name: 'f', a: vec(0, 0), b: vec(0.5, 0.3), c: vec(0, 0), d: vec(0.67, 0) },
  { name: 'g', a: vec(0, 0.5), b: vec(0, 0), c: vec(0, 0), d: vec(0.75, 0) },
  { name: 'h', a: vec(0.5, -0.5), b: vec(0, 0), c: vec(-0.5, 0.5), d: vec(0, 0) }
]

export const colorTemplates = [
  {
    name: 'autumn',
    minHue: 0.0,
    maxHue: 0.25,
    saturation: 0.7,
    lightness: 0.5,
    lightnessOffset: 0.4,
    alpha: 1.0
  },
  {
    name: 'winter',
    minHue: 0.62,
    maxHue: 0,
    saturation: 0.58,
    lightness: 1,
    lightnessOffset: 0.1,
    alpha: 1.0
  },
  {
    name: 'leaf',
    minHue: 0.25,
    maxHue: 0.0,
    saturation: 1.0,
    lightness: 0.9,
    lightnessOffset: 0.1,
    alpha: 1.0
  },
  {
    name: 'sakura',
    minHue: 0.83,
    maxHue: 0.0,
    saturation: 0.66,
    lightness: 1.0,
    lightnessOffset: 0.5,
    alpha: 1.0
  },
  {
    name: 'rainbow',
    minHue: 0,
    maxHue: 1,
    saturation: 0.8,
    lightness: 0.5,
    lightnessOffset: 1,
    alpha: 1.0
  },
]
