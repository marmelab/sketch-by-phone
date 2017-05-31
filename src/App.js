import React, { Component } from 'react';
import FileSelection from './FileSelection';
import Sketch from './Sketch';

class App extends Component {
    state = {
        image: null,
    };

    handleFileSelected = (image) => {
        this.setState({ image });
    }

  render() {
        const { image } = this.state;

        if (!image) {
            return <FileSelection onFileSelected={this.handleFileSelected} />;
        }
        return (
            <Sketch image={image} />
        );
    }
}

export default App;
