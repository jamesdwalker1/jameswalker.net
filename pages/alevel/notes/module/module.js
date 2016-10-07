const WebFont = require('webfontloader');

module.exports = function ($scope, $routeParams, Notes, $timeout, $location) {
    const container = document.getElementById('note-container');

    function load() {
        Notes.getHTML($routeParams.filename, function (html) {
            if (container.innerHTML === html) {
                return; // don't rerender if not changed
            }

            container.innerHTML = html;
            container.className = 'viewer animated zoomIn';

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // render TeX
        });
    }
    load();
    var refresher = setInterval(load, 60000);

    $scope.$on("$destroy", function () {
        clearInterval(refresher);
    });

    // Print button
    $scope.print = function () {
        window.print();
    }

    // Colour options
    const colours = [
        '#F1F1F1',
        '#FFC67E'
    ];
    $scope.bgColour = colours[0];
    $scope.toggleWarm = function () {
        if ($scope.bgColour === colours[0]) {
            $scope.bgColour = colours[1];
        } else {
            $scope.bgColour = colours[0];
        }
    };

    // On desktop, show the toolbar fully for 5 secs before retracting it
    $scope.toolbarDown = true;
    $timeout(function () {
        $scope.toolbarDown = false;
    }, 5000);

    $scope.back = function () {
        container.className = 'viewer animated zoomOutDown';

        $timeout(function () {
            $location.url('/alevel/notes/');
        }, 200);
    };

    // Fonts
    $scope.font = 'Default Font';
    $scope.fontOptions = [
        'Open Sans',
        'Roboto',
        'Roboto Slab',
        'Rubik',
        'Fira Sans',
        'Alegreya',
        'Arvo',
        'Lato',
        'Chelsea Market'
    ];

    $scope.fontChanged = function () {
        localStorage.setItem('viewerFont', $scope.font);

        if ($scope.font === 'Default Font') {
            return container.style.fontFamily = 'inherit';
        }

        WebFont.load({
            google: {
                families: [$scope.font]
            },
            active: function () {
                container.style.fontFamily = $scope.font;
            }
        });
    }

    if (localStorage.getItem('viewerFont') !== null) {
        $scope.font = localStorage.getItem('viewerFont');
        $scope.fontChanged();
    }
}