/**
*  @FileName 	Popup.js 
*/

var pForm = nexacro.Form.prototype;
//var pForm = this;

/**
 * @class 팝업오픈
 * @param {String} sPopupId	- 팝업ID
 * @param {String} sUrl	 - 팝업URL
 * @param {String} [oArg] - 전달값
 * @param {String} [sPopupCallback] - 팝업콜백
 * @param {Object} [oOption] - 팝업옵션 <br>
 *	oOption.top : 상단 좌표 <br>
 *	oOption.left : 좌측 좌표 <br>
 *	oOption.width : 넓이 <br>
 *	oOption.height : 높이 <br>
 *	oOption.popuptype : 팝업종류(modal:showModal, modeless:application.open, modalsync:showModalSync, modalwindow:showModalWindow) <br>
 *	oOption.layered : 투명 윈도우 <br>
 *	oOption.opacity : 투명도 <br>
 *	oOption.autosize : autosize <br>
 * @return N/A
 * @example
 * this.gfnOpenPopup(this);
 */
pForm.gfn_openPopup = function(sPopupId, sUrl, oArg, sPopupCallback, oOption)
{
    var objApp = pForm.gfn_getApplication();
	var nLeft = -1;
	var nTop = -1;
	var nWidth = -1;
	var nHeight = -1;
	var bShowTitle = true;	
	var bShowStatus = false;	
	var sPopupType = "modal";
	var bLayered = false;
	var nOpacity = 100;
	var bAutoSize = false;
	var bResizable = false;
	var sPopupCallback = (this.gfn_isNull(sPopupCallback)) ? "fn_popupAfter" : sPopupCallback;
	var sTitleText = "";

	for (var key in oOption) {
       if (oOption.hasOwnProperty(key)) {
            switch (key) 
			{
				case "top":				
					nTop = parseInt(oOption[key]);
					break;
				case "left":
					nLeft = parseInt(oOption[key]);
					break;
				case "width":
					nWidth = parseInt(oOption[key]);
					break;
				case "height":
					nHeight = parseInt(oOption[key]);
					break;
				case "popuptype":
					sPopupType = oOption[key];
					break;
				case "layered":
					bLayered = oOption[key];
					break;
				case "opacity":
					nOpacity =oOption[key];
					break;
				case "autosize":
					bAutoSize = oOption[key];
					break;
				case "titlebar":
					if (""+oOption[key] == "false")	bShowTitle = false;		
					break;
				case "title":					
					sTitleText = oOption[key];	
					break;					
			}	
        }
    }

	var sOpenalign = "";
	if(nLeft == -1 && nTop == -1) {	
		sOpenalign = "center middle";
// 		if (system.navigatorname == "nexacro") {
// 			var curX = objApp.mainframe.left;
// 			var curY = objApp.mainframe.top;
// 		}
//         else{
// 			var curX = window.screenLeft;
// 			var curY = window.screenTop;
// 		}
//         nLeft =  curX + (objApp.mainframe.width / 2) - Math.round(nWidth / 2);
// 	    nTop  = curY + (objApp.mainframe.height / 2) - Math.round(nHeight / 2) ;				

        nLeft = (objApp.mainframe.width  / 2) - Math.round(nWidth / 2);
        nTop  = (objApp.mainframe.height / 2) - Math.round(nHeight / 2) ;		
        nLeft = system.clientToScreenX(this, nLeft);
        nTop  = system.clientToScreenY(this, nTop);

	}
    else {
		nLeft   =  this.getOffsetLeft() + nLeft;
		nTop   =  this.getOffsetTop() + nTop;
	}
		
	if(nWidth == -1 || nHeight == -1){
	    bAutoSize = true;
	}
	
	var objParentFrame = this.getOwnerFrame();

    if(sPopupType == "modeless"){
        var sOpenStyle= "showtitlebar=true showstatusbar=false showontaskbar=true showcascadetitletext=false resizable=true autosize="+bAutoSize+" titletext="+sTitleText;
		var arrPopFrame = nexacro.getPopupFrames();

		if (arrPopFrame[sPopupId]) {	
			if (system.navigatorname == "nexacro") {
				arrPopFrame[sPopupId].setFocus();
			} 
            else {	
				arrPopFrame[sPopupId]._getWindowHandle().focus();
			}
		}
		else {
			nexacro.open(sPopupId,sUrl,objParentFrame,oArg,sOpenStyle,nLeft, nTop, nWidth, nHeight, this);
		}
    }
	else if(sPopupType == "modalsync")
    {
		newChild = new nexacro.ChildFrame;
		newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sUrl);
		
		newChild.set_dragmovetype("all");
		newChild.set_showcascadetitletext(false);
		newChild.set_showtitlebar(bShowTitle);    //titlebar는 안보임
		newChild.set_autosize(bAutoSize);	
		newChild.set_resizable(bResizable);    //resizable 안됨
		if(!this.gfn_isNull(sTitleText)){
            newChild.set_titletext(sTitleText);
        }
		newChild.set_showstatusbar(bShowStatus);    //statusbar는 안보임
		newChild.set_openalign(sOpenalign);
		newChild.set_layered(bLayered);
		newChild.set_overlaycolor("RGBA(0, 0, 0, 0.2)");
		system.showModalSync(newChild, objParentFrame, oArg);	
	}
	else if(sPopupType == "modalwindow")
    {
		newChild = new nexacro.ChildFrame;
		newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sUrl);
		
		newChild.set_dragmovetype("all");
		newChild.set_showcascadetitletext(false);
		newChild.set_showtitlebar(bShowTitle);    //titlebar는 안보임
		newChild.set_autosize(bAutoSize);	
		newChild.set_resizable(bResizable);    //resizable 안됨
		if(!this.gfn_isNull(sTitleText)){
            newChild.set_titletext(sTitleText);
        }
		newChild.set_showstatusbar(bShowStatus);    //statusbar는 안보임
		newChild.set_openalign(sOpenalign);
		newChild.set_layered(bLayered);
		newChild.set_overlaycolor("RGBA(0, 0, 0, 0.2)");
		var rtn = system.showModalWindow(newChild, sPopupId, objParentFrame, oArg);		
        return rtn;
	}	
    else
    {
		newChild = new nexacro.ChildFrame;
		newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sUrl);
		
		newChild.set_dragmovetype("all");
		newChild.set_showcascadetitletext(false);
		newChild.set_showtitlebar(bShowTitle);    //titlebar는 안보임
        if(bShowTitle){
            newChild.set_titlebarheight(33);
        }
		newChild.set_autosize(bAutoSize);	
		newChild.set_resizable(bResizable);    //resizable 안됨
		if(!this.gfn_isNull(sTitleText)){
            newChild.set_titletext(sTitleText);
        }
		newChild.set_showstatusbar(bShowStatus);    //statusbar는 안보임
		newChild.set_openalign(sOpenalign);
		newChild.set_layered(bLayered);
		newChild.set_overlaycolor("RGBA(0, 0, 0, 0.2)");
		newChild.showModal(objParentFrame, oArg, this, this[sPopupCallback]);
		//newChild.titlebar.closebutton.set_visible(false);	//close버튼 visible false 처리
		//newChild.style.set_border("2 solid #24322b");
		//newChild.style.set_bordertype("round 10 10");
		//newChild.style.set_background("white");    
		//newChild.style.set_opacity(nOpacity);

    }
};

