let material;
let camera, container, renderer, scene, plane, imgOne, imgTwo, texts, geometry, geometryCopy;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(1, 1);
let cont = 0;

let myParticles = [];

function initParticleEffect(input, texture) {
    container = document.querySelector(input);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff0000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    geometryCopy = new THREE.BufferGeometry();

    geometry = new THREE.PlaneGeometry(300, 500);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });

    plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.z = -.7;
    scene.add(plane);


    for (var j = 0; j < 3; j++) {
        const material = new THREE.PointsMaterial({ size: 0.3, color: 0xffffff, map: texture, sizeAttenuation: true });
        const geometry = new THREE.BufferGeometry();

        let positions = [];

        for (var i = 0; i < 700; i++) {
            positions.push((Math.random() * 200 - 100));
            positions.push((Math.random() * 200 - 100));
            positions.push((Math.random() * 200 - 100));
        }
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
        myParticles.push(particleSystem);
    }

    renderer = createRenderer(container);

    renderer.setAnimationLoop(() => {
        update();
        render();
    });

    window.addEventListener('resize', onWindowResize);
}

function explode() {
    const pos = myParticles[0].geometry.attributes.position;
    for (var i = 0, l = pos.count; i < l; i++) {
        pos.setXYZ(i, Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 90 - 45);
        pos.needsUpdate = true;
    }
}

var rotation1 = Math.random() * (0.002 - 0.0005) + 0.0005;
var rotation2 = Math.random() * (0.002 - 0.0005) + 0.0005;
var rotation3 = Math.random() * (0.002 - 0.0005) + 0.0005;
function update() {
    myParticles[0].rotation.y += rotation1;
    myParticles[1].rotation.y -= rotation2;
    myParticles[2].rotation.y += rotation3;
}

function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    renderer.autoClearColor = false;
    container.appendChild(renderer.domElement);
    return renderer;
}

function render() {
    renderer.render(scene, camera);
}

function createParticlesLineText(scene, contentText, font) {
    var xMid;
    let thePoints = [];
    let shapes = font.generateShapes(contentText, 14);
    let geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    geometry.center();
    let holeShapes = [];
    for (let q = 0; q < shapes.length; q++) {
        let shape = shapes[q];
        if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
                let hole = shape.holes[j];
                holeShapes.push(hole);
            }
        }
    }
    shapes.push.apply(shapes, holeShapes);
    for (let x = 0; x < shapes.length; x++) {
        let shape = shapes[x];
        let points = shape.getSpacedPoints(250);
        points.forEach((element) => {
            thePoints.push(element)
        });
    }
    let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
    geoParticles.translate(xMid, 0, 0);
    let particles = new THREE.Points(geoParticles, PointMaterial);
    scene.add(particles);

    return particles;
}

function createNewText() {
    if (texts) {
        scene.remove(texts);
        texts.geometry.dispose();
        texts.material.dispose();
        texts = undefined;
    }

    if (cont == 0) {
        texts = createParticlesLineText(scene, 'JOAO OLIVEIRA E SILVA', font);
        geometryCopy.copy(texts.geometry);
        const pos = texts.geometry.attributes.position;
        for (var i = 0, l = pos.count; i < l; i++) {
            pos.setXYZ(i, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
            pos.needsUpdate = true;
        }
        cont++;
    } else {
        texts = createParticlesLineText(scene, 'JOAO OLIVEIRA E SILVA', font);
        geometryCopy.copy(texts.geometry);
        const pos = texts.geometry.attributes.position;
        for (var i = 0, l = pos.count; i < l; i++) {
            pos.setXYZ(i, Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15);
            pos.needsUpdate = true;
        }
        cont = 0;
    }
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Setup the javascript
 */
$(document).ready(() => {
    new THREE.TextureLoader().load("vendor/disc.png", function (texture) {
        initParticleEffect('#header-background', texture);
    });
});
