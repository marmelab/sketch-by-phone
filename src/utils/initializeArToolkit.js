/* globals THREEx */
import cameraData from '../assets/camera_para.dat';
import hiro from '../assets/patt.hiro';

const { ArMarkerControls, ArToolkitContext, ArToolkitSource } = THREEx;

export default (renderer, markerRoot, camera) => {
    ArToolkitContext.baseURL = '../';
    
    const arToolkitSource = new ArToolkitSource({ sourceType : 'webcam' });

    arToolkitSource.init(() => {
        arToolkitSource.onResize(renderer.domElement);
    });

    window.addEventListener('resize', () => {
        arToolkitSource.onResize(renderer.domElement);
    });

    // create atToolkitContext
    const arToolkitContext = new ArToolkitContext({
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
        if(arToolkitSource.ready === false) return;

        arToolkitContext.update(arToolkitSource.domElement);
    }];

    new ArMarkerControls(arToolkitContext, markerRoot, {
        type : 'pattern',
        patternUrl : hiro,
    });

    return onRenderFcts;
}
