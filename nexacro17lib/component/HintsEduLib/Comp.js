
var pForm = nexacro.Form.prototype;
//var pForm = this;

/**
 * @class 해당 콤포넌트의 form으로 부터의 경로를 구하는 함수
 * @param {Object} obj - 콤포넌트
 * @return {String} 해당 콤포넌트의 form으로 부터의 경로
 */
pForm.gfn_getCompId = function (obj)
{
	var sCompId = obj.name;
	var objParent = obj.parent;
	
	while (true)
	{
		//trace("" + objParent + " / " + objParent.name);
		if (objParent instanceof nexacro.ChildFrame )
		{
			break;
		}
		else {
			sCompId = objParent.name + "." + sCompId;
		}
		objParent = objParent.parent;		
	}
	return sCompId;
}



/**
 * @class 월력용 Calendar에 월력 Popup Div을 자동생성하고 해당 Popup Div을 호출
 * @param {Object} obj - 월력용 Calendar
 * @return N/A
 */
pForm.gfn_openMonthCal = function (obj)
{
    var sFullPath = this.gfn_getCompId(obj)     //FormID.Calendar00 or FormID.Div00.form.Calendar00
	var sFormId   = this.name;
    var compPath  = sFullPath.substr(sFormId.length+1);    //Calendar00 or Div00.form.Calendar00
    var compid    = nexacro.replaceAll(compPath, ".", "_"); //Calendar00 or Div00_form_Calendar00

	var compid = this.gfn_getCompId(obj);
    // Creating pdv
	if (this.gfn_isNull(this.components[compid])) {		
		var objCalPopupDiv = new PopupDiv();
		objCalPopupDiv.init(compid, obj.getOffsetLeft(), obj.getOffsetBottom(), 180, 200, null, null);		
		this.addChild(compid, objCalPopupDiv);
		objCalPopupDiv.show();
		objCalPopupDiv.set_url("Comm::Comm_CalMMPdv.xfdl");
		objCalPopupDiv.calObj = obj;
		objCalPopupDiv.calId = compPath;
        objCalPopupDiv.callbackfunc = obj.uCallbackfunc;
        objCalPopupDiv.addEventHandler("oncloseup", this.gfn_monthCalClose, this);
	}
	else {
		var objCalPopupDiv = this.components[compid];
		
		// Calendar에서 수정한 년도를 Popup Div에 반영
		var sDate = obj.value;
        if(this.gfn_isNull(sDate)) sDate = this.gfn_getDate();;
		objCalPopupDiv.form.sta_year.set_text(sDate.substr(0,4));
  	}

	objCalPopupDiv.trackPopupByComponent(obj, 0, obj.height);
	
	return false;
};

pForm.gfn_monthCalClose = function(obj)
{
	if (!this.gfn_isNull(obj.callbackfunc))
	{	
		this.lookupFunc(obj.callbackfunc).call(obj.calId, obj.calObj.value); 
	}

}

