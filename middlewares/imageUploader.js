const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({});
const maxFileSize=1024*1024*3;
const fileTypeCheck=(req,file,callback)=>{
    const fileExtension=path.extname(file.originalname).toLocaleLowerCase();
    if(fileExtension==='.png' || fileExtension==='.jpg' || fileExtension==='.jpeg' || fileExtension==='.gif'){
        return callback(null,true);
    }
    else {
        return callback(new Error('Only .png .gif, and .jpg images are allowed'));
    }
};

const upload=multer({
fileSize:maxFileSize,
fileFilter:fileTypeCheck,
storage
})
module.exports=upload;
