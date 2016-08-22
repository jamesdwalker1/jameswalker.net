module.exports = function ($scope, $location, $timeout) {
    $scope.switch = function (page) {
        document.getElementById('home').className = 'animated fadeOutDown';

        $timeout(function () {
            if (page === 'alevelnotes') {
                $location.url('/alevel/notes/');
            } else if (page === 'alevelresources') {
                $location.url('/alevel/resources/');
            }
        }, 150);
    };
};