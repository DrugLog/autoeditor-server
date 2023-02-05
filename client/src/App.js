import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'; 
import React, { Component} from 'react';
import {Helmet} from 'react-helmet'
// import 'SpotifyAPIHandler.js';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data_sent: false,
      video_files: '',
      spotify_url: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){

    console.log('component mounted');

  }


  handleChange(e) {
    console.log('handleChange: ', e);

    if(e.target.type == "file"){
      this.setState({[e.target.name]: e.target.files}, () => console.log('new state: ', this.state));
    } else {
      this.setState({[e.target.name]: e.target.value}, () => console.log('new state: ', this.state));
    }

    
    // this.setState({});
}

  async handleSubmit(e) {
    console.log('handleSubmit: ', e);
    e.preventDefault();

    if(e.target.name == "submit_button"){
      var result = await hitCreateVideo(this.state);

      if(result == 0){
        console.log('Success.');
        this.setState({data_sent: true}, () => console.log('new state: ', this.state));
        return;
      }

      if(result == 1){
        console.log('Empty field');
      }

    }
  }

  render(){

    const response = fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log('Error: ', error))

    var {data_sent, video_files, spotify_url} = this.state;
    // console.log('current state: ', this.state);

    return (
      <div className="App">
        <Helmet>
          <style>{'body { background-color: #292b2c; }'}</style>
        </Helmet> 
        <div className="col d-flex justify-content-center">
          <div className="card rounded-3 border-3 shadow-lg p-4 m-4 w-40" style={{width: '18rem'}}>
          <div className="card-body shadow-lg">
        <div id="input">
          <form action="/api" method="POST">
            Enter spotify song URL: 
            <input type="text" name = "spotify_url" onChange={this.handleChange}></input>
            Upload video files: 
            <input type="file" multiple accept='application/pdf, image/png' name = "video_files" onChange={this.handleChange}></input>
            <button className="btn btn-primary" type="submit" name = "submit_button" onClick={this.handleSubmit}>Create Video</button>
          </form>
        </div>
        </div>
        </div>
        </div>
          
      </div>

      

    );


  }

  
}

async function hitCreateVideo(state){

  
  console.log('hitCreateVideo with state" ', state);

  var {data_sent, video_files, spotify_url} = state;

  if(video_files == '' || spotify_url == ''){
    return 1;
  }

  const response = await fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state),
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log('Error: ', error))
    // console.log('response: ', res.);
    // return response;

  return 0;
}

export default App;
