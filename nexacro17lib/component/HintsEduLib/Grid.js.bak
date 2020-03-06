/**
*  @FileName 	Grid.js 
*/
var pForm = nexacro.Form.prototype;

//grid propertiy
pForm.defaultmenulis = "colfix,rowfix,sort,filter,initial";
pForm.selectmenulist = "checkbox,no,status,replace,colhide,export,import,personal,userheader,cellcopypaste";
pForm.popupmenulist = "colfix,rowfix,filter,initial,replace,colhide,export,import,personal,userheader";

//소트
// 헤더 클릭시 정렬 false= 오름/내림 true= 오름/내림/없음
pForm.SORT_TOGGLE_CANCEL = true;
pForm.MARKER_TYPE = "text"; // 정렬 표시자 구분 (text or image)
// Grid Head 에 정렬 상태를 표시할 텍스트 또는 이미지 경로 지정 
pForm.MARKER = ["▲", "▼"];// [오름차순표시, 내림차순표시]
//cell copy and paste 시 chorme용 textarea 저장 object
pForm.tragetGrid = "";
/**
 * @class Grid에 기능 추가
 * @param {Object} obj	- 대상그리드
 * @return N/A
 * @example
 * this.gfnSetGrid(this.grdMain);	
*/
pForm.gfn_setGrid = function(objGrid)
{
	var gtrcPos = "Grid.xjs.gfn_setGrid";
	var gtrcTimeCheckPos = "Grid.xjs.gfn_setGrid.timeCheck";
	
		this.gtrace("●그리드세팅", gtrcPos);
	this.gtrace("●그리드세팅-타임체크", gtrcTimeCheckPos);
		this.gtrace("그리드명--->"+objGrid.name, gtrcPos);
	this.gtrace("그리드명--->"+objGrid.name, gtrcTimeCheckPos);
	var tStartTime = this.gfn_getDate("time");
	this.gtrace("시작시간--->"+tStartTime, gtrcTimeCheckPos);
		
	//Grid의 binddataset설정
	var objDs = objGrid.getBindDataset();

	// grid에 바인드된 Dataset이 없는 경우 return;
	if (this.gfn_isNull(objDs)) {
		return;
	}
	// Validation에서 foucus 처리시 사용
	else {
		objDs.bindgrid = objGrid;
	}

	// 바인드명을헤드텍스트로 (ds_grdDic)
	//	if(this.gfn_nvl(objGrid.name,"")!="GridTrace") this.gfn_setGrdDic(objGrid);
	this.gfn_setGrdDic(objGrid);

	//Grid의 UserProperty설정
	var arrProp = this._getGridUserProperty(objGrid);			//	this.gtrace("_getGridUserProperty를 통해 가져온 배열(중복현상 있음) arrProp--->"+arrProp, gtrcPos);
	if(this.gfn_isNull(arrProp)) return; 		//설정할 속성이 엄쪄용
	
	objGrid.set_enableevent(false);
	objGrid.set_enableredraw(false);	
	objDs.set_enableevent(false); 
	objDs.set_useclientlayout(true);	//	그리드에 바인딩된 데이터셋은 고정한다.
	
	var objApp = pForm.gfn_getApplication();
	var objGds = objApp.gds_gridPersonal;
	
	var sFormatId = this._getUniqueId(objGrid);					//	this.gtrace("_getUniqueId를 통해 sFormatId를 가져온다--->"+sFormatId, gtrcPos);
	var sFormat;
																//	this.gtrace("SAVEXML : gds_gridPersonal--------->"+objGds.saveXML(), gtrcPos);
	var nFindRow = objGds.findRow("sFormatId", sFormatId);		this.gtrace("gds_gridPersonal에 sFormatId "+sFormatId+"가 있는지 확인 nFindRow--->"+nFindRow, gtrcPos);
	if( nFindRow > -1){
		//	objGrid.orgformat2 = objGds.getColumn(nFindRow, "sOrgFormat");
		objGrid.orgformat2 = objGrid.getFormatString();			//	191225.mod.
																//	this.gtrace("gds_gridPersonal에 있을경우 sOrgFormat컬럼값을 orgformat2에 지정--->"+objGrid.orgformat2, gtrcPos);
		sFormat = "<Formats>" + objGds.getColumn(nFindRow, "sFormat") + "</Formats>";
																//	this.gtrace("gds_gridPersonal의 sFormat컬럼값을 sFormat 스트링에 담아서"+objGrid.name+"그리드의 포맺으로 지정", gtrcPos);
		
		if(!(this.gfn_nvl(objGrid.name, "")=="GridTrace")) objGrid.set_formats(sFormat);
		//if((this.gfn_nvl(objGrid.name, "")=="GridPoList")) objGrid.set_formats(sFormat);
	
	}
	else{
		objGrid.orgformat2 = objGrid.getFormatString();
																//	this.gtrace("gds_gridPersonal에 없으므로 "+objGrid.name+" 그리드의 포맺스트링을 orgformat2에 지정--->"+objGrid.orgformat2, gtrcPos);
	}
		
	objGrid.arrprop = arrProp;
																//	this.gtrace(arrProp+"(arrProp)가 지정된 그리드를 넘겨서 _gfnGridAddProp 를 실행", gtrcPos);
	
	this._gfnGridSetCssclass(objGrid);	
		
	this._gfnGridAddProp(objGrid);
															//	this.gtrace(arrProp+"(arrProp)가 지정된 그리드를 넘겨서 _gfnMakeGridPopupMenu 를 실행", gtrcPos);
	this._gfnMakeGridPopupMenu(objGrid,arrProp);	//popupmenu 생성
	
	// Grid head에 filer 기능 추가하기 초기화(nexacro demo)
	this.initGridHeadAppendFilter(objGrid);
	
	/*********************************************** 이벤트추가 START ***********************************************/
	
	objGrid.addEventHandler("onheadclick", this.gfn_grid_onheadclick, this); 	//	this.gtrace("헤드클릭이벤트추가 gfn_grid_onheadclick", gtrcPos);
	objGrid.addEventHandler("oncellclick", this._gfn_oneTouchComboDropdown, this);	// 클릭한번으로 콤보활성
																				//	this.gtrace("userproperties중 하나라도 popupmenulist에 하나라도 있다면 우클릭 이벤트 추가", gtrcPos);
																				//	this.gtrace("		userproperties(arrProp)---->"+arrProp, gtrcPos);
																				//	this.gtrace("		popupmenulist---->"+this.popupmenulist, gtrcPos);
																				//	this.gtrace("		우클릭이벤트 : gfn_grid_onrbuttondown", gtrcPos);
	for(var k=0; k< arrProp.length; k++)
    {
		var arr = this.popupmenulist.split(",");
		for(var n=0; n<arr.length; n++)
        {
			if(arrProp[k] == arr[n]){
				//우클릭 이벤트 중 하나라도 있어야 팝업 이벤트 사용 가능
				//우클릭이벤트추가
				objGrid.addEventHandler("onrbuttondown", this.gfn_grid_onrbuttondown, this);	    
				break;
			}
		}
		if( arrProp[k] == "cellcopypaste"){
																				//	this.gtrace("arrProp["+k+"]-->"+arrProp[k]+"-->이므로 키다운이벤트추가---> : gfn_grid_onkeydown", gtrcPos);
			objGrid.addEventHandler("onkeydown", this.gfn_grid_onkeydown, this);
		}

		if( arrProp[k] == "cellcopy"){
																				//	this.gtrace("arrProp["+k+"]-->"+arrProp[k]+"-->이므로 키다운이벤트추가---> : gfn_grid_onkeydowncopy", gtrcPos);
			objGrid.addEventHandler("onkeydown", this.gfn_grid_onkeydowncopy, this);
		}

		if( arrProp[k] == "seltype"){
																				//	this.gtrace("arrProp["+k+"]-->"+arrProp[k]+"-->이므로 키다운이벤트추가---> : _gfn_selTypeArea,Row", gtrcPos);
			//objGrid.addEventHandler("onlbuttondown", this._gfn_selTypeArea, this);
			objGrid.addEventHandler("ondrag", this._gfn_selTypeArea, this);
			objGrid.addEventHandler("oncellclick", this._gfn_selTypeRow, this);
		}
	}

	/*********************************************** 이벤트추가 END *************************************************/
	objGrid.set_enableevent(true);
	objGrid.set_enableredraw(true);	
	objDs.set_enableevent(true);
	objGrid.orgformat = objGrid.getCurFormatString();
	
	
	var tEndTime = this.gfn_getDate("time");
	this.gtrace("끝시간--->"+tEndTime, gtrcTimeCheckPos);
	this.gtrace("경과시간--->"+(tEndTime - tStartTime), gtrcTimeCheckPos);
};	

/**
 * @class Grid에 기능 추가(addCol..)
 * @param {Object} objGrid	- 대상그리드
 * @return N/A
 * @example
 * this._gfnGridAddProp(this.grdMain);	
*/
pForm._gfnGridAddProp = function (objGrid)
{																
	var gtrcPos = "Grid.xjs._gfnGridAddProp";
		this.gtrace("● Grid에 기능 추가(_gfnGridAddProp)", gtrcPos);
																this.gtrace("여기서는 checkbox, no, status, sort 값에 대한 기능을 처리한다", gtrcPos);
	var arrProp = objGrid.arrprop;								this.gtrace("전달받은 userproperties : arrProp--->"+arrProp, gtrcPos);
	var objDs = objGrid.getBindDataset();						this.gtrace("바인딩된 데이터셋 : objDs--->"+objDs.name, gtrcPos);
	for( var i=0; i<arrProp.length; i++)
	{
		switch(arrProp[i]) {
			case "checkbox":
																this.gtrace("arrProp["+i+"]-->"+arrProp[i]+"-->_gfnGridCheckboxNoStatusAdd(objGrid, objDs, '"+arrProp[i]+"')--실행", gtrcPos);
				this._gfnGridCheckboxNoStatusAdd(objGrid, objDs, "checkbox");
				break;
			case "no":
																this.gtrace("arrProp["+i+"]-->"+arrProp[i]+"-->_gfnGridCheckboxNoStatusAdd(objGrid, objDs, '"+arrProp[i]+"')--실행", gtrcPos);
				this._gfnGridCheckboxNoStatusAdd(objGrid, objDs, "no");
				break;
			case "status":
																this.gtrace("arrProp["+i+"]-->"+arrProp[i]+"-->_gfnGridCheckboxNoStatusAdd(objGrid, objDs, '"+arrProp[i]+"')--실행", gtrcPos);
				this._gfnGridCheckboxNoStatusAdd(objGrid, objDs, "status");
				break;
			case "sort":
																this.gtrace("arrProp["+i+"]-->"+arrProp[i]+"-->objGrid.sort = 'true'--실행", gtrcPos);
				objGrid.sort = "true";
				break;
				
			default: break;
		}
	}
};

