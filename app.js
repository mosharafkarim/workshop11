const express=require('express');
const multer=require('multer');
const ejs=require('ejs');
const path=require('path');

//Set Storage Engine
const storage=multer.diskStorage({
    destination:'./public/uploads',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
}) 

//Init Upload
const upload=multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('myimage')

//Check File Type
function checkFileType(file,cb){
    // Allowed extension 
    const filetypes= /jpeg|jpg|png/
    //check text
    const extname= filetypes.test(path.extname(file.originalname).toLowerCase())
    //check mime
    const mimetype=filetypes.test(file.mimetype)

    if(extname && mimetype){
        return cb(null,true)
    }else{
        cb('Error:Images only')
    }
}

//Init app
const app=express();
//Ejs
app.set('view engine','ejs');
//Public folder
app.use(express.static('./public'));


app.get('/', (req,res) => res.render('index'));

let n=Math.floor(Math.random*100)

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg:err
            })
        }else{
            console.log(req.file)
            res.send('test')
        }
    })
})

const PORT=3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));