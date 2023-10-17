/*
		 _     _
		| |   (_)
		| |_   _ ___
		| __| | / __|
		| |_ _| \__ \
		 \__(_) |___/
		     _/ |
		    |__/

	t.js
	a micro-templating framework in ~400 bytes gzipped

	@author  Jason Mooberry <jasonmoo@me.com>
	@license MIT
	@version 0.1.0

*/
(function() {

	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
		valregex = /\{\{([=%])([\.\w]+?)\s*(\|\s*([\w,]+))?\s*\}\}/g;

	function t(template, formatters) {
		this.t = template;
		this.f = formatters || {};
	}

	function scrub(val) {
		return new Option(val).innerHTML.replace(/"/g,"&quot;");
	}

	function get_value(vars, key) {
		var parts = key.split('.');
		while (parts.length) {
			if (!(parts[0] in vars)) {
				return false;
			}
			vars = vars[parts.shift()];
		}
		return vars;
	}

	function render(fragment, vars, formatters) {
		return fragment
			.replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {

				var val = get_value(vars,key), temp = "", i;

				if (!val) {

					// handle if not
					if (meta == '!') {
						return render(inner, vars, formatters);
					}
					// check for else
					if (has_else) {
						return render(if_false, vars, formatters);
					}

					return "";
				}

				// regular if
				if (!meta) {
					return render(if_true, vars, formatters);
				}

				// process array/obj iteration
				if (meta == '@') {
					// store any previous vars
					// reuse existing vars
					_ = vars._key;
					__ = vars._val;
					for (i in val) {
						if (val.hasOwnProperty(i)) {
							vars._key = i;
							vars._val = val[i];
							temp += render(inner, vars, formatters);
						}
					}
					vars._key = _;
					vars._val = __;
					return temp;
				}

			})
			.replace(valregex, function (_, meta, key, __, fns = '') {
				const val = fns
					.split(',')
					.reduce(
						function (val, fn) {
							return typeof formatters[fn] == 'function' ? formatters[fn](val) : val
						},
						get_value(vars, key)
					);

				if (val || val === 0) {
					return meta == '%' ? scrub(val) : val;
				}
				return "";
			});
	}

	t.prototype.render = function (vars) {
		return render(this.t, vars, this.f);
	};

	window.t = t;

})();
