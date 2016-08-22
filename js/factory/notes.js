const Parser = require('../parser');

module.exports = function ($http) {

    let fetches = {}; // endpoint -> fetches from server (not cache)

    // callback = error first (node.js style)
    function loadEndpoint(endpoint, callback) {
        const cached = localStorage.getItem(endpoint);

        if (cached !== null) {
            callback(null, JSON.parse(cached));
        }

        $http.get(endpoint).then(function (res) {
            callback(null, res.data); // call callback again (update)

            const string =  JSON.stringify(res.data);
            if (string.length < 100000) { // localStorage has a size limit
                localStorage.setItem(endpoint, string);
            }
        }, function (err) {
            if (!cached) {
                callback(err);
            }
        });
    };

    return {
        getModuleList: function (callback) {
            const self = this;

            loadEndpoint('api/alevel-modules.php', function (err, data) {
                if (!err) {
                    return callback(data.modules);
                }

                setTimeout(function () {
                    self.getModuleList(callback);
                }, 5000);
            });
        },

        getHTML: function (filename, callback) {
            const self = this;

            const path = `api/alevel-module.php?name=${filename}`;
            loadEndpoint(path, function (err, data) {
                if (!err) {
                    const parser = new Parser();
                    parser.setMarkup(data.file);
                    return parser.toHTML(callback);
                }

                setTimeout(function () {
                    self.getHTML(filename, callback);
                }, 5000);
            });
        }
    }
};