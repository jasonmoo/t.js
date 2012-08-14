class t

  constructor: (template) ->

    @scrub = (val) =>
      return new Option(val).innerHTML

    @get_value = (vars, key) =>
      parts = key.split('.')
      while parts.length
        return false if parts[0] not of vars
        vars = vars[parts.shift()]

        return if typeof vars is 'function' then vars() else vars

    @t = template
    return @

  render: (fragment, vars) =>
    blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g
    valregex = /\{\{([=%])(.+?)\}\}/g

    if not vars?
      vars = fragment
      fragment = @t

    return fragment.replace(blockregex, (_, __, meta, key, inner, if_true, has_else, if_false) =>
      val = @get_value(vars, key)
      temp = ''

      if not val
        return @render(inner, vars) if meta is '!'
        return @render(if_false, vars) if has_else
        return ''

      if not meta
        return @render('has_else ? if_true : inner, vars')

      if meta is '@' and val
        for i, v of val
          if {}.hasOwnProperty.call(val, i)
            vars._key = i
            vars._val = v
            temp += @render(inner, vars)

        delete vars._key
        delete vars._val
        return temp
    ).replace(valregex, (_, meta, key) =>
      val = @get_value(vars, key)
      (return if meta is '%' then scrub(val) else val) if val
      return ''
    )

window.t = t