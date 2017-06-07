import React from 'react';
import './Gallery.css';
import GalleryItem from './GalleryItem';
import RaisedButton from 'material-ui/RaisedButton';

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
    <div className="gallery-container">        
        <RaisedButton secondary fullWidth onClick={onClose} label="Cancel" />
        <div className="gallery">        
            {images.map(image => <GalleryItem key={image} image={image} onSelected={onSelected} />)}
        </div>
    </div>
)

export default Gallery;
