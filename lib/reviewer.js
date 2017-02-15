/********************************
 * Reviewer configuration class.
 ********************************/

function ReviewerConfiguration() {

	this.url = null;

	/**
	 * Array of field names.
	 * 
	 * Example:
	 * 
	 * ["title", "description"]
	 */
	this.fields = [];

	/**
	 * Defines whether to use CORS proxy.
	 */
	this.useCorsProxy = true;

	/**
	 * Returns field's value.
	 */
	this.getFieldValue = function(fieldIndex, htmlString) {
		return null;
	};

	this.onSuccess = function(content) {
	};

	this.onError = function() {
	};

}

/********************************
 * Reviewer class.
 ********************************/

/*
 * Implements scraper functionality for single page.
 * 
 * Example of usage:
 * 
 * new Reviewer({
 * 		url: "http://microsoft.com",
 * 		fields: [
 * 			"title",
 * 			"description"
 * 		],
 * 		getFieldValue: function(fieldIndex, data) {
 * 			switch (fieldIndex) {
 * 				case 0:
 * 					// Obtain title from page
 * 					return $("body p#title").text();
 * 				case 1:
 * 					// Obtain description from page
 * 					return $("body p#description").text();
 * 				default:
 * 					return null;
 * 			}
 * 		},
 * 		onSuccess: function(content) {
 * 			log("Result content: " + content);
 * 		},
 * 		onError: function() {
 * 			log("Failed request.");
 * 		}
 * }).start();
 */
function Reviewer(configuration) {
	
	this._configuration = configuration;
	
}

Reviewer.prototype.getConfiguration = function() {
	return this._configuration;
}

Reviewer.prototype._urlWithCrossDomainProxy = function(sourceUrl) {
	return "https://cors-anywhere.herokuapp.com/" + sourceUrl;
}

/*
 * Starts scraping process.
 */
Reviewer.prototype.start = function() {
	var reviewerConfiguration = this.getConfiguration();
	
	var sourceUrl = this.getConfiguration().url;
	var actualUrl = this.getConfiguration().useCorsProxy ? this._urlWithCrossDomainProxy(sourceUrl) : sourceUrl;

	var ajaxConfiguration = {
		url: actualUrl,
		method: "GET",
		cache: false,
		crossDomain: true,
		success: function (htmlString) {
			var resultContent = {};
			var numberOfFields = reviewerConfiguration.fields.length;

			for (var fieldIndex = 0; fieldIndex < numberOfFields; fieldIndex++) {
				var fieldName = reviewerConfiguration.fields[fieldIndex];
				var fieldValue = reviewerConfiguration.getFieldValue(fieldIndex, htmlString);
				resultContent[fieldName] = fieldValue;
			}

			reviewerConfiguration.onSuccess(resultContent);
		},
		error: function() {
			reviewerConfiguration.onError();
		}
	};

	$.ajax(ajaxConfiguration);
};
