import { ref } from 'vue'
import { vec } from './math'

export const displayParameter = ref({
  n: 10,
  majorR: 0,
  majorStd: 0,
  minorR: 0,
  minorStd: 0,
  pointSize: 0.5,
  timeScale: 0.6,
  moveScale: 1.0,
  minHue: 0.3,
  maxHue: 0.0,
  saturation: 1.0,
  lightness: 0.5,
  lightnessOffset: 0.2,
  alpha: 0.5
})

export const parameter = ref({
  a: vec(0, 0),
  b: vec(0, 0),
  c: vec(0, 0),
  d: vec(0, 0),
  aStd: vec(0, 0),
  bStd: vec(0, 0),
  cStd: vec(0, 0),
  dStd: vec(0, 0)
})

export const displayProps = ref([
  {
    name: 'Color',
    visible: false,
    props: [
      { name: 'minHue', default: 0.25, min: 0, max: 1, step: 0.001 },
      { name: 'maxHue', default: 0, min: 0, max: 1, step: 0.001 },
      { name: 'saturation', default: 1.0, min: 0, max: 1, step: 0.001 },
      { name: 'lightness', default: 0.9, min: 0, max: 1, step: 0.001 },
      { name: 'lightnessOffset', default: 0.1, min: 0, max: 1, step: 0.001 },
      { name: 'alpha', default: 1.0, min: 0, max: 1, step: 0.001 }
    ]
  },
  {
    name: 'Shape',
    visible: false,
    props: [
      { name: 'n', default: 19, min: 0, max: 32, step: 1 },
      { name: 'majorR', default: 0.65, min: 0.5, max: 1.0, step: 0.0001 },
      { name: 'majorStd', default: 0.05, min: 0, max: 0.3, step: 0.0001 },
      { name: 'minorR', default: 0, min: 0.0, max: 0.5, step: 0.0001 },
      { name: 'minorStd', default: 0.05, min: 0, max: 0.3, step: 0.0001 },
      { name: 'pointSize', default: 0.1, min: 0, max: 1, step: 0.001 },
      { name: 'timeScale', default: 0.4, min: 0, max: 1.5, step: 0.001 },
      // { name: 'moveScale', default: 0.0, min: 0, max: 32, step: 0.001 },
    ]
  }
])
export const parameterProps = ref([
  {
    name: 'Parameters',
    visible: false,
    props: [
      { name: 'a', default: vec(0.7, -0.2), min: -1, max: 1, step: 0.001 },
      { name: 'b', default: vec(0, 0), min: -1, max: 1, step: 0.001 },
      { name: 'c', default: vec(0, 0), min: -1, max: 1, step: 0.001 },
      { name: 'd', default: vec(0.65, 0), min: -1, max: 1, step: 0.001 }
      // { name: 'aStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
      // { name: 'bStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
      // { name: 'cStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
      // { name: 'dStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
    ]
  }
])
