import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'; 
import React, { Component} from 'react';
import {Helmet} from 'react-helmet'
import axios from 'axios';
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

  asynccomponentDidMount(){

    console.log('component mounted');

  }

  onFileChange = event => {
    this.setState({selectedFiles: event.target.files});
  }

  onFileUpload = async () => {
    const formData = new FormData();

    var newFileList = [];

    console.log('length: ', this.state.selectedFiles.length);

    // for(var i = 0; i < this.state.selectedFiles.length; i++){
    //   var tempFile = this.state.selectedFiles[i];
    //   // var tempFileData = {
    //   //   'name': tempFile.name,
    //   //   'data': tempFile.data,
    //   //   'size': tempFile.size,
    //   //   'mv': Function(tempFile.mv),
    //   // }

    //   // console.log('tempFileData: ', tempFileData);
    //   console.log('tempFile(',i, '):', tempFile);
    //   newFileList.push(tempFile);
    // }

    // console.log('newFileList: ', newFileList);

    for(var i = 0; i < this.state.selectedFiles.length; i++){
      formData.append('FileList', this.state.selectedFiles[i]);
    }

    // console.log('this.state.selectedFiles[0]: ', this.state.selectedFiles[0]);
    // formData.append('fileName', this.state.selectedFile.name);

    console.log('details of the uploaded file: ', this.state.selectedFiles);
    // console.log('formData: ', formData);

    // axios.post("/files", formData);

    // const response = fetch('http://localhost:5000/files', {
    //   method: 'POST',
    //   headers: {
    //     // 'Accept': 'application/json',
    //     'content-Type': 'multipart/form-data',
    //     // 'Content-Type': 'file.type',
    //   },
    //   body: formData,
    // })
    // .then(res => console.log(res))
    // .then(data => console.log('Success: ', data))
    // .catch(error => console.log('Error: ', error));

    const config = {

      headers: {

        'content-type': 'multipart/form-data',

      },

    };

    await axios.post('http://localhost:5000/files', formData, config)
    .then((response) => {
      console.log('response: ', response.data);
    })
    .catch(error => console.log('error: ', error))
    // console.log('response: ', response);

  }

  fileData = () => {
    if(this.state.selectedFile){
      return (
        <div>
          <h2>File Details:</h2>
          <p> File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified: {" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>

        </div>
      );
    } else {
      return(
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  }

  handleChange(e) {
    console.log('handleChange: ', e);

    if(e.target.type == "file"){
      this.setState({[e.target.name]: e.target.files}, () => console.log('new state: ', this.state));
      this.setState({selectedFiles: e.target.files}, () => console.log('new state: ', this.state))
    } else {
      this.setState({[e.target.name]: e.target.value}, () => console.log('new state: ', this.state));
    }

    
    // this.setState({});
}

  async handleSubmit(e) {
    console.log('handleSubmit: ', e);
    e.preventDefault();

    if(e.target.name == "submit_button"){
      var result = await this.hitCreateVideo();

      if(result == 0){
        console.log('Success.');
        this.setState({data_sent: true}, () => console.log('new state: ', this.state));
        return;
      } else if(result == 1){
        console.log('Empty field');
        return;
      } else if(result == 2){
        console.log('Only one file was selected. Select at least one more');
        return;
      }
      
      // await testUploadVideo(this.state.video_files);
      // this.onFileUpload();
    }
  }

  hitCreateVideo = async () => {

  
    console.log('hitCreateVideo with state" ', this.state);
  
    var {data_sent, video_files, spotify_url} = this.state;
  
    if(video_files == '' || spotify_url == ''){
      return 1;
    }
  
    if(video_files.length < 2){
      return 2;
    }
  
    const response = await fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state),
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.log('Error: ', error))
      // console.log('response: ', res.);
      // return response;
  
    this.onFileUpload();
  
    this.setState({data_sent: true}, () => console.log('confirmed data sent. new state: ', this.state))

    return 0;
  }

  render(){

    
  //   const response = fetch('http://localhost:5000/api', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(this.state),
  // })
  //   .then(res => res.json())
  //   .then(data => console.log(data))
  //   .catch(error => console.log('Error: ', error))

  //   var {data_sent, video_files, spotify_url} = this.state;
  //   // console.log('current state: ', this.state);

    return (
      <div className="App">
        <Helmet>
          <style>{'body { background-color: #292b2c; }'}</style>
        </Helmet> 
        <div className="col d-flex justify-content-center">
          <div className="card rounded-3 border-3 shadow-lg p-4 m-4 w-40" style={{width: '18rem'}}>
          <div className="card-body shadow-lg">
        <div id="input">
          {/* <form action="/api" method="POST"> */}
          <form>
            Enter spotify song URL: 
            <input type="text" name = "spotify_url" onChange={this.handleChange}></input>
            Upload video files: 
            <input type="file" multiple accept='image/png, image/jpg, video/mp4' name = "video_files" onChange={this.handleChange}></input>
            {/* <button className="btn btn-primary" type="submit" name = "submit_button" onClick={this.handleSubmit}>Create Video</button> */}
            {/* <input type="file" onChange={this.onFileChange} /> */}
            {/* <button className="btn btn-primary" type="submit" name = "submit_button" onClick={this.onFileUpload}>Create Video</button> */}
            {/* <input type="file" onChange={this.handleChange}/> */}
            <button type="submit" name="submit_button" onClick={this.handleSubmit}>Upload</button>
          </form>
        </div>
        </div>
        {/* {this.fileData()} */}
        </div>
        </div>
        
          
      </div>

      

    );


  }

  
}

async function testUploadVideo(tempFile){
  console.log('testUploadVideo with tempFile: ', tempFile);

  let formData = new FormData();
  formData.append('File', tempFile, tempFile.name);

  console.log('tempFile.name: ', tempFile.name);

  console.log('formData: ', formData);

  // const testResponse = await fetch('http://localhost:5000/files', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     body: formData,
  // })
  //   .then(res => res.json())
  //   .then(data => console.log('Success: ', data))
  //   .catch(error => console.log('Error: ', error))

  // console.log('testResponse: ', testResponse);

  axios.post("http://localhost:5000/files", formData);

}

async function hitCreateVideo(state){

  
  console.log('hitCreateVideo with state" ', state);

  var {data_sent, video_files, spotify_url} = state;

  if(video_files == '' || spotify_url == ''){
    return 1;
  }

  if(video_files.length < 2){
    return 2;
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

  this.onFileUpload();

  return 0;
}

export default App;
