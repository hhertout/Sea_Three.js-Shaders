import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexSharder from "./shaders/water/vertex.glsl"
import waterFragmentShader from "./shaders/water/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 340})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 1024, 1024)


//Color
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9BD8FF'


// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexSharder,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uTime: {value: 0},
        uBigWaveSpeed: {value: 0.75},
        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},

        uSmallWaveElevation: {value: 0.05},
        uSmallWaveFrequency: {value: 4},
        uSmallWaveSpeed: {value: 0.2},
        uSmallWaveIteration: {value: 4.0},

        uDepthColor : {value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor : {value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 5.0},
    }
})
gui.add(waterMaterial.uniforms.uSmallWaveIteration, 'value')
    .min(0)
    .max(5)
    .step(1)
    .name('uSmallWaveIteration')

gui.add(waterMaterial.uniforms.uSmallWaveElevation, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('uSmallWaveElevation')

gui.add(waterMaterial.uniforms.uSmallWaveFrequency, 'value')
    .min(0)
    .max(30)
    .step(0.01)
    .name('uSmallWaveFrequency')

gui.add(waterMaterial.uniforms.uSmallWaveSpeed, 'value')
    .min(0)
    .max(5)
    .step(0.01)
    .name('uSmallWaveSpeed')

gui.add(waterMaterial.uniforms.uColorMultiplier, 'value')
    .min(0)
    .max(10)
    .step(0.01)
    .name('uColorMultiplier')

gui.add(waterMaterial.uniforms.uColorOffset, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name("uColorOffset")

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name("uBigWaveElevation")

gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
    .min(0)
    .max(10)
    .step(0.001)
    .name("uBigWavesFrequency")

gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
    .min(0)
    .max(10)
    .step(0.001)
    .name("uBigWavesFrequency")

gui.add(waterMaterial.uniforms.uBigWaveSpeed, 'value')
    .min(0)
    .max(7)
    .step(0.001)
    .name("uBigWaveSpeed")

gui.addColor(debugObject, 'depthColor')
    .name("depthColor")
    .onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor))

gui.addColor(debugObject, 'surfaceColor')
    .name("surfaceColor")
    .onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    waterMaterial.uniforms.uTime.value = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()