pForm.gfn_openMultiCombo = function(obj)
{
		var gtrcPos = "Comp.xjs.gfn_openMultiCombo";
							this.gtrace("● 멀티콤보라이브러리 : gfn_openMultiCombo"				, gtrcPos);
	this.gfn_getParentForm();	// 공통화폼의 경우 무조건 실행

				
				this.gtrace(" - this.sParentFormGetTxt	--->"+this.sParentFormGetTxt	, gtrcPos);
				this.gtrace(" - this.oFrmParnt.name    --->"+this.oFrmParnt.name		, gtrcPos);
				this.gtrace(" - this.oDivParnt.name    --->"+this.oDivParnt.name		, gtrcPos);
				this.gtrace(" - this.oTargetGrid       --->"+this.oTargetGrid			, gtrcPos);
				this.gtrace(" - this.oTargetDs         --->"+this.oTargetDs				, gtrcPos);
				this.gtrace(" - this.sInitCompVisEna   --->"+this.sInitCompVisEna		, gtrcPos);
	
    if(this.gfn_isNull(obj.u_innerdataset) || this.gfn_isNull(obj.u_codecolumn) || this.gfn_isNull(obj.u_datacolumn)){
        this.alert("innerdataset error");
        return;
    }

	//	var objDs = this.all[obj.u_innerdataset];
    var objDs = this.oFrmParnt.all[obj.u_innerdataset];
    if(this.gfn_isNull(objDs)){		
			this.alert("innerdataset error");
        return;
    }

    // obj : Combo Object
    // 컴포넌트의 Full 경로: Formid.Combo00 or Formid.Div00.form.Combo00
    // 맨 앞쪽에 Formid 제거, "."을 "_"로 변경(컴포넌트ID에 "." 설정 불가)
    // PopupDiv 생성시 Pdv_
    // Dataset  생성시 ds_
    var sFullPath = this.gfn_getCompId(obj)     
	var sFormId   = this.name;    
    var compPath  = sFullPath.substr(sFormId.length+1);    //Combo00 or Div00.form.Combo00
    var compid    = nexacro.replaceAll(compPath, ".", "_");

    //1. Combo InnerDataset 생성        
    var sDsId = "ds_" + compid;   // innerdataset id는 "ds_"+ComboID로 지정 ds_Combo00    

    var objComboDs = this.all[sDsId];
	if(this.gfn_isNull(objComboDs)) {		
		objComboDs = new Dataset();
		this.addChild(sDsId, objComboDs);

        var cmbCode = obj.u_codecolumn;         //콤보의 사용자속성 사용 --> 콤보의 innerdataset, codecolumn에 지정하면 콤보의 text가 설정 안됨
        var cmbName = obj.u_datacolumn;         //콤보의 사용자속성 사용
        var displayCnt = obj.displayrowcount;   //콤보의 속성 사용
        if(this.gfn_isNull(displayCnt)) displayCnt = 10; //최대 10개로 지정

        //멀티콤보 데이터셋 컬럼 생성
        objComboDs.clear();
        objComboDs.addColumn("mComboChk", "STRING");
        objComboDs.addColumn(cmbCode    , "STRING");
        objComboDs.addColumn(cmbName    , "STRING");

        //멀티콤보 데이터셋 데이터 추가
        objComboDs.set_enableevent(false);
        for(var j=0; j<objDs.getRowCount(); j++)
        {
            objComboDs.addRow();
            objComboDs.setColumn(j, "mComboChk", "0");
            objComboDs.setColumn(j, cmbCode, objDs.getColumn(j, cmbCode));
            objComboDs.setColumn(j, cmbName, objDs.getColumn(j, cmbName));
        }
        if(objDs.getRowCount() < displayCnt)    displayCnt = objDs.getRowCount();        
        objComboDs.set_enableevent(true);        
	}
    
    //2. PopupDiv 생성
    var sPdvId = "pdv_" + compid;    
    var objPdv = this.components[sPdvId];		
	if(this.gfn_isNull(objPdv)) {		
		var objPdv = new PopupDiv();        
		objPdv.init(sPdvId, obj.getOffsetLeft(), obj.getOffsetBottom(), 100, 100, null, null);		
		this.addChild(sPdvId, objPdv);
		objPdv.show();
		objPdv.set_border("1px solid #cccccc");
        objPdv.uComboId = compPath;
        objPdv.uDs = objComboDs;
        objPdv.uCombo = obj;
        objPdv.uComboCode = obj.u_codecolumn;
        objPdv.uComboData = obj.u_datacolumn;
        objPdv.uCallback  = obj.u_callback;
        
        objPdv.addEventHandler("oncloseup", this._pdvClose, this);
	}
        
    //3. Grid 생성    
    var objGrid = objPdv.form.components["grd_cmb"];		
	if(this.gfn_isNull(objGrid)){		
        var oGrd = new Grid("grd_cmb", 0, 0, null, null, 0, 0);
        oGrd.set_cssclass("grd_mCombo");
        objPdv.addChild("grd_cmb", oGrd); 
        
        oGrd.set_enableevent(false);
        oGrd.set_enableredraw(false);
        
        oGrd.set_binddataset(objComboDs.name);
        oGrd.set_wheelscrollrow(1);
        oGrd.createFormat();	

        oGrd.mergeCell(1, 2, -1, -1);   //헤더 체크박스 제외 머지
        oGrd.setCellProperty("head", 0, "displaytype", "checkboxcontrol");
        oGrd.setCellProperty("head", 0, "text", "0");
        oGrd.setCellProperty("head", 1, "text", "Select all");
        
        oGrd.setCellProperty("Body", 0, "displaytype", "checkboxcontrol");
        oGrd.setCellProperty("Body", 0, "edittype", "checkbox");
        oGrd.set_autosizingtype("col");
        oGrd.set_scrollbarsize(10);

        oGrd.show();

        oGrd.addEventHandler("onheadclick", this.gfn_grid_onheadclick, this);
        oGrd.set_enableevent(true);
        oGrd.set_enableredraw(true);    
        
        var nScrollSize = oGrd.scrollbarsize;
        var nGridSize = oGrd.getRealColFullSize();  //그리드 전체 컬럼 사이즈
        var nGridCol0 = oGrd.getRealColSize(0);     //첫번째 컬럼 사이즈: checkbox
        var nGridCol1 = oGrd.getRealColSize(1);     //두번째 컬럼 사이즈: code
        var nGridCol2 = oGrd.getRealColSize(2);     //세번째 컬럼 사이즈: value
        var nGridRow0 = oGrd.getRealRowSize(-1);
        var nGridRow1 = oGrd.getRealRowSize(0);
                
        //콤보 사이즈를 기준
        var nComboSize = obj.getOffsetWidth() - 2; //보더제외

        // 데이터 길이가 짧아 그리드에 빈영역이 생길경우 컬럼사이즈 조정
        if(nComboSize > nGridSize){
            oGrd.setRealColSize("body", 0, nGridCol0);
            oGrd.setRealColSize("body", 1, nGridCol1);
            oGrd.setRealColSize("body", 2, nComboSize-nGridCol0-nGridCol1-nScrollSize);
            objPdv.set_width(nComboSize+2);
        }
        // 데이터 길이가 길어서 콤보영역에 다 안보일 경우 사이즈 키움
        else{
            objPdv.set_width(nGridSize + nScrollSize + 2);
        }        
        objPdv.set_height(nGridRow0 + (nGridRow1 * displayCnt) + 2);
    }
    obj.set_text("선택");
	objPdv.trackPopupByComponent(obj, 0, obj.height);
}


