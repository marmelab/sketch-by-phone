import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import Subheader from 'material-ui/Subheader';

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
        padding: '0.5rem',
    },
    modalItem: {
        padding: '0.5rem',
    },
    slider: {
        marginTop: 0,
        marginBottom: '0.5rem',
    },
    detectOptions: {
        display: 'flex',
        flexFlow: 'row',
        flexWrap: 'wrap',
    },
    detectOptionItem: {
        boxSizing: 'border-box',
        width: '50%',
        padding: '0 0.5rem',
    },
    detectOptionItemFull: {
        boxSizing: 'border-box',
        width: '100%',
        padding: '0 0.5rem',
    },
    detectEdges: {
        marginBottom: '1rem',
    },
};

class Settings extends Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        setTimeout(() => {
            this.setState({ isOpen: true });
        }, 500);
    }

    handleClose = () => {
        setTimeout(() => {        
            this.setState({ isOpen: false });
        }, 500);
    }

    render() {
        const { isOpen } = this.state;
        if (!isOpen) {
            return <RaisedButton style={styles.openButton} onClick={this.handleOpen} label="Settings" />
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
                { !isDetectingEdge &&
                    <div style={styles.modalItem}>
                        <Subheader>Opacity: {opacity}</Subheader>
                        <Slider
                            name="opacity"
                            value={opacity}
                            onChange={onOpacityChange}
                            sliderStyle={styles.slider}
                        />
                    </div>
                }
                {
                    isDetectingEdge && (
                        <div style={styles.detectOptions}>
                            <div style={styles.detectOptionItemFull}>
                                <Subheader>blur: {blur}</Subheader>
                                <Slider
                                    name="blur"
                                    value={blur}
                                    max={4}
                                    onChange={onBlurChange}
                                    sliderStyle={styles.slider}
                                />
                            </div>
                            <div style={styles.detectOptionItem}>
                                <Subheader>low treshold: {lowTreshold}</Subheader>
                                <Slider
                                    name="lowTreshold"
                                    value={lowTreshold}
                                    max={127}
                                    onChange={onLowTresholdChange}
                                    sliderStyle={styles.slider}
                                />
                            </div>
                            <div style={styles.detectOptionItem}>
                                <Subheader>high treshold: {highTreshold}</Subheader>
                                <Slider
                                    name="highTreshold"
                                    value={highTreshold}
                                    max={127}
                                    onChange={onHighTresholdChange}
                                    sliderStyle={styles.slider}
                                />
                            </div>
                        </div>
                    )
                }
                <Checkbox
                    name="isDetectingEdge"
                    type="checkbox"
                    checked={isDetectingEdge}
                    onCheck={onDetectEdgeChange}
                    label="detect edge"
                    style={styles.detectEdges}
                />

                <RaisedButton
                    primary
                    fullWidth
                    onClick={this.handleClose}
                    label="close"
                />
            </div>
        );
    }
}


export default Settings;
