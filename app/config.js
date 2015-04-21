'use strict';
//2001
define([], function() {
    return {
        DEVELOPMENT: {
            INDEXES_NAMES: 4,
            timus_base_url: 'http://acm.timus.ru/problem.aspx?space=1&num=',
            timus_default: 1409, //1567, //1401, 1409 2001
            possibleTypes: ['string', 'integer', 'double', 'word'],
            wordsToIgnore: [
                '<', '>', '=', '!=', '==', '≥', '≤', '-', ' — ', ' _ ', ';', ' is ', ' are ', ' has ', ' have ', ' had ', ' was ', ' were ', ' in ',
                ' are ', ' all ', ' to ', ' and ', ' or ', ' of ', ' a ', ' the ', 'the ', ' there ', ' can ', ' can\\.', ' be ', ' by ', ' that ', ' this ',
                ' on ', ' than ', ' then ', ' from ', ' get ', ' got ', ' how ', ' many ', ' some ', ' at ', ' they ', ' you ', ' his ', ' her ', ' he ', ' she ', ' their ',
                ' which ', ' which, ', ' for ', ' after ', ' before ', ' it ', ' will ', ' would ', ' should ', ' must '
            ]
        },
        
        PRODUCTION: {
            base_url: ''
        }
    };
});
