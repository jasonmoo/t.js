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
		valregex = /\{\{([=%#])(.+?)\}\}/g;

	function t(template) {
		this.t = template;
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
				if (meta=='#') {
					var fn=key.split('|');
				    key=fn[0];
				    var	val=get_value(vars,key);
					if (fn.length>1){
					    var	methods=fn[1].split(',');
					    var j=methods.length;
					    var i=0;
						while(i<j){
							if (t.hasOwnProperty(methods[i])) {
								val=t[methods[i++]](val);

							};
						};
					}
					return val;
				};

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
	
	t.prototype.register = function(fname, fn) {
        if(t.hasOwnProperty(fname)) {
            return false;
        }
        return t[fname]=fn;
    };

    t.prototype.unregister = function(fname) {
        if(t.hasOwnProperty(fname)) {
            return delete t[fname];
        }
    };

	window.t = t;

})();
