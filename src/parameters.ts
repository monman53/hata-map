import { ref } from 'vue'

export const parameter = ref({
  n: 10,
  scale: 0,
  ar: 0.0,
  ai: 0.0,
  br: 0.0,
  bi: 0.0,
  cr: 0.0,
  ci: 0.0,
  dr: 0.0,
  di: 0.0
})

export const parameterProps = ref([
  {
    name: 'Parameters',
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
        default: 1 << 11,
        min: 0,
        max: 1 << 13,
        step: 1
      },
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
      }
    ]
  }
])
