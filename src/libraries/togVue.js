/********************
*********************
**  		       **
**    togVue.js    **
**      v1.00      **
**  			   **
*********************
********************/


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



**************************/

import bus from '@/auxiliary/bus'

var togvue = {
    log:
    function(message)
    {
        setTimeout(function(){
            bus.emit('debug display', message)
        }, 1000);
    }
}

export default togvue