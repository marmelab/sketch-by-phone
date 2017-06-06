import React, { Component } from 'react';

export default class GalleryItem extends Component {
    handleClick = () => {
        this.props.onSelected(this.props.image);
    }
    render() {
        const { image } = this.props;
        return (
            <button className="btn-image" onClick={this.handleClick}>
                <img src={image} alt="" />
            </button>
        );
    }
}
