/**
*  @FileName 	QmeNexa.js 
*/
 
var pForm = nexacro.Form.prototype;
var FORMAT_GRID_SETTING_EXEC = true;

pForm._getUserProperty = function (obj,userPropertyName)
{
															var gtrcPos	= "Util_adh.xjs._getUserProperty";
	var sEvVal = obj+"."+userPropertyName;						this.gtrace(" - sEvVal --->"+sEvVal, gtrcPos);
	var sProp = eval(sEvVal);									this.gtrace(" - sProp --->"+sProp, gtrcPos);
 	var arrprop = sProp.split(",");

 	return arrprop;
};

/*********************************************************************************************
 * @type   : function
 * @access : public
 * @desc   : 기존 QME 시스템에 존재하는 특정 URL을 호출한다.
 * @param  : 
 * @return :
 *********************************************************************************************/
pForm.gfn_qmeRedirectMenu = function (sProgramId, oData){

	var gtrcPos = "QmeNexa.xjs.gfn_qmeRedirectMenu";
	this.gtrace("● 기존QME시스템 內 메뉴 호출",gtrcPos);
	
	//	호출URL
	var redirectUrl = "/nexos/html/"+sProgramId+".html?ver=20190305";

	this.gtrace("sProgramId---->"+sProgramId+" ---->PROGRAM_ID");
	this.gtrace("redirectUrl---->"+redirectUrl+" ----> URL");
	this.gtrace("oData---->"+oData+" ----> DATA");
	
	//	$NC를 찾지 못하는 경우 발생하는 Error를 Catch한다.
	try {
		var params = {
			PROGRAM_ID	: sProgramId,
			URL			: redirectUrl,
			DATA		: oData
		};
		
		//	팝업인 경우 호출
		opener.$NC.G_MAIN.redirectMenu(params);
		this.gtrace("opener.$NC.G_MAIN.redirectMenu(params) 호출성공(팝업)");
		return true;
	}
	catch(e){
		//	탭인 경우 호출
		try {
			$NC.G_MAIN.redirectMenu(params);
			this.gtrace("$NC.G_MAIN.redirectMenu(params) 호출성공(탭)");
			return true;
		}
		catch(e){
			this.gtrace("QME메뉴호출실패----------->"+e, gtrcPos);
			return false
		}
	}
}


/*********************************************************************************************
 * @type   : function
 * @access : public
 * @desc   : 현재 플랫폼의 OS종류를 구한다.
 * @param  : 
 * @return :
 *********************************************************************************************/
pForm.gfn_getOS = function ()
{
	var osVersion = system.osversion;
	
	//trace("osVersion[" + osVersion + "]")

	if ( this.gfn_isNull(osVersion) )
		return "ETC";
	
	osVersion = osVersion.toUpperCase();
		
	if ( osVersion.indexOf("ANDROID") >= 0 )	// android 
	{
		return "ANDROID";
	}
	else if ( osVersion.indexOf("IOS") >= 0 )
	{
		return "IOS";
	}
	else if ( osVersion.indexOf("WINDOWS") >= 0 )
	{
		return "WINDOWS";
	}
	else if ( osVersion.indexOf("MAC") >= 0 )
	{
		return "MAC";
	}
	else if ( osVersion.indexOf("LINUX") >= 0 )
	{
		return "LINUX";
	}
	else
	{
		return "ETC";
	}
}

/*********************************************************************************************
 * @type   : function
 * @access : public
 * @desc   : 애플리케이션이 실행되는 환경 정보를 구한다.
 * @param  : 
 * @return :
 *********************************************************************************************/
pForm.gfn_getNavigator = function ()
{
	var osNavigatorname = system.navigatorname;
	
	//trace("osVersion[" + osVersion + "]")

	if ( this.gfn_isNull(osNavigatorname) )
		return "NOT_DEFINE";
	
	osNavigatorname = osNavigatorname.toUpperCase();
	
	return osNavigatorname;
}

/*********************************************************************************************
 * @type   : function
 * @access : public
 * @desc   : 현재 전체 경로를 가지고온다.
 * @param  : obj 현재 obj
 * @return :
 *********************************************************************************************/
pForm.gfn_getObjPath = function (obj)
{
	var arrPath = new Array();
	var tmpObj = obj;
	var cnt = 1;

	arrPath[0] = tmpObj.name;
	while (true) 
	{
		if (tmpObj.parent == "[object ChildFrame]") 
		{
			arrPath[cnt-1] = "application.mainframe.childframe.form";
			break;
		}

		arrPath[cnt] = tmpObj.parent.name;
		tmpObj = tmpObj.parent;
		cnt++;
	}

	var path = "";
	for (var i = arrPath.length - 1; i >= 0; i--) 
	{
		path += arrPath[i] + ".";
	}

	return path;
}

