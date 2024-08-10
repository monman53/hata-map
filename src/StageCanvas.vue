<script lang="ts">
// Canvases
export const canvas = ref()

// Methods
const getPositionOnSvg = (e: any) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = rect.bottom - e.clientY
  return vec(x, y)
}

const getPositionOnSvgApp = (e: any) => {
  const m = getPositionOnSvg(e)
  const x = ((m.x - app.value.width / 2) / app.value.scale) * 2 + app.value.c.x
  const y = ((m.y - app.value.height / 2) / app.value.scale) * 2 + app.value.c.y
  return vec(x, y)
}

const getPositionDiffOnSvgApp = (e: any, m0: Vec) => {
  const m = getPositionOnSvg(e)
  const d = m.inplaceSub(m0).inplaceDiv(app.value.scale / 2)
  return d
}

const preventDefaultAndStopPropagation = (e: any) => {
  e.stopPropagation()
  e.preventDefault()
}

// Elements move system on SVG
let moveHandlerWithM0: any = null
let m0: Vec
const setMoveHandlerWithM0 = (h: any, m: Vec) => {
  moveHandlerWithM0 = h
  m0 = m
}

const svgMoveHandler = (e: any) => {
  e.preventDefault()
  app.value.pointerPos = getPositionOnSvgApp(e)
  app.value.mousePos = getPositionOnSvg(e)
  if (moveHandlerWithM0 !== null) {
    preventDefaultAndStopPropagation(e)
    const d = getPositionDiffOnSvgApp(e, m0)
    moveHandlerWithM0(e, d)
  }
}
const svgMoveEndHandler = () => {
  moveHandlerWithM0 = null
}

const svgScaleHandler = (e: any) => {
  preventDefaultAndStopPropagation(e)
  // Zoom in/out
  const p = getPositionOnSvgApp(e)
  const scaleFactor = 1.1
  const r = e.deltaY > 0 ? scaleFactor : 1 / scaleFactor
  app.value.c = app.value.c.add(p.sub(app.value.c).mul(1 - r))
  app.value.scale /= r
}