pForm._pdvClose = function(obj, e)
{
//    trace(obj.uDs);     //object dataset
//    trace(obj.uCombo);  //object combo
	this.gfn_getParentForm();	// 공통화폼의 경우 무조건 실행

				
				trace(" - this.sParentFormGetTxt	--->"+this.sParentFormGetTxt);
				trace(" - this.oFrmParnt.name    --->"+this.oFrmParnt.name		);
				trace(" - this.oDivParnt.name    --->"+this.oDivParnt.name		);
				trace(" - this.oTargetGrid       --->"+this.oTargetGrid			);
				trace(" - this.oTargetDs         --->"+this.oTargetDs			);
				trace(" - this.sInitCompVisEna   --->"+this.sInitCompVisEna		);
				
	var arrTextList  = [];
	var arrValueList = [];

	for(var i=0; i<obj.uDs.getRowCount(); i++)
	{
		if(obj.uDs.getColumn(i, "mComboChk") == "1"){
			arrTextList.push(obj.uDs.getColumn(i, obj.uComboData));
			arrValueList.push(obj.uDs.getColumn(i, obj.uComboCode));
		}
	}

	this.gfn_setComboText(obj.uCombo, arrTextList, arrValueList);

	if (!this.gfn_isNull(obj.uCallback)){		//	trace("obj.uCombo.name--->"+obj.uCombo.name);
												//	trace("obj.uCallback------>"+obj.uCallback);
												//	trace("this.oFrmParnt.lookupFunc(obj.uCallback)--->"+this.oFrmParnt.lookupFunc(obj.uCallback));
												//	trace("this.lookupFunc(obj.uCallback)--->"+this.lookupFunc(obj.uCallback));
												//	trace("this.parent.lookupFunc(obj.uCallback)--->"+this.parent.lookupFunc(obj.uCallback));
												//	trace("this.parent.parent.lookupFunc(obj.uCallback)--->"+this.parent.parent.lookupFunc(obj.uCallback));
												//	trace("this.parent.form.lookupFunc(obj.uCallback)--->"+this.parent.form.lookupFunc(obj.uCallback));
												//	trace("this.parent.form.parent.lookupFunc(obj.uCallback)--->"+this.parent.form.parent.lookupFunc(obj.uCallback));
												
												//	trace("this.parent.form.parent.parent.lookupFunc(obj.uCallback)--->"+this.parent.form.parent.parent.lookupFunc(obj.uCallback));
												//	trace(this.name);
												
	eval(obj.uCallback+"(obj.uCombo, arrTextList, arrValueList)"); 

		//	this.lookupFunc(obj.uCallback).call(obj.uCombo); 
		//	eval("this.oFrmParnt.form."+obj.uCallback+"()");
	}
};

