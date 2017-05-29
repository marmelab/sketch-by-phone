function initializeRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
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
        cameraParametersUrl: THREEx.ArToolkitContext.baseURL + './assets/camera_para.dat',
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
        patternUrl : THREEx.ArToolkitContext.baseURL + './assets/patt.hiro'
    });

    return onRenderFcts;
}

function startApp() {
    const renderer = initializeRenderer();
    document.body.appendChild(renderer.domElement);

    const scene	= new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const markerRoot = new THREE.Group();
    scene.add(markerRoot);
    const onRenderFcts = initializeArToolkit(renderer, markerRoot, camera);

    const geometry = new THREE.PlaneGeometry(1, 1, 1);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "";

    var img = loader.load('./assets/image.png');
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: img,
        side: THREE.DoubleSide,
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x	= geometry.parameters.width * 5;
    mesh.position.y	= -(geometry.parameters.height * 5);
    mesh.rotation.x = -2; // This is most probably wrong, I arbitrarily set it to 2 after many tries
    mesh.scale.x = 5;
    mesh.scale.y = 5;

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
