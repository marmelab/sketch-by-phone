import React from 'react';
import './Gallery.css';
import GalleryItem from './GalleryItem';

const images = [
    require('./assets/drawing1.jpg'),
    require('./assets/drawing2.jpg'),
    require('./assets/drawing3.jpg'),
    require('./assets/drawing4.jpg'),
    require('./assets/drawing5.jpg'),
    require('./assets/drawing6.jpg'),
    require('./assets/drawing7.jpg'),
];

const Gallery = ({ onClose, onSelected }) => (
    <div className="gallery">
        <button className="btn btn-default btn-block" onClick={onClose}>Cancel</button>
        {images.map(image => <GalleryItem image={image} onSelected={onSelected} />)}
    </div>
)

export default Gallery;
