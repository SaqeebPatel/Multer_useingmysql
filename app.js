const express= require('express');
const multer = require('multer');
const db= require('./db');

const app = express();
const PORT=8000;


const storage = multer.diskStorage({
    destination: './upload',
    filename:(req, file, cb)=> {
        cb(null,`${Date.now()}-${file.originalname}`)
    }
    
});

const upload = multer({storage});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    const {filename, path, originalname, mimetype, size}=req.file;
    
    queryForInsert='insert into files (filename, path, originalname, mimetype, size) VALUES(?,?,?,?,?)';

    db.query(queryForInsert,[filename, path, originalname, mimetype, size], (err) => {
        if (err) {
            // return res.status(500);
            console.log(err);
        }
        res.status(201).send(`File Uploaded: ${filename}`)
    });
    
});    


  app.get('/download/:filename', (req,res)=>{
    const sql = 'select * from files where filename=?';

    db.query(sql,[req.params.filename],(err,results)=>{
        if(err){
            return res.status(500).send('Error in retrieving file');
        }
        if(results.length === 0){
            return res.status(404).send('File not found');
    }
    const file = results[0];
    res.download(file.path,file.filename);
    });
});
  

 
app.post('/uploadmul', upload.array('files', 12), (req, res) => {
    const files = req.files;
    console.log(req.files);
    
    if (!files || files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const queryForInsert = 'INSERT INTO files (filename, path, originalname, mimetype, size) VALUES ?';
    const values = files.map(file => [file.filename, file.path, file.originalname, file.mimetype, file.size]);

    db.query(queryForInsert, [values], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error uploading files');
        }
        res.status(201).send('Files uploaded successfully');
    });
});
    
    
    app.listen(PORT, (req, res)=> {
        console.log(`server is running on port ${PORT}`);
    });
