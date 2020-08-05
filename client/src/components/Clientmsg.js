import React, { Fragment,Component } from 'react'
import axios from 'axios';

export default class Message extends Component{
    constructor(props){
        super(props);
    }
    render(){
        if(this.props.message.sender!==1){
            return(
                <div class='send'>
                    <p style={{fontSize:"15px",color:"white"}} className='mt-2'><b>Sent On:{this.props.message.date}</b></p>
                    <p style={{fontSize:"15px",position:"relative",top:"-20px",color:"white"}}><b>Sent At:{this.props.message.time}</b></p>
                    <br />
                    <p style={{position:'relative',top:'-40px',fontSize:"18px",color:"White"}}><b>Mail sent by you:</b></p>
                    <p style={{color:"White",position:"relative",top:"-60px"}}>{this.props.message.body}</p>
                </div>
            )
        }
        else{
            return(
                <div class='receive'>
                    <p style={{fontSize:"15px",color:"white"}} className='mt-2'><b>Sent On:{this.props.message.date}</b></p>
                    <p style={{fontSize:"15px",position:"relative",top:"-20px",color:"white"}}><b>Sent At:{this.props.message.time}</b></p>
                    <br />
                    <p style={{position:'relative',top:'-40px',fontSize:"18px",color:"White"}}><b>Mail sent by Client:</b></p>
                    <p style={{color:"White",position:"relative",top:"-60px"}}>{this.props.message.body}</p>
                </div>
            )
        }
    }
}