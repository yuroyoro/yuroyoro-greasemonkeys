// ==UserScript==
// @name           MoveHatebuSimlarEntries
// @namespace      http://yuroyoro.com/
// @include        http://b.hatena.ne.jp/entry/*
// ==/UserScript==

(function(){
  var b = document.getElementsByClassName('info');
  if( b ){
    p = b[0].parentNode;
    s = p.removeChild(b[1]);
    p.insertBefore( s , b[0] );
  }
})();