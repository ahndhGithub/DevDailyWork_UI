/**
*  @FileName 	Transaction.xfdl
*/

var pForm = nexacro.Form.prototype;
//var pForm = this;

/******************************************************************************************************
 * @class 서비스 호출 공통함수 <br>
 * Dataset의 값을 갱신하기 위한 서비스를 호출하고, 트랜젝션이 완료되면 콜백함수을 수행하는 함수
 * @param {String} strSvcId - 서비스 ID
 * @param {String} strSvcUrl - 서비스 호출 URL 
 * @param {String} [inData]	- input Dataset list("입력ID=DataSet ID" 형식으로 설정하며 빈칸으로 구분)
 * @param {String} [outData] - output Dataset list("DataSet ID=출력ID" 형식으로 설정하며 빈칸으로 구분)
 * @param {String} [strArg]	- 서비스 호출시 Agrgument
 * @param {String} [callBackFnc] - 콜백 함수명
 * @param {Boolean} [isAsync] - 비동기통신 여부 
 * @return N/A
 * @example
 * var strSvcUrl = "transactionSaveTest.do";
 * var inData    = "dsList=dsList:U";
 * var outData   = "dsList=dsList";
 * var strArg    = "";
 * this.gfnTransaction("save", strSvcUrl, inData, outData, strArg, "fnCallback", true);
*****************************************************************************************************/ 
pForm.gfn_transaction = function(strSvcId, strSvcUrl, inData, outData, strArg, callBackFnc, isAsync)
{	
											var gtrcPos = "Transaction.xjs.gfn_transaction";
	// callback 함수 기본값 설정
	if (this.gfn_isNull(callBackFnc)) callBackFnc = "fn_callback";
	
	var objDate = new Date();
	var nStartTime = objDate.getTime();
    var sStartDate = objDate.getYear()
						+"-"+String(objDate.getMonth()).padLeft(2, '0')
						+"-"+String(objDate.getDate()).padLeft(2, '0')
						+" "+String(objDate.getHours()).padLeft(2, '0')
						+":"+String(objDate.getMinutes()).padLeft(2, '0')
						+":"+String(objDate.getSeconds()).padLeft(2, '0')
						+" "+objDate.getMilliseconds();

	// Async
	if ((isAsync != true) && (isAsync != false)) isAsync = true;	
	
	// 1. callback에서 처리할 서비스 정보 저장
	var objSvcID = { 
			svcId     : strSvcId,
			svcUrl    : strSvcUrl,
			callback  : callBackFnc,
			isAsync   : isAsync,
			startDate : sStartDate,
			startTime : nStartTime };

	// 2. strServiceUrl
//	var strServiceUrl = "SvcUrl::" + strSvcUrl;
	var strServiceUrl = strSvcUrl;


	// 3. strArg
	var strArguments = "";
	if (this.gfn_isNull(strArg)) {
		strArguments = "";
	}
	else { 
		strArguments = strArg;
	}

	// 개발시에는 xml, 개발서버/운영서버는 SSV로 통신
	var nDataType;	
	if (nexacro.getEnvironmentVariable("ev_RunMode") == "2") {
		nDataType = 2;
	}
	else {
		nDataType = 0;
	}

     this.gtrace("in_var1="+nexacro.wrapQuote(this.titletext) + " in_var2="+this.name, gtrcPos); 
	 
	 {	//	out데이터셋백업 : 콜백 사라짐 제거용
		var arrOutDs = outData.split(" ");				//	this.gtrace("arrOutDs--->"+arrOutDs, gtrcPos);
		
		// 포맷관련 데이터셋이 없다면 무조건 추가해 놓음. 기준 : gds_outDs
		{
			var tOutDsName = "xGds_FormatOut";	this.gtrace("this.lookup(tOutDsName)-------------->"+this.lookup(tOutDsName), gtrcPos);
			
			if(this.gfn_isNull(this.lookup(tOutDsName))){
				var tOutDs = new Dataset;
				this.addChild(tOutDsName, tOutDs);
			}
			
			this.xGds_FormatOut.copyData(this.gfn_getApplication().gds_outDs);
		}
		
		//	OUT 데이터셋 Loop. : 받을 데이터셋 형태 세팅
		for (var k = 0 ; k < arrOutDs.length ; k++)
		{
			var arrTmpStr = arrOutDs[k].split("=");
			var tmpDs = eval("this."+arrTmpStr[0]);		
					this.gtrace("tmpDs.name--->"+tmpDs.name, gtrcPos);
					this.gtrace(arrTmpStr[0]+"-->tmpDs.useclientlayout--->"+tmpDs.useclientlayout, gtrcPos);
			
			var tmpDsName = tmpDs.name;
			
			//	useclientlayout 여부와 관계 없이 무조건 xGds_FormatOut데이터셋을 기준으로 가져오도록 한다.
			//	var tmpUseclientlayout = tmpDs.useclientlayout;
					this.gtrace("tmpDs.getColCount()--->"+tmpDs.getColCount(), gtrcPos);
			for( var j=0; j<tmpDs.getColCount(); j++)
			{
				var tmpcol = tmpDs.getColID(j);
				 
				var aRp = this.xGds_FormatOut.addRow();
					this.xGds_FormatOut.setColumn(aRp, "outName", tmpDsName);	//	Java : ds_out0 , ds_out1 , ...
					this.xGds_FormatOut.setColumn(aRp, "dsName", "ds_out"+k);	//	Nexacro UI
					this.xGds_FormatOut.setColumn(aRp, "dsCol", tmpcol);
					this.xGds_FormatOut.setColumn(aRp, "dsColType", "STRING");
			}
		}
		
		inData = "xGds_FormatOut=xGds_FormatOut" + " " + inData;
		
		this.gtrace("xGds_FormatOut.saveXML--->"+this.xGds_FormatOut.saveXML(), gtrcPos);
		this.gtrace("inData--->"+inData, gtrcPos);
	 }
	 
	this.transaction( JSON.stringify(objSvcID)  //1.svcID
					, strServiceUrl             //2.strServiceUrl
					, inData                    //3.inDataSet
					, outData                   //4.outDataSet
					, strArguments              //5.arguments
					, "gfn_callback"			//6.strCallbackFunc
					, isAsync                   //7.bAsync
					, nDataType                 //8.nDataType : 0(XML 타입), 1((Binary 타입),  2(SSV 타입) --> HTML5에서는 Binary 타입은 지원안함
					, false);                   //9.bCompress ( default : false ) 
};

