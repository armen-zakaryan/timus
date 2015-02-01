require.config({
    paths: {
        'angular': '../bower_components/angular/angular',
        'angularResource': '../bower_components/angular-resource/angular-resource',
        'bootstrap': "../bower_components/bootstrap/dist/js/bootstrap.min",
        'jquery': '../node_modules/jquery/dist/jquery.min',
        'lodash': '../node_modules/lodash/dist/lodash.min'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'angularResource': ['angular']
    },
    priority: [
        "angular"
    ]
});

window.name = "NG_DEFER_BOOTSTRAP!";
require([
    'jquery',
    'angular',
    'app',
    'bootstrap'
], function ($, angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $.support.cors = true;
    angular.element().ready(function () {
        angular.resumeBootstrap([app['name']]);
    });
});