const express = require("express");
const cors = require('cors');
const router = express.Router;
const request = require('request');
const fileUpload = require('express-fileupload')
var multer = require('multer')
var path = require('path');
var os = require('os');
const app = express();

const port = 5000;

app.use(cors());
app.listen(port);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({extended: true}))
// app.use(fileUpload())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/test/'
}));

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

app.get('/api', (req, res) => {
    console.log('GET request on /api');
    res.json(stateData);
})

app.post('/api', (req, res) => {
    console.log('POST request on /api');
    console.log('req body: ', req.body);
    res.json(req.body);
    stateData = req.body;
    // createVideo(req.body);
})

app.get('/files', async (req, res) => {
    console.log('GET request on /files');
    // await downloadFiles(req, res);
    await res.json(fileData);
})

app.post('/files', async (req, res) => {
    console.log('POST request on /files');
    console.log('request body: ', req.body);
    console.log('request files: ', req.files);
    // fileData = req.files;
    // console.log('fileData: ', fileData);
    // console.log('response: ', res);
    downloadFiles(req, res);
    
})

var stateData = {
    data_sent: false,
    spotify_url: '',
    video_files: '',
}

var videoFileList = [];
var fileFormData = new FormData();
var fileData = {
    video_files: [],
}
tempFileData = null;

function downloadFiles(req, res){
    var filePathList = [];
    tempFileData = req.files;
    // console.log('fileData.FileList.length: ', fileData.FileList.length);
    console.log('tempFileData: ', tempFileData.FileList.length);
    if(tempFileData != null){
        for(var i = 0; i < tempFileData.FileList.length; i++){
            var tempFile = tempFileData.FileList[i];
            console.log('fileData.FileList[',i,']: ', tempFile);
            var uploadPath = './test/' + tempFile.name;
            filePathList.push(path.join(process.cwd(),'test',tempFile.name));
            tempFile.mv(uploadPath, function(err) {
                if(err){
                    console.log('error: ', err);
                    // return res.status(500).send(err);
                }
            });
            // tempFile.mv(uploadPath);
        }
    }
    // res.json({
    //     video_files: filePathList,
    // });
    fileData = {
        video_files: filePathList,
    }
}

async function uploadVideos(videoFiles){

    console.log('uploadVideos() with videoFiles: ', videoFiles);

    // console.log('videoFiles.name: ', videoFiles.name);

    const formData = new FormData();

    formData.append('File', videoFiles.name);
    // videoFileList =(videoFiles);

    console.log('formData: ', formData);
    fileFormData = formData;

    // await fetch('http://localhost:5000/files', {
    //     method: 'POST',
    //     headers: {
    //         // 'Accept': 'application/json',
    //         // 'Content-Type': 'multipart/form-data'
    //         'Content-Type': file.type,
    //     },
    //     body: formData,
    // })
    //     .then(res => res.json())
    //     .then(data => console.log('Success: ', data))
    //     .catch(error => console.log('Error: ', error))
    //     console.log('res.json(): ', res.json());
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

    // uploadVideos(videoFiles)
}
