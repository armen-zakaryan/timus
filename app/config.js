'use strict';
//2001
define([], function() {
    return {
        DEVELOPMENT: {
            INDEXES_NAMES: 10, //12,
            INDEXES_ITERATION_LOWER_BOUND: 3,
            timus_base_url: 'http://acm.timus.ru/problem.aspx?space=1&num=',
            timus_default: 1573, //1572, //1348, //1567, //1401, 1409 2001
            possibleTypes: ['string', 'integer', 'double', 'word'],
            wordsToIgnore: [ ' length ', ' length\\.', 'i\\.e\\. ',
                '<', '>', '=', '!=', '==', '≥', '≤', '“', '”', '-', ' — ', ' _ ', ';', ' is ', ' are ', ' has ', ' have ', ' had ', ' was ', ' were ', ' in ', '\"',
                ' are ', ' all ', ' been ', ' to ', ' and ', ' or ', ' of ', ' a ', ' an ', ' the ', 'the ', ' there ', ' can ', ' can\\.', ' be ', ' by ', ' that ', ' this ',
                ' on ', ' than ', ' then ', ' from ', ' get ', ' got ', ' how ', ' many ', ' some ', ' at ', ' they ', ' you ', ' his ', ' her ', ' he ', ' she ', ' their ',
                ' which ', ' which, ', ' for ', ' after ', ' before ', ' it ', ' will ', ' would ', ' should ', ' must ', ' because,', 'because,', ' any ',
                ' however ', ' however, ', ' not ', ' again ', ' as ', ' now ', ' need ', ' but ', ' more ', ' most ', ' if '
            ]
        },
        
        PRODUCTION: {
            base_url: ''
        }
    };
});
