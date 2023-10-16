# t.js
## A tiny javascript templating framework in ~400 bytes gzipped

`t.js` is a simple solution to interpolating values in an html string for insertion into the DOM via `innerHTML`.

### Features
 * Simple interpolation: `{{=value}}`
 * Scrubbed interpolation: `{{%unsafe_value}}`
 * Name-spaced variables: `{{=User.address.city}}`
 * If/else blocks: `{{value}} <<markup>> {{:value}} <<alternate markup>> {{/value}}`
 * If not blocks: `{{!value}} <<markup>> {{/!value}}`
 * Object/Array iteration (see **Nested Loops** below): `{{@object_value}} {{=_key}}:{{=_val}} {{/@object_value}}`
 * Multi-line templates (no removal of newlines required to render)
 * Render the same template multiple times with different data
 * Works in all modern browsers

### How to use

	var template = new t("<div>Hello {{=name}}</div>");
	document.body.innerHtml = template.render({name: "World!"});

For more advanced usage check the [`t_test.html`](https://github.com/jasonmoo/t.js/blob/master/t_test.html).

### Nested Loops

When looping over the `_val` variable of a deeply nested loop of loops like:

```
{{@_val}} 1
	{{@_val}} 2 
	{{/@_val}} 3 
{{/@_val}} 4
```

the parser cannot match the opening `@_val` with its corresponding `/@_val` picking the first end tag it finds,
that is, it matches `1` with `3` instead of `4`.

To tell them apart, the start and end tags can be followed by a space and a label:

```
{{@_val outer}}
	{{@_val inner}} 
	{{/@_val inner}} 
{{/@_val outer}}
```

See this [Github issue](https://github.com/jasonmoo/t.js/issues/21) for more details.

---

This software is released under the MIT license.

___

[Coffeescript version](https://github.com/davidrekow/t.coffee) maintained by [@davidrekow](https://github.com/davidrekow)

[PHP version](https://github.com/ramon82/t.php) maintained by [@ramon82](https://github.com/ramon82)
