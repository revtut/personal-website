'use strict';

var scene, camera, renderer;
var container, aspectRatio,
    HEIGHT, WIDTH, fieldOfView,
    nearPlane, farPlane, stats, geometry,
    starStuff, starTexture, materialOptions, stars;
var mouseX, mouseY, windowHalfX, windowHalfY;

/**
 * Initialize the sky scene
 */
function initScene() {
    container = document.querySelector('#header-background');

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 75;
    nearPlane = 1;
    farPlane = 1000;

    mouseX = 0;
    mouseY = 0;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = farPlane / 2;

    scene = new THREE.Scene({ antialias: true });
    scene.fog = new THREE.FogExp2(0x000000, 0.0003);

    generateStars();

    if (webGLSupport()) {
        renderer = new THREE.WebGLRenderer({ alpha: true });
    } else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

/**
 * Invoked to render the scene
 */
function render() {
    camera.position.x += ((mouseX * 0.25) - camera.position.x) * 0.005;
    camera.position.y += (- (mouseY * 0.25) - camera.position.y) * 0.005;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

/**
 * Animate the scene
 */
function animateScene() {
    requestAnimationFrame(animateScene);
    render();
}

/**
 * Generate the stars of the scene
 */
function generateStars() {
    var starQty = 30000;
    geometry = new THREE.SphereGeometry(1000, 100, 50);

    materialOptions = {
        size: 1.0,
        transparency: true,
        opacity: 0.7,
        map: starTexture
    };

    starStuff = new THREE.PointCloudMaterial(materialOptions);

    for (var i = 0; i < starQty; i++) {
        var starVertex = new THREE.Vector3();
        starVertex.x = Math.random() * 2000 - 1000;
        starVertex.y = Math.random() * 2000 - 1000;
        starVertex.z = Math.random() * 2000 - 1000;
        geometry.vertices.push(starVertex);
    }

    stars = new THREE.PointCloud(geometry, starStuff);
    scene.add(stars);
}

/**
 * Check if WebGL is supported by the browser
 */
function webGLSupport() {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (
            canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

/**
 * Invoked when the window has been resized
 */
function onWindowResize() {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
}

/**
 * Invoked when the mouse moves
 * @param {MouseEvent} event mouse move event
 */
function onMouseMove(e) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

/**
 * Setup the javascript
 */
$(document).ready(() => {
    new THREE.TextureLoader().load("vendor/disc.png", function (texture) {
        starTexture = texture
        initScene();
        animateScene();
    });
});
