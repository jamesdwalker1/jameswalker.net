require('./css/main.css');

const angular = require('angular');
require('angular-route');

const app = angular.module('jwnet', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/home/home.html',
        controller: 'home'
    })

    .when('/editor/', {
        templateUrl: 'pages/editor/editor.html',
        controller: 'editor'
    })

    .when('/alevel/notes/', {
        templateUrl: 'pages/alevel/notes/main/main.html',
        controller: 'alevelNotesMain'
    })
    .when('/alevel/notes/:filename/viewer/', {
        templateUrl: 'pages/alevel/notes/module/module.html',
        controller: 'alevelNotesModule'
    })
}]);

app.controller('mainController', require('./js/mainController'));

app.controller('home', require('./pages/home/home'));

app.controller('alevelNotesMain', require('./pages/alevel/notes/main/main'));
app.controller('alevelNotesModule', require('./pages/alevel/notes/module/module'));

app.controller('editor', require('./pages/editor/editor'));


app.factory('Notes', require('./js/factory/notes.js'));