// /*++
// @desc	온로드 이벤트, 필요한 모든 데이터 가져옴
// 		-	콤보 , 권한 , 유저 , ...
// */
pForm.gfn_getAllInitData = function()
{
																		var gtrcPos = "Util_adh.xjs.gfn_getAllInitData";
																		this.gtrace("● 온로드 이벤트, 필요한 모든 데이터 가져옴",gtrcPos);
		
	//html로부터 전달받은값, 브라우져정보
	var sQMELOGONUSERID = 	nexacro.getApplication().QmeLogonUserId;		this.gtrace(" - 유저 : sQMELOGONUSERID--->"+sQMELOGONUSERID,gtrcPos);
	var sLANGUAGEKEY	=	nexacro.getApplication().LanguageKey;       	this.gtrace(" - 언어 : sLANGUAGEKEY--->"+sLANGUAGEKEY,gtrcPos);
	var sNAVIGATOR		=	this.gfn_getNavigator();						this.gtrace(" - 브라우져 : this.gfn_getNavigator()--->"+this.gfn_getNavigator(),gtrcPos);		//NEXACRO / IE / CHROME

	{	//	gds_QmeLogonInfo 데이터셋 세팅
		if(this.gfn_getNavigator()=="NEXACRO"){	//	넥사크로 전용브라우져 실행시 - 테스트용 데이터
																			this.gtrace(" - 로그온유저Ds : (gds_QmeLogonInfo.rowcount) --->"+nexacro.getApplication().gds_QmeLogonInfo.rowcount,gtrcPos);
// 			if(nexacro.getApplication().gds_QmeLogonInfo.rowcount==0)
// 			{
				//무조건 트랜잭션
																			this.gtrace(" -  넥사크로전용브라우져--TRANSYES", gtrcPos);
				nexacro.getApplication().gds_QmeLogonInfo_in.clearData();
				nexacro.getApplication().gds_QmeLogonInfo_in.addRow();
				nexacro.getApplication().gds_QmeLogonInfo_in.setColumn(0, "p_user_id", "160307");
				nexacro.getApplication().gds_Language_in.clearData();
				nexacro.getApplication().gds_Language_in.addRow();
				nexacro.getApplication().gds_Language_in.setColumn(0, "p_country_cd", "KO");		//	한국 : KO / 베트남 : VI / 인도네시아 : ID

// 			}else{
// 				this.gtrace(" - nexacro전용브라우져--NOTRANS", gtrcPos);
// 				
// 				this.gfn_onloadSequence();
// 				
// 				return;
// 			}
		}else{
			//	QME기존시스템에서 띄운 경우 == 무조건 QmeLogonUserId값이 있다고 정의
			//	QmeLogonUserId값이 있다면 초기세팅트랜잭션 실행 : UserId를 넘김
			if(!this.gfn_isNull(sQMELOGONUSERID))
			{
				nexacro.getApplication().gds_QmeLogonInfo_in.clearData();
				nexacro.getApplication().gds_QmeLogonInfo_in.addRow();
				nexacro.getApplication().gds_QmeLogonInfo_in.setColumn(0, "p_user_id", sQMELOGONUSERID);
				nexacro.getApplication().gds_Language_in.clearData();
				nexacro.getApplication().gds_Language_in.addRow();
				nexacro.getApplication().gds_Language_in.setColumn(0, "p_country_cd", sLANGUAGEKEY);
			}else{
				alert("비정상접근URL--QMELOGONUSERID없음");
				this.close();
				return;
			}
		}
	}
	
	//	파람세팅+트랜잭
	{
		var sSvcID = "getAllInitData";
		//	var sURL = "AppSvrLocalMsSql::CommonSaveAction_Return.do";
		var sURL = "AppSvr::common/commonAction.ppc";
		var sInDatasets 	= "";
		var sOutDatasets 	= "";
		var sArguments 		= "";
		
		var iSeq = 0;													//	트랜잭션의 Argument에서는 nexacro.getApplication... 안 붙여도 된다 ?
// 		if (nexacro.getApplication().gds_User.rowcount 		== 0)	{sArguments+="UserMapper.getLoginInfo "; 	sInDatasets+="ds_in"+iSeq+"=gds_QmeLogonInfo "; 	sOutDatasets+="gds_User=ds_out"+iSeq+" "; 		iSeq++;}
//   	if (nexacro.getApplication().gds_word.rowcount 		== 0)	{sArguments+="SqlId_00004 "; 	sInDatasets+="ds_in"+iSeq+"=gds_QmeLogonInfo ";	sOutDatasets+="gds_word=ds_out"+iSeq+" "; 		iSeq++;}
		
					this.gtrace(" ---- 유저DS(gds_User) : gds_User.rowcount--->"+this.gfn_getApplication().gds_User.rowcount, gtrcPos);
		if(this.gfn_getApplication().gds_User.rowcount == 0 )
		{	// 사용자로그인정보 가져오기 : 있다면 스킵 ( ex. 팝업 )
			sArguments+="UserMapper.getLoginInfo ";
			sInDatasets+="ds_in"+iSeq+"=gds_QmeLogonInfo_in"+" ";
			sOutDatasets+="gds_User=ds_out"+iSeq+" ";
			iSeq++;	//	this.gtrace(" - iSeq-->"+iSeq, gtrcPos);		
		}
		
																		this.gtrace(" ---- 언어DS(gds_Language) : gds_Language.rowcount--->"+this.gfn_getApplication().gds_Language.rowcount, gtrcPos);
		if(this.gfn_getApplication().gds_Language.rowcount == 0 )
		{	// 언어 가져오기
			sArguments+="CommonMapper.getMultiLang ";
			sInDatasets+="ds_in"+iSeq+"=gds_Language_in"+" ";
			sOutDatasets+="gds_Language=ds_out"+iSeq+" ";
			iSeq++;	
			this.gtrace(" - sArguments-->"+sArguments, gtrcPos);
		}
		
		if(FORMAT_GRID_SETTING_EXEC){	//	그리드포맺 가져오기
			
			var arrAllGrid = Array();
			this.gfn_getAllGrid(this, arrAllGrid);
				this.gtrace("arrAllGrid--------------->"+arrAllGrid, gtrcPos);
			
			var tFormatInDs = new Dataset;
			var tFormatOutDs = new Dataset;
				var tFormatInDsName = "tFormatInDs";
				var tFormatOutDsName = "tFormatOutDs";
				this.addChild(tFormatInDsName, tFormatInDs);
					this.addChild(tFormatOutDsName, tFormatOutDs);
				
				tFormatInDs.copyData(this.gfn_getApplication().gds_FormatInDs);
				tFormatOutDs.copyData(this.gfn_getApplication().gds_FormatOutDs);
				tFormatOutDs.set_useclientlayout(true);
				
			for(var k = 0  ; k < arrAllGrid.length ; k++)
			{
				var tempGridUniqueId = this._getUniqueId(arrAllGrid[k]);
					this.gtrace("tempGridUniqueId-->"+tempGridUniqueId, gtrcPos);
					
				var aNewRow = tFormatInDs.addRow();

					tFormatInDs.setColumn(aNewRow, "PROGRAM_ID", this.name);
					tFormatInDs.setColumn(aNewRow, "GRID_ID", tempGridUniqueId);
					tFormatInDs.setColumn(aNewRow, "DEFAULT_YN", "Y");
					tFormatInDs.setColumn(aNewRow, "DEL_YN", "N");
					tFormatInDs.setColumn(aNewRow, "USER_ID", nexacro.getApplication().gds_QmeLogonInfo_in.getColumn(0, "p_user_id"));

			}
				
			sArguments+="getUserGridData ";
			sInDatasets+="ds_in"+iSeq+"="+tFormatInDsName+" ";
			sOutDatasets+=tFormatOutDsName+"=ds_out"+iSeq+" ";
			iSeq++;

			this.gtrace(tFormatInDs.saveXML(),gtrcPos);
		}
		
		
		var arrCmmCode = this.gfn_getArrComboSetStr();		this.gtrace(" ---- 공통코드", gtrcPos);
															this.gtrace(" ---- 널체크 : arrCmmCode-->"+arrCmmCode, gtrcPos);
		if(!this.gfn_isNull(arrCmmCode))
		{	//공통코드정보 가져오기 인풋 추가


			for(var k = 0 ; k < arrCmmCode.length ; k++)
			{
				var sTmpDsName = arrCmmCode[k].dsName;
				var sTmpCmType = arrCmmCode[k].cmType;
				
				switch(sTmpCmType)		//	dsName, cmType
				{
					//사용자Center
					case "UserMapper.getUserCenter" 	: 
						var tCommInDs = new Dataset;
						var tCommInDsName = "tCommInDs"+k;
						this.addChild(tCommInDsName, tCommInDs); 
							tCommInDs.addColumn( "p_user_id", "string" );
							tCommInDs.addColumn( "p_country_cd", "string" );
							tCommInDs.addRow();
							tCommInDs.setColumn(0, "p_user_id", nexacro.getApplication().gds_QmeLogonInfo_in.getColumn(0, "p_user_id"));
							//tCommInDs.setColumn(0, "p_country_cd", nexacro.getApplication().gds_Language_in.getColumn(0, "p_country_cd"));									
							tCommInDs.setColumn(0, "p_country_cd", "%");	//%로 넘겨야한다.
							
							sArguments	+=	sTmpCmType							+" ";
							sInDatasets	+=	"ds_in"+iSeq+"="+tCommInDsName	+" ";
							sOutDatasets+=	sTmpDsName+"=ds_out"+iSeq			+" ";
							iSeq++;
							//	trace(tCommInDs.saveXML());
						break;
						
					//Sales Group
					case "CommonMapper.getSalesGroup" 	: 
						var tCommInDs = new Dataset;
						var tCommInDsName = "tCommInDs"+k;
						this.addChild(tCommInDsName, tCommInDs); 
							tCommInDs.addColumn( "p_bu_cd", "string" );
							tCommInDs.addRow();
							tCommInDs.setColumn(0, "p_bu_cd", "%");
							
							sArguments	+=	sTmpCmType							+" ";
							sInDatasets	+=	"ds_in"+iSeq+"="+tCommInDsName	+" ";
							sOutDatasets+=	sTmpDsName+"=ds_out"+iSeq			+" ";
							iSeq++;
						break;

					//공통코드
					default : 
						var tCommInDs = new Dataset;
						var tCommInDsName = "tCommInDs"+k;
						this.addChild(tCommInDsName, tCommInDs); 
							tCommInDs.copyData(nexacro.getApplication().gds_CommCodeIn);
							tCommInDs.setColumn(tCommInDs.addRow(), "p_code_grp", sTmpCmType);
							
							switch(sTmpCmType)
							{	// 특이로직
								case "CURRENCY" :	tCommInDs.setColumn(0, "p_sub_cd1", "T");	// 통화
											break;
								default : break;
							}

							sArguments	+=	"CommonMapper.getCodeInfo"		+" ";	//	this.gtrace(" - sArguments-->"+sArguments, gtrcPos);
							sInDatasets	+=	"ds_in"+iSeq+"="+tCommInDsName	+" ";
							sOutDatasets+=	sTmpDsName+"=ds_out"+iSeq			+" ";
							iSeq++;
						break;
				}
			}
			
			this.gtrace(" ------ 아규먼트 : sArguments--->"+sArguments, gtrcPos);
			this.gtrace(" ------ IN데이터셋 : sInDatasets--->"+sInDatasets, gtrcPos);
			this.gtrace(" ------ OUT데이터셋 : sOutDatasets--->"+sOutDatasets, gtrcPos);
		}
		
		//	하나라도 있는 경우에만 트랜잭
		if(sArguments !="")
		{
			sArguments = "sqlId=" + nexacro.wrapQuote(sArguments);										
			this.transaction(sSvcID, sURL, sInDatasets, sOutDatasets, sArguments, "gfn_callbackFunction")	//, false); // sync로 보낸다.
//			this.gfn_transaction(sSvcID, sURL, sInDatasets, sOutDatasets, sArguments, "gfn_callbackFunction")	//, false); // sync로 보낸다.
		}else{
			//	트랜잭션을 하던 안하던 실행되는 함수
			this.gfn_onloadSequence();
		}
	}
}

