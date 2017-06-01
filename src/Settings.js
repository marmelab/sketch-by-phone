import React, { Component } from 'react';

const styles = {
    openButton: {
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
    },
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
    },
    modalItem: {
        padding: 10,
        width: '100%',
    },
};

class Settings extends Component {
    state = {
        open: false,
    };

    handleOpen = () =>
        this.setState({ isOpen: true });

    handleClose = () =>
        this.setState({ isOpen: false });

    render() {
        const { isOpen } = this.state;
        if (!isOpen) {
            return <button className="btn" style={styles.openButton} onClick={this.handleOpen}>settings</button>
        }

        const {
            blur,
            lowTreshold,
            highTreshold,
            opacity,
            isDetectingEdge,
            onBlurChange,
            onLowTresholdChange,
            onHighTresholdChange,
            onOpacityChange,
            onDetectEdgeChange
        } = this.props;

        return (
            <div style={styles.modal}>
                <div class="form-group" style={styles.modalItem} >
                    <label for="opacity" >
                        opacity
                    </label>
                    <input
                        className="form-control"
                        name="opacity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={opacity}
                        onChange={onOpacityChange}
                    />
                </div>
                <div class="form-check" style={styles.modalItem} >
                    <label for="isDetectingEdge" className="form-check-label">
                        <input
                            className="form-check-input"
                            name="isDetectingEdge"
                            type="checkbox"
                            value={isDetectingEdge}
                            onChange={onDetectEdgeChange}
                        /> detect edge
                    </label>
                </div>
                {
                    isDetectingEdge && (
                        <div>
                            <div class="form-group" style={styles.modalItem} >
                                <label for="blur" >
                                    blur
                                </label>
                                <input
                                    className="form-control"
                                    name="blur"
                                    type="range"
                                    min="0"
                                    max="12"
                                    step="1"
                                    value={blur}
                                    onChange={onBlurChange}
                                />
                            </div>
                            <div class="form-group" style={styles.modalItem} >
                                <label for="lowTreshold" >
                                    low treshold
                                </label>
                                <input
                                    className="form-control"
                                    name="lowTreshold"
                                    type="range"
                                    min="1"
                                    max="127"
                                    step="1"
                                    value={lowTreshold}
                                    onChange={onLowTresholdChange}
                                />
                            </div>
                            <div class="form-group" style={styles.modalItem} >
                                <label for="highTreshold" >
                                    high treshold
                                </label>
                                <input
                                    className="form-control"
                                    name="highTreshold"
                                    type="range"
                                    min="1"
                                    max="127"
                                    step="1"
                                    value={highTreshold}
                                    onChange={onHighTresholdChange}
                                />
                            </div>
                        </div>
                    )
                }
                <button
                    className="btn btn-block"
                    onClick={this.handleClose}
                >close</button>
            </div>
        );
    }
}


export default Settings;
