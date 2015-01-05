require.config({
    paths: {
        'angular': '../bower_components/angular/angular',
        'angularResource': '../bower_components/angular-resource/angular-resource',
        'jquery': '../node_modules/jquery/dist/jquery.min',
        'lodash': '../node_modules/lodash/dist/lodash.min'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularResource': ['angular']
    },
    priority: [
        "angular"
    ]
});

/*
require(['jquery', 'API'], function($, API) {

    //If Not specified input field then loads the first page of the Timus website
    var websiteUrl = $('#url').val() || 'http://acm.timus.ru/problem.aspx?space=1&num=1401'
    API.loadPage(websiteUrl);
*/
/*
    $('#load').on('click', function() {
        API.loadPage(websiteUrl);
    });
    */
/*
});
*/

window.name = "NG_DEFER_BOOTSTRAP!";
require([
    'jquery',
    'angular',
    'app'
], function($, angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    $.support.cors = true;
    angular.element().ready(function() {
        angular.resumeBootstrap([app['name']]);
    });
});