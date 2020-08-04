import React, { Fragment,Component } from 'react'
import $ from 'jquery';
import axios from 'axios';
import Clientmsg from './Clientmsg';


export default class Scroll extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            client:this.props.client,
            show:false,
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

    toggle = () => {
        $('#content').scrollTop('0')
        this.setState({show:!this.state.show})
    }

    pind = () => {
        this.props.pic();
    }

    render(){
        let m='click'+this.props.client.toString();
        let c='content'+this.props.client.toString();
        let d='center'+this.props.client.toString();
        return(
                <div className='center' id={d}>
                    {!this.state.show &&  
                        <i class="fa fa-lg fa-sticky-note-o" aria-hidden="true" style={{position:"relative",top:"12px",left:"85px"}} onClick={this.props.pic}></i>
                    }
                    {this.props.show && 
                        <div>
                            <i class="fa fa-lg fa-sticky-note-o" aria-hidden="true" style={{"position":"relative",top:"314px",right:"-312px"}}></i>
                            <div style={{position:"relative",top:"325px"}} className='toppart'>
                                <h2 style={{position:"relative",top:"20px",color:"white"}}>Mail Logs</h2>
                                <label htmlFor={m}  onClick={this.props.pic}><i className="fa fa-times" aria-hidden="true" style={{position:"relative",right:"-210px",display:"inline",top:"-18px",color:"White"}}></i></label>
                            </div>
                            <div className='content shadow' id='content' style={{backgroundColor:"rgba(238,224,177,0.4)",position:"relative",top:"600px"}}>
                                <div className='container'>
                                    <br />
                                    {this.state.messages.map((currentexercise,index) => (
                                        <div>
                                            <Clientmsg message={currentexercise} key={currentexercise.message_id} />
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                </div>

        )
    }
}