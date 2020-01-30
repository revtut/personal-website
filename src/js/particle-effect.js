let PointMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: .5 });
let camera, container, renderer, scene, plane, cube, imgOne, imgTwo, texts, geometry, geometryCopy;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(1, 1);
let cont = 0;

function initParticleEffect(typeface, input) {
    container = document.querySelector(input);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff0000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    geometryCopy = new THREE.BufferGeometry();

    geometry = new THREE.PlaneGeometry(300, 500);
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });

    plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.z = -.7;
    scene.add(plane);

    renderer = createRenderer(container);

    renderer.setAnimationLoop(() => {
        update();
        render();
    });

    document.addEventListener('mousemove', onDocumentMouseMove);

    window.addEventListener('resize', onWindowResize);
    document.getElementById("magic").addEventListener("click", createNewText, true);
    window.addEventListener('touchstart', onDocumentTouchStart);
    window.addEventListener('touchmove', onDocumentTouchMove);
    onWindowResize()
    createNewText();
}

function update() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
        const mx = intersects[0].point.x;
        const my = intersects[0].point.y;
        const mz = intersects[0].point.z;
        const pos = texts.geometry.attributes.position;
        const copy = geometryCopy.attributes.position;
        for (var i = 0, l = pos.count; i < l; i++) {
            const initX = copy.getX(i);
            const initY = copy.getY(i);
            const initZ = copy.getZ(i);
            let px = pos.getX(i);
            let py = pos.getY(i);
            let pz = pos.getZ(i);
            const dx = mx - px;
            const dy = my - py;
            const dz = mz - pz;
            const mouseDistance = distance(mx, my, px, py)
            if (mouseDistance < 25) {
                const ax = dx;
                const ay = dy;
                const az = dz;
                px -= ax / 20;
                py -= ay / 20;
                //pz -= az / 20;
                pz -= Math.sin(i);
                pos.setXYZ(i, px, py, pz);
                pos.needsUpdate = true;
            }
            const dxo = px - initX;
            const dyo = py - initY;
            const dzo = pz - initZ;
            px -= dxo / 25;
            py -= dyo / 25;
            pz -= dzo / 25;
            pos.setXYZ(i, px, py, pz);
            pos.needsUpdate = true;
        }
    }
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

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        //event.preventDefault();
        mouseX = +(event.targetTouches[0].pageX / window.innerWidth) * 2 + -1;
        mouseY = -(event.targetTouches[0].pageY / window.innerHeight) * 2 + 1;
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        //event.preventDefault();
        mouseX = +(event.targetTouches[0].pageX / window.innerWidth) * 2 + -1;
        mouseY = -(event.targetTouches[0].pageY / window.innerHeight) * 2 + 1;
    }
    let vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    let dir = vector.sub(camera.position).normalize();
    let distance = - camera.position.z / dir.z;
    pos = camera.position.clone().add(dir.multiplyScalar(distance));
    particles[7].position.copy(pos);
}

function onWindowResize() {
    console.log(container);
    if (container.clientWidth < 600) {
        camera.position.z = 300;
    }

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

/**
 * Setup the javascript
 */
$(document).ready(() => {
    var loader = new THREE.FontLoader();
    loader.load('https://unpkg.com/three@0.112.1/examples/fonts/helvetiker_bold.typeface.json', function (response) {
        font = response;

        initParticleEffect(font, '#magic');
    });
});
