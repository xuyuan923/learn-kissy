KISSY.add(function (S, require) {
    var $ = require('node').all,
        SWF = require('swf'),
        IO = require('io'),
        XT = require('xtemplate/runtime'),
        recordTpl = require('./tpl/record-list.xtpl'),
        DataLazyload = require('kg/datalazyload/2.0.2/'),
        Limitfixed = require('kg/limitfixed/2.0.0/index');

    var Interactive = require('./interactive');
    var recordListConEl = $('#J_RecordList');

    var itemId = $('#J_ItemId').val();

    /*给xtemplate添加全局函数，去掉价格中的逗号和小数点*/
    XT.addCommand('clean', function (scopes, option) {
        var price = option.params[0];
        return price.replace(/\,/g, '').replace(/\./, '');
    });

    /*tab悬浮*/
    function _limitFix() {
        var limitfixed = new Limitfixed($('#J_DetailTabMenu'), {
            limit: $('.pm-addition'),
            holder: true
        });
        limitfixed.render();
    }

    function _tabChange() {
        var menu = $('#J_DetailTabMenu li'),
            content = $('.J_Content', '#J_DetailTabMain');
        menu.each(function (item, key) {
            item.on('click', function (e) {
                e.halt();
                //判断，如果高度大于父容器高度则先滚动到顶部，否者正常切换
                if($(window).scrollTop() > $('.pm-addition').offset().top) {
                    $(window).scrollTop($('.pm-addition').offset().top);
                }
                if(!item.hasClass('current')){
                    item.addClass('current').siblings('li').removeClass('current');
                        $(content[key]).show().siblings('div.J_Content').hide();
                        if (key === 1) {
                            _getTableData();
                        } else if (key === 2) {
                        }
                }
            })
        })
    }

    function _getFirstTabData() {
        var getDesc = $('#J_desc'),
            getDescContent = $('#J_desc_content'),
            scriptUrl = getDesc.attr('data-from');//prop 换成 attr
        var _imgLazyReplace = function(str){
            var reg = /<\s*img\s+([^>]*?)src\s*=\s*[\'|\"](.*?)[\'|\"]\s*([^>]*?)\/?\s*>/ig,
                to = '<img $1 src="http://gtms02.alicdn.com/tps/i2/TB1SN33GVXXXXarapXX0deX8pXX-900-600.png" data-ks-lazyload="$2" $3 />';
            return str.replace(reg, to);
        };
        try {
            S.getScript(scriptUrl, function () {
                if (typeof desc !== 'undefined') {
                    var newDesc = _imgLazyReplace(desc);
                    S.log(newDesc);
                    getDescContent.html(newDesc);
                    new DataLazyload({
                        container: '#J_desc_content'
                    });
                    _showFlash();
                } else {
                    getDescContent.html('暂无描述');
                }
            });

        } catch (e) {

        }
    }

    /*
     * 添加flash
     * */
    function _showFlash() {
        if (!$('#player').length) return;
        var swf = new SWF({
            render : '#player',
            src    : $('#player').attr('data-src'),
            id     : 'auction-video',
            params : {flashvars: {autoplay: false, loop: false}},
            attrs  : {         // swf 对应 DOM 元素的属性
                width : 660,    // 最小控制面板宽度,小于此数字将无法支持在线快速安装
                height: 440  // 最小控制面板高度,小于此数字将无法支持在线快速安装
            },
            xi     : 'expressInstall.swf',  // 快速安装地址. 全称 express install
            version: 9
        });

        $('#play').on('click', function (e) {
            e.halt();
//            swf.get(data.id).Play();
            swf.callSWF('play');
        });
    }


    //表格数据展示
    function _getTableData() {
        var currentPage = $('#J_CurrentPage').html() || 1;
        _fillTableData(currentPage);
    }

    function _fillTableData(currentPage) {
        var api = recordListConEl.attr('data-from');
        currentPage = currentPage || 1;

        var recordCallback = function (data) {
            recordListConEl.html(new XT(recordTpl).render(data));
            Interactive.renderWholeFavor();//渲染点赞踩
        };

        IO({
            dataType: 'jsonp',
            url     : api,
            data    : {
                'currentPage': currentPage
            },
            success : recordCallback
        });
    }


    function _pageChange() {
        var getTable = $('#J_RecordList');
        getTable.delegate('click', '.prev-page', function (e) {
            e.preventDefault();
            var currentPage = $('#J_CurrentPage').html() || 1;
            if (currentPage == 1) {
                return;
            }
            var key = parseInt(currentPage) - 1;
            getTable.attr('current-page', key);
            _fillTableData(key);
            $(window).scrollTop($('#J_DetailTabMenu').offset().top);
        });
        getTable.delegate('click', '.next-page', function (e) {
            e.preventDefault();
            var getPageContent = $('#J_PagInfo');
            if (getPageContent.attr('data-more') === 'no') {
                return;
            }
            var currentPage = $('#J_CurrentPage').html() || 1;
            var key = parseInt(currentPage) + 1;
            getTable.attr('current-page', key);
            _fillTableData(key);
            $(window).scrollTop($('#J_DetailTabMenu').offset().top);
        });

    }

    function _slideTabLine(index) {
        var menu = $('#J_DetailTabMenu li'), wrapLine = $('.line', '.wrap-line');
        var offLeft = [0, $(menu[0]).width(), $(menu[0]).width() + $(menu[1]).width(), $(menu[0]).width() + $(menu[1]).width() + $(menu[2]).width()];
        var timer;

        if(index){
            index = index + 1;
            wrapLine.animate({
                left : offLeft[index - 1],
                width: $(menu[index - 1]).width()
            }, 0.1, 'easeOut');
            return;
        }

        menu.on('mouseenter', function (e) {
            var targetEl = $(e.currentTarget),
                index = targetEl[0].id.replace(/tab/, '');
            timer && timer.cancel();
            wrapLine.animate({
                left : offLeft[index - 1],
                width: $(menu[index - 1]).width()
            }, 0.1, 'easeOut');

        });

        menu.on('mouseleave', function () {
            var currentIndex = $('.current', '#J_DetailTabMenu')[0].id.replace(/tab/, '');

            timer = S.later(function () {
                wrapLine.animate({
                        left : offLeft[currentIndex - 1],
                        width: $(menu[currentIndex - 1]).width()
                    }, 0.05, 'easeOut',
                    function () {
                    });
            }, 100)
        });
    }

    function fireMore(idx) {
        var menu = $('#J_DetailTabMenu li'),
            content = $('#J_DetailTabMain .J_Content');
        $(menu[idx]).addClass('current').siblings('li').removeClass('current');
        _getTableData();
        $(content[idx]).show().siblings('div.J_Content').hide();
        _slideTabLine(idx);
    }

    return {
        render  : function () {
            _limitFix();
            _tabChange();
            _getFirstTabData();
            _pageChange();
            _slideTabLine();
        },
        fireMore: fireMore
    };
});
