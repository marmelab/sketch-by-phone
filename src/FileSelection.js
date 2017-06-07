import React, { Component } from 'react';
import './FileSelection.css';
import getImageDataFromDataUrl from './utils/getImageDataFromDataUrl';
import hiro from './assets/hiro.png';
import Gallery from './Gallery';
import RaisedButton from 'material-ui/RaisedButton';

class FileSelection extends Component {
    state = {
        showGallery: false,
    };

    handleChange = (event) => {
        var reader = new FileReader();
        reader.addEventListener('load', () => {
            getImageDataFromDataUrl(reader.result)
                .then(this.props.onFileSelected);
        }, false);

        reader.readAsDataURL(event.target.files[0]);
    }

    handleFileInputClick = () => {
        this.fileInput.click();
    }

    handleOpenGalleryClick = () => {
        setTimeout(() => {
            this.setState({ showGallery: true });
        }, 500);
    }

    handleCloseGalleryClick = () => {
        setTimeout(() => {
            this.setState({ showGallery: false });
        }, 500);
    }

    handleGalleryImageSelected = (image) => {
        getImageDataFromDataUrl(image).then(this.props.onFileSelected);
    }

    storeFileInputRef = node => {
        this.fileInput = node;
    }

    render() {
        const { showGallery } = this.state;

        if (showGallery) {
            return <Gallery onClose={this.handleCloseGalleryClick} onSelected={this.handleGalleryImageSelected} />;
        }

        return (
            <div className="file-selection container-fluid">
                <h1 className="h6 title">Sketch anything you want using your phone as a guide</h1>
                <hr className="my-4" />
                <ol>
                    <li className="hiro">
                        <div>
                            Print a <a href={hiro}>hiro marker</a>
                        </div>
                        <div className="marker"><a href={hiro}><img alt="Hiro marker example" src={hiro} /></a></div>
                    </li>
                    <li>
                        Put it on a sheet of paper
                    </li>
                    <li>
                        Choose something to draw
                        <div className="form-group">
                            <RaisedButton secondary fullWidth htmlFor="file_input" onTouchTap={this.handleFileInputClick} label="From your photo library">
                                <input ref={this.storeFileInputRef} id="file_input" className="file-input" type="file" accept="image/*" onChange={this.handleChange} />
                            </RaisedButton>
                        </div>
                        <RaisedButton secondary fullWidth onTouchTap={this.handleOpenGalleryClick} label="Our drawings" />
                    </li>
                </ol>
            </div>
        );
    }
}

export default FileSelection;
