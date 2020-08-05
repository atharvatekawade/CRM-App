import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
  NavLink
} from 'reactstrap';
import axios from 'axios';
import History from './History';
import Mailer from './Mailer';



export default class Navigation2 extends Component{
    constructor(props){
        super(props);
        this.state={
            isOpen:false,
            unread:'0'
        }
        this.toggle=this.toggle.bind(this);
        this.logout=this.logout.bind(this);
        this.read=this.read.bind(this);
    }

    get = () => {
        axios.get('/unread/'+this.props.user.user_id)
            .then(res => this.setState({unread:res.data}));
    }

    componentDidMount(){
        this.get();
        this.timer = setInterval(() => this.get(), 5000);
    }

    toggle(){
        this.setState({isOpen:!this.state.isOpen})
    }

    componentWillUnmount() {
        this.timer = null;
    } 


    logout(){
        axios.delete('/logout')
            .then(res => window.location="/");
    }

    read(){
        console.log('Read fn...');
        //this.setState({unread:0});
        this.setState({unread:0});
        if(Number(this.state.unread)>0){
            axios.post('/read/'+this.props.user.user_id)
                .then(res => this.setState({unread:0}))
        }
    }

    render(){
        if(!this.props.show){
            this.state.show=0;
        }
        return(
            <div>
                <Navbar dark expand='sm' className='mb-1 nav'>
                    <Container>
                        <NavbarBrand href='/' style={{color:"rgba(10,10,10,0.7)"}}><b className='mr-2'>Home</b></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className='ml-auto' navbar>
                                <NavItem>
                                    <NavLink href='#' style={{color:"rgba(30,30,30,0.65)"}} className='mr-4'>Welcome {this.props.user.name}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <Mailer client={this.props.user.user_id} key={this.props.user.user_id} mail={this.props.user.email} />
                                </NavItem>
                                <NavItem>
                                    {Number(this.state.unread)>0 && this.props.show && 
                                        <div>
                                            <div style={{position:"relative",right:"69px",top:"5px",color:"rgba(0,0,0,0)",backgroundColor:"rgba(0,0,0,0)"}} className='dot'>
                                                <span style={{position:"relative",top:"-3.2px",fontSize:"14px"}}>{this.state.unread}</span>
                                            </div>
                                            <NavLink href='#' style={{color:"rgba(30,30,30,0.65)"}} className='mr-4 mtl-4' onClick={this.read}><History client={this.props.user.user_id} key={this.props.user.user_id} pic={this.props.pic} show={this.props.show} /></NavLink>
                                        </div>
                                    }
                                    {Number(this.state.unread)>0 && !this.props.show &&
                                        <div>
                                            <div style={{position:"relative",right:"69px",top:"5px"}} className='dot'>
                                                <span style={{position:"relative",top:"-3.2px",fontSize:"14px"}}>{this.state.unread}</span>
                                            </div>
                                            <NavLink href='#' style={{color:"rgba(30,30,30,0.65)"}} className='mr-4 mtl-4' onClick={this.read}><History client={this.props.user.user_id} key={this.props.user.user_id} pic={this.props.pic} show={this.props.show} /></NavLink>
                                        </div>
                                    }
                                    {Number(this.state.unread)===0 && 
                                        <NavLink href='#' style={{color:"rgba(30,30,30,0.65)",position:"relative",top:"23.4px",right:"165px"}} className='mr-4 mtl-4' onClick={this.read}><History client={this.props.user.user_id} key={this.props.user.user_id} pic={this.props.pic} show={this.props.show} /></NavLink>
                                    }
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        )
    }
}