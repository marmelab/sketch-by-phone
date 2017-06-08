/* globals THREE */
/* eslint jsx-a11y/img-redundant-alt: off */
import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import RaisedButton from 'material-ui/RaisedButton';

import './Sketch.css';
import hiro from './assets/hiro.png';
import pan from './assets/pan.png';
import pinch from './assets/pinch.png';
import rotate from './assets/rotate.png';
import Settings from './Settings';
import SketchRenderer from './SketchRenderer';
import MoveControl from './MoveControl';

class Sketch extends Component {
    state = {
        showTips: true,
        markerFound: false,
        opacity: 1,
        isDetectingEdge: false,
        blur: 2,
        highTreshold: 20,
        lowTreshold: 50,
        coord: {
            x: 2,
            z: 1,
        },
        rotation: 0,
        scale: {
            x: 2,
            y: 2,
        }
    };

    renderer = null;

    shouldComponentUpdate(nextProps, state) {
        return !isEqual(state, this.state);
    }

    storeRef = node => {
        this.canvas = node;
    }

    handleTranslateChange = ({ x, z }) => {
        this.setState({
            ...this.state,
            coord: { x, z },
        });
    }

    handleZoomChange = ({ x, y }) => {
        this.setState({
            ...this.state,
            scale: { x, y },
        });
    }

    handleRotationChange = (rotation) => {
        this.setState({
            ...this.state,
            rotation,
        });
    }

    handleOpacityChange = (event, opacity) =>
        this.setState({
            ...this.state,
            opacity,
        });

    handleBack = () => {
        setTimeout(() => {
            // We can't reset the AR.js created elements (no dispose, reset or destroy methods available)
            window.location.reload();
        }, 500);
    }

    handleDetectEdgeChange = () =>
        this.setState({
            ...this.state,
            isDetectingEdge: !this.state.isDetectingEdge,
        });

    handleBlurChange = (event, blur) =>
        this.setState({
            ...this.state,
            blur,
        });

    handleLowTresholdChange = (event, lowTreshold) =>
        this.setState({
            ...this.state,
            lowTreshold,
        });

    handleHighTresholdChange = (event, highTreshold) =>
        this.setState({
            ...this.state,
            highTreshold,
        });

    handleHideTips = () =>
        this.setState({
            ...this.state,
            showTips: false,
        });

    handleMarkerFound = () =>
        this.setState({
            ...this.state,
            markerFound: true,
        });

    render() {
        const {
            markerFound,
            showTips,
            opacity,
            isDetectingEdge,
            blur,
            lowTreshold,
            highTreshold,
            coord: {
                x: coordX,
                z: coordZ,
            },
            scale: {
                x: scaleX,
                y: scaleY,
            },
            rotation,
        } = this.state;

        const { image, blackImage } = this.props;

        return (
            <div>
                <SketchRenderer
                    coordX={coordX}
                    coordZ={coordZ}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    rotation={rotation}
                    opacity={opacity}
                    isDetectingEdge={isDetectingEdge}
                    blur={blur}
                    lowTreshold={lowTreshold}
                    highTreshold={highTreshold}
                    image={image}
                    blackImage={blackImage}
                    onMarkerFound={this.handleMarkerFound}
                />
                {!markerFound &&
                    <div className="MarkerSearchContainer">
                        <div className="MarkerSearch">
                            Looking for Hiro Marker
                            <img alt="Hiro marker example" src={hiro} />
                        </div>
                    </div>
                }
                {markerFound && <MoveControl
                    canvas={this.canvas}
                    coordX={coordX}
                    coordZ={coordZ}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    rotation={rotation}
                    onTranslateChange={this.handleTranslateChange}
                    onZoomChange={this.handleZoomChange}
                    onRotationChange={this.handleRotationChange}
                /> }
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
                <RaisedButton className="backButton" onClick={this.handleBack} label="Back" />
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
