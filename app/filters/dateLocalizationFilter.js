define(['filters', 'moment'], function(filters, moment) {
    filters.filter('dateLocalizationFilter', ['LocaleSvc',
        function(localeService) {
            return function(date) {
                moment.lang(localeService.getCurrentLocale().key);
                return moment(date).format("DD MMMM gggg, h:mm A");
            }
        }
    ]);
});