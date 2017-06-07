import React from 'react';
import ReactDOM from 'react-dom';
import expect, { createSpy } from 'expect';

import { moveControlFactory } from './MoveControl';

describe('MoveControl', () => {
    const MoveControl = moveControlFactory(createSpy().andReturn({
        get: createSpy().andReturn({ set: createSpy() }),
        on: createSpy(),
    }));

    it('should initialize state', () => {
        const div = document.createElement('div');
        const moveControl = ReactDOM.render(<MoveControl />, div);
        expect(moveControl.state).toEqual({
            pan: {
                startX: 1,
                startZ: 2,
            },
            scale: {
                startX: 2,
                startY: 2,
            },
            rotation: {
                start: 0
            },
        });
    });

    it('handlePan should call onTranslateChange with new coord', () => {
        const div = document.createElement('div');
        const onTranslateChange = createSpy();
        const props = {
            onTranslateChange,
            coordX: 10,
            coordZ: 10,
        };
        const moveControl = ReactDOM.render(<MoveControl {...props} />, div);
        moveControl.handlePan({
            deltaX: 1000,
            deltaY: 2000,
        });

        expect(moveControl.state.pan).toEqual({
            startX: 1,
            startZ: 2,
        });

        expect(onTranslateChange).toHaveBeenCalledWith({ x: 6, z: 12 });
    });

    it('handlePan should update pan state if event type is panstart before calling onTranslateChange', () => {
        const div = document.createElement('div');
        const onTranslateChange = createSpy();
        const props = {
            onTranslateChange,
            coordX: 10,
            coordZ: 10,
        };
        const moveControl = ReactDOM.render(<MoveControl {...props} />, div);
        moveControl.handlePan({
            type: 'panstart',
            deltaX: 1000,
            deltaY: 2000,
        });

        expect(moveControl.state.pan).toEqual({
            startX: 10,
            startZ: 10,
        });

        expect(onTranslateChange).toHaveBeenCalledWith({ x: 15, z: 20 });
    });

    it('handlePinch should call onZoomChange with new scale', () => {
        const div = document.createElement('div');
        const onZoomChange = createSpy();
        const props = {
            onZoomChange,
            scaleX: 10,
            scaleY: 10,
        };
        const moveControl = ReactDOM.render(<MoveControl {...props} />, div);
        moveControl.handlePinch({
            scale: 4,
        });

        expect(moveControl.state.scale).toEqual({
            startX: 2,
            startY: 2,
        });

        expect(onZoomChange).toHaveBeenCalledWith({ x: 8, y: 8 });
    });

    it('handlePinch should update state before calling onZoomChange', () => {
        const div = document.createElement('div');
        const onZoomChange = createSpy();
        const props = {
            onZoomChange,
            scaleX: 10,
            scaleY: 10,
        };
        const moveControl = ReactDOM.render(<MoveControl {...props} />, div);
        moveControl.handlePinch({
            type: 'pinchstart',
            scale: 10,
        });

        expect(moveControl.state.scale).toEqual({
            startX: 10,
            startY: 10,
        });

        expect(onZoomChange).toHaveBeenCalledWith({ x: 100, y: 100 });
    });

    it('handleRotate should call onZoomChange with new rotation', () => {
        const div = document.createElement('div');
        const onRotationChange = createSpy();
        const props = {
            onRotationChange,
            rotation: 45,
        };
        const moveControl = ReactDOM.render(<MoveControl {...props} />, div);
        moveControl.handleRotate({
            rotation: 180,
        });

        expect(moveControl.state.rotation).toEqual({ start:  0 });
        expect(onRotationChange).toHaveBeenCalledWith(-Math.PI);
    });

    it('handleRotate should update state when event is rotatestart but not call onZoomChange', () => {
        const div = document.createElement('div');
        const onRotationChange = createSpy();
        const props = {
            onRotationChange,
            rotation: 0,
        };
        const moveControl = ReactDOM.render(<MoveControl {...props} />, div);
        moveControl.handleRotate({
            type: 'rotatestart',
            rotation: 180,
        });

        expect(moveControl.state.rotation).toEqual({ start:  Math.PI });
        expect(onRotationChange).toNotHaveBeenCalled();
    });
});

