import React, { Component } from 'react';
import '../../styles/fbLoginModalStyle.css';
import logo from '../../images/turtle-logo.png';
import Facebook from './fbLogin';

class FbModal extends Component {
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
            <div className="modal fade " id="fbloginModal" tabIndex="-2" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog fbLoginModalStyle" role="document">
                    <div className="modal-content">
                    {/*
                        <div className="modal-header">
                            <p className="fbpopup-content" id="exampleModalLabel"></p>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        */}
                        <div className="modal-body">
                        <img src={logo} className="turtle-popup"/>

                        <Facebook setPolicyAccepted={this.props.setPolicyAccepted}  setAppState={this.props.setAppState} setInstaAccountId={this.props.setInstaAccountId}/>
                        <br/>
                        <button type="button" className="btn btn-cancel-login" data-dismiss="modal">Cancel Login</button>
                        </div>
                        {/*}<div className="modal-footer">

                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default FbModal;