// ex : this.gfn_openSearchPop("POHIST_POP_VendorCode", {pStr:"", pNum:"", pObj:""}, "callbackFunc_pop", {title:"VendorCode"});
//								콜백의 아이디로사용,   넘길 파람,                 콜백함수명,       옵션:title값을 gds_SearchConditionType에서 찾음
pForm.gfn_openSearchPop = function(sPopupId, oArg, sCallBack, oOption)
{
	var gtrcPos = "Popup.xjs.gfn_openSearchPop";
	this.gtrace("● 팝업오픈공통함수(gtrcPos)", gtrcPos);
	this.gtrace("oOption.title값을 gds_SearchConditionType에서 찾아 팝업폼을 열고 타이틀을 표시한다.", gtrcPos);
	this.gtrace("ex : this.gfn_openSearchPop('POHIST_POP_VendorCode', {pStr:'', pNum:'', pObj:''}, 'callbackFunc_pop', {title:'VendorCode'});", gtrcPos);
	
	var sPopUrl;
	var sPopTitle;
	var ds_SearchConditionType = this.gfn_getApplication().gds_SearchConditionType;
	
	// 팝업의 URL, TitleText
		sPopUrl 	= ds_SearchConditionType.lookup("TypeCode",oArg.TypeCode, "PopupUrl");
	if(this.gfn_isNull(sPopUrl)){this.gfn_alert("PopupUrl does not exists"); return;}
	
	//	언어적용
	oOption.title	= this.gfn_getWord(oOption.title);
		
		this.gtrace("sPopUrl--->"+sPopUrl, gtrcPos);
		this.gtrace("sPopTitle--->"+sPopTitle, gtrcPos);
		this.gtrace("oOption--->"+oOption, gtrcPos);

	// 호출
	this.gfn_openPopup(sPopupId, sPopUrl, oArg, sCallBack, oOption);
};
