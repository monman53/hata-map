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
  const x = ((m.x - app.value.width / 2) / displayParameter.value.scale) * 2 + app.value.c.x
  const y = ((m.y - app.value.height / 2) / displayParameter.value.scale) * 2 + app.value.c.y
  return vec(x, y)
}

const getPositionDiffOnSvgApp = (e: any, m0: Vec) => {
  const m = getPositionOnSvg(e)
  const d = m.inplaceSub(m0).inplaceDiv(displayParameter.value.scale / 2)
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
  displayParameter.value.scale /= r
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
import { fitView, gaussianRandom, Vec, vec } from './math'
import { randomParameter } from './StageUI.vue'

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
  let aStd2 = vec(0, 0)
  let bStd2 = vec(0, 0)
  let cStd2 = vec(0, 0)
  let dStd2 = vec(0, 0)
  let aStd3 = vec(0, 0)
  let bStd3 = vec(0, 0)
  let cStd3 = vec(0, 0)
  let dStd3 = vec(0, 0)
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
      app.value.t += (dt * displayParameter.value.timeScale) / 300
      // Update
      if (app.value.t > 1.0) {
        app.value.t = app.value.t - Math.floor(app.value.t)

        a[0] = a[3]
        b[0] = b[3]
        c[0] = c[3]
        d[0] = d[3]
        a[1] = a[3].add(a[3].sub(a[2]))
        b[1] = b[3].add(b[3].sub(b[2]))
        c[1] = c[3].add(c[3].sub(c[2]))
        d[1] = d[3].add(d[3].sub(d[2]))
        aStd2 = vec(gaussianRandom(), gaussianRandom())
        bStd2 = vec(gaussianRandom(), gaussianRandom())
        cStd2 = vec(gaussianRandom(), gaussianRandom())
        dStd2 = vec(gaussianRandom(), gaussianRandom())
        aStd3 = vec(gaussianRandom(), gaussianRandom())
        bStd3 = vec(gaussianRandom(), gaussianRandom())
        cStd3 = vec(gaussianRandom(), gaussianRandom())
        dStd3 = vec(gaussianRandom(), gaussianRandom())

        displayParameter.value.prevScale = displayParameter.value.scale
        app.value.prevC = app.value.c
      }
    }
    appThen = time

    const aStd = parameter.value.aStd
    const bStd = parameter.value.bStd
    const cStd = parameter.value.cStd
    const dStd = parameter.value.dStd
    const moveScale = displayParameter.value.moveScale

    a[2] = parameter.value.a.add(aStd2.eMul(aStd).mul(moveScale))
    b[2] = parameter.value.b.add(bStd2.eMul(bStd).mul(moveScale))
    c[2] = parameter.value.c.add(cStd2.eMul(cStd).mul(moveScale))
    d[2] = parameter.value.d.add(dStd2.eMul(dStd).mul(moveScale))
    a[3] = parameter.value.a.add(aStd3.eMul(aStd).mul(moveScale))
    b[3] = parameter.value.b.add(bStd3.eMul(bStd).mul(moveScale))
    c[3] = parameter.value.c.add(cStd3.eMul(cStd).mul(moveScale))
    d[3] = parameter.value.d.add(dStd3.eMul(dStd).mul(moveScale))

    //--------------------------------
    // Draw
    //--------------------------------
    // Clear canvas
    gl.useProgram(mainProgram)

    gl.uniform1i(mainProgLocs.n, displayParameter.value.n)
    gl.uniform1f(mainProgLocs.prevScale, displayParameter.value.prevScale)
    gl.uniform1f(mainProgLocs.scale, displayParameter.value.scale)
    gl.uniform1f(mainProgLocs.pointSize, displayParameter.value.pointSize)
    gl.uniform2f(mainProgLocs.prevCenter, app.value.prevC.x, app.value.prevC.y)
    gl.uniform2f(mainProgLocs.center, app.value.c.x, app.value.c.y)
    gl.uniform1f(mainProgLocs.t, app.value.t)
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
      displayParameter.value.hue,
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
