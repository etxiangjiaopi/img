define(function(require){
    require("js/img");
    $(function(){
        var aUrl = [];
        for(i = 1; i < 30; i++){
            if(i < 10){
                aUrl.push("img/0" + i + ".jpg");
            }else{
                aUrl.push("img/" + i + ".jpg");
            }
        }
        $.each(aUrl,function(idx,ele){
            var imgEle = $('<div class="item"><img src="'+ ele +'"></div>');
            $(".container").append(imgEle);
        });
        setTimeout(function(){
            $(".container").rowGrid({
                itemSelector: ".item",
                minMargin: 5,
                maxMargin: 15,
                firstItemClass: "first-item"
            });
        },1000);
    });
});