module.exports = function ($scope, $http) {
    $scope.subs = {};

    $http.get('api/alevel-resources-worksheets.php').then(function (res) {
        res.data.worksheets.forEach(function (worksheet) {
            if ($scope.subs[worksheet.subject] === undefined) {
                $scope.subs[worksheet.subject] = [];
            }

            $scope.subs[worksheet.subject].push(worksheet);
        });
    });
};