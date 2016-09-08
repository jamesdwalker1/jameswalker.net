const configureAce = require('../../../editor/aceConfig');

module.exports = function ($scope, $http) {
    const aceEditor = configureAce('worksheet');
    aceEditor.getSession().on('change', update);

    $scope.ABoundary = '80%';
    $scope.BBoundary = '70%';

    // TODO: preview
    // TODO: saving
}