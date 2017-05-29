import './vendors/ar.min';
import image from './assets/image.png';
import cameraData from './assets/camera_para.dat';
import hiro from './assets/patt.hiro';

const { Camera, Color, DoubleSide, Group, Mesh, MeshPhongMaterial, PlaneGeometry, Scene, TextureLoader, WebGLRenderer } = THREE;
function initializeRenderer() {
    const renderer = new WebGLRenderer({ alpha: true });

    renderer.setClearColor(new Color('lightgrey'), 0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'

    return renderer;
}

function initializeArToolkit(renderer, markerRoot, camera) {
    THREEx.ArToolkitContext.baseURL = '../'
    
    const arToolkitSource = new THREEx.ArToolkitSource({ sourceType : 'webcam' });

    arToolkitSource.init(() => {
        arToolkitSource.onResize(renderer.domElement);
    });

    window.addEventListener('resize', () => {
        arToolkitSource.onResize(renderer.domElement);
    });

    // create atToolkitContext
    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: cameraData,
        detectionMode: 'mono',
        maxDetectionRate: 30,
        canvasWidth: 80 * 3,
        canvasHeight: 60 * 3,
    });

    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // update artoolkit on every frame
    const onRenderFcts = [() => {
        if(arToolkitSource.ready === false)	return;

        arToolkitContext.update(arToolkitSource.domElement);
    }];

    const artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type : 'pattern',
        patternUrl : hiro,
    });

    return onRenderFcts;
}

function startApp() {
    const renderer = initializeRenderer();
    document.body.appendChild(renderer.domElement);

    const scene	= new Scene();
    const camera = new Camera();
    scene.add(camera);

    const markerRoot = new Group();
    scene.add(markerRoot);
    const onRenderFcts = initializeArToolkit(renderer, markerRoot, camera);

    const geometry = new PlaneGeometry(1, 1, 1);
    const loader = new TextureLoader();
    loader.crossOrigin = "";

    var img = loader.load(image);
    var material = new MeshPhongMaterial({
        color: 0xffffff,
        map: img,
        side: DoubleSide,
    });

    var mesh = new Mesh(geometry, material);
    mesh.position.x	= geometry.parameters.width * 2;
    mesh.position.z	= geometry.parameters.height;
    mesh.rotation.x = - Math.PI / 2; // -90°
    mesh.scale.x = 2;
    mesh.scale.y = 2;

    markerRoot.add(mesh);

    // render the scene
    onRenderFcts.push(function(){
        renderer.render(scene, camera);
    });

    // run the rendering loop
    var lastTimeMsec = null;

    function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        onRenderFcts.forEach(onRenderFct => {
            onRenderFct(deltaMsec / 1000, nowMsec / 1000);
        });
    }
    requestAnimationFrame(animate);
}

startApp();