/**
 * @class 공통 Callback 함수 <br>
 * 이 함수가 먼저 수행되고 사용자지정Callback함수가 수행된다.
 * @param {String} svcID - 서비스 ID
 * @param {Number} errorCode - 에러코드(정상 0, 에러 음수값)
 * @param {String} [errorMsg] - 에러메시지
 * @return N/A
 */
pForm.gfn_callback = function(svcID, errorCode, errorMsg)
{
																var gtrcPos = "Transaction.xjs.gfn_callback"
		this.gtrace("●콜백_공통(Transaction.js)", gtrcPos);
		this.gtrace("svcID---->"+svcID, gtrcPos);
		this.gtrace("errorCode---->"+errorCode, gtrcPos);
		this.gtrace("errorMsg---->"+errorMsg, gtrcPos);
		
	var objSvcID = JSON.parse(svcID);
	// 에러 공통 처리
	if(errorCode != 0)
	{
		switch(errorCode)
		{
			case -1 :	//	JAVA Controller Exception에서 발생 시키는 에러코드
			
				// Transaction Server Error{0} : 메세지창에는 에러코드만 노출 , 트레이스에는 svcID와 메세지.
				trace("### svcID : "+svcID+" #### "+"errorCode---->"+errorCode+" #### "+"errorMsg---->"+errorMsg);
				this.gfn_alert("msg.server.error", ["(errorCode:"+errorCode+")"], svcID, "", "A");	// gfn_alert(strMsgId, arrArg, strPopId, strCallback, strMsgType)
																				//	var arrError = (""+errorMsg).split("Query is");
				
				break;
				
			case -2463215:
				//@todo : 임의 에러코드  처리
				//return false;
				break;
		}
		
		//	에러발생시 리턴 처리
		return;
	}

	// 서비스 실행결과 출력
	var sStartDate = objSvcID.startDate;
	var nStartTime = objSvcID.startTime;
	
	var objDate = new Date();
	var sEndDate = objDate.getYear()
					+"-"+String(objDate.getMonth()).padLeft(2, '0')
					+"-"+String(objDate.getDate()).padLeft(2, '0')
					+" "+String(objDate.getHours()).padLeft(2, '0')
					+":"+String(objDate.getMinutes()).padLeft(2, '0')
					+":"+String(objDate.getSeconds()).padLeft(2, '0')
					+" "+objDate.getMilliseconds();
	var nElapseTime = (objDate.getTime() - nStartTime)/1000;
	
	var sMsg = "";
	if (errorCode == 0)
	{
		sMsg = "gfn_callback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", errorMsg>>"+errorMsg + ", isAsync>>" + objSvcID.isAsync + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime;
		//	trace(sMsg);
	}
	else {
		sMsg = "gfn_callback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", isAsync>>" + objSvcID.isAsync + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime;
		sMsg += "\n==================== errorMsg =======================\n"+errorMsg+"\n==================================================";
		//	trace(sMsg);
	}
																this.gtrace("this[objSvcID.outData]--->"+this[objSvcID.outData], gtrcPos);
	// form에 callback 함수가 있을때
	if (this[objSvcID.callback]) {
        this.lookupFunc(objSvcID.callback).call(objSvcID.svcId, errorCode, errorMsg);
    }
};

/**
 * @함수설명  				공통코드 조회
 * @param arrCode 	        조회할 공통코드 정보
 * @param isAsync			싱크여부(디폴트 : ansync)
 * @return None
 */ 