/**
 * @class Grid에 기능 추가(addCol..)
 * @param {Object} objGrid	- 대상그리드
 * @param {Object} objDs	- 대상데이터셋
 * @param {Array} addProp	- 기능
 * @return N/A
 * @example
 * this._gfnGridCheckboxNoStatusAdd(this.grdMain, this.dsList, [checkbox,no,status]);	
*/
pForm._gfnGridCheckboxNoStatusAdd = function(objGrid, objDs, addProp)
{
										var gtrcPos = "Grid.xjs._gfnGridCheckboxNoStatusAdd";
										this.gtrace("● 체크박스,No,상태추가(그리드, _gfnGridCheckboxNoStatusAdd)", gtrcPos);
	var sFormatColProp = objGrid.getFormatColProperty( 0, "band" );	this.gtrace("sFormatColProp-->"+sFormatColProp, gtrcPos);
	var bGridPersonal = false;
	if(this.gfn_getApplication().gds_gridPersonal.findRow("sFormatId", this._getUniqueId(objGrid)) > -1 )
	{
		bGridPersonal = true;
	}
	
	var nHeadColIndex;
												// true : this.gtrace("this.gfn_isNull(objDs.insertheadcell)-->"+this.gfn_isNull(objDs.insertheadcell), gtrcPos);
	if(this.gfn_isNull(objDs.insertheadcell)) nHeadColIndex = 0;
	else nHeadColIndex = objDs.insertheadcell;		
												this.gtrace("nHeadColIndex-->"+nHeadColIndex, gtrcPos);

	var nBodyColIndex;
	if(this.gfn_isNull(objDs.insertbodycell)) nBodyColIndex = 0;
	else nBodyColIndex = objDs.insertbodycell;
												//	this.gtrace("nBodyColIndex-->"+nBodyColIndex, gtrcPos);	// 0
	var nFormatRowCount = objGrid.getFormatRowCount();
												//2 : this.gtrace("nFormatRowCount-->"+nFormatRowCount, gtrcPos);
	var nHeadCount=-1;
	var nBodyCount=-1;
	for (var i=0; i<nFormatRowCount; i++)
	{
		if (objGrid.getFormatRowProperty(i, "band") == "head") nHeadCount++;	
		if (objGrid.getFormatRowProperty(i, "band") == "body") nBodyCount++;	
	}
												//0 : this.gtrace("nHeadCount-->"+nHeadCount, gtrcPos);
	                                            //0 : this.gtrace("nBodyCount-->"+nBodyCount, gtrcPos);
	var sNo 	= this.gfn_getWord("Seq.");		
	var sStatus = this.gfn_getWord("상태값");
												//undefined : this.gtrace("sNo-->"+sNo, gtrcPos);
												//undefined : this.gtrace("sStatus-->"+sStatus, gtrcPos);
	//체크박스
	if( addProp == "checkbox")
	{
		objDs.set_enableevent(false); 
		var idx=-1;

		for( var j=0; j<objDs.getColCount(); j++){
			var tmpcol = objDs.getColID(j);			//	this.gtrace("tmpcol-->"+tmpcol, gtrcPos);
			if( tmpcol == "ROW_CHK"){
				idx = j;
			}
		}
													// 0 : this.gtrace("idx-->"+idx, gtrcPos);
		if( idx < 0 ) objDs.addColumn("ROW_CHK", "STRING", 1);
														this.gtrace("objGrid.getCellCount(head)-->"+objGrid.getCellCount("head"), gtrcPos);
		for( var i=0; i<objGrid.getCellCount("head"); i++){
			//헤드텍스트
			var tmp = objGrid.getCellProperty("head" , i, "text");
			if( tmp == "0"){
				// head cell index 에 해당하는 body cell index
				var bodyCellIndex = this._gfnGridGetBodyCellIndex(objGrid, i);
				// body cell index 에 해당하는 바인드 컬럼명
				var columnName = this._gfnGridGetBindColumnNameByIndex(objGrid, bodyCellIndex);
				if(columnName == "ROW_CHK") {
					//return;
					objGrid.deleteContentsCol("body", i);	//	Grid 에 현재 표시된 포맷에서 특정 Column 을 삭제하는 메소드입니다.
				}
			}
		}
													this.gtrace("nBodyColIndex--->"+nBodyColIndex, gtrcPos);
		objGrid.insertContentsCol(nBodyColIndex);			//	Grid 에 현재 표시된 포맷의 특정 위치에 Column 을 삽입하는 메소드입니다.
		objGrid.setFormatColProperty(nBodyColIndex, "size", "40");	
		objGrid.setCellProperty("head", nHeadColIndex, "displaytype", "checkboxcontrol");
		objGrid.setCellProperty("head", nHeadColIndex, "edittype", "checkbox");
		objGrid.setCellProperty("head", nHeadColIndex, "text", "0");
		objGrid.setCellProperty("body", nBodyColIndex, "displaytype", "checkboxcontrol");
		objGrid.setCellProperty("body", nBodyColIndex, "edittype", "checkbox");
		objGrid.setCellProperty("body", nBodyColIndex, "text", "bind:ROW_CHK");
		objGrid.setFormatColProperty(nBodyColIndex, "band", sFormatColProp);
		
		objGrid.mergeContentsCell("head", 0, nBodyColIndex, nHeadCount, nBodyColIndex, nHeadColIndex, false);	
		objGrid.mergeContentsCell("body", 0, nBodyColIndex, nBodyCount, nBodyColIndex, nBodyColIndex, false);		
		
		nHeadColIndex++;
 		nBodyColIndex++;
																					//	this.gtrace("nHeadCount-->"+objDs.saveXML(), gtrcPos);
	}
	//번호
	if(addProp == "no")
	{
		for( var i=0; i<objGrid.getCellCount("head"); i++){
			var tmp = objGrid.getCellProperty("head" , i, "text");
			if( tmp == "NO" || tmp == "Seq."){
				//return;
				objGrid.deleteContentsCol("body", i);
			}
		}
		objGrid.insertContentsCol(nBodyColIndex);	
		objGrid.setFormatColProperty(nBodyColIndex, "size", "60");	
 		objGrid.setCellProperty("head", nHeadColIndex, "text", sNo);	
		objGrid.setCellProperty("head", nHeadColIndex, "textAlign","center");
		objGrid.setCellProperty("body", nBodyColIndex, "text","expr:currow+1");
		objGrid.setCellProperty("body", nBodyColIndex, "textAlign","center");
		objGrid.setFormatColProperty(nBodyColIndex, "band", sFormatColProp);
		
		objGrid.mergeContentsCell("head", 0, nBodyColIndex, nHeadCount, nBodyColIndex, nHeadColIndex, false);	
		objGrid.mergeContentsCell("body", 0, nBodyColIndex, nBodyCount, nBodyColIndex, nBodyColIndex, false);			
		
		nHeadColIndex++;
 		nBodyColIndex++;
	}
	//상태
	if ( addProp == "status"){
		{	// 데이터셋
			var idx=-1;

			for( var p=0; p<objDs.getColCount(); p++){
				var tmpcol = objDs.getColID(p);				//	this.gtrace("tmpcol-->"+tmpcol, gtrcPos);
				if( tmpcol == "ROW_STS"){
					idx = p;
				}
			}
														 //	this.gtrace("idx-->"+idx, gtrcPos);	//0
			if( idx < 0 ) objDs.addColumn("ROW_STS", "STRING", 1);

			objDs.addEventHandler("oncolumnchanged", this.gfn_multiDatasetChanged, this);
			objDs.addEventHandler("onrowposchanged", this.gfn_multiDatasetAdded, this);	//	디버깅용
			
		}
														//42 : this.gtrace("objGrid.getCellCount(head)-->"+objGrid.getCellCount("head"), gtrcPos);
		{	// 그리드
			for( var i=0; i<objGrid.getCellCount("head"); i++){

				var tmp = objGrid.getCellProperty("head" , i, "text");
				if( tmp == "상태" || tmp == "Status" || tmp == "상태값"){
					this.gtrace("tmp---->"+tmp,gtrcPos);
					objGrid.deleteContentsCol("body", i);
				}
			}
			
			{//상태를 텍스트로 나타내기 : 막음 - 필요없으면 삭제할 것
// 			var sInsert = nexacro.wrapQuote(this.gfn_getWord("insert")); //입력
// 			var sUpdate = nexacro.wrapQuote(this.gfn_getWord("modify")); //수정
// 			var sDelete = nexacro.wrapQuote(this.gfn_getWord("delete")); //삭제
// 			
// 			this.gtrace("sInsert---->"+sInsert,gtrcPos);
// 			this.gtrace("sUpdate---->"+sUpdate,gtrcPos);
// 			this.gtrace("sDelete---->"+sDelete,gtrcPos);
// 				
// 			var sExpr = "expr:"
// 					  + "dataset.getRowType(currow)==2?"+sInsert
// 					  + ":dataset.getRowType(currow)==4?"+sUpdate
// 					  + ":dataset.getRowType(currow)==8?"+sDelete
// 					  + ":''";
			}
			
			var sExpr ="expr:comp.parent.gfn_setRowStatus(ROW_STS)";
					  
				this.gtrace("sExpr----->"+sExpr, gtrcPos);
						//	expr:dataset.getRowType(currow)==2?"입력":dataset.getRowType(currow)==4?"수정":dataset.getRowType(currow)==8?"삭제":''
			
			var nSize = 50;
			if( nexacro.getEnvironmentVariable("evLanguage") == "EN") nSize = 80;

			objGrid.insertContentsCol(nBodyColIndex);
			objGrid.setFormatColProperty(nBodyColIndex, "size", nSize);	
			objGrid.setCellProperty("head", nHeadColIndex, "text", sStatus);
			objGrid.setCellProperty("head", nHeadColIndex, "textAlign","center");
			objGrid.setCellProperty("body", nBodyColIndex, "displaytype", "imagecontrol");
			objGrid.setCellProperty("body", nBodyColIndex, "text", sExpr);
			objGrid.setCellProperty("body", nBodyColIndex, "textAlign","center");
			objGrid.setFormatColProperty(nBodyColIndex, "band", sFormatColProp);
			
			objGrid.mergeContentsCell("head", 0, nBodyColIndex, nHeadCount, nBodyColIndex, nHeadColIndex, false);	
			objGrid.mergeContentsCell("body", 0, nBodyColIndex, nBodyCount, nBodyColIndex, nBodyColIndex, false);			

			nHeadColIndex++;
			nBodyColIndex++;
		}
	}
};

/////////////////////////////////////////////////////////////////
// method name	: _gfn_getRowType
// description	: 
// parameter	: 
// return		: 
// example		: 
/////////////////////////////////////////////////////////////////
//	pForm._gfn_getRowType = function(obj:nexacro.NormalDataset,e:nexacro.DSRowPosChangeEventInf)
pForm._gfn_getRowType = function(obj, e)
{
														var gtrcPos = "Grid.xjs._gfn_getRowType";
	var iRowType = obj.getRowType(e.newrow);
	var sRowTypeName;
	switch(iRowType){
		case  0 : sRowTypeName	=	"Dataset.ROWTYPE_EMPTY  0 존재하지 않는 행의 상태"; break;
		case  1 : sRowTypeName	=	"Dataset.ROWTYPE_NORMAL 1 초기 행의 상태 "; break;
		case  2 : sRowTypeName	=	"Dataset.ROWTYPE_INSERT 2 추가된 행의 상태 "; break;
		case  4 : sRowTypeName	=	"Dataset.ROWTYPE_UPDATE 4 수정된 행의 상태 "; break;
		case  8 : sRowTypeName	=	"Dataset.ROWTYPE_DELETE 8 삭제된 행의 상태 "; break;
		case 16 : sRowTypeName	=	"Dataset.ROWTYPE_GROUP 16 그룹 정보 행의 상태 "; break;
	
		default : break;
	}
	
	this.gtrace(e.newrow+" 행---sRowTypeName-------->"+sRowTypeName, gtrcPos);
};


/////////////////////////////////////////////////////////////////
// method name	: gfn_multiDatasetChanged
// description	: 역할1 : ROW_STS, ROW_CHK 변경값은 Skip, 2 : ROW_STS에 세팅
// parameter	: 
// return		: 
// example		: 
/////////////////////////////////////////////////////////////////
//	pForm.gfn_multiDatasetChanged = function(obj:nexacro.NormalDataset,e:nexacro.DSColChangeEventInfo) 
pForm.gfn_multiDatasetChanged = function(obj, e) 
{
											var gtrcPos = "Grid.xjs.gfn_multiDatasetChanged";
													this.gtrace("e.columnid--->"+e.columnid, gtrcPos);
	if(e.columnid == "ROW_STS" || e.columnid == "ROW_CHK") return;

	var iRow = e.row;
	var iRowType = obj.getRowType(iRow);			this.gtrace("iRowType--->"+iRowType, gtrcPos);
	var sRowSts = obj.getColumn(iRow, "ROW_STS");
	//	var sRowChk = obj.getColumn(iRow, "ROW_CHK");
	
	// cmmGridAddDelButton.xfdl을 사용하면 이벤트에 있으므로 I로 셋하는 것은 필요 없겠지만
	// 다른 addRow 상황을 대비하여 추가.
	// 어차피 oncolumnchanged 상황에서는 안 타므로 막음. 191215.
// 	if (iRowType == Dataset.ROWTYPE_INSERT) 		//	2
// 	{
// 		if (sRowSts != "I") {
// 			obj.setColumn(iRow, "ROW_STS", "I");
// 		}
// 	} 
// 	else 
	
	if (iRowType == Dataset.ROWTYPE_UPDATE)	//	4
	{
		// sRowSts == I 인 경우는 U로 바꾸지 않는다. I는 계속 I 임(데이터셋의 기본적세팅과 동일)
		if (sRowSts == undefined || sRowSts == "" || sRowSts == "N") {
			obj.setColumn(iRow, "ROW_STS", "U");
		}
	}

	return iRow;
};


/////////////////////////////////////////////////////////////////
// method name	: gfn_multiDatasetAdded
// description	: 역할1 : ROW_STS, ROW_CHK 변경값은 Skip, 2 : ROW_STS에 세팅
// parameter	: 
// return		: 
// example		: 
/////////////////////////////////////////////////////////////////
//	pForm.gfn_multiDatasetAdded = function(obj:nexacro.NormalDataset,e:nexacro.DSRowPosChangeEventInfo) 
pForm.gfn_multiDatasetAdded = function(obj, e) 
{
											var gtrcPos = "Grid.xjs.gfn_multiDatasetAdded";
													this.gtrace("e.columnid--->"+e.columnid, gtrcPos);
	//	if(e.columnid == "ROW_STS" || e.columnid == "ROW_CHK") return;

	var iRow = e.newrow;
	var iRowType = obj.getRowType(iRow);			this.gtrace("iRowType--->"+iRowType, gtrcPos);
	var sRowSts = obj.getColumn(iRow, "ROW_STS");
	//	var sRowChk = obj.getColumn(iRow, "ROW_CHK");

	if (iRowType == Dataset.ROWTYPE_INSERT) 		//	2
	{
		if (sRowSts != "I") {
			obj.setColumn(iRow, "ROW_STS", "I");
		}
	} 

	return iRow;
};


/**
 * @class  멀티그리드 상태 그림
 * @param 
 * @param    
 * @return  N/A
 * @example
 */
 pForm.gfn_setRowStatus = function(sStatus) 
{
	if (sStatus == null) return;
	
	if (sStatus == "I") 		sStatus = "theme://images\\"+"grid_add.png";
	else if (sStatus == "D") 	sStatus = "theme://images\\"+"RecycleBin_Empty_18.png";
	else if (sStatus == "U") 	sStatus = "theme://images\\"+"grid_edit.png";
	else if (sStatus == "") 	sStatus = "";
	
	return sStatus;
};

/**
 * @class  그리드헤드클릭 이벤트 [Sort, Checkbox]
 * @param {Object} objGrid - 대상그리드
 * @param {Evnet}  e	   - 헤드클릭이벤트
 * @return  N/A
 * @example
 * objGrid.addEventHandler("onheadclick", 	 this.gfn_grid_onheadclick, 	 this);
 */
pForm.gfn_grid_onheadclick = function(objGrid, e)
{																				var gtrcPos = "Grid.xjs.gfn_grid_onheadclick";
																				this.gtrace("onheadclick시에 발생하는 이벤트 : 체크박스 / 일반 구분에 따라 다름(전체선택 / 정렬)", gtrcPos);
	var sType = objGrid.getCellProperty("head", e.cell, "displaytype");			this.gtrace("getCellProperty - displaytype 가져오기 sType--->"+sType, gtrcPos);
	if (sType == "checkboxcontrol"){											this.gtrace("head display type이 checkbox인 경우 all/none check기능추가--->_gfnHeadCheckSelectAll", gtrcPos);
		//head display type이 checkbox일 경우 all/none check기능추가			
		this._gfnHeadCheckSelectAll(objGrid, e);
	}else{																		this.gtrace("head display type이 checkbox가 아닌 경우 sType--->"+sType, gtrcPos);
																				this.gtrace("objGrid.sort값을 본다--->"+objGrid.sort, gtrcPos);
		//sort
		if(this.gfn_isNull(objGrid.sort) || objGrid.sort=="false"){
			return;
		}else if(objGrid.sort == "true"){										this.gtrace("objGrid.sort=="+objGrid.sort+" 이므로 sort시작", gtrcPos);
			var arr = objGrid.arrprop;
			var bUserHeader = this._gfnGridUserHeaderFlg(objGrid);
			var multiple = false;
			if ( e.ctrlkey ) multiple = true;// Ctrl 키
			if(!bUserHeader){
				// 정렬 상태 변경이 성공하면 정렬을 실행한다.
				var rtn = this._gfnGridSetSortStatus(objGrid, e.cell, multiple);
				if(rtn){
					this._gfnGridExecuteSort(objGrid);
				}
			}else{
				this._gfnGirdUserHeaderExcuteSort(objGrid, e.cell, multiple);
			}
		}
	}
																							this.gtrace("-----------------------------END---------------------------------", gtrcPos);
};

/**
 * @class  그리드키다운 이벤트 [cellcopypaste]
 * @param {Object} objGrid - 대상그리드
 * @param {Evnet}  e	   - 키다운이벤트
 * @return  N/A
 * @example
 * objGrid.gfn_grid_onkeydown("onheadclick", 	 this.gfnGrid_onheadclick, 	 this);
 */
pForm.gfn_grid_onkeydown =function(objGrid, e){
	var keycode = e.keycode;
	var sBrowser = system.navigatorname;
	if(e.ctrlkey){
		if(keycode == 67){
			//copy
			if( sBrowser == "nexacro" || sBrowser == "IE"){
				this._gfnGridCopyEventForRuntime(objGrid, e);
			}else {
				this._gfnGridCopyEventForChrome(objGrid, e);
			}
		}else if(keycode == 86){ // ctrl+V
			//paste
			this._gfnGridPasteEvent(objGrid, e);
		}
	}
};

pForm.gfn_grid_onkeydowncopy =function(objGrid, e){
	var keycode = e.keycode;
	var sBrowser = system.navigatorname;
	if(e.ctrlkey){
		if(keycode == 67){
			//copy
			if( sBrowser == "nexacro" || sBrowser == "IE"){
				this._gfnGridCopyEventForRuntime(objGrid, e);
			}else {
				this._gfnGridCopyEventForChrome(objGrid, e);
			}
		}
	}
};


