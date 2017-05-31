/* globals Hammer, THREE */
import React, { Component } from 'react';
import degToRad from './utils/degToRad';
import initializeRenderer from './utils/initializeRenderer';
import { initializeArToolkit, getMarker } from './utils/arToolkit';
import './Sketch.css';

const { Camera, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, Texture } = THREE;

class Sketch extends Component {
    state = { markerFound: false };

    componentDidMount() {
        const renderer = initializeRenderer(this.canvas);

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
        var texture = new Texture(this.props.image);
        texture.needsUpdate = true;
        var material = new MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            side: DoubleSide,
        });

        var mesh = new Mesh(geometry, material);
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

        const root = document.getElementById('root');
        const hammer = new Hammer(root);

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

    storeRef = node => {
        this.canvas = node;
    }

    render() {
        const { markerFound } = this.state;

        return (
            <div>
                <canvas ref={this.storeRef} />
                {!markerFound && <div className="MarkerSearch">Looking for marker</div>}
            </div>
        );
    }
}

export default Sketch;
