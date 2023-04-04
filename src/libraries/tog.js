/*****************
******************
**  			**
**    tog.js    **
**    v1.13     **
**  			**
******************
*****************/


/**********************
***********************
**   				**
**   DOCUMENTATION   **
**   				**
***********************
***********************

Use by calling tog.function(). 	You can even do this within functions below.

Include something like this on the page, needs experimenting to get around console error:

  <script type="module" src="Tog.js"></script>
  <script type="text/javascript">
	import tog from './Tog';
  </script>

Functions themselves can depend on other
libraries like jQuery and jQuery-visible by calling tog.include_js_file() within said functions. This should only load them when said functions are used on a website, though it'd be good to test this.

/**************************
***************************
**   					**
**   LIST OF FUNCTIONS   **
**   					**
***************************
***************************

Objects
  is_empty
  map
  map_to_array
  map_numeric_obj_to_array
  update_recursively
  remove_by_key
Arrays
  map_to_object
Includes
  include_js_file
  library_urls
URLS
  get_query_params
  append_query_params
  download_url_and_pass_to_callback
DOM
  add_element
Animation
  animate_element_when_it_appears
Numbers
  random_from(array)
Strings
Error-Catching
  parse_json
Specific Libraries
  Vue
  mark_loaded
  FCM (Firebase Cloud Messages)
	body_to_object

**************************/

