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


export default class Navigation extends Component{
    constructor(props){
        super(props);
        this.state={
            isOpen:false
        }
        this.toggle=this.toggle.bind(this);
        this.logout=this.logout.bind(this);
    }

    toggle(){
        this.setState({isOpen:!this.state.isOpen})
    }


    logout(){
        axios.delete('/logout')
            .then(res => window.location="/");
    }

    render(){
        return(
            <div>
                <Navbar dark expand='sm' className='mb-1 nav'>
                    <Container>
                        <NavbarBrand href='/' style={{color:"rgba(10,10,10,0.7)"}}><b className='mr-2'>Home</b><img href='data:image/png;base64,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' /></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className='ml-auto' navbar>
                                <NavItem>
                                    <NavLink href='#' style={{color:"rgba(30,30,30,0.65)"}} className='mr-4'>Welcome Admin</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='/dashboard' style={{color:"rgba(30,30,30,0.65)"}} className='mr-4'>Dashboard</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        )
    }
}