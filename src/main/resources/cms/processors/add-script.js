var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/thymeleaf')
};

var view = resolve('add-script.html');


exports.responseProcessor = function (req, res) {

	var siteConfig = libs.portal.getSiteConfig();

	// If no pixel code added to app, send null so that no script will be generated.
	var params = {
		pixelCode : siteConfig.pixelCode
	};

	var metadata = libs.thymeleaf.render(view, params);

	// Force arrays since single values will be return as string instead of array
	var headEnd = res.pageContributions.headEnd;
	var normalizedHeadEnd = headEnd == null ? [] : (Array.isArray(headEnd) ? headEnd : [headEnd]);
	if (metadata != null) {
		normalizedHeadEnd.push(metadata);
	}
	res.pageContributions.headEnd = normalizedHeadEnd;

	// Add ?debug=true to URL to disable this script-filter.
	if (req.params) {
		if (req.params.debug === 'true') {
			res.applyFilters = false;
		}
	}

	return res;
};
