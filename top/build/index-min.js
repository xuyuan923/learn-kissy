KISSY.add("kg/top/1.0.0/index",["node","base","anim"],function(e,t,n,o){{var s,i=t("node"),r=t("base");t("anim")}s=function(t){var n=i,o=n.all,s=r,a=s.extend({initializer:function(){var e=this,t=e.get("showPos");0===t&&o(window).on("resize",function(){e.set("showPos",o(window).height())})},_create:function(){var e=this,t=e.get("tpl"),n=o(t);return e.set("$target",n),o("body").append(n),n.on("click",function(t){t.preventDefault(),e.run()}),n},render:function(){var t=this,n=t.get("showPos"),s=t.get("$target");o(window).on("scroll",function(){o(window).scrollTop()>n?(s.length||(s=t._create()),e.later(function(){t.set("visible",!0)})):t.set("visible",!1)}),s.length&&s.on("click",function(e){e.preventDefault(),t.run()})},run:function(){var e=this,t=e.get("scrollSpeed");console.log("scrollSpeed:"+t),o("body").animate({scrollTop:0},t,"swing")}},{ATTRS:{$target:{value:"",getter:function(e){return o(e)}},showPos:{value:0,getter:function(e){return e>0?e:o(window).height()}},tpl:{value:'<div class="J_Top goto-top"><div class="top-bg"></div><span class="vc-iconfont top-icon">&#xe600;</span></div>'},visible:{value:!1,setter:function(e){var t=this,n=t.get("$target"),o=t.get("showClass");return n[e&&"addClass"||"removeClass"](o),e}},scrollSpeed:{value:1e3},showClass:{value:"top-show"}}});return t=a}(),o.exports=s});