/**
 * @class 유저헤더사용여부반환
 * @param {Object} objGrid - 대상그리드
 * @return 유저헤더사용여부 true/false
 * @example
 * this._gfnGridUserHeaderFlg(this.grdMain);
 */
pForm._gfnGridUserHeaderFlg = function (objGrid)
{
	var arr = objGrid.arrprop;
	var bUserHeader = false;
	for( var i=0; i<arr.length; i++){
		if( arr[i] == "userheader"){
			bUserHeader = true;
		}
	}
	return bUserHeader;
};

/**
 * @class 유저헤더를 이용한 정렬
 * @param {Object} grid - 대상그리드
 * @return N/A
 * @example
 * this._gfnGirdUserHeaderExcuteSort(objGrid);
 */
pForm._gfnGirdUserHeaderExcuteSort = function (objGrid, headCellIndex, multiple)
{
	var bindCol = objGrid.getCellProperty("head", headCellIndex, "calendarweekformat");
	if( this.gfn_isNull(bindCol)) return false; //헤더에 바인드없음

	var bodyCellIdx = 0;
	var nbodyCnt = objGrid.getCellCount("body");
	for( var i=0; i<nbodyCnt; i++){
		var tmp =  objGrid.getCellProperty("body", i, "text");
		if( tmp == bindCol ){
			bodyCellIdx = i;
			break;
		}
	}
	var rtn = this._gfnGridSetSortStatus(objGrid, headCellIndex, multiple, "", bodyCellIdx);
	if(rtn){
		this._gfnGridExecuteSort(objGrid);
	}
};

/**
 * @class 정렬가능여부리턴
 * @param {Object} grid - 대상그리드
 * @param {Number} headCellIndex - 대상셀INDEX
 * @param {Boolean}multiple - 멀티소트여부 
 * @param {Number} sortStatus - 소트상태  
 * @return{Boolean} sort 가능/불가능 여부
 * @example
 * this._gfnGridSetSortStatus(obj, e.cell, multiple);	
 */
pForm._gfnGridSetSortStatus = function(grid, headCellIndex, isMultiple, sortStatus, bodyCellIndex)
{
	// head cell index 에 해당하는 body cell index
	if( this.gfn_isNull(bodyCellIndex)){
		bodyCellIndex = this._gfnGridGetBodyCellIndex(grid, headCellIndex);
	}
	if ( bodyCellIndex < 0 ) return false;
	
	// body cell index 에 해당하는 바인드 컬럼명
	var columnName = this._gfnGridGetBindColumnNameByIndex(grid, bodyCellIndex);
	if ( this.gfn_isNull(columnName) ){
		trace("Check Grid body cell bind value");
		return false;
	}
	
	if ( this.gfn_isNull(isMultiple) ) isMultiple = false;
	if ( this.gfn_isNull(sortStatus) ) sortStatus = -1;
	
	// 대상 grid 에 정렬정보를 가지는 사용자 속성 확인/추가
	if ( this.gfn_isNull(grid.sortInfos) ){
		grid.sortInfos = {};
	}
	
	// 정렬대상컬럼 (순서중요)
	if ( this.gfn_isNull(grid.sortItems) ){
		grid.sortItems = [];
	}
	
	var sortInfos = grid.sortInfos,
		sortItems = grid.sortItems,
		sortInfo = sortInfos[columnName],
		sortItem,
		status;
	
	if (this.gfn_isNull(sortInfo)){
		var headText = grid.getCellText(-1, headCellIndex);
		
		// executeSort에서 정렬 표시를 위해 cell index 가 필요한데
		// cell moving 될 경우 index는 변하므로 cell object 를 참조하여 값을 얻어온다. 		
		var refCell = this._gfnGridGetGridCellObject(grid, "head", headCellIndex);
		sortInfo = sortInfos[columnName] = { status: 0, text: headText, refCell: refCell};
	}
	// set sort status
	if (isMultiple){		
		status = sortInfo.status;
		if ( sortStatus == -1 ) {
			if ( status == 0 ) {
				sortInfo.status = 1;
			} 
			else if ( status == 1 ) {
				sortInfo.status = 2;
			} 
			else if ( status == 2 ) {
				sortInfo.status = ( this.SORT_TOGGLE_CANCEL ? 0 : 1);
			}
		}
		else {
			sortInfo.status = sortStatus;
		}
	}
    else {
		for (var p in sortInfos) {
			if ( sortInfos.hasOwnProperty(p) )
			{
				sortInfo = sortInfos[p];
				if ( p == columnName ) {
					status = sortInfo.status;
					if ( sortStatus == -1 ) {
						if ( status == 0 ) {
							sortInfo.status = 1;
						} 
						else if ( status == 1 ) {
							sortInfo.status = 2;
						} 
						else if ( status == 2) {
							sortInfo.status = ( this.SORT_TOGGLE_CANCEL ? 0 : 1);
						}
					}else {
						sortInfo.status = sortStatus;
					}
				}else {
					sortInfo.status = 0;
				}
				if ( sortInfo.status == 0 ){
					for (var j=0, len2=sortItems.length; j<len2; j++) {
						if ( sortItems[j] !== columnName ) {
							sortItems.splice(j, 1);
							break;
						}
					}
				}
			}
		}
	}
	
	// 컬럼정보 등록
	var hasItem = false;
	for (var i=0, len=sortItems.length; i<len; i++) {
		if ( sortItems[i] == columnName ) {
			hasItem = true;
			break;
		}
	}	
	if ( !hasItem ){
		sortItems.push(columnName);
	}
	return true;
}; 

/**
 * @class head cell에 match되는 body cell을 얻어온다
 * @param {Object}  grid 대상 Grid Component
 * @param {Number} eadCellIndex head cell index
 * @return{Number}  body cell index
 * @example
 * this._gfnGridSetSortStatus(obj, e.cell, multiple);	
 */ 
