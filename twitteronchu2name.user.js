// ==UserScript==
// @name           TwitterOnChu2Name
// @namespace      http://yuroyoro.com/
// @description    �~2���ۂ����O��Twitter��Timeline��\�����܂��B
// @include        http://twitter.com/*
// ==/UserScript==
(function() {

  var names ={}
  

  var name_list = document.getElementsByClassName('screen-name');
  var len = name_list.length;
  
  for( var i = 0 ; i < len; i++){
    var name = name_list[i].innerHTML;
    if( names[name] ){
      name_list[i].innerHTML = names[name];
    }
    else{
      createChu2Name( name_list[i],name);
    }
  }
  
  // ���O�𐶐�����
  function createChu2Name( nameNode,name) {
    GM_xmlhttpRequest({
      method : 'get',
      url    : 'http://pha22.net/name2/c/' + name,
      onload : function(res) {
        if (res.responseText != 'Error'){
          var reg = new RegExp("<div id='name2'><p id='yomi'>(.*)</p><p id='kanji'>(.*)</p></div><p class='uri'>", "i");
          res.responseText.match(reg);
          var yomi = RegExp.$1;
          var kanji = RegExp.$2;
          
          nameNode.innerHTML =kanji + '(' + yomi + ')';
          names[name] = nameNode.innerHTML;
        }
      },
    })
  }
})();