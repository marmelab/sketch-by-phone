/* globals THREEx */
import cameraData from '../assets/camera_para.dat';
import hiro from '../assets/patt.hiro';

const { ArMarkerControls, ArToolkitContext, ArToolkitSource } = THREEx;

/**
 * Initialize AR Toolkit from our three.js objects so that it can detect the Hiro marker
 * 
 * @param {Object} renderer: the WebGL renderer from three.js
 * @param {Object} camera the camera object from three.js
 * @param {Array} onRenderFcts an array of functions which will be executed every frames
 * @returns {Object} An ArToolkitContext instance
 */
export function initializeArToolkit(renderer, camera, onRenderFcts) {
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
        canvasWidth: 800,
        canvasHeight: 600,
    });

    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // update artoolkit on every frame
    onRenderFcts.push(() => {
        if(arToolkitSource.ready === false) return;

        arToolkitContext.update(arToolkitSource.domElement);
    });

    return arToolkitContext;
}

/**
 * Initialize AR Toolkit Hiro marker
 * 
 * @param {Object} arToolkitContext: the ArToolkitContext instance
 * @param {Object} markerRoot a DOM element where to put the marker
 * @returns {Object} An ArMarkerControls instance
 */

export function getMarker(arToolkitContext, markerRoot) {
    return new ArMarkerControls(arToolkitContext, markerRoot, {
        type : 'pattern',
        patternUrl : hiro,
    });
}