/*++
@desc	Callback Function
*/
pForm.gfn_callbackFunction = function(strSvcID, nErrorCode, strErrorMsg)
{
							var gtrcPos = "Util_adh.xjs.gfn_callbackFunction"
			this.gtrace("콜백서비스아이디(strSvcID)--->"+strSvcID, gtrcPos);
	// 에러 체크 영역
	if (nErrorCode < 0) 
	{
		//	alert(this.gfn_removeJavaErrMsg(strErrorMsg));
		alert(strErrorMsg);

		switch (strSvcID) 
		{
			case "getAllInitData":		// 기본 데이터 가져오기인 경우는 바로 닫음.
				
				//	this.close();
			default:
				return;
		}
	}

	switch (strSvcID) 
	{
		case "formatSearchOnload": 
			var oGrdPrsnDs = this.gfn_getApplication().gds_gridPersonal;
				oGrdPrsnDs.clearData();

			if(this.tFormatInDs.rowcount > 0)
			{
				for(var i = 0 ; i < this.tFormatInDs.rowcount ; i++)
				{
					var iAddRp = oGrdPrsnDs.addRow();
					oGrdPrsnDs.setColumn(iAddRp, "sFormatId"	, this.tFormatInDs.getColumn(i, "GRIDID"));
					oGrdPrsnDs.setColumn(iAddRp, "sFormat"		, this.tFormatInDs.getColumn(i, "JSONDATA"));
					//	oGrdPrsnDs.setColumn(iAddRp, "sOrgFormat"	, this.tFormatInDs.getColumn(i, "JSONDATA"));
				}
				//	trace(oGrdPrsnDs.saveXML());
			}
			
			this.gfn_onloadSequence();	//테스트 끝나면 이걸 막자
			
			break;

		case "getAllInitData":		// 기본 데이터 가져오기 - 콤보Ds세팅
			
			if(FORMAT_GRID_SETTING_EXEC){	// 포맺그리드 처리

				var oTmpFrmDs = this.tFormatOutDs;
					this.gtrace("oTmpFrmDs.saveXML---->"+oTmpFrmDs.saveXML(),gtrcPos);


				//테스트데이터는 삭제
				var iTstRp = oTmpFrmDs.findRowExpr("GRID_ID=='MASTER' && LAYOUT_NM=='TEST_LAYOUT'");
					oTmpFrmDs.deleteRow(iTstRp);

					//	trace("oTmpFrmDs.getRowCount()---->"+oTmpFrmDs.getRowCount());
				//포맺데이터가 있을 경우만 실행
				if(oTmpFrmDs.getRowCount() > 0)
				{
					var oGrdPrsnDs = this.gfn_getApplication().gds_gridPersonal;
						oGrdPrsnDs.clearData();	

						this.gtrace("oTmpFrmDs.rowcount---->"+oTmpFrmDs.rowcount,gtrcPos);
						
					for(var i = 0 ; i < oTmpFrmDs.rowcount ; i++)
					{
						var sData = "";
						for(var k = 0 ; k < 10 ; k++){
							sData += this.gfn_nvl(oTmpFrmDs.getColumn(iAddRp, "DATA_"+(k+1)), "");
						}
						
						var iAddRp = oGrdPrsnDs.addRow();
						this.gtrace("GRIDID---->"+oTmpFrmDs.getColumn(i, "GRID_ID"),gtrcPos);
						oGrdPrsnDs.setColumn(iAddRp, "sFormatId"	, oTmpFrmDs.getColumn(i, "GRID_ID"));
						oGrdPrsnDs.setColumn(iAddRp, "sFormat"		, sData);
						
						this.gtrace("oGrdPrsnDs.saveXML---->"+oGrdPrsnDs.saveXML(),gtrcPos);
						
					}

				}
			}
			
			{	// 공통코드
			/*
			 * 공통코드 
			 * AppVariables Datasets gds_commCode에서 구분값에 맞는 코드값 가져오기
			 *
			 * 규칙
			 * Dataset ID는 마지막 4자리를 공통코드 구분자로 지정 ds_deptC001
			 * 
			 * 컴포넌트id 또는 데이터셋id를 지정
			 *  
			 * 여러개 지정시 구분자 스페이스
			 * ":"구분자 이용하여 0이면 "전체", 1이면 "선택하세요" 표현
			 * "전체" 선택시 코드값은 "ALL", "선택하세요" 선택시 코드값은 "" 으로 지정

				compId : 컴포넌트 or Dataset 아이디
				type   : 0(전체), 1(선택하세요)
				this.gfn_getCommCode(compId:type compId2:type2);
				
				ex) this.gfn_getCommCode("cbo_pos rdo_gender:0 Div00.form.cbo_dept:1 ds_hobbyE001");
			 */
			 
			 var arrCmmCode = this.gfn_getArrComboSetStr();
						this.gtrace("this.COMBO_SET_STR--->"+this.COMBO_SET_STR, gtrcPos);
						this.gtrace("공통코드(arrCmmCode)--->"+arrCmmCode, gtrcPos);
						this.gtrace("유저정보(gfn_getUser)--->"+this.gfn_getUser("USER_ID"), gtrcPos);
						
			 if(!this.gfn_isNull(arrCmmCode)){
				 for(var j=0 ; j < arrCmmCode.length ; j++)
				 {
					var sTdsNm = arrCmmCode[j].dsName;
						var sCmType = arrCmmCode[j].cmType;
						
							this.gtrace("데이터셋명(sTdsNm)--->"+sTdsNm, gtrcPos);
							this.gtrace("구분코드(sCmType)--->"+sCmType, gtrcPos);

					if(this.gfn_nvl(sTdsNm,"") !="")
					{
						var tDs = eval("this."+sTdsNm);
						
						//	코드+명칭으로 표시
						for(var k=0 ; k < tDs.getRowCount() ; k++)
						{
								var sCodeCd, sCodeNm, sSetCodeNm;
								switch(sCmType){
									case "UserMapper.getUserCenter":
											sCodeCd	=	"CENTER_CD";
											sCodeNm	=	"CENTER_NM";
										break;
									case "CommonMapper.getSalesGroup":
											sCodeCd	=	"BU_CD";
											sCodeNm	=	"BU_NM";
										break;
									default : 
											sCodeCd	=	"CODE_CD";
											sCodeNm	=	"CODE_NM";
										break;
								}
								sSetCodeNm = sCodeNm;
								var tCd = tDs.getColumn(k, sCodeCd);
								var tNm = tDs.getColumn(k, sCodeNm);
								tDs.setColumn(k , sSetCodeNm, tCd==""?tNm:tCd+"-"+tNm);
						}
					}
						
						this.gfn_SetFirstRow(tDs, "CODE_CD", "CODE_NM", "S ");
					}
				 }
			 }

			{	// 언어
			var gdsLan 		= this.gfn_getApplication().gds_Lang;
			var gdsLanguage = this.gfn_getApplication().gds_Language;
				//		trace("gdsLanguage.rowcount---->"+gdsLanguage.rowcount);
			for(var i=0 ; i < gdsLan.rowcount ; i++){

				var sDEFAULT = this.gfn_nvl(gdsLan.getColumn(i, "DEFAULT_LANG"),"");
				var sLANG_KO = this.gfn_nvl(gdsLan.getColumn(i, "LANG_KO"),"");
				var sLANG_VI = this.gfn_nvl(gdsLan.getColumn(i, "LANG_VI"),"");
				var sLANG_ID = this.gfn_nvl(gdsLan.getColumn(i, "LANG_ID"),"");
				var sKeyLan  = this.gfn_getApplication().gds_Language_in.getColumn(0, "p_country_cd");
				var sSetLang = "";
					sSetLang = eval("sLANG_"+sKeyLan);
					sSetLang = (sSetLang==""?sLANG_KO:sSetLang);

				var nRp = gdsLanguage.addRow();
					gdsLanguage.setColumn(nRp, "DEFAULT_LANG", sDEFAULT);
					gdsLanguage.setColumn(nRp, "LANGUAGE", sSetLang);

			}
			}
			
			//	트랜잭션을 하던 안하던 실행되는 함수
				this.gtrace("온로드시퀀스실행", gtrcPos);
				this.gfn_onloadSequence();
		break;

		default:
			break;	

	}
}

