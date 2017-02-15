function LogUpdater() {
}

LogUpdater.prototype.update = function(onSuccess, onError) {
	var log = $("p#log");
	log.text("Making request...");

	new Reviewer({
		url: "http://android.com",
		useCorsProxy: true,
		fields: [
			"title",
			"description"
		],
		getFieldValue: function(fieldIndex, htmlString) {
			switch (fieldIndex) {
				case 0:
					var html = $.parseHTML(htmlString);
					var element = $(html).find("div.l-section__intro h2").first();
					var text = element.text();
					return text;
				case 1:
					var html = $.parseHTML(htmlString);
					var element = $(html).find("div.l-section__intro p").first();
					var text = element.text();
					return text;
				default:
					break;
			}
		},
		onSuccess: function(content) {
			var report = "Title: " + content.title + "<br/>" + "Description: " + content.description;
			log.html(report);

			onSuccess();
		},
		onError: function(content) {
			var report = "Error";
			log.html(report);

			onError();
		}
	}).start();
}

$(document).ready(function() {

	$("#update-button").click(function() {
		new LogUpdater().update(function() {
		}, function() {
		});
	});

});