const moveStart = (e: any) => {
  const c0 = app.value.c.copy()
  const m0 = getPositionOnSvg(e)
  setMoveHandlerWithM0((e_: any, d: Vec) => {
    app.value.c = c0.sub(d)
  }, m0)
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { app, fps } from './main'

// Shaders
import mainVS from './glsl/main.vert?raw'
import mainFS from './glsl/main.frag?raw'
import { displayParameter, parameter } from './parameters'
import { Vec, vec } from './math'
import { createAndSetRandomParameter } from './utils'

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
    prevScale: gl.getUniformLocation(mainProgram, 'prevScale'),
    scale: gl.getUniformLocation(mainProgram, 'scale'),
    prevCenter: gl.getUniformLocation(mainProgram, 'prevCenter'),
    center: gl.getUniformLocation(mainProgram, 'center'),
    pointSize: gl.getUniformLocation(mainProgram, 'pointSize'),
    t: gl.getUniformLocation(mainProgram, 't'),
    param0: gl.getUniformLocation(mainProgram, 'param0'),
    param1: gl.getUniformLocation(mainProgram, 'param1'),
    param2: gl.getUniformLocation(mainProgram, 'param2'),
    param3: gl.getUniformLocation(mainProgram, 'param3'),
    hsl: gl.getUniformLocation(mainProgram, 'hsl'),
    lightnessOffset: gl.getUniformLocation(mainProgram, 'lightnessOffset'),
    minHue: gl.getUniformLocation(mainProgram, 'minHue'),
    maxHue: gl.getUniformLocation(mainProgram, 'maxHue'),
    alpha: gl.getUniformLocation(mainProgram, 'alpha'),
    canvasSize: gl.getUniformLocation(mainProgram, 'canvasSize')
  }

  //================================
  // Frame render function
  //================================
  let counter = 0
  let fpsThen = 0
  let appThen = 0
  let a0 = parameter.value.a.copy()
  let b0 = parameter.value.b.copy()
  let c0 = parameter.value.c.copy()
  let d0 = parameter.value.d.copy()
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
    // if (!app.value.pause) {
    {
      const dt = time - appThen
      app.value.t += (dt * displayParameter.value.timeScale) / 300
      // Update
      if (app.value.t > 1.0 || app.value.pause) {
        app.value.t = app.value.t - Math.floor(app.value.t)

        if (app.value.pause) {
          a[0] = parameter.value.a
          b[0] = parameter.value.b
          c[0] = parameter.value.c
          d[0] = parameter.value.d
          a[1] = parameter.value.a
          b[1] = parameter.value.b
          c[1] = parameter.value.c
          d[1] = parameter.value.d
        } else {
          a[0] = a[3]
          b[0] = b[3]
          c[0] = c[3]
          d[0] = d[3]
          a[1] = a[3].add(a[3].sub(a[2]))
          b[1] = b[3].add(b[3].sub(b[2]))
          c[1] = c[3].add(c[3].sub(c[2]))
          d[1] = d[3].add(d[3].sub(d[2]))
        }

        // if (app.value.randomAnimation) {
        if (app.value.pause) {
          app.value.prevScale = app.value.scale
          app.value.prevC = app.value.c
        } else {
          createAndSetRandomParameter()
        }
      }
    }
    appThen = time

    a[2] = parameter.value.a
    b[2] = parameter.value.b
    c[2] = parameter.value.c
    d[2] = parameter.value.d
    a[3] = parameter.value.a
    b[3] = parameter.value.b
    c[3] = parameter.value.c
    d[3] = parameter.value.d

    //--------------------------------
    // Draw
    //--------------------------------
    // Clear canvas
    gl.useProgram(mainProgram)

    gl.uniform1i(mainProgLocs.n, displayParameter.value.n)
    gl.uniform1f(mainProgLocs.prevScale, app.value.prevScale)
    gl.uniform1f(mainProgLocs.scale, app.value.scale)
    gl.uniform1f(mainProgLocs.pointSize, displayParameter.value.pointSize)
    gl.uniform2f(mainProgLocs.prevCenter, app.value.prevC.x, app.value.prevC.y)
    gl.uniform2f(mainProgLocs.center, app.value.c.x, app.value.c.y)
    gl.uniform1f(mainProgLocs.t, app.value.t)
    gl.uniform1f(mainProgLocs.lightnessOffset, displayParameter.value.lightnessOffset)
    gl.uniform1f(mainProgLocs.minHue, displayParameter.value.minHue)
    gl.uniform1f(mainProgLocs.maxHue, displayParameter.value.maxHue)
    gl.uniformMatrix4x2fv(mainProgLocs.param0, false, [
      a[0].x,
      a[0].y,
      b[0].x,
      b[0].y,
      c[0].x,
      c[0].y,
      d[0].x,
      d[0].y
    ])
    gl.uniformMatrix4x2fv(mainProgLocs.param1, false, [
      a[1].x,
      a[1].y,
      b[1].x,
      b[1].y,
      c[1].x,
      c[1].y,
      d[1].x,
      d[1].y
    ])
    gl.uniformMatrix4x2fv(mainProgLocs.param2, false, [
      a[2].x,
      a[2].y,
      b[2].x,
      b[2].y,
      c[2].x,
      c[2].y,
      d[2].x,
      d[2].y
    ])
    gl.uniformMatrix4x2fv(mainProgLocs.param3, false, [
      a[3].x,
      a[3].y,
      b[3].x,
      b[3].y,
      c[3].x,
      c[3].y,
      d[3].x,
      d[3].y
    ])
    gl.uniform3f(
      mainProgLocs.hsl,
      0, // dummy
      displayParameter.value.saturation,
      displayParameter.value.lightness
    )
    gl.uniform1f(mainProgLocs.alpha, displayParameter.value.alpha)
    gl.uniform2i(mainProgLocs.canvasSize, app.value.width, app.value.height)

    gl.viewport(0, 0, app.value.width, app.value.height)

    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1 << displayParameter.value.n)

    // Next frame
    window.requestAnimationFrame(render)
  }

  window.requestAnimationFrame(render)
})
</script>

<template>
  <div id="base">
    <canvas
      ref="canvas"
      :width="app.width"
      :height="app.height"
      @mousemove="svgMoveHandler"
      @mouseup="svgMoveEndHandler"
      @wheel="svgScaleHandler"
      @mousedown="moveStart"
    ></canvas>
  </div>
</template>