pForm.gfn_onloadSequence = function(){
	var gtrcPos = "QmeNexa.xjs.gfn_onloadSequence"
			this.gtrace("● 온로드시퀀스", gtrcPos);
	//	타 함수의 집합으로만 구성. 순서에 집중하기 위함
	

	
	// 공통화	--> 폼 콤포넌트 전체 돌기 실행 ( 포함 : 다국어 + ... )
	this.gfn_formOnLoad(this);
	
	//	리셋함수 호출 : 가장 마지막에 위치하도록 한다.
				this.gtrace("lookupFunc--->"+this.lookupFunc("fn_reset"), gtrcPos);
	if(!this.gfn_isNull(this.lookupFunc("fn_reset")))
	{
		this.fn_reset();
	}
}

pForm.gfn_commButtonAlignByVisible = function(oDivParnt, arrBtns, arrBtnPos)
{	//	Visible 여부와 부모Div의 좌우정렬에 따라 버튼의 위치를 자동배치

						var gtrcPos = "Util_adh.xjs.gfn_commButtonAlignByVisible";
	var alignPos;
	{
						this.gtrace(" - oDivParnt.left--->"+oDivParnt.left, gtrcPos);
						this.gtrace(" - oDivParnt.right--->"+oDivParnt.right, gtrcPos);
		if(this.gfn_isNull(oDivParnt.left))
				alignPos = "RGHT";
		else 	alignPos = "LEFT"
						this.gtrace(" - alignPos--->"+alignPos, gtrcPos);
	}

	//	var arrBtnPos 		= [0, 76, 152, 228];
	
	switch(alignPos) {
	case "LEFT":
			var iVisIdx = 0;
			for(var i = 0 ; i < arrBtns.length ; i++)
			{
						this.gtrace(" - arrBtns[i].visible--->"+arrBtns[i].visible, gtrcPos);
				if(arrBtns[i].visible==true)
				{
						this.gtrace(" - arrBtnPos[iVisIdx]--->"+arrBtnPos[iVisIdx], gtrcPos);

					arrBtns[i].set_left(arrBtnPos[iVisIdx]);
					iVisIdx++;
				}
			}
		break;
		
	case "RGHT":
			var iVisIdx = arrBtns.length - 1;	this.gtrace(" - iVisIdx--->"+iVisIdx, gtrcPos);
			for(var k = arrBtns.length - 1 ; k >= 0 ; k--)
			{
						this.gtrace(" - arrBtns[k].visible--->"+arrBtns[k].visible, gtrcPos);
				if(arrBtns[k].visible==true)
				{
					arrBtns[k].set_left(arrBtnPos[iVisIdx]);
					iVisIdx--;
				}
			}
		break;
		
	default:
		break;
	}
}

