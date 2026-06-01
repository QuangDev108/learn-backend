const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

//Cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});
//End Cloudinary configuration

module.exports.upload = function (req, res, next) {
       if(req.file) {
            let streamUpload = (req) => {
            return new Promise((resolve, reject) => {

                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        }
                        else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.secure_url; 
            // req.body.thumbnail = req.file ? `/uploads/${req.file.filename}` : "";
            next();
        }
        upload(req);
    } else {
        next();
    } 
}