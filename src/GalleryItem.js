import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    button: {
        height: '10rem',
        width: '10rem',
        margin: '0.5rem 0',
    },
    image: {
        height: '9rem',
        width: '9rem',
        margin: '0.5rem',
    },
}
export default class GalleryItem extends Component {
    handleClick = () => {
        this.props.onSelected(this.props.image);
    }
    render() {
        const { image } = this.props;
        return (
            <RaisedButton style={styles.button} onClick={this.handleClick}>
                <img style={styles.image} src={image} alt="" />
            </RaisedButton>
        );
    }
}
