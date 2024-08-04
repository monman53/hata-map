import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import { resetAllParameter } from './utils'

export const app = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  n: 10,
  pause: false,
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
