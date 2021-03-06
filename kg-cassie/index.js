/**
 *
 * 当鼠标在顶部时，显示到底部
 * 当鼠标在底部时，显示到顶部
 */
var $ = require('node').all;
var Base = require('base');

var KgCassie = Base.extend({
    initializer: function(){
        var self = this;
        var $target = self.get('$target');
    },
    //创建DOM节点
    _create: function(){
        var self = this;
        var tpl = self.get('tpl');
        var $target = $(tpl);
        //设置$target属性值为$target
        self.set('$target',$target);
        $('body').append($target);
        $target.on('click', function (ev) {
            ev.halt();
            self.run();
        });
        //TODO: return $target不能少
        return $target;
    },
    //运行
    render: function(){
        var self = this;
        var $target = self.get('$target');
        //不存在目标节点，使用模板创建个
        if(!$target.length){
            $target = self._create();
        }else{
            $target.on('click',function(ev){
                ev.preventDefault();
                self.run();
            });
        }
    },
    //触发动画滚动
    run: function(){
        var self = this;
        var scrollSpeed = self.get('scrollSpeed');
        $('body').animate({scrollTop: 0}, scrollSpeed, 'swing');
    }
},{
    ATTRS:{
        $target:{
            value:'',
            getter:function(v){
                return $(v);
            }
        },
        //模板
        tpl:{
            value:'<div class="J_Top goto-top"><div class="top-bg"></div><span class="vc-iconfont top-icon">到底部</span></div>'
        },
        //到顶部、底部的速度
        scrollSpeed: {
            value:0,
            getter: function(v){
                if(!v.length) return 1;
                return v;
            }
        }
    }
});

module.exports = KgCassie;



