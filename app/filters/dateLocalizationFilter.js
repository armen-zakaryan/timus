define(['filters'], function (filters) {
    filters.filter('filterName', [

        function () {
            return function (data) {
                return data;
            }
        }
    ]);
});