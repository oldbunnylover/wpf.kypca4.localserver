const express = require("express");
const multer  = require("multer");
const path = require('path');
const fs = require('fs');
 
const app = express();

app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.send("ok");
});

app.post("/upload/:id", function (req, res) {

    if (!fs.existsSync("books/")) {
        fs.mkdirSync("books/");
    }

    if (!fs.existsSync("books/" + req.params.id)) {
        fs.mkdirSync("books/" + req.params.id);
    }

    let storageConfig = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, "books/" + req.params.id);
        },
        filename: (req, file, cb) =>{
            let ext = path.extname(file.originalname.toLocaleLowerCase());
            if(ext === ".png" || ext === ".jpg" || ext === ".jpeg")
                cb(null, "cover.png");
            else
                cb(null, "book.pdf");
        }
    });

    let upload = multer({storage:storageConfig}).any();
    upload(req, res, function(err) {
        if(err){
            res.end('error');
            console.log(err);
        }
        else
            res.end('ok');
    });
});

app.listen(3000, ()=>{console.log("Server started")});