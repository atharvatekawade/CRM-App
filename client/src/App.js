import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import axios from 'axios';
import Navigation from './components/Navigation';
import Navigation1 from './components/Navigation1';
import Navigation2 from './components/Navigation2'
import Dashboard from './components/Dashboard'
import Home from './components/Home';
import Scroll from './components/Scroll';
import $ from 'jquery';

//import Home from './components/Home';

export default class App extends Component{

  constructor(props){
      super(props);
      this.state={
          islog:"no",
          picture:true,
          show:false
      }
  }

  componentDidMount(){
    axios.get('/user')
      .then(res => this.setState({islog:res.data}))
  }

  componentDidUpdate(prevProps,prevState){
    if(true){
      axios.get('/user')
        .then(res => this.setState({islog:res.data}))
    }
  }

  pic = () => {
    console.log('You hit the App component');
    $('#content').scrollTop('0')
    this.setState({picture:!this.state.picture,show:!this.state.show});
  }

  render(){
    if(this.state.islog.name==='Admin'){
      return (
        <Router>
          <Navigation />
          <Route
            path='/dashboard'
            exact
            render={(props) => (
              <Dashboard {...props} islog={this.state.islog} />
            )}
          />
          <Route
            path='/'
            exact
            render={(props) => (
              <Home {...props} islog={this.state.islog} />
            )}
          />
        </Router>
      );
    }
    else if(this.state.islog==='no'){
      return (
        <Router>
          <Navigation1 />
          <Route
            path='/'
            render={(props) => (
              <Home {...props} islog={this.state.islog} />
            )}
          />
        </Router>
      );
    }
    else{
      return (
        <Router>
          <Navigation2 user={this.state.islog} picture={this.state.picture} show={this.state.show} pic={this.pic} />
          <Route
            path='/'
            render={(props) => (
              <Home {...props} islog={this.state.islog} picture={this.state.picture} show={this.state.show} pic={this.pic} />
            )}
          />
        </Router>
      );
    }
  }
}

