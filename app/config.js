'use strict';
//2001
define([], function () {
    return {
        DEVELOPMENT: {
            timus_base_url: 'http://acm.timus.ru/problem.aspx?space=1&num=',
            timus_default: 1567, //1401,
            possibleTypes: ['string', 'integer', 'double', 'word']
        },

        PRODUCTION: {
            base_url: ''
        }
    };
});