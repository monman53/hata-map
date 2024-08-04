import { ref } from 'vue'

export const parameter = ref({
  n: 10,
  a: 0.0
})

export const parameterProps = ref([
  {
    name: 'Parameters',
    visible: true,
    props: [
      {
        name: 'n',
        default: 10,
        min: 0,
        max: 32,
        step: 1
      },
      {
        name: 'a',
        default: 0,
        min: -1,
        max: 1,
        step: 0.001
      }
    ]
  }
])
