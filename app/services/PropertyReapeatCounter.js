'use strict'

define(['factories', 'lodash'], function (factories, _) {
    factories.factory('PropertyReapeatCounter', [

        function () {
            function PropertyReapeatCounter(txt, ignoredElements) {

                var text = txt.toLowerCase(),
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

                if (ignoredElements) {
                    text = text.replace(new RegExp(ignoredElements.join('|'), 'g'), ' ');
                }

                splitedText = text.split(/[\s\.\(\),]+/);

                _.each(splitedText, function (element) {
                    self.insert(element);
                });

            }

            return PropertyReapeatCounter;
        }
    ]);
});