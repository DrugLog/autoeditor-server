const express = require("express");
const cors = require('cors');
const router = express.Router;
const request = require('request');
const app = express();

const port = 5000;

app.use(cors());
app.listen(port);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({extended: true}))

app.get('/api', (req, res) => {
    console.log('GET request on /api');
    res.json(stateData);
})

app.post('/api', (req, res) => {
    console.log('POST request on /api');
    console.log('req body: ', req.body);
    res.json(req.body);
    stateData = req.body;
    createVideo(req.body);
})

app.get('/files', (req, res) => {
    console.log('GET request on /files');
    // console.log('response: ', res.json());
    res.json(fileFormData);
})

app.post('/files', (req, res) => {
    console.log('POST request on /files');
    console.log('request body: ', req.body);
})

var stateData = {
    data_sent: false,
    spotify_url: '',
    video_files: '',
}

var videoFileList = [];
var fileFormData = new FormData();

async function uploadVideos(videoFiles){

    console.log('uploadVideos() with videoFiles: ', videoFiles);

    const formData = new FormData();

    formData.append('File', videoFiles);
    // videoFileList =(videoFiles);

    console.log('formData: ', formData);
    fileFormData = formData;

    await fetch('http://localhost:5000/files', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData,
    })
        .then(res => res.json())
        .then(data => console.log('Success: ', data))
        .catch(error => console.log('Error: ', error))
        console.log('res.json(): ', res.json());
}

function createVideo(reqData){
    console.log('Creating video');
    var spotifyURL = reqData.spotify_url;
    var videoFiles = reqData.video_files;
    var valid = reqData.data_sent;
    console.log('spotifyURL: ', spotifyURL, ', videoFiles: ', videoFiles, 'valid: ', valid);

    // if(!valid){
    //     console.log('exiting createVideo. Not valid');
    //     return;
    // }

    uploadVideos(videoFiles)
}
