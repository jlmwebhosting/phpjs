function parse_str(str, array){
    // http://kevin.vanzonneveld.net
    // +   original by: Cagri Ekin
    // +   improved by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   reimplemented by: stag019
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: stag019
	// -    depends on: urldecode
    // %        note 1: When no argument is specified, will put variables in global scope.
    // *     example 1: var arr = {};
    // *     example 1: parse_str('first=foo&second=bar', arr);
    // *     results 1: arr == { first: 'foo', second: 'bar' }
    // *     example 2: var arr = {};
    // *     example 2: parse_str('str_a=Jack+and+Jill+didn%27t+see+the+well.', arr);
    // *     results 2: arr == { str_a: "Jack and Jill didn't see the well." }

	var glue1 = '=', glue2 = '&', array2 = String(str).split(glue2),
	i, j, chr, tmp, key, value, bracket, keys, evalStr,
	fixStr = function(str)
	{
		return urldecode(str).replace(/([\\"'])/g, '\\$1').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
	};

	if(!array)
	{
		array = this.window;
	}

	for(i = 0; i < array2.length; i++)
	{
		tmp = array2[i].split(glue1);
		if(tmp.length < 2)
		{
			tmp = [tmp, ''];
		}
		key   = fixStr(tmp[0]);
		value = fixStr(tmp[1]);
		while(key.charAt(0) === ' ')
		{
			key = key.substr(1);
		}
        if(key.indexOf('\0') !== -1)
        {
            key = key.substr(0, key.indexOf('\0'));
        }
		if(key && key.charAt(0) !== '[')
		{
			keys    = [];
			bracket = 0;
			for(j = 0; j < key.length; j++)
			{
				if(key.charAt(j) === '[' && !bracket)
				{
					bracket = j + 1;
				}
				else if(key.charAt(j) === ']')
				{
					if(bracket)
					{
						if(!keys.length)
						{
							keys.push(key.substr(0, bracket - 1));
						}
						keys.push(key.substr(bracket, j - bracket));
						bracket = 0;
						if(key.charAt(j + 1) !== '[')
						{
							break;
						}
					}
				}
			}
			if(!keys.length)
			{
				keys = [key];
			}
			for(j = 0; j < keys[0].length; j++)
			{
				chr = keys[0].charAt(j);
				if(chr === ' ' || chr === '.' || chr === '[')
				{
					keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
				}
				if(chr === '[')
				{
					break;
				}
			}
			evalStr = 'array';
			for(j = 0; j < keys.length; j++)
			{
				key = keys[j];
				if((key !== '' && key !== ' ') || j === 0)
				{
					key = "'" + key + "'";
				}
				else
				{
					key = eval(evalStr + '.push([]);') - 1;
				}
				evalStr += '[' + key + ']';
				if(j !== keys.length - 1 && eval('typeof ' + evalStr) === 'undefined')
				{
					eval(evalStr + ' = [];');
				}
			}
			evalStr += " = '" + value + "';\n";
			eval(evalStr);
		}
	}
}