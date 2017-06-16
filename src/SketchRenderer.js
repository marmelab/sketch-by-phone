/* globals THREE, requestAnimationFrame */
import React, { Component } from 'react';
import initializeRenderer from './utils/initializeRenderer';
import { initializeArToolkit, getMarker } from './utils/arToolkit';
import detectEdge from './utils/detectEdge';

export const sketchRendererFactory = ({ THREE, initializeArToolkit, initializeRenderer, getMarker, requestAnimationFrame, detectEdge }) => {
    const { Camera, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, Texture } = THREE;

    return class SketchRenderer extends Component {
        componentDidMount() {
            const {
                opacity,
                coordX,
                coordZ,
                scaleX,
                scaleY,
                rotation,
                onMarkerFound,
            } = this.props;

            const renderer = this.renderer = initializeRenderer(this.canvas);

            const scene = new Scene();
            const camera = new Camera();
            scene.add(camera);

            const markerRoot = new Group();
            scene.add(markerRoot);
            const onRenderFcts = [];
            const arToolkitContext = initializeArToolkit(renderer, camera, onRenderFcts);
            const marker = getMarker(arToolkitContext, markerRoot);

            marker.addEventListener('markerFound', onMarkerFound);

            const geometry = new PlaneGeometry(1, 1, 1);

            this.image = this.props.image;
            this.blackImage = this.props.blackImage;

            const texture = new Texture(this.image);
            texture.needsUpdate = true;

            this.material = new MeshBasicMaterial({
                map: texture,
                opacity,
                side: DoubleSide,
                transparent: true,
            });

            this.mesh = new Mesh(geometry, this.material);
            this.mesh.rotation.x = - Math.PI / 2; // -90°
            this.mesh.rotation.z = rotation;
            this.mesh.position.x = coordX;
            this.mesh.position.z = coordZ;
            this.mesh.scale.x = scaleX;
            this.mesh.scale.y = scaleY;

            markerRoot.add(this.mesh);

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

        componentWillUnmount() {
            this.renderer.dispose();
        }

        storeRef = node => {
            this.canvas = node;
        }

        componentDidUpdate() {
            const { coordX, coordZ, scaleX, scaleY, rotation } = this.props;
            this.mesh.position.x = coordX;
            this.mesh.position.z = coordZ;
            this.mesh.scale.x = scaleX;
            this.mesh.scale.y = scaleY;
            this.mesh.rotation.z = rotation;
            this.mesh.needsUpdate = true;

            const { blackImage, image } = this.props;
            const { opacity, isDetectingEdge, blur, lowTreshold, highTreshold } = this.props;
            if (isDetectingEdge) {
                this.material.opacity = 1;
                const alphaImage = detectEdge(image, { blur, lowTreshold, highTreshold });
                const alphaTexture = new Texture(alphaImage);
                alphaTexture.needsUpdate = true;
                this.material.alphaMap = alphaTexture;
                this.material.map.image = blackImage;
                this.material.map.needsUpdate = true;
            } else {
                this.material.opacity = opacity;
                this.material.alphaMap = null;
                const texture = new Texture(image);
                texture.needsUpdate = true;
                this.material.map = texture;
            }
            this.material.needsUpdate = true;
        }

        render() {
            return (
                <canvas id="root" ref={this.storeRef} />
            );
        }
    }
};

export default sketchRendererFactory({
    THREE,
    initializeArToolkit,
    getMarker,
    initializeRenderer,
    requestAnimationFrame: requestAnimationFrame,
    detectEdge,
});