/**********************************************************************************
 * Function Name: gfn_setUser
 * Description  : 데이터셋의 SaveUser에 사용자를 등록
 * Arguments    : 
 * Return       : 
 **********************************************************************************/
pForm.gfn_setUser = function(oDs, sCol) 
{
									var gtrcPos = "Util_adh.xjs.gfn_setUser";
	oDs.enableevent = false;
	var sUserId = this.gfn_getApplication().gds_User.getColumn(0, "USER_ID");
										this.gtrace(" - sUserId--->"+sUserId, gtrcPos);
	if(this.gfn_isNull(sCol)) sCol = "SaveUser";
	
	// 변경
	for( var i=0; i < oDs.rowcount; i++){
		if(this.gfn_ExistColumnId(oDs, sCol))
		{
			//	this.gtrace(" - this.gfn_ExistColumnId(oDs, sCol)--->"+this.gfn_ExistColumnId(oDs, sCol), gtrcPos);
			oDs.setColumn(i, sCol, sUserId);
		}
	}
	
	oDs.enableevent = true;

	return oDs;
}

/**********************************************************************************
 * Function Name: gfn_getUser
 * Description  : gds_User를 배열로 가져오기
 * Arguments    : 
 * Return       : 
 **********************************************************************************/
pForm.gfn_getUser = function(col) 
{
	var gds_User = nexacro.getApplication().gds_User;
	var arrUser={};
	if(this.gfn_isNull(col)){
		for(var i=0; i < gds_User.getColCount() ; i++)
		{
			var tColId = gds_User.getColID(i);
			var tVal = gds_User.getColumn(0, tColId);
			
			arrUser[tColId] = tVal;
		}
	}else{
			arrUser = gds_User.getColumn(0, col);
	}
	
	return arrUser;
}

