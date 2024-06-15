// Scene Declartion
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// This defines the initial distance of the camera, you may ignore this as the camera is expected to be dynamic
camera.applyMatrix4(new THREE.Matrix4().makeTranslation(-5, 3, 110))
camera.lookAt(0, -4, 1)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// helper function for later on
function degrees_to_radians(degrees) {
  var pi = Math.PI
  return degrees * (pi / 180)
}

// Rotation matrices
const translateAndRotate = (object, tx, ty, tz, rx, ry, rz) => {
  const translationMatrix = new THREE.Matrix4().makeTranslation(tx, ty, tz)
  const rotationXMatrix = new THREE.Matrix4().makeRotationX(rx)
  const rotationYMatrix = new THREE.Matrix4().makeRotationY(ry)
  const rotationZMatrix = new THREE.Matrix4().makeRotationZ(rz)

  object.matrix.multiplyMatrices(translationMatrix, rotationXMatrix)
  object.matrix.multiply(rotationYMatrix)
  object.matrix.multiply(rotationZMatrix)
  object.matrixAutoUpdate = false
}

// Dimentions
const postRadius = 0.5
const crossbarWidth = 50
const postHeight = crossbarWidth / 3
const ballDiameter = postHeight / 8
const ballRadius = ballDiameter / 4

// Here we load the cubemap and pitch images, you may change it

const loader = new THREE.CubeTextureLoader()
const texture = loader.load([
  'src/pitch/right.jpg',
  'src/pitch/left.jpg',
  'src/pitch/top.jpg',
  'src/pitch/bottom.jpg',
  'src/pitch/front.jpg',
  'src/pitch/back.jpg',
])
scene.background = texture

// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time
// Load the texture
const textureLoader = new THREE.TextureLoader()
const ballTexture = textureLoader.load('src/textures/soccer_ball.jpg')

// TODO: Add Lighting
// Light sources
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Directional Light at the start of the routes
const directionalLightStart = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLightStart.applyMatrix4(
  new THREE.Matrix4().makeTranslation(0, 10, 100)
)
scene.add(directionalLightStart)

// Directional Light at the end of the routes
const directionalLightEnd = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLightEnd.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0))
scene.add(directionalLightEnd)

// TODO: Goal
// You should copy-paste the goal from the previous exercise here
// Goal
const postMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })

const frontLeftPost = new THREE.Mesh(
  new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 32),
  postMaterial
)
translateAndRotate(
  frontLeftPost,
  -crossbarWidth / 2,
  postHeight / 2,
  0,
  0,
  0,
  0
)

scene.add(frontLeftPost)

const frontRightPost = new THREE.Mesh(
  new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 32),
  postMaterial
)
translateAndRotate(
  frontRightPost,
  crossbarWidth / 2,
  postHeight / 2,
  0,
  0,
  0,
  0
)

scene.add(frontRightPost)

const crossbar = new THREE.Mesh(
  new THREE.CylinderGeometry(postRadius, postRadius, crossbarWidth, 32),
  postMaterial
)
translateAndRotate(crossbar, 0, postHeight, 0, 0, 0, Math.PI / 2)

scene.add(crossbar)

const backSupportLength = postHeight / Math.cos(Math.PI / 4)
const backSupportMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
const xOffset = postHeight / Math.tan(Math.PI / 4) / 2

const leftBackSupport = new THREE.Mesh(
  new THREE.CylinderGeometry(postRadius, postRadius, backSupportLength, 32),
  backSupportMaterial
)
translateAndRotate(
  leftBackSupport,
  -crossbarWidth / 2,
  postHeight / 2,
  -xOffset,
  Math.PI / 4,
  Math.PI / 2,
  0
)

scene.add(leftBackSupport)

const rightBackSupport = new THREE.Mesh(
  new THREE.CylinderGeometry(postRadius, postRadius, backSupportLength, 32),
  backSupportMaterial
)
translateAndRotate(
  rightBackSupport,
  crossbarWidth / 2,
  postHeight / 2,
  -xOffset,
  Math.PI / 4,
  Math.PI / 2,
  0
)

scene.add(rightBackSupport)

const torusMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
const torusRadius = 0.1
const tubeRadius = 0.05
const radialSegments = 16
const tubularSegments = 100

const torusGeometry = new THREE.TorusGeometry(
  torusRadius,
  tubeRadius,
  radialSegments,
  tubularSegments
)
const frontLeftTorus = new THREE.Mesh(torusGeometry, torusMaterial)
translateAndRotate(frontLeftTorus, -crossbarWidth / 2, 0, 0, Math.PI / 2, 0, 0)

scene.add(frontLeftTorus)

const frontRightTorus = new THREE.Mesh(torusGeometry, torusMaterial)
translateAndRotate(frontRightTorus, crossbarWidth / 2, 0, 0, Math.PI / 2, 0, 0)

scene.add(frontRightTorus)

const backSupportTorusGeometry = new THREE.TorusGeometry(
  torusRadius,
  tubeRadius,
  radialSegments,
  tubularSegments
)
const leftBackSupportTopTorus = new THREE.Mesh(
  backSupportTorusGeometry,
  torusMaterial
)
translateAndRotate(
  leftBackSupportTopTorus,
  -crossbarWidth / 2,
  0,
  -backSupportLength * Math.sin(Math.PI / 4),
  Math.PI / 2,
  0,
  0
)

