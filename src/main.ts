import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import { resetAllParameter } from './utils'
import { vec } from './math'
import { parameter, parameterProps } from './parameters'

export const app = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  n: 10,
  pause: false,
  t: 2, // > 1 for initial Bezier creation
  c: vec(0, 0),
  prevC: vec(0, 0),
  scale: 0,
  prevScale: 0,
  pointerPos: vec(0, 0),
  mousePos: vec(0, 0),
  randomAnimation: false,
  // TODO: Better way
  randomHistory: [
    {
      a: parameterProps.value[0].props[0].default,
      b: parameterProps.value[0].props[1].default,
      c: parameterProps.value[0].props[2].default,
      d: parameterProps.value[0].props[3].default
    }
  ],
  randomHistoryPtr: 1,
  randomHistoryMax: 512
})

export const fps = ref(0)

resetAllParameter()

const resize = () => {
  app.value.width = window.innerWidth
  app.value.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)

createApp(App).mount('#app')