/**********************************************************************************
 * Function Name: gfn_ExistColumnId
 * Description  : 해당 dataset에서 컬럼명이 존재 하는지 검사
 * Arguments    : objDs  - 검사할 dataset
				  sColId - 검사할 컬럼명
 * Return       : boolean
 **********************************************************************************/
pForm.gfn_ExistColumnId = function(objDs, sColId){
	var nColCnt = objDs.colcount;

	for(var i=0; i < nColCnt; i++){
		if (sColId == objDs.getColID(i)) return true;
	}
	return false;
}


/**********************************************************************************
 * Function Name: gfn_getParentForm
 * Description  : - Frame 바로 전 단계의 폼을 가져온다.
 * Arguments    : 
				  
 * Return       : 	//	this.sParentFormGetTxt
					//	this.oFrmParnt
					//	this.oDivParnt
					//	this.oTargetGrid
					//	this.oTargetDs
					//	this.sInitCompVisEna
 **********************************************************************************/
pForm.gfn_getParentForm = function()	{

	var gtrcPos = "Util_adh.xjs.gfn_getParentForm";
	
	this.gtrace("●부모폼가져오기(gfn_getParentForm)", gtrcPos);
	
	// 최상위폼, 부모Div
	this.oFrmParnt	=	this.gfn_getTopLevelForm(this);				this.gtrace("this.oFrmParnt.name ---->"+this.oFrmParnt.name, gtrcPos);
	this.oDivParnt	=	this.parent;								this.gtrace("this.oDivParnt--->"+this.oDivParnt.name, gtrcPos);
	
	// 타겟그리드,타겟데이터셋
	this.gtrace("this.oDivParnt.hasOwnProperty(targetGrid)--->"+this.oDivParnt.hasOwnProperty("targetGrid"), gtrcPos);
	if(this.oDivParnt.hasOwnProperty("targetGrid")){
		if(!this.gfn_isNull(this.oFrmParnt.lookup(this.oDivParnt.targetGrid)))
		{
			this.oTargetGrid 		= this.oFrmParnt.lookup(this.oDivParnt.targetGrid);
			this.gtrace("this.oTargetGrid.name--->"+this.oTargetGrid.name, gtrcPos);
			this.oTargetDs			= this.oTargetGrid.getBindDataset();	this.gtrace("this.oTargetDs--->"+this.oTargetDs.name, gtrcPos);
	}
	}

	// 콤보넌트 Visible / Enable
	this.gtrace("this.oDivParnt.hasOwnProperty(InitCompVisEna)--->"+this.oDivParnt.hasOwnProperty("InitCompVisEna"), gtrcPos);
	if(this.oDivParnt.hasOwnProperty("InitCompVisEna"))
	{
		this.sInitCompVisEna	= this.oDivParnt.InitCompVisEna;	this.gtrace("this.sInitCompVisEna--->"+this.sInitCompVisEna, gtrcPos);
		this.fn_setButtonVisEna();
	}

	// ReturnParam ( 확인 / 취소 에서 사용 )
	if(this.oDivParnt.hasOwnProperty("returnparms"))
	{
		this.returnparms		= this.oDivParnt.returnparms;		this.gtrace("this.returnparms--->"+this.returnparms, gtrcPos);
	}
}



