import React, { Fragment,Component } from 'react'
import $ from 'jquery';
import axios from 'axios';
import Message from './message';
import {Link} from 'react-scroll';
import { findDOMNode } from "react-dom";


export default class Modal extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            client:this.props.client,
            open:false,
            counter:0
        }
        
        

    }

    componentDidMount(){
        //console.log(this.props.client);
        axios.get('/messages/'+this.props.client)
            .then(res => this.setState({messages:res.data}))
        
        
    }

    componentDidUpdate(prevProps,prevState){
        if(this.state.messages!==prevState.messages){
            if(this.state.messages!==prevState.messages){
                axios.get('/messages/'+this.props.client)
                    .then(res => this.setState({messages:res.data}))
            }
        }
    }

    

    

    toggle=() => {
        if(this.state.open){
            this.setState({open:false})
            console.log(this.state.open);
        }
        else{
            this.setState({open:true}) 
            console.log(this.state.open);
        }
    }
    close = () =>{
        console.log('Closed ok');
        //window.location='/dashboard'
        let c="#modall"+this.props.client;
        let d="modalll"+this.props.client;
        window.close(c,d);
    }
    

    render(){
        let m="#modall"+this.props.client;
        let c="modall"+this.props.client;
        let d="modalll"+this.props.client;
        if(this.state.messages.length>0){
            return(
                <div className='container'>
                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target={m}><i class="fa fa-lg fa-sticky-note-o" aria-hidden="true"></i></button>
                <div id={c} className="modal" role="dialog">
                    <div className="modal-dialog">
                        <div className='modal-content'>
                        <button type="button" className="close mt-2" data-dismiss="modal" onClick={this.close} style={{marginLeft:"85%"}}>&times;</button>
                        <div className="modal-body" id={d}>
                            <div className='container'>
                                <h2>Mail Logs:</h2>
                                <br />
                                {this.state.messages.map((currentexercise,index) => (
                                    <div>
                                        <Message message={currentexercise} key={currentexercise.message_id} />
                                        <br />
                                    </div>
                                ))}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
        else{
            return(
                <div className='container'>
                <button type="button" className="btn btn-outline-secondary" data-toggle="modal" data-target={m}><i class="fa fa-lg fa-sticky-note-o" aria-hidden="true"></i></button>
                <div id={c} className="modal" role="dialog">
                    <div className="modal-dialog">
                        <div className='modal-content'>
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" onClick={this.close}>X</button>
                        </div>
                        <div className="modal-body" id="modal-body">
                            <div className='container'>
                                <h2>No past communications....</h2>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }
}