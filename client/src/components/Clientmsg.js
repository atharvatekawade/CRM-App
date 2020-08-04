import React, { Fragment,Component } from 'react'
import axios from 'axios';

export default class Clientmsg extends Component{
    constructor(props){
        super(props);
    }
    render(){
        if(this.props.message.sender!=1){
            return(
                <div class='send p-3'>
                    <p style={{fontSize:"11px"}}><b>{this.props.message.date}</b></p>
                    <p style={{fontSize:"11px",position:"relative",top:"-10px"}}><b>{this.props.message.time}</b></p>
                    <p style={{position:'relative',top:'-7px',fontSize:"14px",color:"White"}}><b>Mail sent by you:</b></p>
                    <p style={{color:"White",position:"relative",top:"-12px"}}>{this.props.message.body}</p>
                </div>
            )
        }
        else{
            return(
                <div class='receive p-3'>
                    <p style={{fontSize:"11px"}}><b>{this.props.message.date}</b></p>
                    <p style={{fontSize:"11px",position:"relative",top:"-10px"}}><b>{this.props.message.time}</b></p>
                    <p style={{position:'relative',top:'-7px',fontSize:"14px",color:"White"}}><b>Mail sent by Admin:</b></p>
                    <p style={{color:"White",position:"relative",top:"-12px"}}>{this.props.message.body}</p>
                </div>
            )
        }
    }
}