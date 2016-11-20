    function injectDom(doc){
        var oDisplay, oTimer, oStyle, oHeader, oSwithcer, oScore, oInfo;

        oDisplay = doc.createElement("div");
        oDisplay.className = "noahlu-miao";
        oDisplay.id = "noahlu-miao";

        oHeader = doc.createElement("header");
        oHeader.innerHTML = "<a href='/howtouse.php?ref=timer' target='_blank'>金币助手</a>" +
                            " [<a href='#' class='noahlu-miao-link'>展开</a>]";

        oTimer = doc.createElement("div");
        oTimer.className = "noahlu-miao-timer noahlu-hide"; // 计时表默认隐藏
        oTimer.id = "noahlu-miao-timer";
        oTimer.innerHTML="<a herf='javascript:void(0);' id='jb_add'>1.领取更多</a><br><a herf='javascript:void(0);' id='jb_start'>2.领金币</a><br><a herf='javascript:void(0);' id='book_start'>开始自动下单</a><br><a herf='javascript:void(0);' id='jb_start_auto'>自动领金币</a>";


        oInfo = doc.createElement("div");
        oInfo.className = "noahlu-miao-info";
        oInfo.id = "noahlu-miao-info";

        var defaultInfo = "<a href='http://miao.enjoyapps.org/forum/' target='_blank'>秒杀论坛</a>";
        var infoText = '';
       
        oInfo.innerHTML = infoText || defaultInfo;

        oStyle = doc.createElement("style");
        oStyle.innerHTML =
            ".noahlu-miao{border-radius:2px;background-color:rgba(5,5,5,0.15); padding:3px; position:fixed;top:30px;left:30px;z-index:1000000000;}" +
            ".noahlu-miao header{text-align:center;}" +
            ".noahlu-miao-link{font-size:10px; color:red;text-decoration:underline;margin-bottom:3px;text-align:center}" +
            ".noahlu-miao-timer{color:#fff;font-size:20px;padding:5px;border:1px solid #aaa;background-color:#bbb;border-radius:4px;}" +
            ".noahlu-score{text-align:center;color:red;}" +
            ".noahlu-miao-info{text-align: center; margin: 0px; font-size: 12px;}" +
            ".noahlu-hide{display:none}"

        oScore = doc.createElement('div');
        oScore.className = 'noahlu-score noahlu-hide';
        oScore.id = 'noahlu-score';

        oDisplay.appendChild(oHeader);
        oDisplay.appendChild(oTimer);
        oDisplay.appendChild(oScore);
        oDisplay.appendChild(oInfo);
        doc.head.appendChild(oStyle);
        doc.body.appendChild(oDisplay);

        // Toggle timer
        oSwithcer = oHeader.querySelectorAll('a')[1];
        oSwithcer.addEventListener('click', function(e){
            e.preventDefault();
            if(oTimer.className.indexOf('noahlu-hide') > -1) {
                oTimer.className = 'noahlu-miao-timer';
                oSwithcer.innerHTML = '收起';
            } else {
                oTimer.className = 'noahlu-hide';
                oSwithcer.innerHTML = '展开';
            }
        })
    }

    injectDom(document);
    

    function GetCookie(sName)
    {
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++)
        {
            var aCrumb = aCookie[i].split("=");
            if (sName == aCrumb[0])
                return unescape(aCrumb[1]);
        }
        return null;
    }

    $("#jb_add").click(function(e){
        for(var i=0;i<document.querySelectorAll(".item-link").length;i++){
            if(document.querySelectorAll(".item-link")[i].href.indexOf("https://item.")>-1){
                document.querySelectorAll(".item-link")[i].click();
            }
        }
    });


    //自动下单
    $("#book_start").click(function(){
        localStorage.setItem("auto_buy",1);
        setInterval(function(){
            $("#J_LinkBuy").click()
            if(localStorage.getItem("auto_buy")==1)
            {
                localStorage.removeItem("auto_buy");
                $(".go-btn").click();
            }
        },500);
    });


    $("#jb_start").click(function(){
        fPickShopJB();
    });


    //开始自动领金币
    $("#jb_start_auto").click(function(){
       localStorage.setItem("status_auto",true);
       fJBAuto();
    });


    window.addEventListener('message',function(e){
        console.log("e:"+JSON.stringify(e));
    },false);

    setTimeout(fJBAuto,5000);

    function fJBAuto(){
        if(localStorage.getItem("status_auto"))
        {
            var accountarray=[{username:"duoduojk",pwd:"q1w2e3r4"},{username:"zhouxd561128",pwd:"q1w2e3r4"}];
            var step = localStorage.getItem("jb_step")||"1";
            var accountindex = parseInt(localStorage.getItem("jb_accountindex")||0);
            console.log("step:"+step+";accountindex:"+accountindex);
            if(accountindex<accountarray.length)
            {
               switch(step)
               {
                    case "1"://跳转登录
                        location.href="https://login.taobao.com/member/login.jhtml?redirectURL=https%3A%2F%2Ftaojinbi.taobao.com%2Findex.htm%3Fspm%3Da1z02.1.1998056009.d4919644.YKKoEP";
                        localStorage.setItem("jb_step",2);
                        break;
                    case "2"://登录
                        
                        /*setTimeout(function(){*/
                            $("#TPL_username_1").val(accountarray[accountindex].username);
                            $("#TPL_password_1").val(accountarray[accountindex].pwd);
                            if($("#nc_1__scale_text")!=null)
                            {
                                $("#nc_1__bg").css("width","258px");
                                $("#nc_1_n1z").css("left","258px");
                            }

                            setTimeout(function(){
                                localStorage.setItem("jb_step",3);
                                $("#J_SubmitStatic").click();
                                
                            },500);
                            
                        /*},1000);*/
                        break;
                    case "3"://领取日常签到金币
                        $(".J_GoTodayBtn").click();
                        localStorage.setItem("jb_step",4);
                        break;
                    case "4"://领取店铺金币
                        fPickShopJB();
                        setTimeout(function(){localStorage.removeItem("jb_step");localStorage.setItem("jb_accountindex",accountindex+1);fJBAuto();},5000); 

                        break;
               }
               console.log("step="+step);
           }
           else
           {
                localStorage.removeItem("status_auto");
                localStorage.removeItem("jb_accountindex");
           }
           console.log("accountindex="+accountindex);
        }
        
    }

    //领取店铺金币
    function fPickShopJB(){
        $.ajax({
           type: "get",
           //dataType: "jsonp",
           jsonp: "callback",
           jsonpCallback: "jsonp1",
           url: "https://ajax-taojinbi.taobao.com/coin/GetSellerCoinJson.do?_ksTS=1476713915434_50",
           success: function(msg){
             //alert( "Data Saved: " + msg );
             if(msg.success)
             {
                 for(var i=0;i<msg.sellerCoinList.length;i++)
                 {
                    if(msg.sellerCoinList[i].tokenStatus){
                        var _getLink = "https:"+msg.sellerCoinList[i].getLink;
                        //console.log("_getLink:"+_getLink);
                        
                        //setTimeout(function(i){
                            var _tb_token_ = GetCookie("_tb_token_"); 
                            console.log("_getLink:"+_getLink);
                            console.log("i:"+i);
                            $.get(_getLink, function(data){
                                var _reg=/&sellerid=\d{2,}/,
                                _sellerid,
                                sArray=_reg.exec(data);
                                if(sArray!=null)
                                {
                                    _sellerid=sArray[0].split("=");
                                }

                                //var ljburl = $("head script").src;
                                console.log("_sellerid[1]:"+_sellerid[1]);
                                $.ajax({
                                   type: "get",
                                   jsonp: "callback",
                                   jsonpCallback: "jsonp514",
                                   url: "https://api-taojinbi.taobao.com/json/signin.htm?seller_id="+_sellerid[1]+"&_tb_token_="+_tb_token_+"&_ksTS=1476792475890_513",
                                   success: function(data){
                                        if(data.isSuccess)
                                        {
                                           console.log("签到成功,获得"+data.succ_coins); 
                                        }
                                        else
                                        {
                                            console.log("签到失败,"+data.err_msg); 
                                        }
                                   }
                               });
                            });
                            
                        //},500*i);
                    }
                 }
             }
             else
             {
                console.log("失败,"+msg.message); 
             }
             
           }
        });
    }



