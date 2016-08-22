module.exports = function ($scope, $routeParams, Notes, $timeout) {
    const container = document.getElementById('note-container');

    function load() {
        Notes.getHTML($routeParams.filename, function (html) {
            container.innerHTML = html;
            container.className = 'viewer animated zoomIn';
        });
    }

    load();
    setInterval(load, 60000);

    $scope.print = function () {
        window.print();
    }

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
}