pForm.gfn_setComboText = function(objCombo, arrTextList, arrValueList)
{
	var sComboText = arrTextList.toString();
	
	objCombo.retrunvalue = arrValueList.toString();
	objCombo.returntext = sComboText;
	var objRtn = nexacro.getTextSize(sComboText, "12px Malgun Gothic");
	var nComboTextWidth = objRtn.nx;
	
	var nWidth = objCombo.getOffsetWidth();
	if (nComboTextWidth > nWidth){
		objCombo.set_text(arrTextList.length+"개 선택");
		objCombo.set_tooltiptext(sComboText);
		objCombo.set_tooltiptype("hover");
	}
	else{
		objCombo.set_text(sComboText);
	}
		
	if (this.gfn_isNull(arrTextList)) objCombo.set_text("선택");
};


var pCombo = nexacro.Combo.prototype;
pCombo.get_value = function()
{
    return this.retrunvalue;
}

pCombo.get_text = function()
{
    return this.returntext;
}

/**
 * @class 공통코드 설정
 * @param 컴퍼넌트 id  구분자는 space
 * @return N/A
 */
pForm.gfn_getCommCode = function()
{
	var arg = this.gfn_getCommCode.arguments;
	var arrComm = arg[0].split(" ");
	if (arrComm.length == 0) {
		return;
	}

	var sCompId = "";
	var objDs = "";
    var strDs = "";
    var objApp = this.gfn_getApplication();
    //"cbo_List cbo_List2:0"
	for(var i=0; i<arrComm.length; i++) 
	{
		var sCompId = arrComm[i].split(":")[0]; 
		var sType   = arrComm[i].split(":")[1];
        
//       sCompId = this.all[sCompId];
        sCompId = eval("this."+sCompId);
        
		if(sCompId instanceof nexacro.Dataset){
            strDs = sCompId.id;
            objDs = sCompId;
        }
        else{
//            strDs = sCompId.innerdataset;
            objDs = sCompId.getInnerDataset();            
            strDs = objDs.id;
        }

        sCodeType = strDs.substr(strDs.length-4, 4);   //ds_C003...
        objApp.gds_CommCode.filter("CodeGroup =='" + sCodeType + "'");
        objDs.copyData(objApp.gds_CommCode, true);
        objApp.gds_CommCode.filter("");
        if (!this.gfn_isNull(sType)){
            if (sType != 2)	{
                objDs.insertRow(0);
                objDs.setColumn(0, "Code", (sType == 0 ? "ALL" : ""));
                objDs.setColumn(0, "CodeName", (sType == 0 ? "ALL" : "Selected..."));
            }
        }
        
        if(sCompId instanceof nexacro.Combo || sCompId instanceof nexacro.ListBox || sCompId instanceof nexacro.Radio){
            sCompId.set_index(0);
        }
	}
}



/**
 * @class  DLL의 full 경로를 리턴
 * @param  {String} 컴포넌트 DLL 파일명
 * @return {String} 해당 DLL의 실제 경로
 */
