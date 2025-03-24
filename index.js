const canvas = document.getElementById("threeCanvas")
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.z = 5

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.1
controls.rotateSpeed = 0.5
controls.autoRotate = false // Disable auto rotation
controls.autoRotateSpeed = 0.3
controls.enabled = false

let vertexShader, fragmentShader

Promise.all([
	fetch("vertexShader.vert").then((res) => res.text()),
	fetch("fragmentShader.frag").then((res) => res.text()),
]).then(([vertexShaderCode, fragmentShaderCode]) => {
	vertexShader = vertexShaderCode
	fragmentShader = fragmentShaderCode

	const planeGeometry = new THREE.PlaneGeometry(10, 10)
	const planeMaterial = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
			uTime: { value: 0.0 }, // Time uniform
			uMouse: { value: new THREE.Vector2() }, // Mouse uniform
			uColor1Base: { value: new THREE.Vector3(0.1, 0.2, 0.3) },
			uColor1Frequency: { value: 2.0 },
			uColor1Amplitude: { value: 0.2 },
			uColor2Base: { value: new THREE.Vector3(0.2, 0.25, 0.15) },
			uColor2Frequency: { value: 1.5 },
			uColor2Amplitude: { value: 0.05 },
			uNoiseFactor: { value: 0.1 },
			uDistanceFactor: { value: 2.0 },
		},
	})
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	scene.add(plane)

	function updateUniforms() {
		const color1 = document.getElementById("color1Base").value
		const color2 = document.getElementById("color2Base").value

		planeMaterial.uniforms.uColor1Base.value = new THREE.Vector3(
			parseInt(color1.substring(1, 3), 16) / 255,
			parseInt(color1.substring(3, 5), 16) / 255,
			parseInt(color1.substring(5, 7), 16) / 255
		)
		planeMaterial.uniforms.uColor1Frequency.value = parseFloat(
			document.getElementById("color1Frequency").value
		)
		planeMaterial.uniforms.uColor1Amplitude.value = parseFloat(
			document.getElementById("color1Amplitude").value
		)
		planeMaterial.uniforms.uColor2Base.value = new THREE.Vector3(
			parseInt(color2.substring(1, 3), 16) / 255,
			parseInt(color2.substring(3, 5), 16) / 255,
			parseInt(color2.substring(5, 7), 16) / 255
		)
		planeMaterial.uniforms.uColor2Frequency.value = parseFloat(
			document.getElementById("color2Frequency").value
		)
		planeMaterial.uniforms.uColor2Amplitude.value = parseFloat(
			document.getElementById("color2Amplitude").value
		)
		planeMaterial.uniforms.uNoiseFactor.value = parseFloat(
			document.getElementById("noiseFactor").value
		)
		planeMaterial.uniforms.uDistanceFactor.value = parseFloat(
			document.getElementById("distanceFactor").value
		)
	}

	document
		.getElementById("color1Base")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("color1Frequency")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("color1Amplitude")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("color2Base")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("color2Frequency")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("color2Amplitude")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("noiseFactor")
		.addEventListener("input", updateUniforms)
	document
		.getElementById("distanceFactor")
		.addEventListener("input", updateUniforms)

	canvas.addEventListener("mousemove", (event) => {
		// Get mouse position relative to the canvas
		const rect = canvas.getBoundingClientRect()
		const mouseX = event.clientX - rect.left
		const mouseY = event.clientY - rect.top

		// Normalize mouse coordinates to range 0 to 1
		const normalizedMouseX = mouseX / canvas.width
		const normalizedMouseY = 1 - mouseY / canvas.height // Invert Y axis

		// Set the uMouse uniform
		planeMaterial.uniforms.uMouse.value.set(normalizedMouseX, normalizedMouseY)
	})

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement
		const width = window.innerWidth
		const height = window.innerHeight
		const needResize = canvas.width !== width || canvas.height !== height
		if (needResize) {
			renderer.setSize(width, height, false)
			camera.aspect = width / height
			camera.updateProjectionMatrix()
		}
		return needResize
	}

	function animate() {
		requestAnimationFrame(animate)

		resizeRendererToDisplaySize(renderer)

		// Update the time uniform in the shader material.
		planeMaterial.uniforms.uTime.value = performance.now() / 1000.0

		controls.update()
		renderer.render(scene, camera)
	}

	resizeRendererToDisplaySize(renderer)
	animate()
})
