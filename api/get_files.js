var uploadcare = require('uploadcare')(process.env.UPLOAD_CARE_PUBLIC, process.env.UPLOAD_CARE_KEY),
fs = require('fs');
module.exports = (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 100;
    res.setHeader('content-type', 'application/json');
    uploadcare.files.list({page, limit}, (error, data) => {
        if(error){
            
            res.send(JSON.stringify(data));
        }
        else{
            const images = data.results.map(i => {
                return {
                    url: i.url,
                    uuid: i.uuid,
                    description: "no description",
                    category: "uknown",
                    created_at: i.datetime_uploaded
                }
            });
            res.send(JSON.stringify(images));
        }
        console.log('error', error);
        console.log('data', data);
    });
}