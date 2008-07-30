// ==UserScript==
// @name           Xss Check Helper
// @namespace      http://yuroyoro.com/
// @description    This is helper script That Fill input value for checking XSS and SQL Injection or other.
// @include        *
// @exclude        *
// ==/UserScript==

(function() {

  var DEFAULT_VALUES = [
    "<b>TestValue</b>",
    ">'><script>alert('Test')</script>",
    ">\"><script>alert(\"Test\")</script>",
    "\" sytle=\"background:url(javascript:alert('Test')) \" OA=\"",
    "'+alert('Test')+'",
    "\\\"'<>&/",
    "1 or 1=1 or 1=1",
    "' or 'a'='a",
    "0xA5 or 1=1;--",
    "/../../../../../../../../etc/passwd",
    "/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/etc/passwd",
    "\\..\\..\\..\\..\\..\\..\\..\\..\\boot.ini",
    "\\\\..\\\\..\\\\..\\\\..\\\\..\\\\..\\\\..\\\\..\\\\boot.ini",
    "\\%2E%2E\\%2E%2E\\%2E%2E\\%2E%2E\\%2E%2E\\%2E%2E\\%2E%2E\\%2E%2E\\boot.ini",
    "\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\\\%c0%ae%c0%ae\\boot.ini"
  ];
  
  
  var Text_FillValue = '<input type="text" name="FillValue" id="FillValue" />';
  var Select_FillValue = '<select name="FillValue" id="FillValue" >';
  
  var init = function($j){

    $J = $j;
    $J( function(){

      GM_addStyle(XCH_CSS);

      $J("body").append(XCH_MAIN_HTML.toSource());
      $J("body").append(XCH_FORM_HTML.toSource());
      
      
      var sel = $J("#FillValue");
      $J.each( DEFAULT_VALUES  , function() {
        Select_FillValue +='<option value="'+ sanitaizeXML(this) + '"> ' + sanitaize( this ) + '</option>' ;
      });
      Select_FillValue +="</select>"
      
      $J("#TD_FillValue").append(Select_FillValue);
      
      $J("#Check_FillValue").toggle( 
        function(){
          $J("#FillValue").remove();
          $J("#TD_FillValue").append(Text_FillValue);
          $J("#Check_FillValue").attr("checked",true);
          return true;
        },
        function(){
          $J("#FillValue").remove();
          $J("#TD_FillValue").append(Select_FillValue);
          $J("#Check_FillValue").removeAttr("checked");
          return true;
        }
      );
      
      $J("#XCH_Toggle").toggle(
        function(){
          $J("#XCH_Form").show("normal");
        },
        function(){
          $J("#XCH_Form").hide("normal");
        }
      );
      
      $J("#XCH_Form").hide();
      $J("#Button_Fill").click( function(){
        var changeValue = unsanitaize( $J("#FillValue").val() );
        var targetXPath = $J("#Text_FillTargetFieldXPath").val();
        var applyHidden = $J("#Check_FillHidenField")[0].checked;
        
        if( !targetXPath || targetXPath == "" ){
          targetXPath  = ":input";
        }
        
        $J(targetXPath).not("#FillValue")
                    .not("#Check_FillValue")
                    .not("#Text_FillTargetFieldXPath")
                    .not("#Check_FillHidenField")
                    .not("#Button_Fill")
                    .each( function(){
          var type = $J(this).attr("type");
          
          switch( type ){
            case "text" :
            case "password" :
            case "radio" :
            case "checkbox" :
              $J(this).val( changeValue );
              break;
            case undefined :
              if( this.tagName == "TEXTAREA" ){
                $J(this).val( changeValue );
              }
              if( this.tagName == "SELECT"){
                $J(this.options[this.selectedIndex]).attr("value",changeValue);
              }
              break;
            
          }  
        });
        
        if( applyHidden ){
          $J(":hidden").each( function(){
            $J(this).val( changeValue );
          }
          );
        }
      });
    });
  };
  
  function sanitaize( str ) {
    var s = str;
    s = s.replace(/\&/g,'&amp;');
    s = s.replace(/\>/g,'&gt;');
    s = s.replace(/\</g,'&lt;');
    return s;
  }
  
  function sanitaizeXML( str ) {
    var s = str;
    s = s.replace(/\\/g,'\\\\');
    s = s.replace(/"/g,'&quot;');
    s = s.replace(/'/g,"&apos;");
    s = s.replace(/\&/g,'&amp;');
    s = s.replace(/\>/g,'&gt;');
    s = s.replace(/\</g,'&lt;');
    return s;
  }
  
  function unsanitaize( str ) {
    var s = str;
     s = s.replace(/\\\\/g,'\\');
    s = s.replace(/\&quot;/g,'\"');
    s = s.replace(/\&apos;/g,"'");
    s = s.replace(/\&amp;/g,'&');
    s = s.replace(/\&gt;/g,'>');
    s = s.replace(/\&lt;/g,'<');
    return s;
  }
   
   function log(message) {
       if (unsafeWindow && unsafeWindow.console) {
           unsafeWindow.console.log(message)
       }
   }
   
var XCH_CSS=
<>
<![CDATA[
	div.XCH_Main {
		-moz-box-sizing:border-box;
		box-sizing:border-box;
		
		position : absolute;
		z-index : 1000;
		top : 0px;
		left: 0px;
		opacity: 0.8; 
		-moz-opacity: 0.8; 
		filter:alpha(opacity=80); 
		border-top:1px solid #CCCCCC;
		border-right:1px solid #CCCCCC;
		border-left:1px solid #CCCCCC;
		background:#333333;
		width:300px;
		height:20px;
		margin: 0px;
		padding: 0px;
	}

	div.XCH_Form{
		-moz-box-sizing:border-box;
		box-sizing:border-box;
		
		position : absolute;
		z-index : 1000;
		top : 20px;
		left: 0px;
		opacity: 0.8; 
		-moz-opacity: 0.8; 
		filter:alpha(opacity=80); 
		border:1px solid #CCCCCC;
		background:#333333;
		width:300px;
		height:80px;
		margin: 0px;
		padding: 0px;
		
		border-top:1px solid #CCCCCC;
		padding-top:2px;
	}

	div.XCH_Main table{
		text-align : left;
		font:normal normal normal 12px/1.2 "ヒラギノ角ゴ Pro W3","Osaka","Arial","Helvetica","ＭＳ Ｐゴシック",sans-serif;
		white-space:normal;
		color:#E7845f;
		background-color: #CCCCCC;
		margin: 0px 5px;
		border : none;
		border-collapse : none;
	}
	
	div.XCH_Form table{
		text-align : left;
		font:normal normal normal 12px/1.2 "ヒラギノ角ゴ Pro W3","Osaka","Arial","Helvetica","ＭＳ Ｐゴシック",sans-serif;
		white-space:normal;
		color:#E7845f;
		background-color: #CCCCCC;
		margin: 0px 5px;
		border : none;
		border-collapse : none;
		background-color: #333333;
	}

	div.XCH_Main table td#XCH_Toggle{
		font:normal normal normal 12px/1.2 "ヒラギノ角ゴ Pro W3","Osaka","Arial","Helvetica","ＭＳ Ｐゴシック",sans-serif;
		white-space:normal;
		width:14px;
		text-align : center;
		border : none;
		border-left:1px solid #CCCCCC;
	}

	div.XCH_Form table td{
		border : none;
		padding: 2px 2px;
		background:#333333;
		font:normal normal normal 12px/1.2 "ヒラギノ角ゴ Pro W3","Osaka","Arial","Helvetica","ＭＳ Ｐゴシック",sans-serif;
		white-space:normal;
	}

	div.XCH_Main table td{
		border : none;
		padding: 2px 2px;
		background:#333333;
		font:normal normal normal 12px/1.2 "ヒラギノ角ゴ Pro W3","Osaka","Arial","Helvetica","ＭＳ Ｐゴシック",sans-serif;
		white-space:normal;
	}
	
	div.XCH_Form table td input{
		font:normal normal normal 10.5px/1.2 "ヒラギノ角ゴ Pro W3","Osaka","Arial","Helvetica","ＭＳ Ｐゴシック",sans-serif;
		white-space:normal;
	}
	
	div.XCH_Form table td input[type="text"]{
		width:140px;
	}

	div.XCH_Form table td input[type="button"]{
		font-size:10px;
	}

	div.XCH_Form table td select{
		width:140px;
	}
]]></>

var XCH_MAIN_HTML=
<div id="XCH_Main" class="XCH_Main">
  <table width="98%" border="0" cellspacing="0">
    <tr>
      <td>■ Xss Check Helper</td><td id="XCH_Toggle"><span>▼</span></td>
    </tr>
  </table>
</div>

var XCH_FORM_HTML=
<div id="XCH_Form" class="XCH_Form" >
  <form>
  <table width="98%" border="0" cellspacing="0">
    <tr>
      <td>Value</td>
      <td colspan="2" id="TD_FillValue">
      </td>
      <td><input type="checkbox" name="Check_FillValue" id="Check_FillValue" value="1" />
          <label name="Check_FillValueLabel" for="Check_FillValue">Custom</label></td>
    </tr>
    <tr>
      <td>XPath/CSS</td>
      <td colspan="3"><input type="text" name="Text_FillTargetFieldXPath" id="Text_FillTargetFieldXPath"/></td>
    </tr>
    <tr>
      <td colspan="3"><input type="checkbox" id="Check_FillHidenField" name="Check_FillHidenField" value="1" checked="true"/>
          <label for="Check_FillHidenField">Apply Hidden</label></td>
      <td><input type="button" id="Button_Fill" name="Button_Fill" value="Fill!!" /></td>
    </tr>
  </table>
  </form>
</div>

// External jQuery Loader
/** Usage:
var loader = new jQueryLoader(
  { // jQuery Core: required
    name: 'jQuery'
    version: '1.2.3',
    url: 'http://blog.fulltext-search.biz/javascripts/gm/jquery-1.2.3.min.js'
  },
  [
    { // jQuery Plugin: optional
      name: 'reflect',
      version: '1.0', // optional: use '1.0' if undefined
      url: 'http://blog.fulltext-search.biz/javascripts/gm/jquery.reflect.js'
    }
  ]
);
**/
function jQueryLoader() { this.initialize.apply(this, arguments); };
var Util = {
  bind: function() {
    if (arguments.length < 3 && arguments[1] === undefined) return arguments[0];
    var args = Util.toArray(arguments), __method = args.shift(), object = args.shift();
    return function() {
      return __method.apply(object, args.concat(Util.toArray(arguments)));
    }
  },

  toArray: function(iterable) {
    if (!iterable) return [];
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  },

  extend: function(dist, source) {
    for (var property in source) {
      if(dist == source[property]) continue;
      if(source[property] !== undefined) dist[property] = source[property];
    }
    return dist;
  },

  each: function(iteratorable, iterator) {
    if(iteratorable.length === undefined)
      for(var i in iteratorable) iterator.call( iteratorable[i], i, iteratorable[i] );
    else
      for(var i = 0, l = iteratorable.length, val = iteratorable[0];
        i < l && iterator.call(val,i,val) !== false; val = iteratorable[++i] );
  },

  map: function(elems, callback) {
    var ret = [];
    for(var i=0,l=elems.length; i<l; i++) {
      var value = callback(elems[i], i);
      if(value !== null && value != undefined) {
        if(value.constructor != Array) value = [value];
        ret = ret.concat(value);
      }
    }
    return ret;
  },

  parseQueryString: function(str) {
    var memo = str.split('&');
    for(var i=0,obj={},l=memo.length; i<l; i++) {
      var pair = memo[i];
      if((pair = pair.split('='))[0]) {
        var name = decodeURIComponent(pair[0]);
        var value = pair[1] ? decodeURIComponent(pair[1]) :undefined;
        if(obj[name] !== undefined) {
          if(obj[name].constructor != Array) obj[name] = [obj[name]];
          if(value) obj[name].push(value);
        } else {
          var dummy = parseInt(new Number(value), 10);
          obj[name] = isNaN(dummy) ? value : dummy;
        }
      }
    }
    return obj;
  },

  periodicalExecuter: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;
    Util.extend(this, {
      registerCallback: function() {
        this.timer = setInterval(Util.bind(this.onTimerEvent, this), this.frequency * 1000);
      },

      execute: function() {
        this.callback(this);
      },

      stop: function() {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null;
      },

      onTimerEvent: function() {
        if (!this.currentlyExecuting) {
          try {
            this.currentlyExecuting = true;
            this.execute();
          } finally {
            this.currentlyExecuting = false;
          }
        }
      }
    });

    this.registerCallback();
  }
};
jQueryLoader.prototype = {
  cacheName: 'jQuery.Libraries',
  namespace: 'jQueryLoader',

  initialize: function(jquery, plugins) {
    this.jquery = jquery;
    this.plugins = plugins || [];
    this.downloaded = 0;
    this.permanents = eval(GM_getValue(this.cacheName, '({})'));
  },

  load: function(callback) {
    if(typeof callback != 'function') return;
    this.callback = callback;
    this._load(this.jquery);
    Util.each(this.plugins, Util.bind(function(i,lib) { this._load(lib); }, this));
    this.eval();
  },

  _load: function(lib) {
    lib.version = lib.version ? lib.version : '1.0';
    if(!this.permanents[lib.name] || !this.permanents[lib.name].script ||
       this.permanents[lib.name].version &&
       this.compareVersion(this.permanents[lib.name].version, lib.version) < 0) {
      if(!this.permanents[lib.name]) this.permanents[lib.name] = {};
      Util.extend(this.permanents[lib.name], lib);
      var self = this;
      GM_xmlhttpRequest({
        method: 'GET',
        url: this.permanents[lib.name].url,
        onload: function(res) {
          self.permanents[lib.name].script = encodeURI(res.responseText);
          GM_setValue(self.cacheName, self.permanents.toSource());
          self.downloaded++;
        },
        onerror: function(res) { GM_log(res.status + ':' + res.responseText); }
      });
    } else { this.downloaded++; }
  },

  eval: function() {
    if(this.plugins.length + 1 == this.downloaded) {
      this.insert(this.permanents['jQuery'].script);
      if(!unsafeWindow.__jQuery) unsafeWindow.__jQuery = {};
      this.insert("__jQuery['" + this.namespace + "'] = jQuery.noConflict(true);");
      var plugins = Util.map(this.plugins, Util.bind(function(plugin) {
        return this.permanents[plugin.name].script;
      }, this)).join("\n");
      this.insert([
        '(function(jQuery,$) {', plugins, "})(__jQuery['",
        this.namespace, "'],__jQuery['", this.namespace, "']);"
      ].join(''));
      this.wait();
    } else {
      setTimeout(Util.bind(function() { this.eval(); }, this), 10);
    }
  },

  wait: function() {
    if(unsafeWindow.__jQuery && unsafeWindow.__jQuery[this.namespace] &&
       unsafeWindow.__jQuery[this.namespace]().jquery == this.permanents['jQuery'].version) {
      this.callback(unsafeWindow.__jQuery[this.namespace]);
    } else {
      setTimeout(Util.bind(function() { this.wait(); }, this), 10);
    }
  },

  insert: function(script) {
    var lib = document.createElement('script');
    lib.setAttribute('type', 'text/javascript');
    lib.appendChild(document.createTextNode(decodeURI(script)));
    document.getElementsByTagName('head')[0].appendChild(lib);
  },

  compareVersion: function(current, latest) {
    var delta = 0;
    var curr = current.split('.');
    var ltst = latest.split('.');
    for(var i=0, len = curr.length >= ltst.length ? curr.length : ltst.length; i<len; i++) {
      var curr_num = parseInt(curr[i], 10);
      var ltst_num = parseInt(ltst[i], 10);
      if(isNaN(ltst_num) || curr_num > ltst_num) {
        delta = 1;
        break;
      } else if(isNaN(curr_num) || curr_num < ltst_num) {
        delta = -1;
        break;
      }
    }
    return delta;
  }
};


var loader = new jQueryLoader(
  { // jQuery Core: required
    name: 'jQuery',
    version: '1.2.3',
    url: 'http://yuroyoro.com/greasemonkey/jquery-1.2.3'
  }
);
loader.namespace = 'XssCheckHelper'; // 利用したスクリプト名などの適当な名前空間を指定
loader.load(function($j) {
  // do something with jQuery($j)
  init($j);
});

})();