var tog = {

    objects:
    {
      is_empty:
  
      function(obj) {
        return Object.keys(obj).length === 0;
      },
  
  
      map:
  
      function(object, mapFn) {
      return Object.keys(object).reduce(
        function(result, key) {
        result[key] = mapFn(object[key])
        return result
        }
        ,
        {}
      );
      },
  
  
      map_to_array:
  
      function(object, mapFn) {
      var array = []
      for (var key in object) {
        // ↓ I know this seems to duplicate the above, but it does (almost) the same as object.hasOwnPropery(), which the Vue compiler complains about. (Almost, because it counts prototype keys too)
        if (key in object) {
        array.push(mapFn(object.key, key))
        }
      }
      return array
      },
  
  
      map_numeric_obj_to_array:
  
      function(object, mapFn) {
      var array = []
      for (var key in object) {
        // ↓ I know this seems to duplicate the above, but it does (almost) the same as object.hasOwnPropery(), which the Vue compiler complains about. (Almost, because it counts prototype keys too)
        if (key in object) {
        array.push(mapFn(object[key], key))
        }
      }
      return array
      },
  
      update_recursively:
  
      function (to_update, to_match) {
        for (var key in to_match) {
          if (!to_match.hasOwnProperty(key)) {
            continue;
          } else if (typeof to_match[key] == "object" && to_match[key] !== null) {
            if (key in to_update) {
              update_recursively(to_update[key], to_match[key])
            } else {
              to_update[key] = to_match[key]
            }
          } else {
            if (!(key in to_update)) {
              lo('to_match=')
              lo(to_match)
              to_update[key] = to_match[key]
              let bpt = 1
            }
          }
        }
      },
  
      remove_by_key_as_key_name:
  
      function(key, key_name, object) {
  
        let return_object = {}
  
        for (element of object) {
  
          if (element[key_name] != key) {
  
            return_object.push(element)
  
          }
  
        }
  
        return return_object
  
      }
  
    },
  
  
    arrays:
    {
      map_to_object:
  
      function(array, key = null) {
  
        let object = {}
  
        if (key) {
          array.forEach(function(item) {
            object[item[key]] = item
          })
        } else {
          array.foreach(function(item, index) {
            object[index] = item
          })
        }
  
        return object
  
      }
    },
  
  
    includes:
    {
      include_js_file:
  
      function(url) {
      var script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      },
  
  
      // Library URLs for include_js_file:
      library_urls:
      {
      jquery:
        'https://code.jquery.com/jquery-3.5.1.min.js',
      jquery_visible:
        'https://tomash.philosofiles.com/external/libraries/js/from-others/jquery-visible/jquery.visible.min.js'
      },
    },
  
  
    urls:
    {
      get_query_params:
  
      function
      (
      paramToFind = false,
      originalURL = false
      )
      {
      var params = []
      var param
  
      let url_parameters = decodeURIComponent(window.location.search.substring(1))
      if (!url_parameters) {
        return []
      }
      let sURLVariables = url_parameters.split('&')
  
      for (var i = 0; i < sURLVariables.length; i++) {
  
        param = sURLVariables[i].split('=')
        if (param[1] === undefined) {
        params[param[0]] = true
        } else {
        params[param[0]] = param[1]
        }
      }
  
      if (paramToFind) {
        for (param in params) {
        if (param === paramToFind) {
          return params[param]
        }
        }
        return false;
      } else if (originalURL) {
        var startOfParams = originalURL.indexOf('?');
        if (startOfParams !== -1) {
        return originalURL.substr(startOfParams+1);
        } else {
        return false;
        }
      } else {
        return params;
      }
      },
  
      append_query_params:
  
      function(originalURL, toAppend) {
      if (!tog.get_query_params(false,originalURL)) {
        originalURL += '?';
      } else {
        originalURL += '&';
      }
      originalURL += toAppend;
      return originalURL;
      },
  
  
      download_url_and_pass_to_callback:
      function(url, callback) {
      var request = new XMLHttpRequest()
  
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
        request.onreadystatechange = 'doNothing'; // change
        callback(request, request.status);
        }
      };
  
      request.open('GET', url, true);
      request.send(null);
      },
  
  
      object_to_params:
      function(object_with_param_keys) {
  
        var str = "";
        for (var key in object_with_param_keys) {
          if (str != "") {
            str += "&";
          }
          str += key + "=" + encodeURIComponent(object_with_param_keys[key]);
        }
  
        return str;
  
      }
  
  
  
    },
  
  
    dom:
    {
      add_element: function (type, css_class, contents, parent) {
      var newDiv = document.createElement(type);
      newDiv.className = css_class;
      var newDivContents = document.createTextNode(contents);
      newDiv.appendChild(newDivContents);
      parent.appendChild(newDiv);
  
      // Fix for Safari2/Opera9 repaint issue
      document.documentElement.style.position = "relative";
      },
    },
  
  
    /*
    animation: {
      animate_element_when_it_appears:
      function
      (
      element_selector,
      animation,
      animation_is_a_function_not_a_class = false
      )
      {
      // TO DO: check if this variable is actually available (in scope) when the scroll function is run. If not the if(anim_not_yet_triggered) check for it won't work.
      let anim_not_yet_triggered = true;
  
      $(window).scroll(function(event) {
        if (anim_not_yet_triggered) {
        $(element_selector).each(function(i, el) {
          var el = $(el);
          if (el.visible(true)) {
          /*
          if (animation_is_a_function_not_a_class)
          {
            TO DO: find out how to call a function passed as an arg
            animation();
          } else {
          *//*
            el.addClass(animation);
          // } // End else
          anim_not_yet_triggered = false;
          }
        });
        }
      }
      },
    },
    */
  
    numbers:
    {
      random_from:
      function (array) {
        return array[Math.floor(Math.random() * array.length)];
      }
    },
  
    strings:
    {
      /* !To convert to methods */
      /*
      To convert to methods
        function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
        }
  
        function is_blank_string(str) {
        return (!str || /^\s*$/.test(str));
        }
  
        function is_empty_string(str) {
        return (!str || str.length === 0 );
        }
      */
    },
  
    
    
    error_catching: 
    {
        parse_json:
        function(json) {
            let object
            try {
                object = JSON.parse(json)
            } catch (error) {
                let stringified_error = JSON.stringify(error)
                if (error instanceof SyntaxError) {
                    lo('SyntaxError: '+stringified_error)
                    alert('SyntaxError: '+stringified_error)
                } else {
                    let to_show = 'Non-SyntaxError: '+stringified_error
                }
            }
            return object
        }
    },
    
    debugging:
    {
        
        
        dump:
        function(v, howDisplay, recursionLevel) {
            
            /*
            dump() displays the contents of a variable like var_dump() does in PHP. dump() is
            better than typeof, because it can distinguish between array, null and object.
            Parameters:
                v:              The variable
                howDisplay:     "none", "body", "alert" (default)
                recursionLevel: Number of times the function has recursed when entering nested
                                objects or arrays. Each level of recursion adds extra space to the
                                output to indicate level. Set to 0 by default.
            Return Value:
                A string of the variable's contents
            Limitations:
                Can't pass an undefined variable to dump(). 
                dump() can't distinguish between int and float.
                dump() can't tell the original variable type of a member variable of an object.
                These limitations can't be fixed because these are *features* of JS. However, dump()
            */
            
            howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
            recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;
        
            var vType = typeof v;
            var out = vType;
        
            switch (vType) {
                case "number":
                /* there is absolutely no way in JS to distinguish 2 from 2.0
                   so 'number' is the best that you can do. The following doesn't work:
                   var er = /^[0-9]+$/;
                   if (!isNaN(v) && v % 1 === 0 && er.test(3.0)) {
                       out = 'int';
                   }
                */
                break;
            case "boolean":
                out += ": " + v;
                break;
            case "string":
                out += "(" + v.length + '): "' + v + '"';
                break;
            case "object":
                //check if null
                if (v === null) {
                    out = "null";
                }
                //If using jQuery: if ($.isArray(v))
                //If using IE: if (isArray(v))
                //this should work for all browsers according to the ECMAScript standard:
                else if (Object.prototype.toString.call(v) === '[object Array]') {
                    out = 'array(' + v.length + '): {\n';
                    for (var i = 0; i < v.length; i++) {
                        out += tog.debugging. repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                            dump(v[i], "none", recursionLevel + 1) + "\n";
                    }
                    out += tog.debugging. repeatString('   ', recursionLevel) + "}";
                }
                else {
                    //if object
                    let sContents = "{\n";
                    let cnt = 0;
                    for (var member in v) {
                        //No way to know the original data type of member, since JS
                        //always converts it to a string and no other way to parse objects.
                        sContents += tog.debugging. repeatString('   ', recursionLevel) + "   " + member +
                            ":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
                        cnt++;
                    }
                    sContents += tog.debugging. repeatString('   ', recursionLevel) + "}";
                    out += "(" + cnt + "): " + sContents;
                }
                break;
            default:
                out = v;
                break;
            }
        
            if (howDisplay == 'body') {
                var pre = document.createElement('pre');
                pre.innerHTML = out;
                document.body.appendChild(pre);
            }
            else if (howDisplay == 'alert') {
                alert(out);
            }
        
            return out;
        },
        
        
        repeatString:
        function(str, num) {
            let out = '';
            for (var i = 0; i < num; i++) {
                out += str;
            }
            return out;
        }
    },
  
  
    /*********************
    **					**
    **     SPECIFIC     **
    **	   LIBRARIES    **
    **  	      		**
    *********************/
  
    vue:
    {
  
      mark_loaded:
      function(aspect_to_mark, component) {
        if ('loaded' in component) {
          component.loaded[aspect_to_mark] = true
          component.loaded.overall = true
          for (var aspect in component.loaded) {
            if (!component.loaded[aspect]) {
              component.loaded.overall = false
            }
          }
        }
      },
    },
  
    fcm:
    {
      body_to_object:
      function(string) {
        string.replace('\"', '"')
        let object = JSON.parse(string)
        return object
  
      }
    }
  
};

let lo = function (to_log) {
console.log(to_log)
}

export default tog