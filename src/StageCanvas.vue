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
  // saveImage()
  // console.log(gl.getParameter(gl.MAX_VIEWPORT_DIMS))

  //--------------------------------
  // Create programs
  //--------------------------------

  const mainProgram = createProgram(gl, [mainVS, mainFS])
  const mainProgLocs = {
    n: gl.getUniformLocation(mainProgram, 'n'),
    scale: gl.getUniformLocation(mainProgram, 'scale'),
    a: gl.getUniformLocation(mainProgram, 'a'),
    b: gl.getUniformLocation(mainProgram, 'b'),
    c: gl.getUniformLocation(mainProgram, 'c'),
    d: gl.getUniformLocation(mainProgram, 'd'),
    canvasSize: gl.getUniformLocation(mainProgram, 'canvasSize'),
  }

  //================================
  // Frame render function
  //================================
  let counter = 0
  let then = 0
  const render = (time: number) => {
    if (gl === null) {
      throw new Error()
    }

    //--------------------------------
    // Calculate FPS
    //--------------------------------
    counter += 1
    if (counter % 100 == 0) {
      time *= 0.001
      fps.value = 100 / (time - then)
      then = time
    }

    //--------------------------------
    // Draw
    //--------------------------------
    if (!app.value.pause) {
      // Clear canvas
      gl.useProgram(mainProgram)

      gl.uniform1i(mainProgLocs.n, parameter.value.n)
      gl.uniform1f(mainProgLocs.scale, parameter.value.scale)
      gl.uniform2f(mainProgLocs.a, parameter.value.ar, parameter.value.ai)
      gl.uniform2f(mainProgLocs.b, parameter.value.br, parameter.value.bi)
      gl.uniform2f(mainProgLocs.c, parameter.value.cr, parameter.value.ci)
      gl.uniform2f(mainProgLocs.d, parameter.value.dr, parameter.value.di)
      gl.uniform2i(mainProgLocs.canvasSize, app.value.width, app.value.height)

      gl.viewport(0, 0, app.value.width, app.value.height)

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.drawArrays(gl.POINTS, 0, 1 << parameter.value.n)
    }

    // Next frame
    window.requestAnimationFrame(render)
    // console.log(profile)
  }

  window.requestAnimationFrame(render)
})
</script>

<template>
  <div id="base">
    <canvas ref="canvas" :width="app.width" :height="app.height"></canvas>
  </div>
</template>
