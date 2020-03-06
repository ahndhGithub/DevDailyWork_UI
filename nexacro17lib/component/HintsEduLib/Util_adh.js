/**
*  @FileName 	Util.js 
*/

var pForm = nexacro.Form.prototype;

//var pForm = this;		// 탭 페이지 안에 있는 그리드의 경우 this로 하면 안 먹는다.


/**
 * @class
 * @param 
 * @param 
 * @return
 * @desc	- 날짜 : 191224.
			- 증상 : 숨기기 후 컬럼 사라짐
			- 원인 : 타겟그리드의org포맷(orgformat2)--> undefined
			- 수정 : Grid.xjs.gfn_setGridobjGrid.orgformat2 = objGrid.getFormatString()
 */ 
pForm.gtrace_191224_ColumnHide = function(strTrc,strPos)
{	//	우클릭메뉴 ( 컬럼 숨기기 / 보이기 )
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;
 
	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_191224_ColumnHide", "ROW_CHK"),"")!="1") return;
	
	if(	strPos == "Grid.xjs.gfn_popupmenu_onmenuclick"		//	우클릭메뉴에서 해당메뉴 선택
	||	strPos == "Grid.xjs._gfnGridColHideShow"
	||	strPos == "Comm_ColumnHide.xfdl.form_onload"
	||	strPos == "Comm_ColumnHide.xfdl.fn_getHeadText"
	||	strPos == "Comm_ColumnHide.xfdl.fn_setGrd"
	||	strPos == "Comm_ColumnHide.xfdl.btn_ok_onclick"		//	팝업메뉴에서 확인 버튼
	||	strPos == "Grid.xjs.gfn_columnHidCallback"
	){
		this.fn_trace(strTrc, strPos);
	}
}

pForm.fn_trace = function(strTrc, strPos){

	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;
 	
	if(strTrc.indexOf("●")==-1){
		if(strTrc.indexOf(" - ")!=0){
			strTrc = " - "+strTrc;
		}
	}
	
	var sTxt = strPos+"--------->"+strTrc;
	trace(sTxt);
//	nexacro.getApplication().TrcOutputTxt += sTxt;
// 	if(nexacro.getApplication().gds_TrcOutputTxt.rowcount == 0)
// 	{
// 		nexacro.getApplication().gds_TrcOutputTxt.addRow();
// 	}
	
// 	var sTmpOuTxt = this.gfn_nvl(nexacro.getApplication().gds_TrcOutputTxt.getColumn(0, "OutputTxt"), "");
// 		//	sTmpOuTxt = sTmpOuTxt+"\n"+sTxt;
// 		sTmpOuTxt = sTxt+"\n"+sTmpOuTxt;
		
	//	nexacro.getApplication().gds_TrcOutputTxt.setColumn(0, "OutputTxt", nexacro.trim(sTmpOuTxt));
}
/**
 * @class
 * @param 
 * @param 
 * @return
 * @desc	- 날짜 : 191229.
			- 증상 : 
			- 원인 : 
			- 수정 : 
 */
pForm.gtrace_191229_Comm_ComboConditionFromTo = function(strTrc,strPos)
{	//	콤보조건공통화_From_To
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;
 		
	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_191229_Comm_ComboConditionFromTo", "ROW_CHK"),"")!="1") return;
	
	if(	strPos == "Comm_ComboConditionFromTo.xfdl.form_onload"	//	온로드
 	||	strPos == "Comm_ComboConditionFromTo.xfdl.fn_cmcdColAdd"
	){
		if(	pForm.gfn_isNull(strPos)				//strPos 없이 넘어 오면 무조건 찍는다.
		//	||	this.oFrmParnt.name=="Order_recap" && this.oDivParnt.name=="div_YearFromTo"
		//	||	this.oFrmParnt.name=="Order_recap" && this.oDivParnt.name=="div_OsFactory"
		//	||	this.oFrmParnt.name=="Order_recap" && this.oDivParnt.name=="div_Season"
		||	this.oFrmParnt.name=="Order_recap" && this.oDivParnt.name=="div_SalesGroup"
		)
		this.fn_trace(strTrc, strPos);
	}
}


/**
 * @class
 * @param 
 * @param 
 * @return
 * @desc	- 날짜 : 200104.
			- 증상 : 
			- 원인 : 
			- 수정 : 
 */
