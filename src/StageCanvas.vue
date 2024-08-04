<script lang="ts">
// Canvases
export const canvas = ref()
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
    canvasSize: gl.getUniformLocation(mainProgram, 'canvasSize'),
  }

  //--------------------------------
  // Create buffers
  //--------------------------------

  // Dummy clip for texture computation
  // const createDummyClipVA = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
  //   const buffer = gl.createBuffer()
  //   gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  //   gl.bufferData(
  //     gl.ARRAY_BUFFER,
  //     new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), // Rectangle
  //     gl.STATIC_DRAW
  //   )
  //   const vao = gl.createVertexArray()
  //   gl.bindVertexArray(vao)

  //   // setup our attributes to tell WebGL how to pull
  //   // the data from the buffer above to the position attribute
  //   const positionLoc = gl.getAttribLocation(program, 'position')
  //   gl.enableVertexAttribArray(positionLoc)
  //   gl.vertexAttribPointer(
  //     positionLoc,
  //     2, // size (num components)
  //     gl.FLOAT, // type of data in buffer
  //     false, // normalize
  //     0, // stride (0 = auto)
  //     0 // offset
  //   )

  //   return vao
  // }

  // const drawVA = createDummyClipVA(gl, drawProgram)


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
