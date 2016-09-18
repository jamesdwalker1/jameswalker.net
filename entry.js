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
    .when('/upload/', {
        templateUrl: 'pages/upload/upload.html',
        controller: 'upload'
    })
    .when('/card-editor/', {
        templateUrl: 'pages/cardEditor/cardEditor.html',
        controller: 'cardEditor'
    })

    .when('/alevel/notes/', {
        templateUrl: 'pages/alevel/notes/main/main.html',
        controller: 'alevelNotesMain'
    })
    .when('/alevel/notes/:filename/viewer/', {
        templateUrl: 'pages/alevel/notes/module/module.html',
        controller: 'alevelNotesModule'
    })

    .when('/alevel/resources/', {
        templateUrl: 'pages/alevel/resources/main/main.html',
        controller: 'alevelResourcesMain'
    })
    .when('/alevel/resources/:filename/viewer/', {
        templateUrl: 'pages/alevel/resources/viewer/viewer.html',
        controller: 'alevelResourcesViewer'
    })
    .when('/alevel/resources/editor/', {
        templateUrl: 'pages/alevel/resources/editor/editor.html',
        controller: 'alevelResourcesEditor'
    })
}]);

app.controller('mainController', require('./js/mainController'));

app.controller('home', require('./pages/home/home'));

app.controller('alevelNotesMain', require('./pages/alevel/notes/main/main'));
app.controller('alevelNotesModule', require('./pages/alevel/notes/module/module'));

app.controller('alevelResourcesMain', require('./pages/alevel/resources/main/main'));
app.controller('alevelResourcesEditor', require('./pages/alevel/resources/editor/editor'));
app.controller('alevelResourcesViewer', require('./pages/alevel/resources/viewer/viewer'));

app.controller('editor', require('./pages/editor/editor'));
app.controller('upload', require('./pages/upload/upload'));
app.controller('cardEditor', require('./pages/cardEditor/cardEditor'));


app.factory('Notes', require('./js/factory/notes.js'));