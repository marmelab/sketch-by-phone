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

        const { opacity, onOpacityChange } = this.props;

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
                <button 
                    className="btn btn-block"
                    onClick={this.handleClose}
                >close</button>
            </div>
        );
    }
}


export default Settings;
