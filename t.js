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
(function(undefined) {

	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
		valregex = /\{\{([=%])(.+?)\}\}/g, s=String;

	function t(template) {
		this.t = template;
	}

	function scrub(val) {
		return s(val).replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
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
					return render(has_else ? if_true : inner, vars);
				}
				
				// process array/obj iteration
				if (meta == '@' && val) {
					for (i in val) {
						if (val.hasOwnProperty(i)) {
							vars._key = i;
							vars._val = val[i];
							temp += render(inner, vars);
						}
					}
					delete vars._key;
					delete vars._val;
					return temp;
				}

			})
			.replace(valregex, function(_, meta, key) {
				var val = get_value(vars,key);

				if (val === undefined || val === null) {
					return "";
				}
				return meta == '%' ? scrub(val) : val;
			});
	}

	t.prototype.render = function (vars) {
		return render(this.t, vars);
	};

	window.t = t;

})();
