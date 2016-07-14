define(function(require){
    var jQuery = require("lib/jquery-1.7.2.min");
    (function($){
        //为jquery对象的原型中添加新方法
        $.fn.rowGrid = function(options){
            //将each的返回值（操作的dom元素）返回，为了使该方法可以和其他jq方法一样能够进行链式操作
            return this.each(function(){
                var _this = this;
                options = $.extend({},$.fn.rowGrid.defaults,options);//初始化配置对象
                layout(_this,options);
                if(options.resize) {
                    $(window).on('resize',function() {
                        layout(_this, options);
                    });
                }
            });
        };
        //定义默认配置项
        $.fn.rowGrid.defaults = {
            minMargin : null,
            maxMargin : null,
            resize : true,
            lastRowClass : 'last-row',
            firstItemClass : null
        };
        /*将图片样式算好并插入到容器中的函数*/
        function layout(container,options,items){
            var rowWidth = 0,//用来存放每一行的宽度
                rowElems = [],//用来存放当前行里面的图片元素
                _items = items || $(container).find(options.itemSelector),//每一个图片的dom元素
                itemsSize = _items.length;//图片个数
            /*移除所有图片元素的内联样式,和第一行与最后一行图片的class*/
            _items.each(function(idx,ele){
                var $ele = $(ele);
                $ele.removeAttr('style').removeClass(options.firstItemClass + " " + options.lastRowClass);
            });

            var containerWidth = $(container).outerWidth(true);//容器宽度
            var itemAttrs = [];//定义一个图片宽高数组
            for(var i = 0; i < itemsSize; i++){
                itemAttrs[i] = {
                    outerWidth : _items[i].offsetWidth,
                    height: _items[i].offsetHeight
                }
            }

            for(var globalIndex = 0; globalIndex < itemsSize; globalIndex++){
                rowWidth += itemAttrs[globalIndex].outerWidth;//获取每一张图片拼接后该行的总宽度
                rowElems.push(_items[globalIndex]);//将当前行图片图片放到当前行数组中
                if(globalIndex === itemsSize - 1){//如果是最后一张图
                    $.each(rowElems,function(idx,ele){
                        if(idx === 0){//如果是当前行的第一张图片
                            $(ele).addClass(options.lastRowClass);
                        }
                        //不是当前行的最后一张图右边距为配置项里的最小边距，最后一张右边距为0
                        ele.style.marginRight = (idx < rowElems.length - 1) ? options.minMargin+'px' : 0;
                    });
                }
                /*检测当前行宽度是否超过容器（如果超过改变图片边距）*/
                if(rowWidth + options.maxMargin * (rowElems.length - 1) > containerWidth){
                    var diff = rowWidth + options.maxMargin * (rowElems.length - 1) - containerWidth;//当前行的最大宽度减去容器宽度
                    var nrOfElems = rowElems.length;//当前行的的图片个数
                    var maxSave = (options.maxMargin - options.minMargin) * (nrOfElems - 1);
                    var rowMargin = 0;
                    if(maxSave < diff){//如果边距最小还是不能放下
                        rowMargin = options.minMargin;
                        diff -= maxSave;//此时diff是边距最小还需要减少的距离
                    }else{//如果边距最小能够放下
                        rowMargin = options.maxMargin - diff / (nrOfElems - 1);//此时边距就是正好能够顾所有图全放下的边距
                        diff = 0;
                    }
                    var widthDiff = 0;//声明累积宽度差
                    $.each(rowElems,function(idx,ele){
                        //此时globalIndex是当前行最后一张图片的索引
                        var nowEleIdx = globalIndex + idx - nrOfElems + 1;//计算当前行中每张图片相对于所有图片的索引
                        var rowElemWidth = itemAttrs[nowEleIdx].outerWidth;//通过索引获取图片宽度
                        var newWidth = rowElemWidth - (rowElemWidth / rowWidth) * diff;//按比例计算每张图片的需要减少的宽度（使得图片能够在这一行挤下）
                        var newHeight = Math.round(itemAttrs[nowEleIdx].height * (newWidth / rowElemWidth));//按比例缩放图片高度
                        /*对计算出的新宽度处理（防止出现类似33.3333333这样的值）*/
                        if(widthDiff + 1 - newWidth % 1 >= 0.5){//如果累积宽度差大于等于0.5，当前图片宽度向下舍入
                            widthDiff -= newWidth % 1;//将向下舍入减少的宽度从累积宽度差上减掉
                            newWidth = Math.floor(newWidth);
                        }else{
                            widthDiff += 1 - newWidth % 1;//将向上舍入增加的宽度加到累积宽度差上
                            newWidth = Math.ceil(newWidth);
                        }
                        $(ele).css({
                            "width" : newWidth + "px",
                            "height" : newHeight + "px",
                            //最后一张图没有右边距
                            "margin-right" : ((idx < nrOfElems - 1) ? rowMargin : 0) + "px"
                        });
                        if(idx === 0){
                            //为每行第一张图片加上特定的类
                            $(ele).addClass(options.firstItemClass);
                        }
                    });

                    //初始化当前行
                    rowElems = [];
                    rowWidth = 0;
                }
            }
        }
    })(jQuery);
});
