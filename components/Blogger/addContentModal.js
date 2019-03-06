/*THIS MODAL IS FOR ADDING LOCATION AND CONTENT*/
import React, { Component } from 'react';
import logo from '../../images/turtle-logo.png';
import '../../styles/addContentModalStyle.css';
import GoogleSuggest from './GoogleSuggest';

class AddContentModal extends Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            title: '',
            msg: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
            msg: nextProps.msg,
        });
    }

    titleHandler(e) {
        this.setState({ title: e.target.value });
    }

    msgHandler(e) {
        this.setState({ msg: e.target.value });
    }

    handleSave() {
        const item = this.state;
        this.props.saveModalDetails(item)
    }

    render() {
        return (
            <div className="modal fade " id="addContentModal" tabIndex="-2" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog addContentModalStyle" role="document">
                    <div className="modal-content modal-content-custom ">
                    
                    {/*
                        <div className="modal-header">
                            <p className="fbpopup-content" id="exampleModalLabel"></p>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        */}
                        <div className="modal-body modal-body-custom">



                        <br/>
                        <GoogleSuggest/>

                        <button type="button" className="btn btn-cancel-add-location" data-dismiss="modal">Cancel</button>
                        <hr className="hr1"/>
                        <p className="powered-by-google">powered by <span className="bold">Google</span></p>
                        </div>
                        {/*}<div className="modal-footer">

                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default AddContentModal;