pForm.gfn_getDLLPath = function(sFileName)
{
	var strpath = "";
	var xadl = nexacro.getProjectPath();
	
	// studio로 실행
    if (xadl.indexOf("file://") != -1) {        
		xadl = xadl.replace("file://", "");
        strpath  = nexacro.replaceAll(xadl.substring(0, xadl.lastIndexOf("/")), "/", "\\")+"\\dll\\"+sFileName;
    }
	// 웹 접속
    else {
		strpath = system.convertRealPath("%USERAPP%\\Component\\" + sFileName);
	}
	
	//trace("==================== gfnGetDLLPath strpath : " + strpath);
    return strpath;
};

/**
 * @class 컴포넌트 DLL 을 로딩하고 그 결과 Object를 리턴
 * @param {String}  컴포넌트 DLL 파일명
 * @return {Object} DLL 컴포넌트 Object
 */ 
pForm.gfn_openDLL = function(sFileName)
{
	var objApp = this.gfn_getApplication();
	
	if (this.gfn_isNull(objApp[sFileName])) {
		objApp[sFileName] = {};
	}
	else {
		return objApp[sFileName];
	}

	// 로컬/웹 접근에 따른 파일 full 경로 가져오기
	var strpath = this.gfn_getDLLPath(sFileName);

	// dll load
	objApp[sFileName] = nexacro._addExtensionModule(strpath);

	return objApp[sFileName];
};

/**
 * @class 컴포넌트 DLL 을 로딩하고 그 결과 Object를 리턴
 * @return N/A
 */  
pForm.gfn_closeDLL = function(sFileName)
{
	// 로컬/웹 접근에 따른 파일 full 경로 가져오기
	var strpath = this.gfn_getDLLPath(sFileName);
	
	// dll 등록 해제
	nexacro._clearExtensionModule(strpath);
	
	// 객체 null 처리
	var objApp = this.gfn_getApplication();
	objApp[sFileName] = null;
};

/**
 * @class 확장 컴포넌트 DLL를 로딩하고 그 결과 Object를 리턴
 * @return {Object} 확장 컴포넌트 Object
 */ 
pForm.gfn_getExtCommon = function()
{
	var strFile = "";

// 	// XP
// 	if (system.osversion == "Windows XP") {
// 		strFile = "ExtCommonV17_XP.dll";
// 	}
// 	// 나머지 OS
// 	else {
// 		strFile = "ExtCommonV17_32.dll";
// 	}
	
	// nexacro 엔진 버전 체크
	var navigatorFullName = system.navigatorfullname;
	//trace("navigatorFullName : " + navigatorFullName);
	
	if (navigatorFullName == "nexacro platform 17 Engine (Windows XP)" ) {
		strFile = "ExtCommonV17_XP.dll";
	}
	else if (navigatorFullName == "nexacro platform 17 Engine (x86)") {
		strFile = "ExtCommonV17_32.dll";
	}
	else {
		strFile = "ExtCommonV17_64.dll";
	}	
	
	trace("==================== gfn_getExtCommon strFile : " + strFile);
	return this.gfn_openDLL(strFile);
};

/**
 * @class확장 컴포넌트 DLL를 해제한다.
 * @return N/A
 */  
pForm.gfn_closeExtCommon = function()
{
	var strFile = "";

// 	// XP
// 	if (system.osversion == "Windows XP") {
// 		strFile = "ExtCommonV17_XP.dll";
// 	}
// 	// 나머지 OS
// 	else {
// 		strFile = "ExtCommonV17_32.dll";
// 	}

	// nexacro 엔진 버전 체크
	var navigatorFullName = system.navigatorfullname;
	//trace("navigatorFullName : " + navigatorFullName);
	
	if (navigatorFullName == "nexacro platform 17 Engine (Windows XP)" ) {
		strFile = "ExtCommonV17_XP.dll";
	}
	else if (navigatorFullName == "nexacro platform 17 Engine (x86)") {
		strFile = "ExtCommonV17_32.dll";
	}
	else {
		strFile = "ExtCommonV17_64.dll";
	}	
	this.gfn_closeDLL(strFile);
};