pForm._gfnGridGetBodyCellIndex = function(grid, headCellIndex, useColspan) 
{	//, useColspan) 
	if( this.gfn_isNull(useColspan)) useColspan=false;
	// Max Head Row Index
	var maxHeadRow = 0;
	for (var i=0, len=grid.getCellCount("head"); i<len; i++) {
		var row = grid.getCellProperty("head", i, "row");
		if (maxHeadRow < row) {
			maxHeadRow = row;
		}
	}
	// Max Body Row Index
	var maxBodyRow = 0;
	for (var i=0, len=grid.getCellCount("body"); i<len; i++) {
		var row = grid.getCellProperty("body", i, "row");
		if (maxBodyRow < row) {
			maxBodyRow = row;
		}
	}
	
	if (maxHeadRow == 0 && maxBodyRow == 0) {
// 		var headcolspan = grid.getCellProperty("head", headCellIndex, "colspan");
// 		var bodycolspan = grid.getCellProperty("body", headCellIndex, "colspan");
// 		
// 		if( headcolspan == bodycolspan ){
// 			return headCellIndex;
// 		}
		useColspan = true;
	}
	
	// Body Row 가 1개 이상일 경우
	// Head의 row 가 Body의 row 보다 클 경우 차이 row 를 뺀 것을 대상으로 찾고
	// Body의 row 가 Head의 row 보다 크거나 같을 경우 row index가 같은 대상을 찾는다.			
	var cellIndex = -1;
	var sRow = -1;
	var nRow = parseInt(grid.getCellProperty("head", headCellIndex, "row"));
	var nCol = parseInt(grid.getCellProperty("head", headCellIndex, "col"));
	var nColspan = parseInt(grid.getCellProperty("head", headCellIndex, "colspan"));				
	
	if (maxHeadRow > maxBodyRow) 
	{
		sRow = nRow - (maxHeadRow - maxBodyRow);
		sRow = (sRow < 0 ? 0 : sRow);
	}
	else 
	{
		sRow = nRow;
	}
	var cRow, cCol, cColspan, cRowspan;
	for (var i=0, len=grid.getCellCount("body"); i<len; i++) 
	{
		cRow = parseInt(grid.getCellProperty("body", i, "row"));
		cCol = parseInt(grid.getCellProperty("body", i, "col"));	
		cColspan = parseInt(grid.getCellProperty("body", i, "colspan"));					
		cRowspan = parseInt(grid.getCellProperty("body", i, "rowspan"));
		if( cRowspan > 1 )
		{
			if ( useColspan ){
				if (sRow >= cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
				{		
					cellIndex = i;
					break;
				}		
			}else{
				if (sRow >= cRow && nCol == cCol && nColspan == cColspan) 
				{		
					cellIndex = i;
					break;
				}
			}
		}else{	
			if ( useColspan ){
				if (sRow == cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
				{		
					cellIndex = i;
					break;
				}		
			}else{
				if (sRow == cRow && nCol == cCol && nColspan == cColspan) 
				{		
					cellIndex = i;
					break;
				}
			}
		}
	}
	return cellIndex;
};

/**
 * @class body cell index로 binding 된 컬럼명을 얻어온다.
 * @param {Object}  grid 대상 Grid Component
 * @param {Number} eadCellIndex head cell index
 * @return{String} column id
 * @example
 * this._gfnGridGetBindColumnNameByIndex(obj, e.cell);	
 */  
pForm._gfnGridGetBindColumnNameByIndex = function(grid, index) 
{
	var text = "";
	var columnid = "";
	var subCell = grid.getCellProperty("body", index, "subcell");
	if ( subCell > 0 ){
		text = grid.getSubCellProperty("body", index, 0, "text");
	}
	else{
		text = grid.getCellProperty("body", index, "text");
	}
	
	if ( !this.gfn_isNull(text) ){
		if ( text.search(/^BIND\(/) > -1 ) {	
			columnid = text.replace(/^BIND\(/, "");
			columnid = columnid.substr(0, columnid.length-1);
		} 
		else if ( text.search(/^bind:/) > -1 ) {
			columnid = text.replace(/^bind:/, "");
		}
	}
	return columnid;
};

/**
 * @class 소트를 실행한다
 * @param {Object}  grid 대상 Grid Component
 * @return{String}  N/A
 * @example
 * this._gfnGridExecuteSort(obj);	
 */  
pForm._gfnGridExecuteSort = function(grid) 
{
	var sortInfo, 
		sortItem,
		sortInfos = grid.sortInfos,
		sortItems = grid.sortItems,
		columnName,
		status,
		cell,
		sortString = "";
		
	if ( this.gfn_isNull(sortInfos) || this.gfn_isNull(sortItems) ) return;

	// keystring 조합
	for (var i=0; i<sortItems.length; i++) {
		columnName = sortItems[i];
		sortInfo = sortInfos[columnName];
		status = sortInfo.status;
		cell = sortInfo.refCell;
		
		// 컬럼삭제 등으로 제거될 수 있으므로 실제 column 이 존재하는지
		// 확인하여 없으면 제거해 준다.
		if ( this.gfn_isNull(cell) || grid.getBindCellIndex("body", columnName) < 0 ){
			// 컬럼정보제거
			sortItems.splice(i, 1);
			sortInfos[columnName] = null;
			delete sortInfos[columnName];
			
			i--;
		}else if ( status > 0 ) {
			sortString += (status == 1 ? "+" : "-") + columnName;
		}
	}
	
	var ds = grid.getBindDataset();
	// keystring 확인
	var curKeyString = ds.keystring;
	var groupKeyString = "";
	
	if ( curKeyString.length > 0 && curKeyString.indexOf(",") < 0 ){
		var sIndex = curKeyString.indexOf("S:");
		var gIndex = curKeyString.indexOf("G:");

		if ( sIndex > -1 ){
			groupKeyString = "";
		}else{
			if ( gIndex < 0 )
			{
				groupKeyString = "G:"+curKeyString;
			}
			else
			{
				groupKeyString = curKeyString;
			}
		}
	}
    else{
		var temps = curKeyString.split(",");
		var temp;
		for (var i=0,len=temps.length; i<len; i++){
			temp = temps[i];
			if ( temp.length > 0 && temp.indexOf("S:") < 0 ){
				if ( temp.indexOf("G:") < 0 )
				{
					groupKeyString = "G:"+temp;
				}else{
					groupKeyString = temp;
				}
			}
		}
	}
	
	if ( sortString.length > 0 ){
		var sortKeyString = "S:"+sortString;
		
		if ( groupKeyString.length > 0 ){
			ds.set_keystring(sortKeyString + "," + groupKeyString);
		}else{
			ds.set_keystring(sortKeyString);
		}
		
		grid.sortKeyString = sortKeyString;
	}else{		
		ds.set_keystring(groupKeyString);
		grid.sortKeyString = "";
	}

	// 정렬표시
	var type = this.MARKER_TYPE;
	var index, marker;
	for (var p in sortInfos) {
		if ( sortInfos.hasOwnProperty(p) )
		{
			sortInfo = sortInfos[p];			
			cell = sortInfo.refCell;
			if ( cell )
			{
				index = cell._cellidx;
				marker = this.gfn_decode(sortInfo.status, 1, this.MARKER[0], 2, this.MARKER[1], "");
				grid.setCellProperty( "head", index, "text", sortInfo.text + marker);
			}
		}
	}
};

/**
 * Cell object 를 반환 (Grid 내부 속성이므로 get 용도로만 사용)
 * @param {Grid} grid 대상 Grid Component
 * @param {string} band 얻고자 하는 cell 의 band (head/body/summ);
 * @param {number} index 얻고자 하는 cell 의 index
 * @return {object} cell object
 */
pForm._gfnGridGetGridCellObject = function(grid, band, index)
{
	// 내부속성을 통해 얻어온다.
	var refCell;
	var format = grid._curFormat;
	if (format){
		if ( band == "head" ){
			refCell = format._headcells[index];
		}
		else if ( band == "body" ){
			refCell = format._bodycells[index];
		}
		else if ( band == "summ" || band == "summary" ){
			refCell = format._summcells[index];
		}
	}
	return refCell;
};

/**
 * @class 그리드의 Sort Mark 제거
 * @param {Object} Grid 대상그리드
 * @return N/A
 */  
pForm._gfnClearSortMark = function(obj)
{
	var sortInfos = obj.sortInfos;
	var sortItems = obj.sortItems;
	
	if ( this.gfn_isNull(sortInfos) || this.gfn_isNull(sortItems) ) return;
	
	// 정렬상태 초기화.
	for( var j=0; j<sortItems.length;j++){
		var col = sortItems[j];
		var sortInfo = sortInfos[col];
		sortInfo.status = 0;
	}
	
	// 정렬실행
	this._gfnGridExecuteSort(obj);
	
	// 정보 초기화
	obj.sortInfos = {};
	obj.sortItems = [];
};

/**
 * @class  마우스우클릭이벤트
 * @param  {Object} objGrid	- 대상그리드
 * @param  {Event}  e		- 우클릭이벤트 
 * @return  N/A
 * @example
 * this.gfn_grid_onrbuttondown(this.grdMain, this.dsMain);	
 */
pForm.gfn_grid_onrbuttondown = function (objGrid, e)
{
											var gtrcPos = "Grid.xjs.gfn_grid_onrbuttondown";
											this.gtrace("그리드우클릭이벤트--->시작", gtrcPos);
	var objApp = pForm.gfn_getApplication();
	
	// 대상 그리드와 셀 정보를 추가
	objGrid.popupMenu.grid = objGrid;
	objGrid.popupMenu.cellindex = e.cell;
	objGrid.popupMenu.rowindex = e.row;

	var x = nexacro.toNumber(nexacro.System.getCursorX()) - nexacro.toNumber(system.clientToScreenX(objApp.mainframe, 0));
	var y = nexacro.toNumber(nexacro.System.getCursorY()) - nexacro.toNumber(system.clientToScreenY(objApp.mainframe, 0)) - 120;

// 	var x = e.clientx;
// 	var y = e.clienty;
											this.gtrace("x,y--->("+x+","+y+")", gtrcPos);
	objGrid.popupMenu.trackPopup(x, y);

	this.gtrace("---------------end-------------------------gfn_grid_onrbuttondown----------------------------------------", gtrcPos);
};

/**
 * @class  gfnCreatePopupMenu 내부함수로 팝업메뉴 클릭 시 발생하는 이벤트
 * @param {Object} objGrid	- 대상그리드
 * @param {Evnet}  e 		- 팝업메뉴클릭이벤트
 * @return N/A
 * @example
 * this.gfn_popupmenu_onmenuclick(this.grdMain, nexacro.MenuClickEventInfo);	
 */
pForm.gfn_popupmenu_onmenuclick = function (objMenu, e)
{
											var gtrcPos = "Grid.xjs.gfn_popupmenu_onmenuclick";
												this.gtrace("● 팝업메뉴클릭이벤트", gtrcPos);
	var selectId   = e.id;						//	this.gtrace("selectId--->"+selectId, gtrcPos);
	var grid 	   = objMenu.grid;				//	this.gtrace("grid.name--->"+grid.name, gtrcPos);
	var nCellIndex = objMenu.cellindex;			//	this.gtrace("nCellIndex--->"+nCellIndex, gtrcPos);
	var nRowIndex  = objMenu.rowindex;			//	this.gtrace("nRowIndex--->"+nRowIndex, gtrcPos);

	switch(selectId) {
		case "colfix"://틀고정 열
											this.gtrace(" - 틀고정 열 (selectId)-->"+selectId, gtrcPos);
			this.fv_CellIndex = nCellIndex;
			this._gfnGridcellFix(grid, this.fv_CellIndex, nRowIndex);
			break;
		case "colfixfree"://틀고정 열 해제
											this.gtrace(" - 틀고정 열 해제 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridCellFree(grid);
			break;
		case "rowfix"://틀고정 행
											this.gtrace(" - 틀고정 행 (selectId)-->"+selectId, gtrcPos);
			if(nRowIndex<0) return;
			grid.fixedRow = nRowIndex;
			this._gfnGridSetCssclass(grid);
			break;
		case "rowfixfree"://틀고정 행 해제
											this.gtrace(" - 틀고정 행 해제 (selectId)-->"+selectId, gtrcPos);
			grid.fixedRow = -1;
			this._gfnGridSetCssclass(grid);
			break;
		case "filter"://필터
											this.gtrace(" - 필터 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridFilter(grid);
			break;
		case "filterfree"://필터해제
											this.gtrace(" - 필터해제 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridCellFilterFree(grid);
			break;
		case "replace"://찾기/바꾸기
											this.gtrace(" - 찾기/바꾸기 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridCellReplace(grid, nCellIndex, nRowIndex);
			break;
		case "colhide"://컬럼숨기기
											this.gtrace(" - 컬럼숨기기 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridColHideShow(grid, nRowIndex);
			break;
		case "subsum"://부분합
											this.gtrace(" - 부분합 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridSubSum(grid, nRowIndex);
			break;
			
		case "export"://엑셀내보내기
											this.gtrace(" - 엑셀내보내기 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridExcelExport(grid, nRowIndex);		// 결국, Excel.js.gfn_excelExport를 호출함
			break;	
		case "import"://엑셀가져오기
											this.gtrace(" - 엑셀가져오기 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridExcelImport(grid, nRowIndex);
			break;	
		case "personal" : //개인화
											this.gtrace(" - 개인화 (selectId)-->"+selectId, gtrcPos);
			this._gfnGridPersonalize(grid);
			break;
		case "initial"://초기화
											this.gtrace(" - 초기화 (selectId)-->"+selectId, gtrcPos);
			grid.set_formats("<Formats>" + grid.orgformat2 + "</Formats>");
			//this._gfnGridCellFree(grid);
			//this._gfnClearSortMark(grid);
			this._gfnGridAddProp(grid);
			break;
		default: break;
	}
};

/**
 * @class  _gfnGridSetCssclass 행고정/해제시 css설정
 * @param {Object} objGrid	- 대상그리드
 * @return N/A
 * @example
 * this._gfnGridSetCssclass(this.grdMain);	
 */
pForm._gfnGridSetCssclass = function (objGrid)
{
																var gtrcPos = "Grid.xjs._gfnGridSetCssclass";
																//this.gtrace("_gfnGridSetCssclass : 행고정/해제시 css설정---> 시작", gtrcPos);
	var clname = "grd_WF_cell_fixed";							//this.gtrace("clname------>"+clname, gtrcPos);
			
	objGrid.set_enableredraw(false);							//this.gtrace("objGrid.set_enableredraw(false)설정------>"+objGrid.name, gtrcPos);
																//this.gtrace("objGrid.getFormatColCount()--------------->"+objGrid.getFormatColCount(), gtrcPos);
																//this.gtrace("objGrid.fixedRow----------->"+objGrid.fixedRow, gtrcPos);
	var sFixedRow_EXPR= "(comp.fixedRow==currow?";
	var sRowLvl_EXPR  = "(dataset.getRowLevel(currow)==0?";
	var sROW_STS_EXPR = "(!(ROW_STS == 'I'||ROW_STS == 'D'||ROW_STS == 'U') ? ";
	var sLvlExpr = "'lv2' : 'lv3' ) : 'lv4' )";
	var sLvlFixedExpr = "'lv2."+clname+"' : 'lv3."+clname+"' ) : 'lv4."+clname+"' )";

	for( var k=0; k<objGrid.getFormatColCount(); k++){
		var expr = "";
		if( objGrid.fixedRow >= 0 ){
			expr = "expr:" + sFixedRow_EXPR + sRowLvl_EXPR + sROW_STS_EXPR + sLvlFixedExpr + ":"+ sRowLvl_EXPR + sROW_STS_EXPR + sLvlExpr+")";
		}else{
			expr = "expr:" + sRowLvl_EXPR + sROW_STS_EXPR + sLvlExpr;
		}
		
		objGrid.setCellProperty("body", k, "cssclass", expr);
	}

	objGrid.set_enableredraw(true);
	
	//	trace("objGrid.fixedRow---->"+objGrid.fixedRow);

	if(!this.gfn_isNull(objGrid.fixedRow))objGrid.setFixedRow(objGrid.fixedRow);
};

/**
 * @class  그리드헤드클릭이벤트 내부함수 (헤드클릭시 체크 ALL/None)
 * @param {Object} objGrid - 대상그리드
 * @param {Evnet}  e	   - 헤드클릭이벤트
 * @return  N/A
 * @example
 * this._gfnHeadCheckSelectAll(objGrid, e); //ALL CHECK
 */
pForm._gfnHeadCheckSelectAll = function (objGrid, e)
{																			var gtrcPos = "Grid.xjs._gfnHeadCheckSelectAll";
																			//this.gtrace("체크박스전체선택기능---checkbox의truevalue/falsevalue를 별도로 세팅할 필요 없다. 기본 : 1 과 0 이다", gtrcPos);
																			//this.gtrace("objGrid.readonly==true이면 return된다---->"+objGrid.readonly, gtrcPos);
	if(objGrid.readonly == true) return;					
	
	var sType;
	var sChk;
	var sVal;
	var sChkVal;
	var oDsObj;
	var nHeadCell  = e.cell;												//this.gtrace("e.cell-->nHeadCell---->"+nHeadCell, gtrcPos);
	var nBodyCell;
	var nSubCnt = objGrid.getSubCellCount("head", nHeadCell);

	oDsObj  = objGrid.getBindDataset();										//this.gtrace("바인딩된 데이터셋 : oDsObj---->"+oDsObj.name, gtrcPos);

	if(oDsObj.getRowCount() < 1) return;									//this.gtrace("oDsObj의 행의 갯수 < 1이면 리턴 oDsObj.getRowCount()---->"+oDsObj.getRowCount(), gtrcPos);
																			//this.gtrace("objGrid.getCellCount(body)---->"+objGrid.getCellCount("body"), gtrcPos);
																			//this.gtrace("objGrid.getCellCount(head)---->"+objGrid.getCellCount("head"), gtrcPos);
																			
																			//this.gtrace("이벤트가 발생한 셀번호 가져오기", gtrcPos);
	if(objGrid.getCellCount("body") != objGrid.getCellCount("head")) {
		nBodyCell = parseInt(objGrid.getCellProperty("head", nHeadCell, "col"));	//this.gtrace("body head getCellCount가 다르므로 head의 프로퍼티에서 가져온다.nBodyCell---->"+nBodyCell, gtrcPos);
	} else {
		nBodyCell = e.cell;													//this.gtrace("body head getCellCount가 같으므로 nBodyCell == e.cell---->"+e.cell, gtrcPos);
	}
																			//this.gtrace("<----체크박스에 바인딩된 텍스트가공 : sChkVal---->", gtrcPos);
	sChkVal = objGrid.getCellProperty("body", nBodyCell, "text");			//this.gtrace("body의 "+nBodyCell+"번 셀의 text값 sChkVal---->"+sChkVal, gtrcPos);
	sChkVal = sChkVal.toString().replace("bind:", "");						//this.gtrace("sChkVal.toString().replace('bind:','')---->"+sChkVal, gtrcPos);
		
	// Merge한 셀이 없는 경우
	sType = objGrid.getCellProperty("head", nHeadCell, "displaytype");		//this.gtrace("head의 displayType--->sType---->"+sType+"checkboxcontrol이 아니면 리턴된다", gtrcPos);

	if(sType != "checkboxcontrol") {
		return;
	}
																			//this.gtrace("<----objGrid.getCellProperty('head', nHeadCell, 'text')-->sVal 기준으로 Head, Body 세팅한다.---->"+sType+"checkboxcontrol이 아니면 리턴된다", gtrcPos);
	// Head셋팅
	sVal = objGrid.getCellProperty("head", nHeadCell, "text");				this.gtrace("sVal-->"+sVal, gtrcPos);

	if (sVal == "0") {
		objGrid.setCellProperty("head", nHeadCell, "text", "1");
		sChk="1";
	} else {
		objGrid.setCellProperty("head", nHeadCell, "text", "0");
		var bodyCellIndex = this._gfnGridGetBodyCellIndex(objGrid, nHeadCell);
		// body cell index 에 해당하는 바인드 컬럼명
		var columnName = this._gfnGridGetBindColumnNameByIndex(objGrid, bodyCellIndex);
		if(columnName == "ROW_CHK") {
			 sChk="";
		}else{
			sChk="0";
		}
	}
	
	// Body셋팅
	oDsObj.set_enableevent(false);
	for(var i=0 ; i< oDsObj.rowcount ; i++) {
		oDsObj.setColumn(i, sChkVal, sChk);
	}
	oDsObj.set_enableevent(true);
														this.gtrace("------------------------------------------end------------------------------------------", gtrcPos);
};

/**
 * @class  마우스우클릭시 표현될 팝업메뉴생성
 * @param  {Object} objGrid	- 대상그리드
 * @return  N/A
 * @example
 * this._gfnGetHeadBodyIndex(this.grdMain, this.dsMain);	
 */
pForm._gfnMakeGridPopupMenu = function (objGrid, arrProp)
{																		var gtrcPos = "Grid.xjs._gfnMakeGridPopupMenu";
	var objApp 		 = pForm.gfn_getApplication();						//this.gtrace("objApp-->"+objApp, gtrcPos);
	var objMenuDs 	 = objApp.gds_gridPopupMenu;						//this.gtrace("objMenuDs-->"+objMenuDs.name, gtrcPos);
	var objParentForm= objGrid.parent;									//this.gtrace("objParentForm-->"+objParentForm.name, gtrcPos);
	
	var sPopupDsMenu = "dsPopupMenu_"+objGrid.name+"_"+this.name;		//this.gtrace("sPopupDsMenu-->"+sPopupDsMenu, gtrcPos);
	var objPopupDs 	 = new Dataset(sPopupDsMenu);						//this.gtrace("새롭게 생성된 데이터셋(sPopupDsMenu 명칭으로 생성됨) : objPopupDs-->"+objPopupDs.name, gtrcPos);
	objParentForm.addChild(sPopupDsMenu, objPopupDs); 					this.gtrace(objPopupDs.name+"(objPopupDs)를 addChild 함", gtrcPos);
	objPopupDs.copyData(objApp.gds_gridPopupMenu);						this.gtrace("objPopupDs에 gds_gridPopupMenu를 복사해 옴", gtrcPos);
																		this.gtrace("루프돌리기 : arrProp---->"+arrProp+"----length:"+arrProp.length, gtrcPos);
	for(var i=0; i<arrProp.length; i++){
		for(var j=0; j<objPopupDs.rowcount; j++){
			var sMenu = objPopupDs.getColumn(j,"id");					//	if(i==0){this.gtrace("objPopupDs의 메뉴=sMenu---->"+sMenu, gtrcPos);}
			if( this.gfn_isNull(sMenu) ) continue;

			if( sMenu.indexOf(arrProp[i]) > -1 ){						this.gtrace("objPopupDs의 메뉴에 존재하는 arrProp[i]---->"+arrProp[i], gtrcPos);
				objPopupDs.setColumn(j, "enable", "true");				this.gtrace("존재하는 sMenu만 objPopupDs의 enable을 true로 해 줌", gtrcPos);
																		this.gtrace("level 1 인지 확인--->"+objPopupDs.getColumn(j, "level"), gtrcPos);
				if( objPopupDs.getColumn(j, "level") == 1){
					var sUpMenu = objPopupDs.getColumn(j, "upmenu");
					var nUpRow = objPopupDs.findRow("id", sUpMenu);		this.gtrace("level 1 이므로 그 상위메뉴(upmenu)도 enable true로 바꿈, 여기서의 상위메뉴id는-->"+objPopupDs.getColumn(nUpRow, "id"), gtrcPos);
					if(nUpRow > -1) objPopupDs.setColumn(nUpRow, "enable", "true");
				}
			}
		}
	}
	var sPopMenu = "popMenu_"+objGrid.name+"_"+this.name;				
	var objPopMenu = new PopupMenu(sPopMenu, 0, 0, 100, 100);			this.gtrace("PopupMenu생성(objPopMenu)(사이즈 :  0, 0, 100, 100)---------->"+objPopMenu.name, gtrcPos);
	
	objParentForm.addChild(objPopMenu.name, objPopMenu);
	
	objPopMenu.set_innerdataset(sPopupDsMenu);
	objPopMenu.set_captioncolumn("caption");

    objPopMenu.set_enablecolumn("enable");
	objPopMenu.set_idcolumn("id");
	objPopMenu.set_levelcolumn("level");
 	objPopMenu.addEventHandler("onmenuclick", this.gfn_popupmenu_onmenuclick, objParentForm);	this.gtrace(objParentForm.name+"(objParentForm)에 이벤트추가 : gfn_popupmenu_onmenuclick", gtrcPos);
	objPopMenu.show();
	
	objPopMenu.set_itemheight(24);
	
	objPopMenu.grid = objGrid;
	objGrid.popupMenu = objPopMenu;

														this.gtrace("-------END--------"+gtrcPos+"------", gtrcPos);
};

/**
 * @class  그리드 설정 내부함수<br>
		   그리드에 유저프로퍼티를 Array형태로 반환한다.
 * @param  {Object}objGrid	- 대상그리드
 * @return {Array} user property
 * @example
 * this._getGridUserProperty(this.grdMain);	
 */
pForm._getGridUserProperty = function (objGrid)
{
														var gtrcPos	= "Grid.xjs._getGridUserProperty";
	var sProp = objGrid.griduserproperty;				this.gtrace(objGrid.name+"의 griduserproperty (sProp) : "+sProp, gtrcPos);
	var arrdefault = this.defaultmenulis.split(",");	this.gtrace("defaultmenulis값을 쉼표로 스플릿해 나온 배열 arrdefault : "+arrdefault, gtrcPos);
	var arrprop = [];
	
	if(!this.gfn_isNull(sProp)){						this.gtrace("		"+sProp+" : sProp 값이 null이 아닌 경우", gtrcPos);
		arrprop = sProp.split(",");						this.gtrace("		"+arrprop+" : 스플릿 하여 arrprop 배열을 만든다.", gtrcPos);
														this.gtrace("		"+"느낌표로 시작하는 것은 TODO.DEFAULT에서 제거한다", gtrcPos);
		for( var i=0; i<arrprop.length; i++){
			if( arrprop[i].indexOf("!") == 0 ){
				//TODO.DEFAULT에서제거
				for( var j=0; j<arrdefault.length; j++){
					if( arrdefault[j] == arrprop[i].substr(1) ){
														this.gtrace(arrdefault[j]+"---arrdefault[j] ---------같으므로---------"+arrprop[i].substr(1)+"---arrprop[i].substr(1)", gtrcPos);
						arrdefault[j] = "";
														this.gtrace("["+arrdefault[j]+"]---arrdefault[j]값을 공백처리", gtrcPos);
					}
				}
				arrprop[i] = "";
														this.gtrace("arrprop[i]가 공백처리된 후의 상태 : "+arrprop, gtrcPos);
			}
		}
	}
	
	var arrmyprop = [];
														this.gtrace("arrdefault를 루프돌면서 있는 것만 arrmyprop에 담기", gtrcPos);
	for( var i=0; i< arrdefault.length; i++){
		if(!this.gfn_isNull(arrdefault[i])){
			arrmyprop.push(arrdefault[i]);
		}
	}
														this.gtrace("즉, 느낌표 없는 것만 추출된다. arrmyprop:"+arrmyprop, gtrcPos);
														this.gtrace("arrprop 기준으로 또 넣는다 ?? 중복 아님 ?? 뭔가 이상하다...arrprop-->"+arrprop, gtrcPos);
	for( var i=0; i< arrprop.length; i++){
		if(!this.gfn_isNull(arrprop[i])){
			arrmyprop.push(arrprop[i]);
		}
	}
	
	return arrmyprop;
														this.gtrace("------------------------------------------end------------------------------------------", gtrcPos);
};


//////////////////////////////////////////////////////////////////////////Popupmenu//////////////////////////////////////////////////////////////////////////
/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
		  셀고정(colfix)
 * @param {Object} objGrid  - 대상그리드
 * @param {Number} nCellIdx - 셀고정 셀인덱스
 * @param {Number} nRowIdx  - 셀고정 로우 인덱스
 * @return N/A
 * @example
 * this._gfnGridcellFix(this.grdMain, 1, 2);	
 */
pForm._gfnGridcellFix = function (objGrid, nCellIdx, nRowIdx)
{
										var gtrcPos = "Grid.xjs._gfnGridcellFix";
	var sBandType;
	if(nRowIdx == -1) sBandType = "Head";
	else if(nRowIdx == -2) sBandType = "Summary";
	else sBandType = "Body";
	
	var nCol 	 = nexacro.toNumber(objGrid.getCellProperty(sBandType, nCellIdx, "col"));
	var nColSpan = nexacro.toNumber(objGrid.getCellProperty(sBandType, nCellIdx, "colspan"));
	var nRowSpan = nexacro.toNumber(objGrid.getCellProperty(sBandType, nCellIdx, "rowspan"));
	var nVal = objGrid.getCellpos
	var nMaxCol = 0;
	var i;
	var nRealCol;
	var nRealColSpan;
	var nRealCol_end;
	
	objGrid.set_enableredraw(false);
	
	objGrid.setFormatColProperty(0, "band", "body");	
	
	for (i=0; i<objGrid.getCellCount("Head"); i++)
	{
		nRealCol = nexacro.toNumber(objGrid.getCellProperty("Head", i, "col"));
		nRealColSpan = nexacro.toNumber(objGrid.getCellProperty("Head", i, "colspan"));
		nRealCol_end = nRealCol+nRealColSpan-1;
		if ( nRealCol == nCol||nRealCol_end==nCol)
		{
			if(nRealColSpan>1)
			{
				//objGrid.setCellProperty("Head", i, "line", "1 solid #dcdbdaff,2 solid #919191ff");
				nCol = nRealCol_end;
			}else
			{
				//objGrid.setCellProperty("Head", i, "line", "1 solid #dcdbdaff,2 solid #919191ff");
				nCol = nRealCol_end;
			}
		}else
		{
			objGrid.setCellProperty("Head", i, "line", "");
		}
	}
	
	for (i=0; i<objGrid.getCellCount("Body"); i++)
	{
		if (objGrid.getCellProperty("Body", i, "col") == nCol)
		{
			//objGrid.setCellProperty("Body", i, "line", "1 solid #dcdbdaff,2 solid #919191ff");
			objGrid.setCellProperty("Body", i, "border", "1px solid #dbdee2 , 2px solid aqua , 1px solid #dbdee2 , 1px solid #dbdee2");
		}
		else
		{
			//objGrid.setCellProperty("Body", i, "line", "");
			objGrid.setCellProperty("Body", i, "border", "");
		}
	}	
	
	objGrid.setFormatColProperty(nCol, "band", "left");	
	objGrid.set_enableredraw(true);
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
		  셀고정해제(colfree)
 * @param {Object} objGrid - 대상그리드
 * @return N/A
 * @example
 * this._gfnGridCellFree(this.grdMain);	
 */
pForm._gfnGridCellFree = function(objGrid)
{
	for(i=0; i< objGrid.getFormatColCount(); i++)
	{		
		objGrid.setFormatColProperty(i, "band", "body");	
	}
		
	for (i=0; i<objGrid.getCellCount("Body"); i++)
	{
		objGrid.setCellProperty("Body", i, "border", "");
	}	
	
	this.gv_CellIndex = -1;
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          셀필터(cellFilter)
 * @param {Object} objGrid - 대상그리드	
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridFilter(this.grdMain);	
 */
pForm._gfnGridFilter = function(objGrid)
{																				var gtrcPos = "Grid.xjs._gfnGridFilter";
																				this.gtrace("<-------------셀필터(cellFilter)설정------------->", gtrcPos);
	var sTitle = this.gfn_getWord("popup.datafiltersetting");					this.gtrace("팝업의 titletext를 다국어로 찾아 온다-->popup.datafiltersetting:sTitle---->"+sTitle, gtrcPos);
	var oArg = {pvGrid:objGrid};
	
	var oOption = {title:sTitle};	//top, left를 지정하지 않으면 가운데정렬 //"top=20,left=370"
	var sPopupCallBack = "gfn_gridFilterCallback";
	this.gfn_openPopup( "Comm_GridFilter", "Comm::Comm_GridFilter.xfdl",oArg, sPopupCallBack, oOption);	
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          셀필터해제(cellfilterfree)
 * @param {Object} objGrid - 대상그리드	
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridCellFilterFree(this.grdMain);	
 */
pForm._gfnGridCellFilterFree = function(objGrid)
{
	var objDs = objGrid.getBindDataset();
	objDs.set_filterstr("");
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          찾기/바꾸기
 * @param {Object} objGrid - 대상그리드	
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridCellReplace(this.grdMain);	
 */
pForm._gfnGridCellReplace = function(objGrid,nCellIndex,nRowIndex)
{
	var sTitle = this.gfn_getWord("popup.datafindreplace");
	var orgselecttype = objGrid.selecttype;

	var oArg = {pvGrid:objGrid, pvStrartRow:nRowIndex, pvSelectCell:nCellIndex, pvSelectType:orgselecttype};
	var oOption = {title:sTitle};	//top, left를 지정하지 않으면 가운데정렬 //"top=20,left=370"
	var sPopupCallBack = "gfn_replaceCallback";
	this.gfn_openPopup( "Comm_FindReplace","Comm::Comm_FindReplace.xfdl",oArg,sPopupCallBack,oOption);	
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          컬럼 숨기기/보이기
 * @param {Object} objGrid - 대상그리드	
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridColHideShow(this.grdMain);	
 */
pForm._gfnGridColHideShow = function(objGrid)
{
								var gtrcPos = "Grid.xjs._gfnGridColHideShow";
									this.gtrace("● 컬럼 숨기기/보이기", gtrcPos);
	var sTitle = this.gfn_getWord("popup.colshwohide");		this.gtrace(" - 타이틀(sTitle)------------>"+sTitle, gtrcPos);
	
	var oArg = {pvGrid:objGrid};							this.gtrace(" - 아규먼트(oArg.pvGrid.name)------------>"+oArg.pvGrid.name, gtrcPos);
	var oOption = {title:sTitle};	//top, left를 지정하지 않으면 가운데정렬 //"top=20,left=370"
															this.gtrace(" - 옵션(oOption.title)------------>"+oOption.title, gtrcPos);
	var sPopupCallBack = "gfn_columnHidCallback";			this.gtrace(" - 콜백(팝업,sPopupCallBack)------------>"+sPopupCallBack, gtrcPos);
	this.gfn_openPopup( "Comm_ColumnHide","Comm::Comm_ColumnHide.xfdl",oArg,sPopupCallBack,oOption);	
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          부분합
 * @param {Object} objGrid - 대상그리드	
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridSubSum(this.grdMain);	
 */
pForm._gfnGridSubSum = function(objGrid)
{
	var sTitle = this.gfn_getWord("popup.subsum");
	
	var oArg = {pvGrid:objGrid};
	var oOption = {title:sTitle};	//top, left를 지정하지 않으면 가운데정렬 //"top=20,left=370"
	var sPopupCallBack = "gfn_subSumCallback";
	this.gfn_openPopup( "SubSum","Comm::Comm_SubSum.xfdl",oArg,sPopupCallBack,oOption);	
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          엑셀익스포트
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridExcelExport(this.grdMain);	
 */
pForm._gfnGridExcelExport = function(objGrid)
{
					var gtrcPos = "Grid.xjs._gfnGridExcelExport";
									this.gtrace("● 엑셀익스포트 : _gfnGridExcelExport", gtrcPos);
	//	this.gfn_excelExport(objGrid, "*?*?*?*?*?*?*?","");
	this.gfn_excelExport(objGrid, objGrid.name, this.parent.name);
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          엑셀임포트
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridExcelImport(this.grdMain);	
 */
pForm._gfnGridExcelImport = function(objGrid)
{
	var sDataset = objGrid.binddataset;
	this.gfn_excelImport(sDataset, "sheet1", "A2", "fnImportCallback", objGrid.name + sDataset , this);
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 개인화
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridPersonalize(this.grdMain);	
 */
pForm._gfnGridPersonalize = function(objGrid)
{
	var sOrgFormat = objGrid.orgformat2;
	var sCurFormat = objGrid.getCurFormatString();
	this._gfnGridPersonalizeExcute(objGrid);
//	//변경된 사항 확인 할 경우 아래 스크립트 사용
// 	if( sOrgFormat == sCurFormat ){
// 		this.gfn_alert("msg.save.nochange","","NoChangeFormat");
// 	}else{
// 		var sId = "ChangeFormat|" + objGrid.name;
// 		this.gfn_alert("confirm.before.save","", sId, "gfn_gridFormatChangeMsgCallback");
// 	}
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 개인화내용 저장을 위해 유니크한 아이디를 구성한다.
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridPersonalize(this.grdMain);	
 */
pForm._getUniqueId = function (objGrid)
{
										var gtrcPos = "Grid.xjs._getUniqueId";
	var sFormId;
	var oForm = objGrid.parent; //대상FORM조회
										this.gtrace("해당 그리드를 포함한 폼 : oForm---->"+oForm.name, gtrcPos);
										this.gtrace("위 폼 "+oForm.name+"이 ChildFrame인지 확인---->"+(oForm instanceof nexacro.ChildFrame), gtrcPos);
	while (true)
	{
		if(oForm instanceof nexacro.ChildFrame){
			break;
		}else{
			oForm = oForm.parent;		this.gtrace("위 값이 false인 경우 gv_MenuCodeCol에서 parent를 다시 가져옴---->"+oForm.name, gtrcPos);
		}
	}

	sFormId = oForm.name;				this.gtrace("oForm의 name : sFormId---->"+sFormId, gtrcPos);
										this.gtrace("sFormId에 'win'을 포함하는지에 따라 (팝업 / workform)을 구분함", gtrcPos);
	if( sFormId.indexOf("win") > -1 ){
		//팝업과 workform구분
		sFormId = oForm.form.div_work.form.name;
										this.gtrace("팝업이므로 oForm 의 div_work의 이름을 다시 가져옴 sFormId : "+sFormId, gtrcPos);
	}else{			
										this.gtrace("팝업이 아니므로 sFormId는 그대로 "+sFormId, gtrcPos);
	}
	
	var otf = objGrid.parent.parent;	this.gtrace(objGrid.name+"의 parent.parent는 otf : " +otf.name, gtrcPos);
										this.gtrace(otf.name+"이 탭페이지인지 확인 : " +(otf instanceof nexacro.Tabpage), gtrcPos);
	if( otf instanceof nexacro.Tabpage){
		//탭안에 그리드가 있을경우
		sFormId += "_" + otf.parent.name +"_"+ otf.name;
										this.gtrace(otf.name+"이 탭페이지 이므로 : "+sFormId.name+"_"+ otf.parent.name+"_"+otf.name, gtrcPos);
	}else if( otf instanceof nexacro.Div && otf.name != "div_work"){
		//div안에 그리드가 있을경우
		sFormId += "_" + otf.name;
										this.gtrace(otf.name+"이 div안에 있으므로 : "+sFormId.name+"_"+ otf.name, gtrcPos);
	}
	sFormId += "_" + objGrid.name;		this.gtrace("마지막 그리드의 이름을 붙임 : _"+objGrid.name, gtrcPos);
										this.gtrace("최종 sFormId : "+sFormId, gtrcPos);
										this.gtrace("----------------------------------------------------------------------", gtrcPos);
	return sFormId;
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 개인화실행.
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridPersonalize(this.grdMain);	
 */
pForm._gfnGridPersonalizeExcute = function (objGrid)
{
	var sFormatId 	= this._getUniqueId(objGrid);
	var sFormat 	= objGrid.getCurFormatString(false);
	var sOrgFormats = objGrid.getFormatString();

	var objApp = pForm.gfn_getApplication();
	var objGds = objApp.gds_gridPersonal;
	
	var nFindRow = objGds.findRow("sFormatId", sFormatId);
	if( nFindRow == -1 ){
		var nRow = objGds.addRow();
		objGds.setColumn(nRow, "sFormatId", sFormatId);
		objGds.setColumn(nRow, "sFormat", sFormat);
		objGds.setColumn(nRow, "sOrgFormat", sOrgFormats);
	}else{
		objGds.setColumn(nFindRow, "sFormat", sFormat);
		//objGds.setColumn(nFindRow, "sOrgFormat", sOrgFormats);
	}
	var sXML = objGds.saveXML();
	nexacro.setPrivateProfile("gds_gridPersonal", sXML);	
	this.gfn_alert("msg.save.success","","saveSuccess","gfn_gridFormatChangeMsgCallback");
};
//////////////////////////////////////////////////////////////////////////POPUPMENU CALLBACK///////////////////////////////////////////////////////////

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 개인화 메세지콜백
 * @param {String} sid - popupid	
 * @param {String} rtn - return value	 
 * @return N/A
 * @example
 * this.gfnGridFormatChangeFormatCallback("TEST", "");	
 */
pForm.gfn_gridFormatChangeMsgCallback = function (sid, rtn)
{
	//TODO.
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 찾기/바꾸기 팝업 콜백
 * @param {String} sid - popupid	
 * @param {String} rtn - return value	 
 * @return N/A
 * @example
 * this.gfn_replaceCallback("TEST", "");	
 */
pForm.gfn_replaceCallback = function (sid, rtn)
{
	//TODO
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 필터 팝업 콜백
 * @param {String} sid - popupid	
 * @param {String} rtn - return value	 
 * @return N/A
 * @example
 * this.gfn_gridFilterCallback("TEST", "");	
 */
pForm.gfn_gridFilterCallback = function (sid, rtn)
{
																	var gtrcPos = "Grid.xjs.gfn_gridFilterCallback";
																	this.gtrace("callback---------------->here", gtrcPos);
	//TODO
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 컬럼숨기기/보이기
 * @param {String} sid - popupid	
 * @param {String} rtn - return value	 
 * @return N/A
 * @example
 * this.gfn_columnHidCallback("TEST", "");	
 */
pForm.gfn_columnHidCallback = function (sid, rtn)
{
	//TODO
};

//////////////////////////////////////////////////////////////////////////POPUPMENU FUNCTION///////////////////////////////////////////////////////////
/**
 * @class   주어진 문자열을 그리드에서 찾는다.
 * @param {Object} grid - 대상그리드	
 * @param {String} findText - 찾을 문자열	
 * @param {Object} option - 찾기옵션	
 * @return {Object} 찾은 열과행
 * @example
 * this.gfn_findGridText(this.fv_grid, txt, option);
 */
pForm.gfn_findGridText = function (grid, findText, option)
{
	grid.lastFindText = findText;
	grid.lastFindOption = option;

	// 찾을 옵션
	var direction = option.direction;
	var position = option.position;
	var scope = option.scope;
	var condition = option.condition;
	var strict = option.strict;

	var dataset = grid.getBindDataset();
	var startCell = ( position == "current" ? grid.currentcell : grid.lastFindCell );
	var startRow = ( position == "current" ? grid.currentrow : grid.lastFindRow );
	
	// 바꾸기에서 호출시 (option.cell 은 바꾸기에서만 지정)
	if ( scope == "col" && !this.gfn_isNull(option.cell) )
	{
		startCell = option.cell;
	}
	
	var findRow = findCell = -1;
	var rowCnt = dataset.rowcount;
	var bodyCellCnt = grid.getCellCount("body");
			
	// 대소문자 구분
	if ( !strict )
	{
		findText = findText.toUpperCase();			
	}
		
	if ( direction == "prev" )
	{
		startRow -= 1;	
		if ( startRow < 0 )
		{
			startRow = rowCnt-1;
		}
	}
	else
	{
		startRow += 1;
		if ( startRow >= rowCnt )
		{
			startRow = 0;
		}
	}
	
	var loopCnt = rowCnt;
	while ( loopCnt > 0 )
	{
		// 문자열 비교
		if ( this._compareFindText(grid, startRow, startCell, findText, condition, strict) )
		{
			findRow = startRow;
			findCell = startCell;
			break;
		}
		
		// 방향 (이전, 다음)
		if ( direction == "prev" )
		{
			startRow -= 1;
			if ( startRow < 0 )
			{
				startRow = rowCnt-1;
			}				
		}
		else
		{
			startRow += 1;
			if ( startRow > (rowCnt-1) )
			{
				startRow = 0;
			}
		}
		
		loopCnt--;
	}
	// 마지막 찾은 위치 지정
	// 팝업에서 찾을 방향을 "처음부터" 로 변경 시 초기화
	if ( findRow > -1 && findCell > -1 )
	{
		grid.lastFindRow = findRow;
		grid.lastFindCell = findCell;
	}
	
	return [findRow, findCell];
};

/**
 * @class   주어진 문자열을 그리드에서 찾아서 바꿀 문자열로 변경한다.
 * @param {Object} grid - 대상 Grid Component
 * @param {String} findText - 찾을 문자열
 * @param {String} replaceText - 바꿀 문자열
 * @param {Object} option - 찾을 옵션
 * @param {Boolean} all - 모두 바꾸기 여부
 * @return {Number} 변경 항목 개수.
 * @example
 *this.gfn_replaceGridText(grid, findText, replaceText, option, bAllChg);
 */
pForm.gfn_replaceGridText = function(grid, findText, replaceText, option, all)
{
	// F3 발생 시 마지막 찾은 문자열 계속 찾기 위해 값 지정
	grid.lastFindText = findText;
	grid.lastFindOption = option;
	
	if ( this.gfn_isNull(all) )
	{
		all = false;
	}
	
	
	// 찾을 옵션 ( 바꾸기의 범위는 특정 칼럼만 지원) 
	var direction = option.direction;
	var position = option.position;
	var condition = option.condition;
	var strict = option.strict;
	var cell = option.cell;
	
	var dataset = grid.getBindDataset();//this.gfn_lookup(grid.parent, grid.binddataset);
	
	// 바꾸기의 범위는 특정 칼럼만 지원
	var startCell = option.cell;
	var startRow;
	
	if ( position == "current" )
	{
		startRow = grid.currentrow;
	}
	else
	{
		var lastReplaceRow = grid.lastReplaceRow;
		if ( this.gfn_isNull(lastReplaceRow) )
		{
			startRow = 0;
		}
		else
		{
			startRow = lastReplaceRow;
		}
	}
	
	var results = [];
	var findRow = findCell = -1;		
	var rowCnt = dataset.rowcount;
	var bodyCellCnt = grid.getCellCount("body");
	
	// 바꿀 문자열 목록에 등록
	//this.appendFindReplaceCache("replace", replaceText);
	
	// 대소문자 구분
	if ( !strict )
	{
		findText = findText.toUpperCase();	
	}
	
	// 열 범위 바꾸기
	var result;
	var loopCnt = rowCnt;
	while ( loopCnt > 0 )
	{
		// 문자열 비교
		if ( this._compareFindText(grid, startRow, startCell, findText, condition, strict) )
		{
			findRow = startRow;
			findCell = startCell;
			result = this._replaceGridCellText(grid, findRow, findCell, findText, replaceText, strict);
			results.push(result);
			if ( !all ) break;
		}
		
		// 방향 (이전, 다음)
		if ( direction == "prev" )
		{
			startRow -= 1;
			if ( startRow < 0 )
			{
				startRow = rowCnt-1;
			}				
		}
		else
		{
			startRow += 1;
			if ( startRow > (rowCnt-1) )
			{
				startRow = 0;
			}
		}
		
		loopCnt--;
	}
		
	// 마지막 바꾸기 위치 지정
	grid.lastReplaceRow = findRow;
	return results;
};

 /**
 * @class   바꾸기에 의해 찾아진 행, 셀 인덱스에 해당하는 데이터를 실제 변경한다.
 * @param {Object} grid 대상 Grid Component
 * @param {Number} findRow 찾아진 행 인덱스
 * @param {Number} findCell 찾아진 셀 인덱스
 * @param {String} findText 찾을 문자열
 * @param {String} replaceText 바꿀 문자열
 * @param {Boolean} strict 대소문자 구분
 * @return {Object} result - 결과
 * @example
 * this._replaceGridCellText(grid, findText, replaceText, option, bAllChg);
 */
pForm._replaceGridCellText = function(grid, findRow, findCell, findText, replaceText, strict)
{
	var result = {'replace': true, 'message': '처리되었습니다.', 'row': findRow, 'cell': findCell};
	
	// expr 등에 의해 셀이 실제 입력 가능한지 테스트 후 처리
	var dataset = grid.getBindDataset();//this.gfn_Lookup(grid.parent, grid.binddataset);
	dataset.set_rowposition(findRow);
	grid.setCellPos(findCell);
// 	trace(grid + " :::: " + grid.name);
// 	trace("111111111111111111 findRow :: " + findRow + " findCell :: " + findCell)
// 	trace("111111111111111111 dataset :: " + dataset.name);
//	var editable = grid.showEditor(true);
// 	trace("111111111111111111 editable :: " + editable);
// 	if ( editable )
// 	{
// 		grid.showEditor(false);
// 	}
// 	else
// 	{
// 		 return;
// 	}
	var displayType = grid.getCellProperty("body", findCell, "displaytype");
	var editType 	= grid.getCellProperty("body", findCell, "edittype");
	var text 		= grid.getCellProperty("body", findCell, "text");
	var bindColid 	= text.replace("bind:", "");
	
	// displayType 이 normal일 경우
	// dataType 을 체크하여 displayType 을 변경
	var dataType = this.gfn_getBindColumnType(grid, findCell);
	if ( this.gfn_isNull(displayType) || displayType == "normal" )
	{
		switch(dataType)
		{
			case 'INT' :
			case 'FLOAT' :
			case 'BIGDECIMAL' :
				displayType = "number";
				break;
			case 'DATE' :
			case 'DATETIME' :
			case 'TIME' :
				displayType = "date";
				break;
			default :
				displayType = "text";
		}
	}
	
	var replace;
	var replaceVal;
	var columnValue = dataset.getColumn(findRow, bindColid);
	var displayValue = grid.getCellText(findRow, findCell);
	if ( displayType == "number" || displayType == "currency" )
	{
		// currency 의 경우 원(￦) 표시와 역슬레시(\) 다르므로 제거 후 변경
		if ( displayType == "currency" )
		{
			var code = findText.charCodeAt(0);
			if ( code == 65510 || code == 92 )
			{
				findText = findText.substr(1);
			}
			
			code = replaceText.charCodeAt(0);
			if ( code == 65510 || code == 92 )
			{
				replaceText = replaceText.substr(1);
			}
			
			code = displayValue.charCodeAt(0);
			if ( code == 65510 || code == 92 )
			{
				displayValue = displayValue.substr(1);
			}			
		}
		
		// 셀에 보여지는 값에서 찾는 문자열 값을 변경
		
		// 대소문자 구분
		if ( strict )
		{
			displayValue = displayValue.replace(findText, replaceText);
		}
		else
		{
			displayValue = this.gfn_replaceIgnoreCase(displayValue, findText, replaceText);
		}		
		
		// 숫자형 이외 제거
		replaceVal = this._replaceNumberMaskValue(displayValue);
	}
	else if ( displayType == "date"|| displayType == "calendarcontrol" )
	{
		if ( columnValue == null )
		{
			// 값이 없을때 보이는 "0000-01-01" 과 같이 
			// 텍스트에서 찾아 질 경우가 있다.
			result.replace = false;
			result.message = "유효한 날짜가 아닙니다.";
		}
		else	
		{							
			var mask = grid.getCellProperty("body", findCell, "calendardateformat");
			var ret = this._replaceDateMaskValue(columnValue, displayValue, findText, replaceText, mask, strict);			
			replaceVal = ret[1];
			
			if ( ret[0] == false )
			{
				result.replace = false;
				result.message = ret[2];
			}
		}
	}
	else
	{
		// 대소문자 구분
		if ( strict )
		{
			replaceVal = columnValue.replace(findText, replaceText);
		}
		else
		{
			replaceVal = this.gfn_replaceIgnoreCase(columnValue, findText, replaceText);
		}					
	}
		
	if ( result.replace )
	{
		dataset.setColumn(findRow, bindColid, replaceVal);
	}
	
	return result;
};

 /**
 * @class   문자열을 대소문자 구별없이 주어진 변경문자열(문자) 치환한다.
 * @param {String} sOrg - 원래 문자열( 예 : "aaBBbbcc" )
 * @param {String} sRepFrom - 찾고자 하는 문자열( 예 : "bb" )
 * @param {String} sRepTo - 치환될 문자열 ( 예 : "xx" )
 * @return {String} 치환된 문자열 ( 예 : "aaxxxxccxx" ).
 * @example
 * this.gfn_replaceIgnoreCase(str, findStr, "x");
 */
pForm.gfn_replaceIgnoreCase = function( sOrg, sRepFrom, sRepTo )	
{
	var pos, nStart=0, sRet="";
	
	while(1)
	{
		pos = sOrg.toLowerCase().indexOf(sRepFrom.toLowerCase(), nStart)
		
		if( pos < 0 )
		{
			sRet += sOrg.substr( nStart );
			break;
		}
		else
		{
			sRet += sOrg.substr( nStart, pos - nStart);
			sRet += sRepTo;
			nStart = pos+sRepFrom.length;
		}
	}
	
	return sRet;
};

 /**
 * @class  날짜형으로 마스크 처리된 문자열에서 실제 값을 얻어온다.
 * @param {*} columnValue - 변경전 데이터셋의 실제 값
 * @param {String} displayValue - 보여지는 문자열
 * @param {String} findText - 찾을 문자열
 * @param {String} replaceText - 바꿀 문자열
 * @param {String} mask - 마스크 속성값
 * @param {Boolean} strict - 대소문자 구분 여부
 * @return {Object} 변환정보 (날짜여부, 변경된 문자열, 에러메시지)
 * @example
 * this._replaceDateMaskValue(str, findStr, "x");
 */
pForm._replaceDateMaskValue = function(columnValue, displayValue, findText, replaceText, mask, strict)
{		
	if ( this.gfn_isNull(replaceText) )
	{
		// 바꿀 문자열이 빈값이 되지 않도록 패딩
		replaceText = replaceText.padRight(findText.length, " ");
	}
	
	// 1. 현재 보이는 값에서 문자열을 찾아 바꿀 문자열로 변경
	var replaceDisplayValue;
	
	// 대소문자 구분
	if ( strict )
	{
		replaceDisplayValue = displayValue.replace(findText, replaceText);
	}
	else
	{
		replaceDisplayValue = this.gfn_replaceIgnoreCase(displayValue, findText, replaceText);
	}
	
	// 바꿀 값이 없다면 값을 제거한다.
	if ( this.gfn_isNull(replaceDisplayValue.trim()) )
	{
		return [true, null];
	}
	
	// 2. mask 문자 분리
	var arrMask = this._parseDateMask(mask);
	
	// 3. 변경한 값과 마스크 값을 비교하면서 실제 값을 추출하고 유효날짜 판단
	var tmpStr = "";
	var isDate = true;
	var errorMsg = "";
	var valueIndex = 0;
	var displayIndex = 0;
	var dateValue = [];
	var errorValue = [];
	var checkMask;
	var checkDayIndex = -1;
	var checkYearValue = "";
	var checkMonthValue = "";
	
	for ( var i=0,len=arrMask.length; i<len ; i++ )
	{
		checkMask = arrMask[i];
		if ( !this.gfn_isDigit(checkMask) )
		{
			switch (checkMask)
			{
				case 'yyyy' :
					tmpStr = replaceDisplayValue.substr(displayIndex, 4);
					
					if ( tmpStr.length != 4 || !nexacro.isNumeric(tmpStr) )
					{
						isDate = false;	
						errorMsg = "연도가 올바르지 않습니다.";
					}
					
					// 일자체크를 위해
					checkYearValue = tmpStr;
					
					dateValue[dateValue.length] = tmpStr.trim(" ");
					errorValue[errorValue.length] = tmpStr.trim(" ");
					displayIndex += 4;					
					valueIndex += 4;
					break;
				case 'yy' :
				case 'MM' :
				case 'dd' :
				case 'hh' :
				case 'HH' :
				case 'mm' :
				case 'ss' :
					tmpStr = replaceDisplayValue.substr(displayIndex, 2);
										
					if ( tmpStr.length == 2 && nexacro.isNumeric(tmpStr) )
					{
						if ( checkMask == "yy" )
						{
							// 앞 두자리를 원본 데이터로 채운다.
							tmpStr = columnValue.substr(valueIndex, 2) + tmpStr;
							
							// 일자체크를 위해
							checkYearValue = tmpStr;
						}					
						else if ( checkMask == "MM" )
						{
							if ( parseInt(tmpStr) < 1 || parseInt(tmpStr) > 12 )
							{
								isDate = false;
								errorMsg = "월이 올바르지 않습니다.";
							}
							
							// 일자체크를 위해
							checkMonthValue = tmpStr;
						}
						else if ( checkMask == "dd" )
						{
							// 윤년을 적용하기 위해서는 연도가 필요한데 
							// 무조건 연도(yyyy, yy)가 일(dd) 보다 앞에 온다는
							// 보장이 없으므로 루프가 끝난 후 체크한다.
							checkDayIndex = dateValue.length;
						}
						else if ( checkMask == "hh" || checkMask == "HH" )
						{
							if ( parseInt(tmpStr) < 0 || parseInt(tmpStr) > 23 )
							{
								isDate = false;
								errorMsg = "시간이 올바르지 않습니다.";
							}
						}
						else if ( checkMask == "mm" || checkMask == "ss" )
						{
							if ( parseInt(tmpStr) < 0 || parseInt(tmpStr) > 59 )
							{
								isDate = false;
								errorMsg = "분이 올바르지 않습니다.";
							}
						}
					}
					else
					{
						isDate = false;
						errorMsg = "날짜 형식이 올바르지 않습니다.";
					}
					
					dateValue[dateValue.length] = tmpStr.trim(" ");	
					errorValue[errorValue.length] = tmpStr.trim(" ");	
					displayIndex += 2;
					valueIndex += 2;
					break;
			} // end switch
		}
		else
		{
			// dateValue 는 실제 적용할 값이므로 skip 하자
			
			// 마스크 문자가 아닌 경우 표시문자 이므로 원래 값의 것을 사용
			errorValue[errorValue.length] = displayValue.charAt(checkMask);
			displayIndex += 1;
		}
	}
	
	// 일자 유효 체크
	if ( !this.gfn_isNull(checkYearValue) && 
	     !this.gfn_isNull(checkMonthValue) && checkDayIndex > -1 )
	{
		var dt = checkYearValue + checkMonthValue + "01";
		var inputDay = parseInt(dateValue[checkDayIndex]);
		var lastDay = this.gfn_getMonthLastDay(dt);
	}
	
	if ( isDate )
	{
		return [isDate, dateValue.join("")];
	}
	else
	{
		return [isDate, errorValue.join(""), errorMsg];
	}
};

/**
 * @class  날짜형 마스크 구문을 분석합니다.
 * @param {String} mask - mask 마스크 속성값
 * @return {Object} 구문값
 * @example
 * this._parseDateMask("yyyy-MM-dd");
 */
pForm._parseDateMask = function(mask)
{
	arrMask = [];
	var dateMaskCache;
	var maskArr = mask.split("");	
	var tmpStr = "";
	var tokenStr = "";
	var seq = 0;

	for (var i=0,len=mask.length; i<len;)
	{
		tmpStr = mask.substr(i, 4);
		if ( tmpStr == "yyyy" )
		{
			arrMask[seq] = tmpStr;
			i += 4;
			seq++;
			continue;
		}
		
		// ddd => 요일은 입력할 수 없다.		
		tmpStr = mask.substr(i, 3);
		if ( tmpStr == "ddd" )
		{
			//arrMask[seq] = tmpStr;
			i += 3;
			//seq++;
			continue;
		}						
		
		// hh의 경우 (Calendar는 HH이며 그리드는 둘다 동작함)
		tmpStr = mask.substr(i, 2);
		if ( tmpStr == "yy" || tmpStr == "MM" || tmpStr == "dd" ||
			 tmpStr == "HH" || tmpStr == "hh" || tmpStr == "mm" || tmpStr == "ss" )
		{
			arrMask[seq] = tmpStr;
			i += 2;
			seq++;
			continue;
		}
		
		tokenStr = maskArr[i];
		
		// 입력되지 않으므로 skip.
		if ( tokenStr == "H" || tokenStr == "M" ||
			 tokenStr == "d" || tokenStr == "m" || tokenStr == "s" )
		{
			//arrMask[seq] = tokenStr;
			//seq++;
		}
		else
		{
			arrMask[seq] = i;
			seq++;					
		}
		i++;
	}
	
	//dateMaskCache[mask] = arrMask;
	
	return arrMask;
};

 /**
 * @class  숫자형으로 마스크 처리된 문자열에서 실제 값을 얻어온다.
 * @param {String} mask - 숫자형 문자열
 * @return {String} 변환값 문자열
 * @example
 * this._replaceNumberMaskValue("20170808");
 */
pForm._replaceNumberMaskValue = function(numString)
{
	numString = numString.trim();
	
	var numReg = /[0-9]/;
	var bPoint = false; // 소숫점은 1개만 인정.
	var bInside = false; // 부호는 숫자가 나오기 전에만 인정.
	var c, buf = [];
	
	for(var i=0, len=numString.length; i<len; i++ ) 
	{
		c = numString.charAt(i);
		if( ( c == '+' || c == '-') && ( bInside === false) ) 
		{
			// 부호는 숫자가 나오기 전에만 인정.
			buf.push(c);
			bInside = true;
		}
		else if( numReg.test(c) ) 
		{
			// 숫자인경우 인정.
			buf.push(c);
			bInside = true;
		}
		else if( c == "." && bPoint === false ) 
		{
			// 소숫점은 1회만 인정.
			buf.push(c);
			bPoint = true;
			bInside = true;
		}
		else if( c != "," )
		{
			return "";
		}
	}
	return buf.join("");
};

 /**
 * @class   주어진 행, 셀 인덱스에 해당하는 그리드 데이터와 <br>
 * 문자열을 비교하여 찾아진 결과를 반환
 * @param {Object} grid - 대상 Grid Component
 * @param {Number} row - 찾을 행 인덱스
 * @param {Number} cell - 찾을 셀 인덱스
 * @param {String} findText - 찾을 문자열
 * @param {String} condition - 찾을 조건(equal/inclusion)
 * @param {Boolean} strict - 대소문자 구분 (true/false)
 * @return {Boolean} - 찾기 성공.
 * @example
 * this._compareFindText(grid, startRow, startCell, findText, condition, strict) 
 */
pForm._compareFindText = function(grid, row, cell, findText, condition, strict)
{
	var cellText = grid.getCellText(row, cell);
	if( this.gfn_isNull(cellText))return;
	var displayType = grid.getCellProperty("body", cell, "displaytype");
		
	// displayType 이 normal일 경우
	// dataType 을 체크하여 displayType 을 변경
	if ( this.gfn_isNull(displayType) || displayType == "normal" )
	{
		var dataType = this.gfn_getBindColumnType(grid, cell);
		switch(dataType)
		{
			case 'INT' :
			case 'FLOAT' :
			case 'BIGDECIMAL' :
				displayType = "number";
				break;
			case 'DATE' :
			case 'DATETIME' :
			case 'TIME' :
				displayType = "date";
				break;
			default :
				displayType = "strign";
		}
	}
	
	// currency 의 경우 원(￦) 표시와 역슬레시(\) 다르므로 제거 후 비교
	if ( displayType == "currency" )
	{
		var code = cellText.charCodeAt(0);
		if ( code == 65510 || code == 92 )
		{
			cellText = cellText.substr(1);
		}
		
		code = findText.charCodeAt(0);
		if ( code == 65510 || code == 92 )
		{
			findText = findText.substr(1);
		}
	}

	// 대소문자 구분
	if ( !strict )
	{
		cellText = cellText.toUpperCase();
	}
	// 일치/포함
	if ( condition == "equal" )
	{
		if ( findText == cellText )
		{
			return true;
		}
	}
	else 
	{
		if ( cellText.indexOf(findText) > -1 )
		{			
			return true;
		}
	}

	return false;
};

 /**
 * @class   데이터의 타입반환
 * @param {Object} grid - 대상 Grid Component
 * @param {Number} cell - 찾을 셀 
 * @return {Object} - 찾기 성공.
 * @example
 *  this.gfnGetBindColumnType(grid, cell);
 */
pForm.gfn_getBindColumnType = function(grid, cell)
{
	var dataType = null;
	var dataset = this.gfn_lookup(grid.parent, grid.binddataset);
	var bindColid = grid.getCellProperty("body", cell, "text");
		bindColid = bindColid.replace("bind:", "");
	
	if ( !this.gfn_isNull(bindColid) )
	{
		var colInfo = dataset.getColumnInfo(bindColid);
		if ( !this.gfn_isNull(colInfo) )
		{
			dataType = colInfo.type;
		}
	}
	
	return dataType;
};

//////////////////////////////////////////////////////////////////////////CELL COPY AND PASTE//////////////////////////////////////////////////////////////////////////
/**
 * @class copy event(nexacro, ie)
 * @param {Object} obj- 대상그리드
 * @param {Event}  e - key down event
 * @return N/A
 * @example
 * this._gfnGridCopyEventForRuntime(obj, e);	
*/
pForm._gfnGridCopyEventForRuntime = function (obj, e)
{
	var startrow = nexacro.toNumber(obj.selectstartrow);
	if( startrow == -9) return;

	var endrow   = nexacro.toNumber(obj.selectendrow);
	if( endrow == -9) return;
	
	var startcol = 0;
	var endcol = 0;
	
	if( obj.selecttype == "row" || obj.selecttype == "multirow"){
		startcol = 0;
		endcol = obj.getCellCount("body")-1;
	}else{
		startcol = nexacro.toNumber(obj.selectstartcol);
		endcol   = nexacro.toNumber(obj.selectendcol);
	}
	var colSeperator = "\t";
	var copyData = "";
	var checkIndex = {};
	
	for (var i = startrow; i <= endrow; i++) {
		for (var j = startcol; j <= endcol; j++) {
			var value = obj.getCellValue(i,j);
			if(!this.gfn_isNull(value)) {
				if (j < endcol) {
					copyData += obj.getCellValue(i,j) + colSeperator;
				} else {
					copyData += obj.getCellValue(i,j);
				}
			}
		}
		if (i < obj.selectendrow) {
				copyData += "\r\n";
		}
	}

	copyData += "\r\n";
	system.clearClipboard();
	system.setClipboard("CF_TEXT",copyData);


	var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
};

/**
 * @class paste데이터생성
 * @param {String} browser - 브라우저
 * @return paste데이터 
 * @example
 * this._gfnGirdGetPasteData("nexacro");	
*/
pForm._gfnGirdGetPasteData = function (browser)
{
	var copyData = "";
	if( browser == "nexacro" || browser == "IE"){
		copyData = system.getClipboard("CF_TEXT");
		copyData = new String(copyData);
	}else{
		var ta = this.tragetGrid["ta"];

		if(!ta) return;

		copyData = ta.value;
		document.body.removeChild(ta);
		
		this.tragetGrid["ta"] = undefined;
	}
	return copyData;
	
};

/**
 * @class paste event
 * @param {Object} obj- 대상그리드
 * @param {Event}  e - key down event
 * @return N/A
 * @example
 * this._gfnGridPasteEvent(obj, e);	
*/
pForm._gfnGridPasteEvent = function (obj, e)
{
						var gtrcPos = "Grid.xjs._gfnGridPasteEvent";
	var browser = system.navigatorname;
	var copyData = this._gfnGirdGetPasteData(browser);
	
	if( this.gfn_isNull(copyData)) return;
	
	var colSeperator = "\t";
	var rowData ="";
	if( browser == "nexacro" || browser =="IE"){
		rowData = copyData.split("\r\n");
		if(rowDataCount < 1) {
			e.stopPropagation();
			return;
		}
	}else{
		rowData = copyData.split(/[\n\f\r]/); 
	}
	var rowDataCount = rowData.length - 1;

			
	
	obj.set_enableevent(false);
	obj.set_enableredraw(false); 
	
	var datasetName = obj.binddataset;
	var ds = obj.getBindDataset();

	ds.set_enableevent(false); 

	var grdCellCount = obj.getCellCount("body");
	var rowCount = ds.getRowCount();
	
	var startrow = nexacro.toNumber(obj.selectstartrow);
	if( startrow == -9) return;

	var endrow   = nexacro.toNumber(obj.selectendrow);
	if( endrow == -9) return;
	
	var startcol = 0;
	var endcol = 0;
	
	if( obj.selecttype == "row" || obj.selecttype == "multirow"){
		startcol = 0;
		endcol = obj.getCellCount("body")-1;
	}else{
		startcol = nexacro.toNumber(obj.selectstartcol);
		endcol   = nexacro.toNumber(obj.selectendcol);
	}

	var currRow = startrow;
	var cellIndex = startcol;
	var maxColumnCount = 0;
	var checkIndex = {};	
												this.gtrace("ds.name-->"+ds.name,gtrcPos);
	var iColIdx = ds.getColIndex( "ROW_STS" ); 	this.gtrace("iColIdx-->"+iColIdx,gtrcPos);
	for (var i = 0; i < rowDataCount; i++)
	{
		if(rowCount <= currRow)
		{
			var iAddRp = ds.addRow();
			if(iColIdx>-1){ds.setColumn(iAddRp, "ROW_STS", "I");}
		}

		var columnData = rowData[i].split(colSeperator);
		var columnLoopCount = cellIndex + columnData.length;

		if(columnLoopCount > grdCellCount) {
			columnLoopCount = grdCellCount;
		}

		if(maxColumnCount < columnLoopCount) {
			maxColumnCount = columnLoopCount;
		}

		var k = 0;
		for(var j = cellIndex; j < columnLoopCount; j++) 
		{
			var colTemp = obj.getCellProperty("body", j, "text");
			var colid;
			if( this.gfn_isNull(colTemp) )
			{
				colid = obj.getCellProperty("body", j, "text");
			}
			else
			{
				colid = obj.getCellProperty("body", j, "text").substr(5);
			}
			
			var tempValue = columnData[k];
			if(!this.gfn_isNull(tempValue))
			{
				ds.setColumn(currRow, colid, tempValue);
			}
			k++;
		}
		currRow++;
	}

	ds.rowposition = currRow;	

	endrow = endrow + rowDataCount - 1;
	endcol = maxColumnCount - 1;
	
	system.clearClipboard();

	obj.set_enableredraw(true);
	obj.set_enableevent(true);
	ds.set_enableevent(true); 

	obj.selectArea(startrow, startcol, endrow, endcol);

	
	var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
	e.stopPropagation();
};

/**
 * @class copy event(chrome)
 * @param {Object} obj- 대상그리드
 * @param {Event}  e - key down event
 * @return N/A
 * @example
 * this._gfnGridCopyEventForChrome(obj, e);	
*/
pForm._gfnGridCopyEventForChrome = function (obj, e)
{
	var startrow = nexacro.toNumber(obj.selectstartrow);
	if( startrow == -9) return;

	var endrow   = nexacro.toNumber(obj.selectendrow);
	if( endrow == -9) return;
	
	var startcol = 0;
	var endcol = 0;
	
	if( obj.selecttype == "row" || obj.selecttype == "multirow"){
		startcol = 0;
		endcol = obj.getCellCount("body")-1;
	}else{
		startcol = nexacro.toNumber(obj.selectstartcol);
		endcol   = nexacro.toNumber(obj.selectendcol);
	}

	var colSeperator = "\t";
	var copyData = "";
	
	for (var i = startrow; i <= endrow; i++) {
		for (var j = startcol; j <= endcol; j++) {
			var value = obj.getCellValue(i,j);
			if(!this.gfn_isNull(value)) {
				if (j < endcol) {
					copyData += obj.getCellValue(i,j) + colSeperator;
				} else {
					copyData += obj.getCellValue(i,j);
				}
			}
		}
		if (i < obj.selectendrow) {
				copyData += "\r\n";
		}
	}

	copyData += "\r\n";
	
	var ta = this._createTextarea(copyData);
	this.tragetGrid = obj;
	this.tragetGrid["ta"] = ta;
	var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
	e.stopPropagation();
};

/**
 * @class cell copy and paste (크롬용 텍스트에어리어생성)
 * @param {String} innerText- value
 * @return{Object} 텍스트에어리어 오브젝트
 * @example
 * this._createTextarea("꼬부기");	
*/
pForm._createTextarea = function(innerText)
{
	var ta = document.createElement('textarea');
	ta.id = "textAreabyCopyAndPaste";
	ta.style.position = 'absolute';
	ta.style.left = '-1000px';
	ta.style.top = document.body.scrollTop + 'px';
	ta.value = innerText;
	
	document.body.appendChild(ta);
	ta.select();

	return ta;
};

//	pForm._gfn_oneTouchComboDropdown = function(obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
pForm._gfn_oneTouchComboDropdown = function(obj, e)
{
	//	http://support.tobesoft.co.kr/Support/index.html
	//	433852 문의 그리드에서 콤보사용시 클릭한번으로 콤보활성
	obj.set_autoenter("select");
	obj.dropdownCombo();
};

pForm._gfn_selTypeArea = function(objGrid){
	objGrid.set_selecttype("area");
};

pForm._gfn_selTypeRow = function(objGrid){
	objGrid.set_selecttype("row");
};

/**
 * @class 		gfn_setGrdDic : 바인드명을헤드텍스트로 (ds_grdDic)
 * @param 		
 * @return		
 * @example
 * 
*/
pForm.gfn_setGrdDic = function(objGrid){

	//Grid의 binddataset설정
	var objDs = objGrid.getBindDataset();
	
	var gtrcPos = "Grid.xjs.gfn_setGrdDic";
	var gtrcBindHeaderTextPos = "Grid.xjs.gfn_setGrdDic.bindHeaderText";
	var gtrcElapsedTimePos = "Grid.xjs.gfn_setGrdDic.elapsedTime";
	var gtrcTotalElapsedTimePos = "Grid.xjs.gfn_setGrdDic.totalElapsedTime";
	
		this.gtrace("●그리드딕셔너리세팅", gtrcPos);
		this.gtrace("●그리드딕셔너리세팅-시간체크-->"+objGrid.name, gtrcElapsedTimePos);
		this.gtrace("●그리드딕셔너리세팅-전체시간체크-->"+objGrid.name, gtrcTotalElapsedTimePos);
		this.gtrace("그리드명--->"+objGrid.name, gtrcPos);
		this.gtrace("시작--->"+this.gfn_getDate("time"), gtrcTotalElapsedTimePos);
		
	// 바인드명을헤드텍스트로 (ds_grdDic)
	var sTrcGridNm = "GridPoHistory";	
	var sTrcTmpCol = "ITEM_NM";		
	
	
	var sObjGridNm = objGrid.name;
	
	var iii = 1;
	
	if(!this.gfn_isNull(this.ds_grdDic))
	{
		for( var j=0; j < objDs.getColCount(); j++){
			
			if(iii%10==0/**/){this.gtrace(iii+"(iii) where---->"+this.gfn_getDate("time"), gtrcElapsedTimePos)};
			
			
			// GridId에 있는 걸 먼저 적용 , 없을 경우 다시 찾는다.
			var sObjGridNm		= objGrid.name;			
			var tmpcol 			= objDs.getColID(j);
			
			if(iii > 40 && iii < 50 /**/){this.gtrace("tmpcol-------->"+tmpcol, gtrcElapsedTimePos)};
			
			var realGridCellIndex = objGrid.getBindCellIndex( "body", tmpcol);

									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("●그리드세팅-바인드명헤드텍스트로", gtrcBindHeaderTextPos)};
									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("트레이스볼그리드(sTrcGridNm)--->"+sTrcGridNm, gtrcBindHeaderTextPos)};
									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("트레이스볼컬럼(sTrcTmpCol)--->"+sTrcTmpCol, gtrcBindHeaderTextPos)};
									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("그리드명----->"+objGrid.name, gtrcBindHeaderTextPos)};
									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("데이터셋명(objDs.name)--->"+objDs.name, gtrcBindHeaderTextPos)};
									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("데이터셋컬럼수(objDs.getColCount)--->"+objDs.getColCount(), gtrcBindHeaderTextPos)};
									if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("실제바인딩된그리드셀Index(realGridCellIndex)--->"+realGridCellIndex + " (<--- 이 인덱스에 setCellProperty를 적용한다.", gtrcBindHeaderTextPos);}

			var iFndRp 			= this.ds_grdDic.findRowExpr("GridId=='"+sObjGridNm+"' && BindCol=='"+tmpcol+"'");		
				if(iFndRp == -1)
					iFndRp 		= this.ds_grdDic.findRowExpr("BindCol=='"+tmpcol+"'");
								if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol){this.gtrace("찾은행번호("+tmpcol+"(iFndRp))---> "+iFndRp+" (ds_grdDic의 BindCol컬럼에서 "+tmpcol+" 값을 찾은 행번호)", gtrcBindHeaderTextPos);}
																							if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("ds_grdDic에서 iFndRp의 다른 컬럼값 가져오기", gtrcBindHeaderTextPos);}
			var sHdTxt 			= this.ds_grdDic.getColumn(iFndRp, "HeaderText");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace(" sHdTxt--->"+sHdTxt 			, gtrcBindHeaderTextPos);}
			var iColWidth 		= this.ds_grdDic.getColumn(iFndRp, "ColWidth");				if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace(" iColWidth--->"+iColWidth 		, gtrcBindHeaderTextPos);}
			var sbDisplaytype 	= this.ds_grdDic.getColumn(iFndRp, "bDisplaytype");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace(" sbDisplaytype--->"+sbDisplaytype , gtrcBindHeaderTextPos);}
			var sbEdittype 		= this.ds_grdDic.getColumn(iFndRp, "bEdittype");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace(" sbEdittype--->"+sbEdittype 		, gtrcBindHeaderTextPos);}
			var sbTextAlign 	= this.ds_grdDic.getColumn(iFndRp, "bTextAlign");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace(" sbEdittype--->"+sbEdittype 		, gtrcBindHeaderTextPos);}
			var sbSuppress 		= this.ds_grdDic.getColumn(iFndRp, "bSuppress");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace(" sbSuppress--->"+sbSuppress 		, gtrcBindHeaderTextPos);}
				
				if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:1---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
				
				if(!this.gfn_isNull(sbSuppress)){
					var sSval;

					if(sbSuppress.indexOf("{")==0)
					{
						var obSuppress = eval("obSuppress = " + sbSuppress);	//	trace("obSuppress--->"+obSuppress);
						var arrSupGrId 	= obSuppress.GrId;                  	//	trace("obSuppress.GrId--->"+obSuppress.GrId);
						var	sSupGrVal 	= obSuppress.sPrsVal;               	//	trace("obSuppress.GrId[0]--->"+obSuppress.GrId[0]);
						if(arrSupGrId.includes(sObjGridNm))	
						{                                        				//	trace("obSuppress.GrId[0].includes('GridStyle')--->"+obSuppress.GrId[0].includes(sObjGridNm));
							sSval = sSupGrVal;	
						}
					}else
					{
						sSval = sbSuppress;
					}
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:2---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
					//	Suppress 최종적용
						if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace("sSval--->"+sSval, gtrcPos);}
							objGrid.setCellProperty( "body", realGridCellIndex, "suppress", this.gfn_nvl(sSval,"") );
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:3---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
				}
				
				
			
			var sbPadding 				= this.ds_grdDic.getColumn(iFndRp, "bPadding");					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace("sbEdittype 		--->"+sbEdittype 		, gtrcPos);}
			var sbCombodataset 			= this.ds_grdDic.getColumn(iFndRp, "bCombodataset");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace("sbCombodataset--->"+sbCombodataset, gtrcPos);}
			var sbCombocodecol 			= this.ds_grdDic.getColumn(iFndRp, "bCombocodecol");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace("sbCombocodecol--->"+sbCombocodecol, gtrcPos);}
			var sbCombodatacol 			= this.ds_grdDic.getColumn(iFndRp, "bCombodatacol");			if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace("sbCombodatacol--->"+sbCombodatacol, gtrcPos);}
			var sbCombotype 			= this.ds_grdDic.getColumn(iFndRp, "bCombotype");				if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol)/**/{this.gtrace("sbCombotype--->"+sbCombotype, gtrcPos);}
			var sbMaskedittype 			= this.ds_grdDic.getColumn(iFndRp, "bMaskedittype");										
			var sbMaskeditlimitbymask 	= this.ds_grdDic.getColumn(iFndRp, "bMaskeditlimitbymask");									
			var sbMaskeditformat		= this.ds_grdDic.getColumn(iFndRp, "bMaskeditformat");									
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:4---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
			if(!this.gfn_isNull(sHdTxt)) 			objGrid.setCellProperty( "head", realGridCellIndex, "text", sHdTxt );
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:5---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
			
			//	셀사이즈
			//		속도개선 : Loop 40 이하에서만 셀사이즈를 조정	Before : if(!this.gfn_isNull(iColWidth) && !this.gfn_isNull(sHdTxt))
			if(!this.gfn_isNull(iColWidth) && !this.gfn_isNull(sHdTxt) && iii < 40)	
			{
				objGrid.setRealColSize( "body", realGridCellIndex, iColWidth, true );
			}		
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:5-1---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
			
			if(!this.gfn_isNull(sbDisplaytype	)) 	{
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:6---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
				objGrid.setCellProperty( "body", realGridCellIndex, "displaytype"	, sbDisplaytype 	);	//	if(tmpcol==sTrcTmpCol){this.gtrace("bRslt--->"+bRslt, gtrcPos);}
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:7---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
				switch(sbDisplaytype){
					case "mask" 	: 
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:8---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
									  objGrid.setCellProperty( "body", realGridCellIndex, "maskeditformat"		, sbMaskeditformat		);
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:9---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
						break;
					default : 
						break;
				}
			}
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:9-1---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
			
			if(!this.gfn_isNull(sbEdittype		)) 	{
			
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:10---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
				objGrid.setCellProperty( "body", realGridCellIndex, "edittype"		, sbEdittype		);
				
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:11---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
				switch(sbEdittype){
					case "normal" 	: objGrid.setCellProperty( "body", realGridCellIndex, "editautoselect"	, true 	);
						break;
					case "mask" 	: objGrid.setCellProperty( "body", realGridCellIndex, "maskeditautoselect"	, true 	);
									  objGrid.setCellProperty( "body", realGridCellIndex, "maskedittype"		, sbMaskedittype 		);
									  objGrid.setCellProperty( "body", realGridCellIndex, "maskeditlimitbymask"	, sbMaskeditlimitbymask );
									  objGrid.setCellProperty( "body", realGridCellIndex, "maskeditformat"		, sbMaskeditformat		);
						break;
					default : 
						break;
				}
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:12---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
				if(sbEdittype!="none"){
					this.gtrace("헤더색상변경 : edittype이 none이 아닌경우--->"+sHdTxt, gtrcPos);
					objGrid.setCellProperty( "head", realGridCellIndex, "background", "ibory" );
				}
			}
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:13---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
					
			if(!this.gfn_isNull(sbTextAlign		)) 	objGrid.setCellProperty( "body", realGridCellIndex, "textAlign"		, sbTextAlign 		);
			if(!this.gfn_isNull(sbPadding		)) 	objGrid.setCellProperty( "body", realGridCellIndex, "padding"		, sbPadding 		);
			if(!this.gfn_isNull(sbCombodataset	)) 	objGrid.setCellProperty( "body", realGridCellIndex, "combodataset"	, sbCombodataset 	);
			if(!this.gfn_isNull(sbCombocodecol	)) 	objGrid.setCellProperty( "body", realGridCellIndex, "combocodecol"	, sbCombocodecol 	);
			if(!this.gfn_isNull(sbCombodatacol	)) 	objGrid.setCellProperty( "body", realGridCellIndex, "combodatacol"	, sbCombodatacol 	);
			if(!this.gfn_isNull(sbCombotype		)) 	objGrid.setCellProperty( "body", realGridCellIndex, "combotype"		, sbCombotype 		);
					
					if(sObjGridNm == sTrcGridNm && tmpcol==sTrcTmpCol/**/){this.gtrace("TIME:14---->"+this.gfn_getDate("time"), gtrcBindHeaderTextPos)};
		
			iii++;
		
		}
		
		this.gtrace("끝----->"+this.gfn_getDate("time"), gtrcTotalElapsedTimePos);
	}
};
