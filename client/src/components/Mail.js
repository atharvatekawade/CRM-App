import React, { Fragment,Component } from 'react'
import axios from 'axios';
export default class Edit extends Component{
    constructor(props){
        super(props);
        this.state={
            desc:'',
            subject:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.restore = this.restore.bind(this);

    }

    componentDidMount(){
        this.setState({desc:'',subject:''})
    }

    restore(){
        this.setState({desc:'',subject:''})
    }

    handleChange(event){
        const {name,value}=event.target;
        this.setState({[name]:value})
    }

    submit(e){
        e.preventDefault();
        const msg={
            desc:this.state.desc,
            subject:this.state.subject,
            receiver:this.props.mail
        }
        axios.post('/message/'+this.props.client,msg)
            .then(res => window.location="/dashboard")
            .catch(err => console.log(err));
    }

    render(){
        let m="#modal"+this.props.client;
        let c="modal"+this.props.client;
        return(
            <div className='container'>
                <button type="button" class="btn btn-info" data-toggle="modal" data-target={m}><i class="fa fa-lg fa-envelope" aria-hidden="true"></i></button>
                <div id={c} class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <button type="button" class="close mt-2" data-dismiss="modal" onClick={this.restore} style={{marginLeft:"85%"}}>&times;</button>
                        <div class="modal-body">
                            <h6><p>Send mail to {this.props.mail}</p></h6>
                            <form on onSubmit={this.submit}>
                                <div className="form-group shadow-textarea">
                                    <input class="form-control z-depth-1" id="exampleFormControlTextarea6" placeholder="Subject..." name='subject' value={this.state.subject} onChange={this.handleChange} />
                                </div>
                                <div className="form-group shadow-textarea">
                                    <textarea class="form-control z-depth-1" id="exampleFormControlTextarea6" rows="3" placeholder="Mail body goes here..." name='desc' value={this.state.desc} onChange={this.handleChange}></textarea>
                                </div>
                                <br />
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