this._commCodeArg = null;
pForm.gfn_searchCode = function(arrCode, sCallBack, isAsync) 
{
	var objApp = pForm.gfn_getApplication();
	var objDs = objApp.gds_temp;    //공통코드 임시 데이터셋
//	objDs.clearData();

	var arrCodeGroup = new Array();
	for(var i=0; i<arrCode.length; i++)
	{
		arrCodeGroup.push(arrCode[i].codeGroup);  //코드 그룹
	}
    
	// 파라미터값 조회
	this._commCodeArg = arrCode;
	
    var sSvcID    = "svcCommonCode";
    var sURL      = "LocalUrl::selectCommonCode.do";
    var sInDs     = "";
    var sOutDs    = objDs.name+"=ds_commonCode";
    var sParam    = "codeGroup=" + nexacro.wrapQuote(arrCodeGroup.toString());
    var sCallBack = "gfn_codeCallback";
    
	if(!pForm.gfn_isNull(sCallBack))	sSvcID = sSvcID + ":" + sCallBack;
	if(pForm.gfn_isNull(isAsync))		isAsync = true;    
    
//	this.gfn_transaction(sSvcID, sURL, sInDs, sOutDs, sParam, sCallBack); 
    
    this.gfn_codeCallback("svcCommonCode:fn_callback", 0, "");
}

pForm.gfn_codeCallback = function(svcID, errorCode, errorMsg) 
{
	if (errorCode < 0){
        this.gfn_alert(errorMsg);
        return;
	}
	
	var arrSvcID =  svcID.split(":");
	if (arrSvcID[0] == "svcCommonCode") {
		var sCallBack = arrSvcID[1];
        var objApp = pForm.gfn_getApplication();
        var objDs = objApp.gds_temp;
        
        this.gfn_getCommonCode(this._commCodeArg, objDs);   //{codeGroup:"C001", obj:this.cbo_pos}, gds_temp 
		
		this._commCodeArg = null;
		
		// form에 callback 함수가 있을때
		if (this[sCallBack]) {
			this.lookupFunc(sCallBack).call(arrSvcID[0], errorCode, errorMsg);
		}
	} 
};

pForm.gfn_getCommonCode = function(arrCode, objDsTemp) 
{
    if(this.gfn_isNull(objDsTemp)) objDsTemp = this.gfn_getApplication().gds_CommCode;
    
	var objDs = null;		// 대상 데이터셋
	var objComp = null;	// 대상 컴포넌트

    for(var i=0; i<arrCode.length; i++)
    {
        var obj = arrCode[i].obj;
        if(obj instanceof nexacro.Combo ||  obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox){
            objDs   = obj.getInnerDataset();
            objComp = obj;
        } 
        else if(obj instanceof Dataset){		//obj 가 데이터셋일경우
            objDs = obj;
            objComp = null;
        }
        
        if(objDs == null){	
            trace("gfn_getCommonCode : Dataset is Null");
            return;
        }
        
        var strFilter = "GROUP==" + nexacro.wrapQuote(arrCode[i].codeGroup); 		
        //FIlter조건 추가
        if(!this.gfn_isNull(arrCode[i].filter)) {
            strFilter = strFilter + " && " + arrCode[i].filter;
        }
        
        objDsTemp.set_enableevent(false);
        objDs.set_enableevent(false);
        objDsTemp.filter(strFilter);
        objDs.copyData(objDsTemp, true);

        // first set 세팅
        if(!this.gfn_isNull(arrCode[i].first)){
            objDs.insertRow(0);
            var arrFirst = arrCode[i].first.split(":");                    
            if(arrFirst[0] == "0"){
                objDs.setColumn(0, "CODE"     , "ALL");
                objDs.setColumn(0, "CODE_NAME", "All");
            }
            else if(arrFirst[0] == "1"){
                objDs.setColumn(0, "CODE"     , "");
                objDs.setColumn(0, "CODE_NAME", "Selected...");
            }
            else if(arrFirst[0] == "2"){
                objDs.setColumn(0, "CODE"     , arrFirst[1]);
                objDs.setColumn(0, "CODE_NAME", arrFirst[2]);
            }
        }
        
        objDsTemp.filter("");
        objDs.set_enableevent(true);
        objDsTemp.set_enableevent(true);
        
        //컴포넌트를 넘긴 경우 0번째 인덱스 설정
        if(!this.gfn_isNull(objComp)){
            objComp.set_index(0);
        }
    }
};

/**
 * @함수설명  				트랜잭션 전 공통처리 (데이터셋, ...)
 * @param arrCode 	        
 * @param isAsync			
 * @return None
 */ 
this.gfn_beforeTrans = function(orgDs, targetDs, StsChkType)
{
	var sType = this.gfn_nvl(StsChkType, "ROW_STS");
	
	orgDs.set_enableevent(false);
	
	switch(sType)
	{
		case "ROW_STS" : 	orgDs.filter("ROW_STS=='I' || ROW_STS=='U' || ROW_STS=='D'");
				break;
		case "ROW_CHK" : 	orgDs.filter("ROW_CHK=='1' || ROW_CHK=='Y'"); 
				break;
		default : break;
	}
	
	targetDs.clearData();
	targetDs.copyData(orgDs, true);
	orgDs.filter("");
	orgDs.set_enableevent(true);

	if(targetDs.rowcount > 0) {
		return true;
	}else{
		return false;
	}
	
};
