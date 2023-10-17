# t.js
## A tiny javascript templating framework in ~400 bytes gzipped

`t.js` is a simple solution to interpolating values in an html string for insertion into the DOM via `innerHTML`.

### Features
 * Simple interpolation: `{{=value}}`
 * Scrubbed interpolation: `{{%unsafe_value}}`
 * Name-spaced variables: `{{=User.address.city}}`
 * Formatted output (see below): `{{=value | formatter1[, formatter2]...}}`
 * If/else blocks: `{{value}} <<markup>> {{:value}} <<alternate markup>> {{/value}}`
 * If not blocks: `{{!value}} <<markup>> {{/!value}}`
 * Object/Array iteration: `{{@object_value}} {{=_key}}:{{=_val}} {{/@object_value}}`
 * Multi-line templates (no removal of newlines required to render)
 * Render the same template multiple times with different data
 * Works in all modern browsers

### How to use

	var template = new t("<div>Hello {{=name}}</div>");
	document.body.innerHtml = template.render({name: "World!"});

### Formatted output

Either value tag, i.e.:`{{=` or `{{%` can have the variable name followed by a vertical bar and one or more formatters separated by commas.  

	var template = new t(
		'<div>Name: {{=user.name}}, age: {{=user.dob | dob2age}}</div>', 
		{
			dob2age: (dob) => Math.floor((Date.now() - dob.getTime()) / 1000 / 60 / 60 / 24 / 365.25)
		}
	);
	document.body.innerHTML = template({name:'Joe', dob: new Date(2000,0,1)});

The formatter functions should be provided along the template as an object containing functions that will receive the value to be formatted and return the formatted value.  The property name for that function, `dob2age`,  is the one used in the template.

Several formatters can be chained, the value of the first served to the next in the chain.

Values need not be limited to simple values but they can be objects as well, a pointless use would be:

	var template = new t(
		'<div>Full Name: {{=user | getFullName}}</div>',
		{
			getFullName: (user) => `${user.firstName} ${user.lastName}`
		}
	)

The test suite contains both simple and complex uses of formatters.

---

For more advanced usage check the [`t_test.html`](https://github.com/jasonmoo/t.js/blob/master/t_test.html).

This software is released under the MIT license.

___

[Coffeescript version](https://github.com/davidrekow/t.coffee) maintained by [@davidrekow](https://github.com/davidrekow)

[PHP version](https://github.com/ramon82/t.php) maintained by [@ramon82](https://github.com/ramon82)