scene.add(leftBackSupportTopTorus)

const rightBackSupportTopTorus = new THREE.Mesh(
  backSupportTorusGeometry,
  torusMaterial
)

translateAndRotate(
  rightBackSupportTopTorus,
  crossbarWidth / 2,
  0,
  -backSupportLength * Math.sin(Math.PI / 4),
  Math.PI / 2,
  0,
  0
)

scene.add(rightBackSupportTopTorus)

const netMaterial = new THREE.MeshPhongMaterial({
  color: '#e9e9e9',
  side: THREE.DoubleSide,
})

const backNetGeometry = new THREE.PlaneGeometry(
  crossbarWidth,
  postHeight + xOffset * 0.9
)
const backNet = new THREE.Mesh(backNetGeometry, netMaterial)
translateAndRotate(backNet, 0, postHeight / 2, -xOffset, Math.PI / 4, 0, 0)

scene.add(backNet)

function createTriangleGeometry(width, height) {
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array([0, 0, 0, width, 0, 0, 0, height, 0])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  return geometry
}

const leftSideNetGeometry = createTriangleGeometry(postHeight, postHeight)
const leftSideNet = new THREE.Mesh(leftSideNetGeometry, netMaterial)
translateAndRotate(leftSideNet, -crossbarWidth / 2, 0, 0, 0, Math.PI / 2, 0)
scene.add(leftSideNet)

const rightSideNetGeometry = createTriangleGeometry(postHeight, postHeight)
const rightSideNet = new THREE.Mesh(rightSideNetGeometry, netMaterial)
translateAndRotate(rightSideNet, crossbarWidth / 2, 0, 0, 0, Math.PI / 2, 0)
rightSideNet.scale.x = -1
scene.add(rightSideNet)

// TODO: Ball
// You should add the ball with the soccer.jpg texture here
// Ball
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32)
const ballMaterial = new THREE.MeshPhongMaterial({ map: ballTexture })
const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.applyMatrix4(new THREE.Matrix4().makeTranslation(0, ballRadius, 100))
ball.matrixAutoUpdate = false

scene.add(ball)

// TODO: Bezier Curves
const rightWingerCurve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, 100), // Start point
  new THREE.Vector3(50, 0, 50), // Control point
  new THREE.Vector3(0, 0, 0) // End point
)
const centerForwardCurve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, 100), // Start
  new THREE.Vector3(0, 50, 50), // Control point
  new THREE.Vector3(0, 0, 0) // End
)

const leftWingerCurve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, 100), // Start
  new THREE.Vector3(-50, 0, 50), // Control point
  new THREE.Vector3(0, 0, 0) // End
)

// Center Forward Curve
const cfPoints = centerForwardCurve.getPoints(50)
const cfGeometry = new THREE.BufferGeometry().setFromPoints(cfPoints)
const cfMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }) // Green for visibility
const cfCurveObject = new THREE.Line(cfGeometry, cfMaterial)
scene.add(cfCurveObject)

// Left Winger Curve
const lwPoints = leftWingerCurve.getPoints(50)
const lwGeometry = new THREE.BufferGeometry().setFromPoints(lwPoints)
const lwMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }) // Blue for visibility
const lwCurveObject = new THREE.Line(lwGeometry, lwMaterial)
scene.add(lwCurveObject)

// Right Winger Curve
const rwPoints = rightWingerCurve.getPoints(50) // Generate 50 points along the curve
const rwGeometry = new THREE.BufferGeometry().setFromPoints(rwPoints)
const rwMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })
const rwCurveObject = new THREE.Line(rwGeometry, rwMaterial)
scene.add(rwCurveObject)

// TODO: Camera Settings
// Set the camera following the ball here

// TODO: Add collectible cards with textures

// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
  if (e.code == 'ArrowLeft') {
    // TODO
  } else if (e.code == 'ArrowRight') {
    // TODO
  }
}
document.addEventListener('keydown', handle_keydown)

let t = 0; // Parameter that goes from 0 to 1
const ballSpeed = 0.002; // Speed of the animation, adjust as necessary
const spinSpeed = 0.07; // Speed of the spin, adjust as necessary
let totalRotationX = 0 // Total rotation around the x-axis

function animate() {
	requestAnimationFrame(animate)

	// TODO: Animation for the ball's position
	// Update the ball position using a matrix transformation
	if (t <= 1) {
		const point = centerForwardCurve.getPoint(t);
		const translationMatrix = new THREE.Matrix4().makeTranslation(point.x, point.y, point.z);
		const rotationMatrix = new THREE.Matrix4().makeRotationX(-totalRotationX) // Incremental rotation

		// Combine translation and rotation
		ball.matrix.multiplyMatrices(translationMatrix, rotationMatrix)

		// ball.matrix.copy(translationMatrix); // Apply the new translation matrix to the ball
		t += ballSpeed;
		totalRotationX += spinSpeed // Incremental rotation around the z-axis
	} else {
		t = 0; // Reset t to loop the animation or handle as needed
	}

	// TODO: Test for card-ball collision

	renderer.render(scene, camera)
}
animate()
