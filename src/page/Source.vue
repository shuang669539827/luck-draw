<template>
  <div class="source-page" >
	  <div v-html="code"/>
  </div>
</template>
<script>
import ajax from "../js/ajax";
import highlight from "highlight.js";
import marked from "marked";

import "highlight.js/styles/sunburst.css";

const renderer = new marked.Renderer();
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  renderer,
  highlight(code) {
    return highlight.highlightAuto(code).value;
  }
});
export default {
  data() {
    return {
      code: ""
    };
  },
  mounted() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/index.php?ac=dump", true);
    xhr.onload = () => {
      console.log(xhr.responseText);
      this.code = marked(xhr.responseText);
    };
    xhr.send();
  }
};
</script>
<style>
.source-page {
  height: 100%;
  padding: 0 15px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 16px;
}
.source-page hr{
	margin:20px 0;
	transform: scaleY(.5);
}
.source-page p{
	margin:5px;
}
.source-page pre{
	padding-left: 5px;
	padding-top:5px;
	background: rgba(0, 0, 0, 0.5);
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	
}
.source-page pre code{
	font-family: Courier, monospace;
}
</style>
