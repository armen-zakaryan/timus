'use strict'

define(['factories', 'lodash'], function (factories, _) {
    factories.factory('PropertyReapeatCounter', [

        function () {
            function PropertyReapeatCounter(txt, ignoredElements) {
                var text = txt.toLowerCase(),
                    splitedText,
                    self = this;
                this.data = {},
                this.sortedData = [];
                this.filteredData = {};
                this.sortetFilteredData = [];


                this.insert = function (value) {
                    if (!value) {
                        return;
                    }
                    if (self.data[value]) {
                        self.data[value]++;
                    } else self.data[value] = 1;
                }
                this.filterByKey = function (key) {
                    self.filteredData = {};
                    self.sortetFilteredData = [];

                    _.each(self.data, function (element, index) {
                        if (element >= key) {
                            self.filteredData[index] = element;
                        }
                    });
                    _.each(self.sortedData, function (element, index) {
                        if (element.frequency >= key) {
                            self.sortetFilteredData.push(element);
                        }
                    });
                }

                if (ignoredElements) {
                    text = text.replace(new RegExp(ignoredElements.join('|'), 'g'), ' ');
                }

                splitedText = text.split(/[\s\.\(\),]+/);

                _.each(splitedText, function (element) {
                    self.insert(element);
                });

                _.each(self.data, function (element, index) {
                    self.sortedData.push({
                        frequency: element,
                        value: index
                    });
                });

                //Sort from bigest to lowest frequency
                self.sortedData.sort(function (x, y) {
                    return y.frequency - x.frequency;
                });

            }

            return PropertyReapeatCounter;
        }
    ]);
});