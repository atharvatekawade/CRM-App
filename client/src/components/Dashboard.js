import React, { Fragment,Component } from 'react'
import axios from 'axios';
import Modal from './Modal';
import Navigation from './Navigation';
import Mail from './Mail';
import Scroll from './Scroll';

const User = props => (
    <tr style={{backgroundColor:"rgba(30,30,32,0.02)"}}>
        <td>{props.i+1}.</td>
        <td>{props.user.name}</td>
        <td>{props.user.email}</td>
        <td>{props.user.time} days</td>
        <td><Mail client={props.user.user_id} key={props.user.user_id} mail={props.user.email} /></td>
        <td><Scroll client={props.user.user_id} key={props.user.user_id} i={props.i} /></td>
        <td>
            <a href={"http://localhost:5000/edit/"+props.user.user_id}>Edit</a>   <span style={{color:"rgba(30,32,36,0.6)"}}>|</span>   <a href="#" onClick={() => { props.deleteExercise(props.user.user_id) }}>Delete</a>
        </td>
    </tr>
)

export default class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            users:[],
        }
        this.deleteExercise = this.deleteExercise.bind(this)

    }
    componentDidMount(){
        axios.get('/users')
            .then(res => this.setState({users:res.data}))
    }

    componentDidUpdate(prevProps,prevState){
        if(this.state.users!==prevState.users){
            axios.get('/users')
            .then(res => this.setState({users:res.data}))
        }
    }

    deleteExercise(id) {
        axios.delete('/user/'+id.toString())
          .then(response => { console.log(response.data)});
    
        this.setState({
          users: this.state.users.filter(el => el.user_id !== Number(id))
        })
    }


    render(){
        return(
            <div>
                <div class='container'>
                    <br />
                    <br />
                    <table className="table">
                        <thead>
                        <tr style={{backgroundColor:"rgba(30,145,150)",color:"white",border:"none"}}>
                            <th>S.N.</th>
                            <th>Client Name</th>
                            <th>Email</th>
                            <th>Remainder Frequency</th>
                            <th>Actions</th>
                            <th>History</th>
                            <th>Update</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((current,index) => (
                            <User user={current} i={index} key={current.user_id} deleteExercise={this.deleteExercise} />
                        ))}
                        </tbody>
                    </table>
                <a href='http://localhost:5000/register' className='btn btn-success mt-2'>Add New Client >></a>
                </div>
            </div>
        )
    }
}