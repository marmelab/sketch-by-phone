import React, { Component } from 'react';
import getImageDataFromDataUrl from './utils/getImageDataFromDataUrl';
import hiro from './assets/hiro.png';
import rose from './assets/rose.jpg';
import Gallery from './Gallery';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    container: {
        minHeight: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundImage: `url(${rose})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPositionX: '50%',
        paddingTop: 100,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: '1.2rem',
    },

    list: {
        paddingRight: 40,
    },

    listItem: {
        paddingBottom: 15,
    },

    title: {
        fontSize: '1.2rem',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    a: {
        textDecoration: 'underline',
    },

    hiroMarker: {
        textAlign: 'center',
    },

    btnFileInput: {
        marginTop: 15,
        marginBottom: 15,
    },

    hiroMarkerImg: {
        marginTop: '1rem',
        height: '5rem',
        width: '5rem',
        border: '5px solid white',
    },

    fileInput: {
        display: 'none',
    },

    hr: {
        border: 0,
        borderTop: '1px solid black',
        marginBottom: '1rem',
        marginTop: '1rem',
    }
};

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
            <div style={styles.container}>
                <h1 style={styles.title}>Sketch anything you want using your phone as a guide</h1>
                <hr style={styles.hr} />
                <ol style={styles.list}>
                    <li style={styles.listItem}>
                        <div>
                            Print a <a style={styles.a} href={hiro}>hiro marker</a>
                        </div>
                        <div style={styles.hiroMarker}>
                            <a style={styles.a} href={hiro}>
                                <img style={styles.hiroMarkerImg} alt="Hiro marker example" src={hiro} />
                            </a>
                        </div>
                    </li>
                    <li style={styles.listItem}>
                        Put it on a sheet of paper
                    </li>
                    <li style={styles.listItem}>
                        Choose something to draw
                        <div>
                            <RaisedButton style={styles.btnFileInput} secondary fullWidth htmlFor="file_input" onTouchTap={this.handleFileInputClick} label="From your photo library">
                                <input ref={this.storeFileInputRef} id="file_input" style={styles.fileInput} type="file" accept="image/*" onChange={this.handleChange} />
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