pForm.gtrace_200104_cmmSearchConditionFromTo = function(strTrc,strPos)
{
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;

	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_200104_cmmSearchConditionFromTo", "ROW_CHK"),"")!="1") return;
	
	if(strPos == "Comm_SearchConditionFromTo.xfdl.form_onload"
	)
	{
		this.fn_trace(strTrc, strPos);
	}
}

/**
 * @class
 * @param 
 * @param 
 * @return
 * @desc	- 날짜 : 191230.
			- 증상 : 
			- 원인 : 
			- 수정 : 
 */
pForm.gtrace_191230_Comm_MultiCombo = function(strTrc,strPos)
{
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;

	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_191230_Comm_MultiCombo", "ROW_CHK"),"")!="1") return;
	
	if(strPos.indexOf("Comm_MultiComb.xfdl.")>-1)
	{
		this.fn_trace(strTrc, strPos);
	}
}




/**
 * @class
 * @param 
 * @param 
 * @return
 * @desc	- 날짜 : 191225.
			- 증상 : 엑셀Export헤더필드 없음.(디폴트그리드세팅이 적용된 경우)
			- 원인 : 찾지못함
			- 수정 : 타겟그리드의org포맷(orgformat2)--> undefined 조치 이후에 증상 사라짐.
 */
pForm.gtrace_191225_ExcelExport = function(strTrc,strPos)
{	//	엑셀export
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;

	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_191225_ExcelExport", "ROW_CHK"),"")!="1") return;
	
	if(	strPos == "Grid.xjs.gfn_popupmenu_onmenuclick"		//	우클릭메뉴에서 해당메뉴 선택
	||	strPos == "Grid.xjs._gfnGridExcelExport"
 	||	strPos == "Excel.xjs.gfn_excelExport"
 	||	strPos == "ExportObject.xjs.exportData"
	){	
		this.fn_trace(strTrc, strPos);
	}
}

/**
 * @class
 * @param 
 * @param 
 * @return
 * @desc	- 날짜 : 191226.
			- 증상 : 공통코드를 가져오지 못함. ( this.COMBO_SET_STR )
			- 원인 : 
			- 수정 : 
 */
pForm.gtrace_191226_CommCodeSetting = function(strTrc,strPos)
{	//	엑셀export
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;

	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_191226_CommCodeSetting", "ROW_CHK"),"")!="1") return;
	if(	strPos == "Util_adh.xjs.gfn_getAllInitData"
	){	
		this.fn_trace(strTrc, strPos);
	}
}

pForm.gtrace_200107_cmmGridFilterButton = function(strTrc,strPos)
{	//	퀵그리드필터버튼클릭
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;
	
	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_200107_cmmGridFilterButton", "ROW_CHK"),"")!="1") return;
	
	if(strPos.indexOf("cmmGridFilterButton.xfdl.")>-1)
	{
// 		if(
// 			strPos == "cmmGridFilterButton.xfdl.form_onload"				
// 		||	strPos == "cmmGridFilterButton.xfdl.btn_GridFilter_onclick"	
// 		||	strPos == "cmmGridFilterButton.xfdl.fn_SaveLayoutPopup"		
// 		||	strPos == "cmmGridFilterButton.xfdl.fn_popupCallback"			
// 		)
		{
			this.fn_trace(strTrc, strPos);
		}
	}
}


pForm.gtrace_gfn_getParentForm = function(strTrc,strPos)
{	//	부모폼가져오기
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;
	
	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_gfn_getParentForm", "ROW_CHK"),"")!="1") return;
	
	if(strPos.indexOf("Util_adh.xjs.gfn_getParentForm")>-1)
	{
// 		if(
// 			strPos == "cmmGridFilterButton.xfdl.form_onload"				
// 		||	strPos == "cmmGridFilterButton.xfdl.btn_GridFilter_onclick"	
// 		||	strPos == "cmmGridFilterButton.xfdl.fn_SaveLayoutPopup"		
// 		||	strPos == "cmmGridFilterButton.xfdl.fn_popupCallback"			
// 		)
		{
			this.fn_trace(strTrc, strPos);
		}
	}
}

/**
 * @class
 * @param 
 * @param 
 * @return
 */
pForm.gtrace_checked = function(strPos)
{
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;

	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", strPos, "ROW_CHK"),"")=="1") return true;
	else return false;
}

/**
 * @class
 * @param 
 * @param 
 * @return
 */
