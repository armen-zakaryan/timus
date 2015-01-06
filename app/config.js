'use strict';
//2001
define([], function() {
    return {
        DEVELOPMENT: {
            timus_base_url: 'http://acm.timus.ru/problem.aspx?space=1&num=',
            timus_default: 1401
        },

        PRODUCTION: {
            base_url: ''
        }
    };
});