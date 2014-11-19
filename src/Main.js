requirejs.config({
    paths: {
        'jquery': '../node_modules/jquery/dist/jquery.min',
        'lodash': '../node_modules/lodash/dist/lodash.min'
    }
});

require(['jquery', 'API'], function($, API) {

    //If Not specified input field then loads the first page of the Timus website
    var websiteUrl = $('#url').val() || 'http://acm.timus.ru/problem.aspx?space=1&num=1401'
    API.loadPage(websiteUrl);

    /*
    $('#load').on('click', function() {
        API.loadPage(websiteUrl);
    });
    */

});