pForm.gtrace = function(strTrc,strPos)
{
	var gds_TrcInfo = this.gfn_getApplication().gds_TrcInfo;
	var gds_TrcInfoOutput = this.gfn_getApplication().gds_TrcInfoOutput;

	if(!pForm.gtrace_checked(strPos)) return;
	
	//	부모폼가져오기
	this.gtrace_gfn_getParentForm(strTrc,strPos);
	
	//	퀵그리드필터버튼클릭
	this.gtrace_200107_cmmGridFilterButton(strTrc,strPos);
							// 	gds_TrcInfo.filter("");
							// 	gds_TrcInfo.filter("ROW_CHK=='1'");
							// 	for(var i=0; i < gds_TrcInfo.rowcount ; i++){
							// 		var tFn = gds_TrcInfo.getColumn(i, "TrcId");
							// 		var sEvFn = "this."+tFn+"(strTrc,strPos)";
							// 		eval(sEvFn);
							// 	}
	
	//	if(this.gfn_nvl(gds_TrcInfo.lookup("TrcId", "gtrace_200107_cmmGridFilterButton", "ROW_CHK"),"")!="1") return;
	
	//	우클릭메뉴 ( 컬럼 숨기기 / 보이기 )
	this.gtrace_191224_ColumnHide(strTrc,strPos);
		
	//	엑셀내보내기
	this.gtrace_191225_ExcelExport(strTrc,strPos);

	//	초기데이터모두가져오기
	this.gtrace_191226_CommCodeSetting(strTrc,strPos);
	
	//	콤보조건공통화_From_To
	this.gtrace_191229_Comm_ComboConditionFromTo(strTrc, strPos);
	
	//	멀티콤보
	this.gtrace_191230_Comm_MultiCombo(strTrc, strPos);

	if(pForm.gtrace_checked(strPos))	this.fn_trace(strTrc, strPos);
	
// 	if(strPos.indexOf("Util_adh.xjs.gfn_getParentForm")>-1)
// 	{
// // 		if(
// // 			strPos == "cmmGridFilterButton.xfdl.form_onload"				
// // 		||	strPos == "cmmGridFilterButton.xfdl.btn_GridFilter_onclick"	
// // 		||	strPos == "cmmGridFilterButton.xfdl.fn_SaveLayoutPopup"		
// // 		||	strPos == "cmmGridFilterButton.xfdl.fn_popupCallback"			
// // 		)
// 		{
// 			this.fn_trace(strTrc, strPos);
// 		}
// 	}
// 	
// 	// 주석 처리 여부가 기능에 영향을 주어서는 안된다. 
// 	if ( pForm.gfn_isNull(strPos)				//strPos 없이 넘어 오면 무조건 찍는다.
// 
// // 		||	strPos == "Comm_ColumnHide.xfdl.form_onload"	// 숨기기/보이기팝업															
// // 		||	strPos == "Comm_ColumnHide.xfdl.fn_setGrd"		// 셋그리드
// // 		||	strPos == "Grid.xjs.gfn_setGrid"				// 그리드 세팅
// //  	||	strPos == "Grid.xjs._getUniqueId"				// 그리드의 유니크 아이디 가져오기
// //		||	strPos == "Grid.xjs._getGridUserProperty"		//
// //  	||	strPos == "Grid.xjs._gfnGridAddProp"			// userproperties , arrProp[i]값에 따라 sort-->objGrid.sort = 'true'--실행
// //  	||	strPos == "Grid.xjs.gfn_grid_onheadclick"		// 그리드 헤드 클릭 (체크박스 : 전체선택 / 일반 : 정렬)
// //  	||	strPos == "Grid.xjs._gfnHeadCheckSelectAll"		// 		-	체크박스 : 전체선택 / 전체해제)
// // 		||	strPos == "Grid.xjs.gfn_grid_onrbuttondown"		// 그리드 우클릭 이벤트
// //		||	strPos == "Grid.xjs._gfnMakeGridPopupMenu"		// 우클릭 팝업메뉴
// //		||	strPos == "Grid.xjs.gfn_popupmenu_onmenuclick"	// 우클릭 팝업메뉴--메뉴클릭시
// //		||	strPos == "Grid.xjs._gfnGridFilter"				// 필터설정
// //		||	strPos == "Grid.xjs._gfnGridcellFix"
// //		||	strPos == "Comm_GridFilter.xfdl.btn_filter_onclick"	// 필터적용 버튼
// //		||	strPos == "Grid.xjs._gfnGridSetCssclass"		// 	틀고정 행 실행/해제
// //		||	strPos == "Excel.xjs.gfn_excelExport"					// 엑셀 내보내기
// // 		||	strPos == "Form_Work.xfdl.Button_onclick"
// //		||	strPos == "Comm_SearchConditionFromTo.xfdl.form_onload"
// //		||	strPos == "Comm_SearchConditionFromTo.xfdl.div_search_btn_onclick"
// //		||	strPos == "Comm_SearchConditionFromTo.xfdl.EditFrom_onchanged"
// //		||	strPos == "Comm_SearchConditionFromTo.xfdl.fn_popupCallback"
// //		||	strPos == "Comm_SearchConditionFromTo.xfdl.ds_FromTo_oncolumnchanged"
// // 		||	strPos == "PopupSalesOrder.xfdl.Form_onload"
// // 		||	strPos == "PopupSaveLayout.xfdl.Form_onload"
// // 		||	strPos == "PopupSalesOrder.xfdl.btn_ok_onclick"
// // 		||	strPos == "Util_adh.xjs._getUserProperty"
// // 		||	strPos == "POList.xfdl.Button_SortGroup_onclick"
// // 		||	strPos == "POList.xfdl.callbackFunction"
// // 		||	strPos == "Comm_SubSum.xfdl.form_onload"
// //		||	strPos == "Comm_SubSum.xfdl.btn_ok_onclick"
// //		||	strPos == "Comm_SubSum.xfdl.fn_getHeadTextAndBindingInfo"
// //		||	strPos == "POList.xfdl.fn_reset"
// //		||	strPos == "Util_adh.xjs.gfn_getAllInitData"
// //		||	strPos == "Util_adh.xjs.gfn_callbackFunction"
// //		||	strPos == "Frame.xjs.gfn_setLanguage"
// //		||	strPos == "Comm_CrudButton.btnCrud_onclick"
// //		||	strPos == "Comm_CrudButton.form_onload"
// //		||	strPos == "Grid.xjs._gfnGridCheckboxNoStatusAdd"
// // 		||	strPos == "Transaction.xjs.gfn_callback"
// // 		||	strPos == "Transaction.xjs.gfn_transaction"
// //  	||	strPos == "Grid.xjs.gfn_multiDatasetChanged"
// //		||	strPos == "Comm_GridAddDelButton.form_onload"					
// //  	||	strPos == "cmmGridAddDelButton.xfdl.btn_del_onclick"
// //  	||	strPos == "Grid.xjs._gfn_getRowType"
// // 		||	strPos == "cmmGridAddDelButton.xfdl.fn_deleteRow"
// // 		||	strPos == "Validation.xjs.gfn_clearValidation"
// //		||	strPos == "Validation.xjs.gfn_setValidation"
// // 		||	strPos == "Validation.xjs.gfn_validation" 
// // 		||	strPos == "Validation.xjs.gfn_validationCheckRule"
// // 		||	strPos == "Message.xjs.gfn_alert"
// // 		||	strPos == "Grid.xjs._gfnGridPasteEvent"
// // 		||	strPos == "Grid.xjs.gfn_multiDatasetAdded"
// // 		||	strPos == "Comm_CnC.xfdl.fn_reset"
// // 		||	strPos == "Comm_CnC.xfdl.btn_ok_onclick"
// // 		||	strPos == "PopupMultiSelect.xfdl.Form_onload"
// // 		||	strPos == "PopupMultiSelect.xfdl.grd_list_onexpandup"
// // 		||	strPos == "cmmGridAddDelButton.xjs.btn_GridFormat_onclick"
// // 		||	strPos == "cmmGridAddDelButton.xfdl.fn_SaveLayoutPopup"
// // 		||	strPos == "PopupSaveLayout.xfdl.fn_reset"
// // 		||	strPos == "Comm_CrudButton.fn_setButtonVisEna"
// // 		||	strPos == "Util_adh.xjs.gfn_commButtonAlignByVisible"
// // 		||	strPos == "Util_adh.xjs.gfn_setUser"
// // 		||	strPos == "Util_adh.xjs.gfn_getParentForm"
// // 		||	strPos == "PopupSaveLayout.xfdl.callbackFunc_pop"
// // 		||	strPos == "Grid.xjs._gfnGridColHideShow"
// //		||	strPos == "Comm_CalFromTo.xfdl.form_onload"
// //		||	strPos == "Comm_CalFromTo.xfdl.ds_FromTo_oncolumnchanged"
// )	{
// 		this.fn_trace(strTrc, strPos);
// 	}
	
};

