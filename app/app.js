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
    'directives/input/input-analizer',
    'directives/output/output-analizer'
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