import React from 'react';
import './Gallery.css';
import GalleryItem from './GalleryItem';

const defaultImages = [
    require('./assets/drawing1.png'),
    require('./assets/drawing2.png'),
    require('./assets/drawing3.png'),
    require('./assets/drawing4.png'),
    require('./assets/drawing5.png'),
    require('./assets/drawing6.png'),
    require('./assets/drawing7.png'),
];

const Gallery = ({ images = defaultImages, onClose, onSelected }) => (
    <div className="gallery">
        <button className="btn btn-default btn-block" onClick={onClose}>Cancel</button>
        {images.map(image => <GalleryItem index={image} image={image} onSelected={onSelected} />)}
    </div>
)

export default Gallery;
