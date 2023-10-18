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
		valregex = /\{\{([=%])(.+?)\}\}/g;

	function t(template) {
		this.t = template;
	}

	function scrub(val) {
		return new Option(val).innerHTML.replace(/"/g,"&quot;");
	}

	function get_value(vars, key) {
		return key
    .split('.')
    .reduce(
      (out, part) => (out instanceof Map ? out.get(part) : out[part]) ?? false,
      vars
    );
	}

	function render(fragment, vars) {
		return fragment
			.replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {

				var val = get_value(vars,key), temp = "", i;

				if (!val) {

					// handle if not
					if (meta == '!') {
						return render(inner, vars);
					}
					// check for else
					if (has_else) {
						return render(if_false, vars);
					}

					return "";
				}

				// regular if
				if (!meta) {
					return render(if_true, vars);
				}

				// process array/obj iteration
				if (meta == '@') {
          return Array.from(
						!!val?.[Symbol.iterator] ? val.entries() : Object.entries(val), 
						([_key, _val]) => render(
              inner,
              {
                ...vars,
                _key,
                _val,
              }
            )
          ).join('');
				}	
			})
			.replace(valregex, function(_, meta, key) {
				var val = get_value(vars,key);

				if (val || val === 0) {
					return meta == '%' ? scrub(val) : val;
				}
				return "";
			});
	}

	t.prototype.render = function (vars) {
		return render(this.t, vars);
	};

	window.t = t;

})();
