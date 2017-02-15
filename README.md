# At a Glance

`Reviewer.js` is a JavaScript framework for scraping web pages.

# How To Get Started

Just copy [lib/reviewer.js](./lib/reviewer.js) file to your project and don't forget to follow dependencies.

# Dependencies

* jQuery 3.1.1 or later.

# Usage

Let's assume we want to obtain title and description from [android.com](http://android.com) website. First of all, we need to take a look at HTML structure of the main page on that website.

So the title is available with `$("div.l-section__intro h2").first()` selector and description is available with `$("div.l-section__intro p").first()` selector.

With `Reviewer.js` it's incredibly easy to obtain this data from the web page:

```javascript
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
			  console.log(report);
		},
		onError: function(content) {
			var report = "Error";
			console.log(report);
		}
}).start();
```

Object of `Reviewer` class takes its configuration as the only one parameter. Inside of configuration you can manage few parameters:

- `url`: The URL of website.
- `useCorsProxy`: Defines whether to use CORS proxy (`true` by default).
- `fields`: The fields to return as a result. There are two fields in the example above (title and description), but their number is not limited at all.
- `getFieldValue`: This function should be implemented by library user. It returns field's value based on field's index and HTML string obtained from web page. You can parse HTML, analyze it, do whatever you want with it, but finally some value should be returned as a result.
- `onSuccess`: Obviously, this method is called when everything is okay and request has finished with non-null content.
- `onError`: Called when request has finished with error.

To send request, just call `start` method as it's shown in the code above. This method returns reference to the request. You can use this reference to cancel request if needed:

```javascript
/*
 * Send request.
 */

var request = new Reviewer({
    /* Configuration... */
}).start();

/*
 * Cancel request.
 */

request.cancel();
```

# Integration with jQuery

`Reviewer.js` uses `jQuery` under the hood, so don't forget to include it in the project.

# Demo

If you want to see how `Reviewer.js` works in real life, pull repository and open [demo/index.html](./demo/index.html) page.

# License

`Reviewer.js` is available under the MIT license. See the [LICENSE](./LICENSE) file for more info.
