import React, { Component } from 'react';
import FileSelection from './FileSelection';
import Sketch from './Sketch';

class App extends Component {
    state = {
        image: null,
    };

    handleFileSelected = ({ image, whiteImage, blackImage }) => {
        this.setState({ image, whiteImage, blackImage });
    }

    render() {
        const { image, whiteImage, blackImage } = this.state;

        if (!image) {
            return <FileSelection onFileSelected={this.handleFileSelected} />;
        }
        return (
            <Sketch image={image} whiteImage={whiteImage} blackImage={blackImage} />
        );
    }
}

export default App;
