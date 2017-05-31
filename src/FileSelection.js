import React, { Component } from 'react';
import './FileSelection.css';

class FileSelection extends Component {
    handleChange = (event) => {
        var reader = new FileReader();
        reader.addEventListener('load', () => {
            this.props.onFileSelected(reader.result);
        }, false);

        reader.readAsDataURL(event.target.files[0]);
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
                    </div>
                </div>
            </div>
        );
    }
}

export default FileSelection;
