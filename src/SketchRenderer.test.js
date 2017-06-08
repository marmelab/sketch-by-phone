import React from 'react';
import ReactDOM from 'react-dom';
import expect, { createSpy } from 'expect';

import { sketchRendererFactory } from './SketchRenderer';

describe('SketchRenderer', () => {
    const mesh = {
        position: {},
        scale: {},
        rotation: {},
    };
    const material = {};
    const SketchRenderer = sketchRendererFactory({
        THREE: {
            Camera: createSpy(),
            Group: createSpy().andReturn({ add: createSpy() }),
            Mesh: createSpy().andReturn(mesh),
            MeshBasicMaterial: createSpy().andReturn(material),
            PlaneGeometry: createSpy(),
            Scene: createSpy().andReturn({ add: createSpy() }),
            Texture: createSpy().andCall(image => ({ image })),
        },
        getMarker: createSpy().andReturn({
            addEventListener: createSpy(),
        }),
        initializeArToolkit: createSpy(),
        initializeRenderer: createSpy().andReturn({ render: createSpy() }),
        requestAnimationFrame: createSpy(),
        detectEdge: createSpy().andReturn({ image: 'edge' }),
    });

    it('should update mesh based on props', () => {
        const div = document.createElement('div');
        const props = {
            coordX: 'coordX',
            coordZ: 'coordZ',
            scaleX: 'scaleX',
            scaleY: 'scaleY',
            rotation: 'rotation',
        };
        const sketchRenderer = ReactDOM.render(<SketchRenderer {...props} />, div);
        expect(sketchRenderer.mesh).toEqual({
            position: {
                x: 'coordX',
                z: 'coordZ',
            },
            scale: {
                x: 'scaleX',
                y: 'scaleY',
            },
            rotation: {
                x: - Math.PI / 2,
                z: 'rotation'
            },
        });
    });

    it('should update materials opacity based on props when not detecting edge', () => {
        const div = document.createElement('div');
        const props = {
            opacity: 'opacity',
            image: 'image',
            blackImage: 'blackImage',
        };
        const sketchRenderer = ReactDOM.render(<SketchRenderer {...props} />, div);
        sketchRenderer.componentDidUpdate();
        expect(sketchRenderer.material).toEqual({
            alphaMap: null,
            map: {
                image: 'image',
                needsUpdate: true,
            },
            needsUpdate: true,
            opacity: 'opacity',
        });
    });

    it('should update materials texture based on props when detecting edge', () => {
        const div = document.createElement('div');
        const props = {
            isDetectingEdge: true,
            opacity: 'opacity',
            image: 'image',
            blackImage: 'blackImage',
        };
        const sketchRenderer = ReactDOM.render(<SketchRenderer {...props} />, div);
        sketchRenderer.componentDidUpdate();
        expect(sketchRenderer.material).toEqual({
            alphaMap: {
                image: {
                    image: 'edge',
                },
                needsUpdate: true,
            },
            map: {
                image: 'blackImage',
                needsUpdate: true,
            },
            needsUpdate: true,
            opacity: 1,
        });
    });
});

