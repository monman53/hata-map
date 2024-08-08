import { ref } from 'vue'
import { vec } from './math'

export const displayParameter = ref({
  n: 10,
  scale: 0,
  prevScale: 0, // Not visible
  pointSize: 0.5,
  timeScale: 0.6,
  moveScale: 1.0,
  hue: 0.3,
  saturation: 1.0,
  lightness: 0.5,
  alpha: 0.5,
})

export const parameter = ref({
  a: vec(0, 0),
  b: vec(0, 0),
  c: vec(0, 0),
  d: vec(0, 0),
  aStd: vec(0, 0),
  bStd: vec(0, 0),
  cStd: vec(0, 0),
  dStd: vec(0, 0),
})

export const displayProps = ref([
  {
    name: 'Display',
    visible: true,
    props: [
      { name: 'n', default: 16, min: 0, max: 32, step: 1 },
      { name: 'pointSize', default: 0.5, min: 0, max: 2, step: 0.001 },
      { // Not visible
        name: 'prevScale',
        default: Math.min(window.innerWidth, window.innerHeight),
        min: 0,
        max: 1 << 14,
        step: 1
      },
      {
        name: 'scale',
        default: Math.min(window.innerWidth, window.innerHeight),
        min: 0,
        max: 1 << 14,
        step: 1
      },
      { name: 'timeScale', default: 0.3, min: 0, max: 3, step: 0.001 },
      { name: 'moveScale', default: 1.0, min: 0, max: 32, step: 0.001 },
      { name: 'hue', default: 0.3, min: 0, max: 1, step: 0.001 },
      { name: 'saturation', default: 1.0, min: 0, max: 1, step: 0.001 },
      { name: 'lightness', default: 0.9, min: 0, max: 1, step: 0.001 },
      { name: 'alpha', default: 1.0, min: 0, max: 1, step: 0.001 }
    ]
  },
])
export const parameterProps = ref([
  {
    name: 'Parameters',
    visible: false,
    props: [
      { name: 'a', default: vec(0.7, -0.2), min: -1, max: 1, step: 0.001 },
      { name: 'b', default: vec(0, 0), min: -1, max: 1, step: 0.001 },
      { name: 'c', default: vec(0, 0), min: -1, max: 1, step: 0.001 },
      { name: 'd', default: vec(0.65, 0), min: -1, max: 1, step: 0.001 },
      { name: 'aStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
      { name: 'bStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
      { name: 'cStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
      { name: 'dStd', default: vec(0.001, 0.001), min: 0, max: 0.01, step: 0.0001 },
    ]
  }
])
