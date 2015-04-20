'use strict'

define(['factories', 'lodash'], function (factories, _) {
    factories.factory('PropertyReapeatCounter', [

        function () {
            function PropertyReapeatCounter(txt, ignoredElements) {

                // remove line breaks and uppercase characters make lower case
                var text = txt.toLowerCase().replace(/(\r\n|\n|\r)/gm,""),
                    splitedText,
                    self = this;
                this.data = {};
                this.filteredData = {};

                this.insert = function (value) {
                    if (!value) {
                        return;
                    }
                    if (self.data[value]) {
                        self.data[value]++;
                    } else self.data[value] = 1;
                }
                this.filterByKey = function (key) {
                    this.filteredData = {};

                    _.each(self.data, function (element, index) {
                        if (element >= key) {
                            self.filteredData[index] = element;
                        }
                    });
                };
                this.countFilterByKey = function (key) {
                    var filteredData = {};

                    _.each(self.data, function (element, index) {
                        if (element >= key) {
                            filteredData[index] = element;
                        }
                    });
                    return filteredData;
                }
                
                    //******* for problem 2001   *****************
                //text = text.replace(/a1|b1|a2|b2|a3|b3/g, 'ai');
                    //********************************************

                // If ignoredElements are provided then would be replaced by space
                _.each(ignoredElements, function(ignoredElement){
                    text = text.replace(new RegExp(ignoredElement, 'g'), ' ');
                });

                splitedText = text.split(/[\s\.\(\),]+/);
                _.each(splitedText, function (element) {
                    self.insert(element);
                });

            }

            return PropertyReapeatCounter;
        }
    ]);
});