pForm.gfn_getArrComboSetStr = function(){
			var gtrcPos = "QmeNexa.xjs.gfn_getArrComboSetStr";
	if(!this.gfn_isNull(this.COMBO_SET_STR))
	{	// COMBO_SET_STR이 없다면 스킵
			
		var arrResult = Array();
		var arrTmp = this.COMBO_SET_STR.split(" ");
			this.gtrace("arrTmp--------------->"+arrTmp, gtrcPos);
			this.gtrace("arrTmp.length-------->"+arrTmp.length, gtrcPos);
		for(var i = 0 ; i < arrTmp.length ; i++)
		{
			
			var tStr 	= arrTmp[i];		this.gtrace("tStr("+i+")---->"+tStr, gtrcPos);
			if(this.gfn_nvl(tStr,"")!="")
			{
			var tStrSpl = tStr.split("#");
			var tArr 	= { dsName: tStrSpl[0], cmType: tStrSpl[1] };
				arrResult.push(tArr);
		}
		}
											this.gtrace("arrResult--------------->"+arrResult, gtrcPos);
		return arrResult;
	}
}


pForm.gfn_distincDsFilter = function(objDs, sColID)
{
    var arrArgs    = sColID.split(",");
    var sFilterExpr        = "";
    var sFindRowExpr    = "";
    
    for (var i=0; i<arrArgs.length; i++)
    {
        if (objDs.getColumnInfo(arrArgs[i]) == null) continue;
        
        sFindRowExpr    += (sFindRowExpr) ? " && " : "";
        sFindRowExpr    += "" + arrArgs[i] + "=='\" + " + arrArgs[i] + " + \"'";
    }
    
    if (sFindRowExpr) {
        sFilterExpr    = "rowidx==dataset.findRowExpr(\"" + sFindRowExpr + "\")";
    }
    objDs.filter(sFilterExpr);
};

/************************************************************************
 * 그리드의 e.col 에 바인딩 되어 있는 데이터셋 컬럼명 가져오기
 * oncellclick 이벤트에서 사용
 * 
 ************************************************************************/
pForm.gfn_getBindColId = function(objGrid, sColIndex)
{
	var sGrdTxt = objGrid.getCellProperty("body", sColIndex, "text");
	
	if(!this.gfn_isNull(sGrdTxt))
	{
		var sColId = (objGrid.getCellProperty("body", sColIndex, "text")).toString().split(":");
		var bDs = objGrid.getBindDataset();
		
		return {oDs:bDs, dsCol:sColId[1]};
		
	}else{
		return false;
	}
};

