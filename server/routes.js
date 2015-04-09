var jf = require('jsonfile'),
    mkdirp = require('mkdirp'),
    basePath = "./server/files/";

jf.spaces = 4;

function routes(app) {

    app.post('/export', function (req, res) {
        var problem = req.body.problem,
            fileName = req.body.fileName,
            dataToExport = req.body.data;

        mkdirp(basePath + problem, function (err, success) {
            var message;
            // path was created unless there was error
            if (!err) {
                if (success) {
                    message = "New directory " + problem + " plus " + fileName + " are created"
                } else {
                    message = fileName + " is successfuly Created inside existing folder " + problem;
                }
                jf.writeFile(basePath + '/' + problem + '/' + fileName + '.txt', dataToExport, function (err) { //json file has four space indenting now
                    if (!err) {
                        res.status(200).json(message);
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
                res.status(501).send('Not Implemented');
            }
        });
    });
}

module.exports.routes = routes;