var uploadcare = require('../lib/main')(process.env.UPLOAD_CARE_PUBLIC, private.env.UPLOAD_CARE_KEY),
fs = require('fs');
module.exports = (req, res) => {
    console.log("test");
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 1;
    uploadcare.files.list({page, limit}, (resp, error) => {
        console.log('resp', resp);
        console.log('error', error);
        res.send(`Hello!`)
    });
}