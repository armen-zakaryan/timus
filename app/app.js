'use strict';

define([
    'angular',
    'config',
    'angularResource',
    'filters',
    'services',
    'factories',
    'directives',
    'controllers',
    'controllers/RootCtrl',
    'directives/problem-statement/problem-statement',
    'directives/input/input-analizer',
    'directives/word-counter/word-counter',
    'directives/word-counter/word-counter-item',
    'directives/output/output-analizer',
    'directives/sentances/sentance-container',
], function (angular, config) {
    var app = angular.module('timusAnalizer', [
        'ngResource',
        'timusAnalizer.filters',
        'timusAnalizer.services',
        'timusAnalizer.factories',
        'timusAnalizer.directives',
        'timusAnalizer.controllers'
    ]);
    var ENV = config.DEVELOPMENT;
    app.constant('config', ENV);

    return app;
});