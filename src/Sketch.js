/* globals Hammer, THREE */
/* eslint jsx-a11y/img-redundant-alt: off */
import React, { Component } from 'react';

import degToRad from './utils/degToRad';
import initializeRenderer from './utils/initializeRenderer';
import { initializeArToolkit, getMarker } from './utils/arToolkit';
import './Sketch.css';
import hiro from './assets/hiro.png';
import pan from './assets/pan.png';
import pinch from './assets/pinch.png';
import rotate from './assets/rotate.png';
import Settings from './Settings';
import detectEdge from './utils/detectEdge';

const { Camera, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, Texture } = THREE;

class Sketch extends Component {
    state = {
        showTips: true,
        markerFound: false,
        opacity: 1,
        isDetectingEdge: false,
        blur: 2,
        highTreshold: 20,
        lowTreshold: 50,
    };


    renderer = null;

    componentDidMount() {
        const { opacity } = this.state;
        const renderer = this.renderer = initializeRenderer(this.canvas);

        const scene = new Scene();
        const camera = new Camera();
        scene.add(camera);

        const markerRoot = new Group();
        scene.add(markerRoot);
        const onRenderFcts = [];
        const arToolkitContext = initializeArToolkit(renderer, camera, onRenderFcts);
        const marker = getMarker(arToolkitContext, markerRoot);

        marker.addEventListener('markerFound', () => {
            this.setState({ markerFound: true });
        });

        const geometry = new PlaneGeometry(1, 1, 1);
        const texture = new Texture(this.props.image);
        texture.needsUpdate = true;

        this.material = new MeshBasicMaterial({
            map: texture,
            opacity,
            side: DoubleSide,
            transparent: true,
        });

        var mesh = new Mesh(geometry, this.material);
        mesh.position.x = geometry.parameters.width * 2;
        mesh.position.z = geometry.parameters.height;
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

        const hammer = new Hammer(this.canvas);

        hammer.get('pinch').set({ enable: true });
        hammer.get('rotate').set({ enable: true });
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        let panStartX, panStartY;

        hammer.on('panstart', function(ev) {
            panStartX = mesh.position.x;
            panStartY = mesh.position.z;

            mesh.position.x += ev.deltaX / 200;
            mesh.position.z += ev.deltaY / 200;
        });

        hammer.on('panmove', function(ev) {
            mesh.position.x = panStartX + ev.deltaX / 200;
            mesh.position.z = panStartY + ev.deltaY / 200;
        });

        let pinchStartX, pinchStartY;

        hammer.on('pinchstart', function(ev) {
            pinchStartX = mesh.scale.x;
            pinchStartY = mesh.scale.y;
            mesh.scale.x = ev.scale;
            mesh.scale.y = ev.scale;
        });

        hammer.on('pinch', function(ev) {
            mesh.scale.x = pinchStartX * ev.scale;
            mesh.scale.y = pinchStartY * ev.scale;
        });

        let rotateStart;

        hammer.on('rotatestart', function(ev) {
            rotateStart = mesh.rotation.z + degToRad(ev.rotation); // the first rotation is the angle between the two finger ignoring it.
        });

        hammer.on('rotatemove', function(ev) {
            mesh.rotation.z = rotateStart - degToRad(ev.rotation);
        });
    }

    componentWillUnmount() {
        this.renderer.dispose();
    }

    shouldComponentUpdate(nextProps, { markerFound, opacity, isDetectingEdge, blur, lowTreshold, highTreshold, showTips }) {
        if (
            markerFound !== this.state.markerFound ||
            opacity !== this.state.opacity ||
            isDetectingEdge !== this.state.isDetectingEdge ||
            blur !== this.state.blur ||
            lowTreshold !== this.state.lowTreshold ||
            highTreshold !== this.state.highTreshold ||
            showTips !== this.state.showTips
        ) {
            return true;
        }

        return false;
    }

    storeRef = node => {
        this.canvas = node;
    }

    handleOpacityChange = event =>
        this.setState({
            ...this.state,
            opacity: event.target.value,
        });

    handleBack = () => {
        // We can't reset the AR.js created elements (no dispose, reset or destroy methods available)
        window.location.reload();
    }

    handleDetectEdgeChange = () =>
        this.setState({
            ...this.state,
            isDetectingEdge: !this.state.isDetectingEdge,
        });

    handleBlurChange = (event) =>
        this.setState({
            ...this.state,
            blur: event.target.value,
        });

    handleLowTresholdChange = (event) =>
        this.setState({
            ...this.state,
            lowTreshold: event.target.value,
        });

    handleHighTresholdChange = (event) =>
        this.setState({
            ...this.state,
            highTreshold: event.target.value,
        });

    handleHideTips = () => console.log('hideTips') ||
        this.setState({
            ...this.state,
            showTips: false,
        });

    render() {
        const { blackImage, image } = this.props;
        const { markerFound, showTips, opacity, isDetectingEdge, blur, lowTreshold, highTreshold } = this.state;
        if (this.material) {
            if (isDetectingEdge) {
                    this.material.opacity = 1;
                    const alphaImage = detectEdge(image, { blur, lowTreshold, highTreshold });
                    const alphaTexture = new Texture(alphaImage);
                    alphaTexture.needsUpdate = true;
                    this.material.alphaMap = alphaTexture;
                    this.material.map.image = blackImage;
                    this.material.map.image.needsUpdate = true;
                    this.material.map.needsUpdate = true;
                    this.material.needsUpdate = true;
            } else {
                this.material.opacity = opacity;
                this.material.alphaMap = null;
                const texture = new Texture(image);
                texture.needsUpdate = true;
                this.material.map = texture;
                this.material.needsUpdate = true;
            }
        }

        return (
            <div>
                <canvas id="root" ref={this.storeRef} />
                {!markerFound &&
                    <div className="MarkerSearchContainer">
                        <div className="MarkerSearch">
                            Looking for Hiro Marker
                            <img alt="Hiro marker example" src={hiro} />
                        </div>
                    </div>
                }
                {markerFound && showTips &&
                    <div className="tips" onClick={this.handleHideTips}>
                        <div className="item">
                            <img alt="How to move the image" src={pan} />
                            <div className="text">Pan with your finger to drag the picture on the paper</div>
                        </div>
                        <div className="item">
                            <img alt="How to zoom the image" src={pinch} />
                            <div className="text">Pinch to zoom the picture in or out and fit the sheet</div>
                        </div>
                        <div className="item">
                            <img alt="How to rotate the image" src={rotate} />
                            <div className="text">Rotate your fingers to rotate the picture and orient it on the sheet</div>
                        </div>
                    </div>
                }
                <button className="backButton btn" onClick={this.handleBack}>Back</button>
                <Settings
                    opacity={opacity}
                    blur={blur}
                    lowTreshold={lowTreshold}
                    highTreshold={highTreshold}
                    isDetectingEdge={isDetectingEdge}
                    onOpacityChange={this.handleOpacityChange}
                    onDetectEdgeChange={this.handleDetectEdgeChange}
                    onBlurChange={this.handleBlurChange}
                    onLowTresholdChange={this.handleLowTresholdChange}
                    onHighTresholdChange={this.handleHighTresholdChange}
                />
            </div>
        );
    }
}

export default Sketch;
