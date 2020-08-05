import React, { Fragment,Component } from 'react'
import $ from 'jquery';
import axios from 'axios';
import Message from './message';


export default class Scroll extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            client:this.props.client,
            show:false,
            unread:'0'
        }
    }

    get = () => {
        axios.get('/messages/'+this.props.client)
            .then(res => this.setState({messages:res.data}))
        axios.get('/unread/'+this.props.client)
            .then(res => this.setState({unread:res.data}))
    }

    componentDidMount(){
        this.get();
        this.timer = setInterval(() => this.get(), 5000);
    }

    componentWillUnmount() {
        this.timer = null;
    }  

    toggle = () => {
        let c='#content'+this.props.client.toString();
        $(c).scrollTop('0')
        axios.post('/read/'+this.props.client)
            .then(res => this.setState({show:!this.state.show,unread:0}))
    }

    render(){
        let m='click'+this.props.client.toString();
        let c='content'+this.props.client.toString();
        let d='center'+this.props.client.toString();
        let k=165;
        k=165-this.props.i*62.9;
        k=k.toString();
        k=k+'px';
        let t=440;
        t=t-this.props.i*62.9;
        t=t.toString();
        t=t+'px';
        return(
                <div className='center' id={d}>
                    {!this.state.show && Number(this.state.unread)===0 &&
                        <button type="button" className="btn btn-secondary" onClick={this.toggle} style={{position:"relative",top:"18px"}}><i class="fa fa-lg fa-sticky-note-o" aria-hidden="true"></i></button>
                    }
                    {!this.state.show && Number(this.state.unread)>0 &&
                        <div>
                            <button type="button" className="btn btn-secondary" onClick={this.toggle} style={{position:"relative",top:"18px",right:"-9px"}}><i class="fa fa-lg fa-sticky-note-o" aria-hidden="true"></i></button>
                            <span style={{position:"relative",top:"0px",right:"2px"}} className='dott'><span style={{position:"relative",top:"0.2px"}}>{this.state.unread}</span></span>
                        </div>
                    }
                    {this.state.show && 
                        <div>
                            <button type="button" className="btn btn-secondary" style={{position:"relative",top:"332.2px",right:"-212.9px"}}><i class="fa fa-lg fa-sticky-note-o" aria-hidden="true"></i></button>
                            <div style={{position:"relative",top:k}} className='toppart'>
                                <h2 style={{position:"relative",top:"20px",color:"white"}}>Mail Logs</h2>
                                <label htmlFor={m}><i className="fa fa-times" aria-hidden="true" style={{position:"relative",right:"-210px",display:"inline",top:"-18px",color:"White"}} onClick={this.toggle}></i></label>
                            </div>
                            <div className='content shadow' id={c} style={{backgroundColor:"rgba(238,224,177,0.4)",position:"relative",top:t}}>
                                <div className='container'>
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
                    }
                </div>

        )
    }
}