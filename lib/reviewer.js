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
	 * Enabled by default.
	 */
	this.useCorsProxy = true;

	/**
	 * Returns field's value.
	 */
	this.getFieldValue = function(fieldIndex, htmlString) {
		return null;
	};

	/**
	 * Called when request has finished successfully and
	 * all required fields are obtained.
	 */
	this.onSuccess = function(content) {
	};

	/**
	 * Called when request has finished with error.
	 */
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
	
	/**
	 * Initialize configuration.
	 */
	this._configuration = configuration;

	/**
	 * Initialize reference to current request.
	 */
	this._currentRequest = null;
	
}

/**
 * Returns reviewer's configuration.
 */
Reviewer.prototype.getConfiguration = function() {
	return this._configuration;
}

/**
 * Returns URL converted for usage with CORS proxy.
 */
Reviewer.prototype._convertUrlForUsageWithCorsProxy = function(sourceUrl) {
	return "https://cors-anywhere.herokuapp.com/" + sourceUrl;
}

/*
 * Starts review process.
 */
Reviewer.prototype.start = function() {
	/**
	 * Obtain reviewer's configuration.
	 */

	var reviewerConfiguration = this.getConfiguration();

	/**
	 * Obtain actual URL (formatted for usage with CORS proxy if needed).
	 */
	
	var sourceUrl = this.getConfiguration().url;
	var actualUrl = this.getConfiguration().useCorsProxy ? this._convertUrlForUsageWithCorsProxy(sourceUrl) : sourceUrl;

	/**
	 * Create AJAX configuration object.
	 */

	var ajaxConfiguration = {
		url: actualUrl,
		method: "GET",
		cache: false,
		crossDomain: true,
		success: function (htmlString) {
			/**
			 * Nullify reference to current request.
			 */
			
			this._currentRequest = null;

			/**
			 * Obtain result content.
			 */

			var resultContent = {};
			var numberOfFields = reviewerConfiguration.fields.length;

			for (var fieldIndex = 0; fieldIndex < numberOfFields; fieldIndex++) {
				var fieldName = reviewerConfiguration.fields[fieldIndex];
				var fieldValue = reviewerConfiguration.getFieldValue(fieldIndex, htmlString);
				resultContent[fieldName] = fieldValue;
			}

			/**
			 * Share event.
			 */

			reviewerConfiguration.onSuccess(resultContent);
		},
		error: function() {
			/**
			 * Nullify reference to current request.
			 */

			this._currentRequest = null;

			/**
			 * Share event.
			 */

			reviewerConfiguration.onError();
		}
	};

	/**
	 * Start request.
	 */

	var request = $.ajax(ajaxConfiguration);
	
	/**
	 * Update reference to current request.
	 */
	
	this._currentRequest = request;

	/**
	 * Return result.
	 */

	return request;
};

/**
 * Cancels current review process.
 */
Reviewer.prototype.cancel = function() {
	if (this._currentRequest && this._currentRequest.abort) {
		this._currentRequest.abort();
		this._currentRequest = null;
	}
}
