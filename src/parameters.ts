import { ref } from 'vue'

export const parameter = ref({
  n: 10,
  scale: 0,
  timeScale: 0.5,
  moveScale: 1.0,
  hue: 0.3,
  saturation: 1.0,
  lightness: 0.5,
  alpha: 0.5,
  ar: 0.0,
  ai: 0.0,
  br: 0.0,
  bi: 0.0,
  cr: 0.0,
  ci: 0.0,
  dr: 0.0,
  di: 0.0,
  arStd: 0.0,
  aiStd: 0.0,
  brStd: 0.0,
  biStd: 0.0,
  crStd: 0.0,
  ciStd: 0.0,
  drStd: 0.0,
  diStd: 0.0
})

export const parameterProps = ref([
  {
    name: 'Display',
    visible: true,
    props: [
      {
        name: 'n',
        default: 16,
        min: 0,
        max: 32,
        step: 1
      },
      {
        name: 'scale',
        default: 1 << 10,
        min: 0,
        max: 1 << 13,
        step: 1
      },
      {
        name: 'timeScale',
        default: 0.5,
        min: 0,
        max: 3,
        step: 0.001
      },
      {
        name: 'moveScale',
        default: 1.0,
        min: 0,
        max: 128,
        step: 0.001
      },
      {
        name: 'hue',
        default: 0.3,
        min: 0,
        max: 1,
        step: 0.001
      },
      {
        name: 'saturation',
        default: 1.0,
        min: 0,
        max: 1,
        step: 0.001
      },
      {
        name: 'lightness',
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.001
      },
      {
        name: 'alpha',
        default: 1.0,
        min: 0,
        max: 1,
        step: 0.001
      }
    ]
  },
  {
    name: 'Parameters',
    visible: false,
    props: [
      {
        name: 'ar',
        default: 0.7,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'ai',
        default: -0.2,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'br',
        default: 0,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'bi',
        default: 0,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'cr',
        default: 0,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'ci',
        default: 0,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'dr',
        default: 0.65,
        min: -1,
        max: 1,
        step: 0.001
      },
      {
        name: 'di',
        default: 0,
        min: -1,
        max: 1,
        step: 0.001
      },
      { name: 'arStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'aiStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'brStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'biStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'crStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'ciStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'drStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 },
      { name: 'diStd', default: 0.001, min: 0, max: 0.1, step: 0.0001 }
    ]
  }
])
