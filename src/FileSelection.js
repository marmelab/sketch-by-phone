import React, { Component } from 'react';
import './FileSelection.css';
import image from './assets/image.png';
import getImageDataFromDataUrl from './utils/getImageDataFromDataUrl';
import detectEdge from './utils/detectEdge';


class FileSelection extends Component {
    handleChange = (event) => {
        var reader = new FileReader();
        reader.addEventListener('load', () => {
            getImageDataFromDataUrl(reader.result)
                .then(this.props.onFileSelected);
        }, false);

        reader.readAsDataURL(event.target.files[0]);
    }

    handleClick = () => {
        getImageDataFromDataUrl(image).then(this.props.onFileSelected);
    }

    render() {
        return (
            <div className="fileSelection container-fluid">
                <div id="form">
                    <div className="jumbotron">
                        <h1 className="h4">Sketch by phone</h1>
                        <hr className="my-4" />
                        <div className="form-group">
                            <label htmlFor="file_input">Select a drawing</label>
                            <input id="file_input" className="form-control-file" type="file" accept="image/*" onChange={this.handleChange} />
                        </div>
                        <hr className="my-4" />
                        <button onClick={this.handleClick}>Use the default one</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default FileSelection;
