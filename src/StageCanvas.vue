<script lang="ts">
// Canvases
export const canvas = ref()
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { app, fps } from './main'

// Shaders
import mainVS from './glsl/main.vert?raw'
import mainFS from './glsl/main.frag?raw'
import { parameter } from './parameters'
import { gaussianRandom, vec } from './math'

//--------------------------------
// WebGL support functions
//--------------------------------
const createShader = (gl: WebGL2RenderingContext, type: GLenum, src: string) => {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error()
  }
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  // if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  //     throw new Error(gl.getShaderInfoLog(shader));
  // }
  return shader
}

function createProgram(gl: WebGL2RenderingContext, shaderSources: string[]) {
  const program = gl.createProgram()
  if (!program) {
    throw new Error()
  }
  ;[gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx])
    if (!shader) {
      throw new Error()
    }
    gl.attachShader(program, shader)
  })
  gl.linkProgram(program)
  // if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  //     throw new Error(gl.getProgramParameter(program));
  // }
  return program
}

onMounted(() => {
  const gl: WebGL2RenderingContext = canvas.value.getContext('webgl2', {
    preserveDrawingBuffer: true
  })
  if (gl === null) {
    throw new Error()
  }
  // console.log(gl.getParameter(gl.MAX_VIEWPORT_DIMS))

  //--------------------------------
  // Create programs
  //--------------------------------

  const mainProgram = createProgram(gl, [mainVS, mainFS])
  const mainProgLocs = {
    n: gl.getUniformLocation(mainProgram, 'n'),
    n2: gl.getUniformLocation(mainProgram, 'n2'),
    scale: gl.getUniformLocation(mainProgram, 'scale'),
    t: gl.getUniformLocation(mainProgram, 't'),
    paramR0: gl.getUniformLocation(mainProgram, 'paramR0'),
    paramI0: gl.getUniformLocation(mainProgram, 'paramI0'),
    paramR1: gl.getUniformLocation(mainProgram, 'paramR1'),
    paramI1: gl.getUniformLocation(mainProgram, 'paramI1'),
    paramR2: gl.getUniformLocation(mainProgram, 'paramR2'),
    paramI2: gl.getUniformLocation(mainProgram, 'paramI2'),
    paramR3: gl.getUniformLocation(mainProgram, 'paramR3'),
    paramI3: gl.getUniformLocation(mainProgram, 'paramI3'),
    canvasSize: gl.getUniformLocation(mainProgram, 'canvasSize'),
  }

  //================================
  // Frame render function
  //================================
  let counter = 0
  let fpsThen = 0
  let appThen = 0
  let t = 0
  let a0 = vec(parameter.value.ar, parameter.value.ai)
  let b0 = vec(parameter.value.br, parameter.value.bi)
  let c0 = vec(parameter.value.cr, parameter.value.ci)
  let d0 = vec(parameter.value.dr, parameter.value.di)
  let a = [a0, a0, a0, a0]
  let b = [b0, b0, b0, b0]
  let c = [c0, c0, c0, c0]
  let d = [d0, d0, d0, d0]
  const render = (time: number) => {
    if (gl === null) {
      throw new Error()
    }

    //--------------------------------
    // Calculate FPS
    //--------------------------------
    counter += 1
    if (counter % 100 == 0) {
      const now = time * 0.001
      fps.value = 100 / (now - fpsThen)
      fpsThen = now
    }

    //--------------------------------
    // Update curve
    //--------------------------------
    if (!app.value.pause) {
      const dt = time - appThen
      t += dt * parameter.value.timeScale / 300;
      // Update
      if (t > 1.0) {
        t = t - Math.floor(t)

        a[0] = a[3]
        b[0] = b[3]
        c[0] = c[3]
        d[0] = d[3]
        a[1] = a[3].add(a[3].sub(a[2]))
        b[1] = b[3].add(b[3].sub(b[2]))
        c[1] = c[3].add(c[3].sub(c[2]))
        d[1] = d[3].add(d[3].sub(d[2]))
        a[2] = vec(gaussianRandom(parameter.value.ar, parameter.value.arStd * parameter.value.moveScale), gaussianRandom(parameter.value.ai, parameter.value.aiStd * parameter.value.moveScale))
        b[2] = vec(gaussianRandom(parameter.value.br, parameter.value.brStd * parameter.value.moveScale), gaussianRandom(parameter.value.bi, parameter.value.biStd * parameter.value.moveScale))
        c[2] = vec(gaussianRandom(parameter.value.cr, parameter.value.crStd * parameter.value.moveScale), gaussianRandom(parameter.value.ci, parameter.value.ciStd * parameter.value.moveScale))
        d[2] = vec(gaussianRandom(parameter.value.dr, parameter.value.drStd * parameter.value.moveScale), gaussianRandom(parameter.value.di, parameter.value.diStd * parameter.value.moveScale))
        a[3] = vec(gaussianRandom(parameter.value.ar, parameter.value.arStd * parameter.value.moveScale), gaussianRandom(parameter.value.ai, parameter.value.aiStd * parameter.value.moveScale))
        b[3] = vec(gaussianRandom(parameter.value.br, parameter.value.brStd * parameter.value.moveScale), gaussianRandom(parameter.value.bi, parameter.value.biStd * parameter.value.moveScale))
        c[3] = vec(gaussianRandom(parameter.value.cr, parameter.value.crStd * parameter.value.moveScale), gaussianRandom(parameter.value.ci, parameter.value.ciStd * parameter.value.moveScale))
        d[3] = vec(gaussianRandom(parameter.value.dr, parameter.value.drStd * parameter.value.moveScale), gaussianRandom(parameter.value.di, parameter.value.diStd * parameter.value.moveScale))
      }
      appThen = time
    }

    //--------------------------------
    // Draw
    //--------------------------------
    if (!app.value.pause) {
      // Clear canvas
      gl.useProgram(mainProgram)

      gl.uniform1i(mainProgLocs.n, parameter.value.n)
      gl.uniform1i(mainProgLocs.n2, parameter.value.n)
      gl.uniform1f(mainProgLocs.scale, parameter.value.scale)
      gl.uniform1f(mainProgLocs.t, t)
      gl.uniform4f(mainProgLocs.paramR0, a[0].x, b[0].x, c[0].x, d[0].x)
      gl.uniform4f(mainProgLocs.paramI0, a[0].y, b[0].y, c[0].y, d[0].y)
      gl.uniform4f(mainProgLocs.paramR1, a[1].x, b[1].x, c[1].x, d[1].x)
      gl.uniform4f(mainProgLocs.paramI1, a[1].y, b[1].y, c[1].y, d[1].y)
      gl.uniform4f(mainProgLocs.paramR2, a[2].x, b[2].x, c[2].x, d[2].x)
      gl.uniform4f(mainProgLocs.paramI2, a[2].y, b[2].y, c[2].y, d[2].y)
      gl.uniform4f(mainProgLocs.paramR3, a[3].x, b[3].x, c[3].x, d[3].x)
      gl.uniform4f(mainProgLocs.paramI3, a[3].y, b[3].y, c[3].y, d[3].y)
      gl.uniform2i(mainProgLocs.canvasSize, app.value.width, app.value.height)

      gl.viewport(0, 0, app.value.width, app.value.height)

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.drawArrays(gl.POINTS, 0, 1 << parameter.value.n)
    }

    // Next frame
    window.requestAnimationFrame(render)
  }

  window.requestAnimationFrame(render)
})
</script>

<template>
  <div id="base">
    <canvas ref="canvas" :width="app.width" :height="app.height"></canvas>
  </div>
</template>
