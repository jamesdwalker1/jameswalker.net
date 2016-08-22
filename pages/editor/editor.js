const Parser = require('../../js/parser.js');
const parser = new Parser();

const configureAce = require('./aceConfig.js');

module.exports = function ($scope, $http, Notes) {
    alert('To save changes, please enter your password at the top right.');

    const aceEditor = configureAce();
    aceEditor.getSession().on('change', update);

    $scope.passwordColour = 'darkred';
    $scope.passwordChange = function () {
        $http.post('api/check-password.php', { pw: $scope.password }).then(function (res) {
            if (res.data.correct) {
                $scope.passwordColour = 'green';
            } else {
                $scope.passwordColour = 'darkred';
            }
        });
    }

    $scope.saved = false;
    $scope.fileViewer = false;

    const preview = document.getElementById('preview-document');

    function update(callback) {
        parser.setMarkup(aceEditor.getValue());
        parser.toHTML(function (html) {
            preview.innerHTML = html;

            if (typeof callback === 'function') {
                callback();
            }
        });
    };
    update();

    $scope.manualUpdate = function () {
        parser.clearCache();

        update(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        });
    }

    function sentenceCase(str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
    }

    function fileExists(filename, callback) {
        $http.get('api/alevel-modules.php').then(function (res) {
            let exists = false;
            res.data.modules.forEach(function (module) {
                if (module.filename === filename) {
                    exists = true;
                }
            });

            if (exists) {
                return callback('Error - file already exists');
            }

            callback(null);
        }, function () {
            callback('Connection error - could not save');
        });
    }

    $scope.save = function () {
        const subject = sentenceCase(prompt('Enter subject:'));
        const module = prompt('Enter module name:');
        const filename = `${subject};${module}.jwmkp`;

        fileExists(filename, function (err) {
            if (err) {
                return alert(err);
            }

            const url = `api/alevel-save.php?filename=${filename}`;
            const params = { text: aceEditor.getValue(), pw: $scope.password };
            $http.post(url, params).then(function (res) {
                if (res.data === 'Success') {
                    $scope.saved = true;
                    $scope.openFilename = filename;
                }

                alert(res.data);
            }, function () {
                alert('Connection error - could not save');
            });
        });
    };

    $scope.load = function () {
        $scope.fileViewer = true;

        $http.get('api/alevel-modules.php').then(function (res) {
            $scope.files = res.data.modules;
        }, function () {
            callback('Connection error - could not list files');
        });
    };

    $scope.openFilename = '';
    $scope.open = function (filename) {
        $scope.fileViewer = false;
        $scope.openFilename = filename;

        const url = `api/alevel-module.php?name=${filename}`;
        $http.get(url).then(function (res) {
            aceEditor.setValue(res.data);
            update();
            $scope.saved = true;
        });
    };

    let savedMarkup = '';
    function autoSave() {
        if (savedMarkup === aceEditor.getValue() || !$scope.openFilename) {
            return;
        }

        const url = `api/alevel-save.php?filename=${$scope.openFilename}`;
        const params = { text: aceEditor.getValue(), pw: $scope.password };
        $http.post(url, params).then(function (res) {
            if (res.data === 'Success') {
                savedMarkup = aceEditor.getValue();
            }
        });
    }
    setInterval(autoSave, 15000);

    // Clicking blue markers to go to that section in the left panel
    setInterval(function () {
        document.querySelectorAll('.marker').forEach(function (marker) {
            marker.onclick = function (e) {
                const name = e.target.innerHTML;
                aceEditor.find(`[marker]${name}[/marker]`, {
                    start: 0
                });
                aceEditor.findNext();
            };
        });
    }, 5000);
}