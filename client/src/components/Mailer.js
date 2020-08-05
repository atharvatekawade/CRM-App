import React, { Fragment,Component } from 'react'
import axios from 'axios';
export default class Edit extends Component{
    constructor(props){
        super(props);
        this.state={
            desc:'',
            subject:'',
            password:'',
            err:'',
            loading:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.restore = this.restore.bind(this);

    }

    componentDidMount(){
        this.setState({desc:'',subject:'',password:'',err:'',loading:false})
    }

    restore(){
        this.setState({desc:'',subject:'',password:'',err:'',loading:false})
        //window.location='/dashboard';
    }

    handleChange(event){
        const {name,value}=event.target;
        this.setState({[name]:value})
    }

    submit(e){
        e.preventDefault();
        this.setState({subject:'',desc:'',password:'',loading:true});
        const msg={
            password:this.state.password,
            desc:this.state.desc,
            sender:this.props.mail,
            subject:this.state.subject
        }
        axios.post('/msg/'+this.props.client,msg)
            .then(res => {
                if(res.data==="Authentication unsuccessfull"){
                    this.setState({err:"Authentication unsuccessful",loading:false})
                    console.log('Hi')
                }
                else{
                    //window.location='/';
                    this.setState({err:"Mail sent",loading:false})
                }
            }
            )
            .catch(err => console.log(err));
    }

    render(){
        let m="#modal"+this.props.client;
        let c="modal"+this.props.client;
        return(
            <div className='container'>
                <button type="button" className='mt-1 ml-2' data-toggle="modal" data-target={m} style={{backgroundColor:"White",border:"none",outline:"none",position:"relative",top:"3px",left:"8px"}}><i class="fa fa-lg fa-envelope" aria-hidden="true" style={{color:"rgba(20,20,29,0.7)"}}></i></button>
                <div id={c} className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <button type="button" className="close mt-2" data-dismiss="modal" onClick={this.restore} style={{marginLeft:"85%"}}>&times;</button>
                        <div class="modal-body">
                            <h6><p>Send mail to Admin</p></h6>
                            {this.state.loading &&
                                <b><p style={{fontSize:"14px"}}>Sending....</p></b>
                            }
                            {this.state.err==="Authentication unsuccessful" && !this.state.loading &&
                                <b><p style={{fontSize:"14px",color:"Red"}}><span style={{color:"Red"}} className='mr-1'>*</span>Authentication Failed</p></b>
                            }
                            {this.state.err!=="Authentication unsuccessful" && this.state.err.length>0 && !this.state.loading &&
                                <b style={{color:"Green"}}><p style={{fontSize:"14px",color:"Green"}}><span className='mr-1'>*</span>Mail sent successfully</p></b>
                            }
                            {this.state.err!=="Authentication unsuccessful" && this.state.err.length===0 && !this.state.loading && 
                                <b style={{color:"rgba(0,0,0,0)"}}><p style={{fontSize:"14px",color:"rgba(0,0,0,0)"}}><span className='mr-1'>*</span>Hello</p></b>
                            }
                            <form on onSubmit={this.submit}>
                                <div className="form-group shadow-textarea">
                                    <input type='text' className="form-control z-depth-1" id="exampleFormControlTextarea6" placeholder="Subject..." name='subject' value={this.state.subject} onChange={this.handleChange} />
                                </div>
                                <div className="form-group shadow-textarea">
                                    <textarea className="form-control z-depth-1" id="exampleFormControlTextarea6" rows="3" placeholder="Mail body goes here..." name='desc' value={this.state.desc} onChange={this.handleChange}></textarea>
                                </div>
                                <div className="form-group shadow-textarea">
                                    <input type='password' className="form-control z-depth-1" id="exampleFormControlTextarea6" placeholder="Password" name='password' value={this.state.password} onChange={this.handleChange} />
                                </div>
                                <button className='btn btn-warning' style={{backgroundColor:"Orange",color:"White"}}>Send Mail</button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}