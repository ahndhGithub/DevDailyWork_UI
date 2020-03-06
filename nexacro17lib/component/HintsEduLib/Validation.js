/**
*  @FileName 	Validation.js 
*/

var pForm = nexacro.Form.prototype;
//var pForm = this;

/************************************************************************************************
* Validation check 공통 기능
************************************************************************************************/

// Validation ERROR class 사용 여부
pForm.useErrorClass = false;

/**
 * @class Dataset에 설정된 정합성체크 RuleSet을 Clear한다.
 * @param {Dataset} obj - 데이터셋 Object
 * @return N/A
 */  
pForm.gfn_clearValidation = function(objDs)
{
			var gtrcPos = "Validation.xjs.gfn_clearValidation";
				this.gtrace("objDs.validationRuleSet----->"+objDs.validationRuleSet, gtrcPos);
	objDs.validationRuleSet = "";
};

/**
 * @class Dataset의 Column별로 정합성체크 Rule을 등록한다.
 * @param {Dataset} objDs - 데이터셋 Object
 * @param {String} sColID - 체크대상 컬럼명
 * @param {String} sColName - 컬럼명의 오류메세지 처리 제목
 * @param {String} sRule - 정합성체크 Rule(required, length, min, max, code 등의 체크 형식)
 * @return N/A
 */
pForm.gfn_setValidation = function(objDs, sColID, sColName, sRule)
{
			
	var arrValidation = new Array();
			var gtrcPos = "Validation.xjs.gfn_setValidation";
												var sTrcColName = "Sales Order";
												if(sColName==sTrcColName)this.gtrace("●정합성체크 Rule을 등록(gfn_setValidation)", gtrcPos);
												if(sColName==sTrcColName)this.gtrace("입력파람(objDs.name)-->"+objDs.name, gtrcPos);
												if(sColName==sTrcColName)this.gtrace("입력파람(sColID)-->"+sColID, gtrcPos);
												if(sColName==sTrcColName)this.gtrace("입력파람(sColName)-->"+sColName+" ( ~에 들어갈 단어 ( '~은(는) 필수 입력 항목입니다.))' ", gtrcPos);
												if(sColName==sTrcColName)this.gtrace("입력파람(sRule)-->"+sRule, gtrcPos);
	// title이 2개가 올 경우 구분자를 변경
	// checkrule == "equalto" || checkrule == "fromto" || checkrule == "comparebig" || checkrule == "comparesmall"
	//if (sColName.indexOf(",") != -1) sColName = nexacro.replaceAll(sColName, ",", "^_^");

	// Dataset에 RuleSet이 존재하면
										if(sColName==sTrcColName)this.gtrace("RULE SET 널체크(this.gfn_isNull(objDs.validationRuleSet))-->"+this.gfn_isNull(objDs.validationRuleSet), gtrcPos);
	if(!this.gfn_isNull(objDs.validationRuleSet))
    {
		arrValidation = JSON.parse(objDs.validationRuleSet); 	if(sColName==sTrcColName)this.gtrace("RULE SET (arrValidation)-->"+arrValidation, gtrcPos);
		for(var index in arrValidation)
		{
			// 기존 RuleSet에 컬럼에 대한 Rule이 존재하면 변경
			if( arrValidation[index].name == sColID )
			{            
				arrValidation[index].title = sColName;
				arrValidation[index].value = sRule;
				if(""+sRule.indexOf("required") > -1){
					arrValidation[index].notnull = true;
				}
				else {
					arrValidation[index].notnull = false;
				}
				objDs.validationRuleSet = JSON.stringify(arrValidation);
				return true;
			}
		}
	}
	
	// RuleSet 
	//							objDs	  , sColID		  , sColName		   , sRule
	// this.gfn_setValidation(this.ds_data, "COL_ID"      , "아이디"          , "required,length:5"); 
	var validationRule = 
	{
		name  : sColID		// Column		:	COL_ID
	   ,title : sColName	// Title		: 	아이디
	   ,value : sRule		// 정합성 Rule	:	required,length:5
	};
					if(sColName==sTrcColName)this.gtrace("정합성체크 Rule(validationRule)-->"+validationRule, gtrcPos);
	// RuleSet에 필수여부 추가
	if(""+sRule.indexOf("required") > -1) {
		validationRule.notnull = true;
	}
	else {
		validationRule.notnull = false;
	}
					this.gtrace("필수여부(validationRule.notnull)-->"+validationRule.notnull, gtrcPos);
	arrValidation.push(validationRule);	if(sColName==sTrcColName)this.gtrace("룰추가(validationRule-->arrValidation)", gtrcPos);

	objDs.validationRuleSet = JSON.stringify(arrValidation);
										if(sColName==sTrcColName)this.gtrace("데이터셋 "+objDs.name+" 의 RULE SET (objDs.validationRuleSet)-->"+objDs.validationRuleSet, gtrcPos);
};

/**
 * @class Dataset에 등록된 데이터 정합성체크 RuleSet에의해 정합성을 체크를 하고 이상여부를 리턴한다.
 * @param  {Dataset||Grid,String} Check 대상 Object(Dataset, Grid)
                                  Check 모드 A: 모든 row에 대해서 체크, U: 변경된 row에 대해서만 체크(default)
 * @return {Boolean} 정상 true / 오류 false
 */
pForm.gfn_validation = function()
{
							var gtrcPos = "Validation.xjs.gfn_validation";
								this.gtrace("●정합성체크(gfn_validation)", gtrcPos);
	var nUpdateCnt = 0;
	var targetlist  = new Array();
	var sCheckMode   = "U";
												this.gtrace("입력파람(arguments.length)--->"+arguments.length, gtrcPos);
												this.gtrace("입력파람(arguments[0].name)--->"+arguments[0].name, gtrcPos);
												this.gtrace("입력파람(arguments[1])--->"+arguments[1], gtrcPos);
	// Check 대상과 Check Mode(A/U)를 지정
	for(var m=0; m<arguments.length; m++)
	{    									//	this.gtrace("m--->"+m, gtrcPos);
		// Check 모드(A-전체 row, U-변경된 row, R-ROW_CHK체크된 것) 설정
			
		if(this.gfn_typeOf(arguments[m]) == "string")
		{
			if(arguments[m] == "A" || arguments[m] == "U" || arguments[m] == "R")
			{
				sCheckMode = arguments[m];	this.gtrace("	Check 모드(sCheckMode)---->"+sCheckMode, gtrcPos);
			}
		}
		// Check 대상 설정 : 데이타셋 or 그리드
		else
		{
			targetlist.push(arguments[m]);	this.gtrace("	Check 대상(targetlist)---->"+arguments[m].name, gtrcPos);
		}
	}

	// arguments로 넘어온 Object 만큼 정합성 체크
											this.gtrace("정합성 체크 : arguments로 넘어온 Object 만큼", gtrcPos);
											this.gtrace("타겟리스트 갯수는(targetlist.length)--->"+targetlist.length, gtrcPos);
	for(var m=0; m<targetlist.length; m++)
	{
											this.gtrace("타겟리스트의 "+m+"번째", gtrcPos);
		var objDs;
		var sObjtype = "";
		var arrRule = new Array();

		// 데이터셋
		if(targetlist[m] instanceof Dataset){
			objDs    = targetlist[m];
			sObjtype = "dataset";
		}
		// 그리드
		else if( targetlist[m] instanceof Grid ) {
			objDs    = targetlist[m].getBindDataset();
			sObjtype = "grid";
		}
		else {
			continue;
		}
												this.gtrace("오브젝트타입(sObjtype)--->"+sObjtype, gtrcPos);
												this.gtrace("오브젝트(objDs)--->"+objDs.name, gtrcPos);

		// 데이터셋의 RuleSet
		var arrValidation = new Array();
		if(!this.gfn_isNull(objDs.validationRuleSet) )
		{
			arrValidation = JSON.parse(objDs.validationRuleSet);
		}
		else {
			continue;
		}
												this.gtrace("(데이터셋의) RULE SET (arrValidation)--->"+arrValidation, gtrcPos);

		// 삭제된 row 정합성 체크 건수 증가
		nUpdateCnt += parseInt(objDs.getDeletedRowCount());
												this.gtrace("삭제된 Row갯수(nUpdateCnt)--->"+nUpdateCnt, gtrcPos);

		// 데이터셋의 row 만큼 정합성 체크
		for(var i=0; i<objDs.getRowCount(); i++)
		{
			if(sCheckMode=="R"){	// 체크된 것에 대해서만 체크
				if(objDs.getColumn(i, "ROW_CHK")!="1") continue;
			}
													this.gtrace("i--->"+i+"(데이터셋의 "+i+"번째 행 in FOR문)", gtrcPos);
			var nRowType = objDs.getRowType(i);		this.gtrace("행타입--->"+nRowType, gtrcPos);

			// 삭제된 row
			if (nRowType == 8) {
				++nUpdateCnt;						this.gtrace("삭제행 nUpdateCnt증가--->"+nUpdateCnt, gtrcPos);
				continue;
			}

			// sCheckMode에 따른 체크 대상 구분
													this.gtrace("체크모드(sCheckMode)--->"+sCheckMode+" (A: 모든 row에 대해서 체크, U: 변경된 row에 대해서만 체크(default))", gtrcPos);
			if (sCheckMode == "U") {
				// 변경 안된 Row는 정합성 체크 SKIP
				if (nRowType == 1) {
					continue;
				}

				// 추가, 수정은 정합성 체크
				if (nRowType == 2 || nRowType == 4) {
					++nUpdateCnt;
				}
			}
			// 전체 row
			else {
				++nUpdateCnt;
			}
													this.gtrace("체크대상데이터셋행갯수(nUpdateCnt)--->"+nUpdateCnt, gtrcPos);
			
			// Rule 만큼 처리
													this.gtrace("	RULE SET 갯수만큼 처리 (arrValidation.length)--->"+arrValidation.length, gtrcPos);
													this.gtrace("첫번째체크룰 오브젝트만 확인(arrValidation[0]--->"+arrValidation[0], gtrcPos);
			for(var j=0; j<arrValidation.length; j++)
			{

				var sColID     = arrValidation[j].name;								if(j==0)this.gtrace("	셋파람(sColID)--->"+sColID, gtrcPos);
				var sColName   = new String(arrValidation[j].title);				if(j==0)this.gtrace("	셋파람(sColName)--->"+sColName, gtrcPos);
				var sColValue  = String(objDs.getColumn(i, sColID)).trim();			if(j==0)this.gtrace("	셋파람(sColValue)--->"+sColValue, gtrcPos);
				var arrRule    = (""+arrValidation[j].value).split(","); //required,length:5
																					if(j==0)this.gtrace("	룰(arrRule)--->"+arrRule, gtrcPos);
				var bNullCheck = arrValidation[j].notnull;
																					if(j==0)this.gtrace("	널체크할것이지(bNullCheck)--->"+bNullCheck, gtrcPos);
				// 필수입력 체크
				if(bNullCheck == true){		//required가 있으므로 nullCheck를 하라
																					if(j==0)this.gtrace("	널체크할값은(sColValue)--->"+this.gfn_nvl(sColValue,""), gtrcPos);

				//	if(this.gfn_nvl(sColValue,"")==""){	//공백인 경우도체크 undefined인 경우는 ??
				
				if(sColID.indexOf("||") > -1)
				{
					var arrColId = sColID.split("||");
					
					for(var p=0 ; p<arrColId.length ;p++)
					{
						var tChkVal = String(objDs.getColumn(i, arrColId[p])).trim();
						if(!this.gfn_isNull(tChkVal)){sColValue = tChkVal;}
					}
				}
				
				if(j==0)this.gtrace("sColValue--->"+sColValue, gtrcPos);
					
					if(this.gfn_isNull(sColValue))
					{
																if(j==0)this.gtrace("	체크값이널이다!!--->"+sColValue+" (sColValue)", gtrcPos);
						// row 이동 및 focus 저장
						objDs.set_rowposition(i);
						this.validationObject = arguments[m];	if(j==0)this.gtrace("	체크오브젝트(this.validationObject)--->"+this.validationObject, gtrcPos);
						this.validationColumn = sColID;			if(j==0)this.gtrace("	체크컬럼--->"+this.validationColumn, gtrcPos);

						var titile = "";
						if (sColName.indexOf(",") != -1) {
							titile = sColName.split(",")[0];
						}
						else {
							titile = sColName;
						}
				
						// 예시 : 메시지 처리 : ${} 필수 입력 항목입니다. {0} 은(는) 필수 입력 항목입니다.
						//this.gfnAlert("msg.err.validator", [this.gfn_getKoreanTarget(titile, "은(는)")+" 필수 입력 항목입니다."], null, "gfnValidationCallback");

						this.gtrace("경고메세지---------(gfn_alert실행)(msg.err.validator.required)(in gds_Lang)(sColValue==null)", gtrcPos);
						this.gfn_alert("msg.err.validator.required", [titile], null, "gfn_validationCallback", "A");	
						
						return false;
					}
				}

				// 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크(equalto,fromto,comparebig,comparesmall,comparesmall
				if(this.gfn_nvl(sColValue,"")!=""){		//공백도 체크되도록 수정함	//if(!this.gfn_isNull(sColValue)){ 
					// Rule에 따른 정합성 체크
												if(j==0)this.gtrace("arrRule.length-------->"+arrRule.length, gtrcPos);
					for(var k=0; k<arrRule.length; k++)
					{
						var msg = "";                        
						// 컬럼의 두개의 값을 이용해서 처리하는 check 대상
						var checkrule =  arrRule[k].split(":")[0];	if(j==0)this.gtrace("checkrule------->"+checkrule, gtrcPos);
						if (checkrule == "equalto"
						 || checkrule == "fromto" 
						 || checkrule == "comparebig" 
						 || checkrule == "comparesmall")
						{
							var compare1;
							var compare2;
							if(arrRule[k].split(":").length == 3){
								compare1 = objDs.getColumn(i, arrRule[k].split(":")[1]);
								compare2 = objDs.getColumn(i, arrRule[k].split(":")[2]);
							}
							else {
								compare1 = objDs.getColumn(i, sColID);
								compare2 = objDs.getColumn(i, arrRule[k].split(":")[1]);
							}
							msg = this.gfn_validationCheckRule(sColName, sColValue, arrRule[k], compare1, compare2);
						}
						// 컬럼의 한개 값을 이용해서 처리하는 check 대상
						else {
							msg = this.gfn_validationCheckRule(sColName, sColValue, arrRule[k]);
						}

						// 에러시
						if (!this.gfn_isNull(msg)){
							// row 이동 및 focus 저장
							objDs.set_rowposition(i);
							this.validationObject = arguments[m];
							this.validationColumn = sColID;

							// 메시지 처리 : ${}
							this.gfn_alert("msg.err.validator", [msg], null, "gfn_validationCallback", "A");
							
							return false;
						}
					}  // Rule에 따른 정합성 체크
				}  // 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크
			}  // Rule 만큼 처리
		}  // 데이터셋의 row 만큼 정합성 체크
	}  // arguments로 넘어온 체크 대상 만큼 정합성 체크


	// 정합성 체크 건수 확인
	if (nUpdateCnt == 0)
	{
		this.gtrace("정합성 체크 대상이 없어 Validation을 체크가 되지 않았습니다.", gtrcPos);
		return true; // 체크할 게 없는 경우 통과하도록 수정 191216.ADH.
	}

	return true;
};


/**
 * @class 데이터의 정합성을 체크하여 그 결과를 리턴한다. 메세지가 "" 널이면.. 정상 널이 아니면 실패이다.
 * @param {String} itemName - Column title
 * @param {Stirng} itemValue - Column 값
 * @param {String} validationRuleSet - validation Rule
 * @return {Stirng} 정상이면 "" 실패이면 "XXX는 7자리입니다." 와 같은 완성형 에러메세지
 */

//msg = this.gfn_validationCheckRule(sColName, sColValue, arrRule[k]);
 
pForm.gfn_validationCheckRule = function(itemName, itemValue, validationRuleSet, compare1, compare2)
{
							var gtrcPos = "Validation.xjs.gfn_validationCheckRule";
	var titile     = "";
	var columname1 = "";
	var columname2 = "";
	if (itemName.indexOf(",") != -1) {
		titile     = itemName.split(",")[0];
		columname1 = itemName.split(",")[0];
		columname2 = itemName.split(",")[1];
	}
	else {
		titile = itemName;
	}
	
	//타이틀도 언어셋에 의해 변환
	titile = (this.gfn_getWord(titile)==undefined?title:this.gfn_getWord(titile));
	
	var arrItem2  =  validationRuleSet.split(":");
	var checkrule =  arrItem2[0];

	checkrule = checkrule.toLowerCase();		//this.gtrace("checkrule--->"+checkrule, gtrcPos);
												//this.gtrace("(itemValue+'').length--->"+(itemValue+"").length, gtrcPos);
												//this.gtrace(" parseInt(arrItem2[1])--->"+ parseInt(arrItem2[1]), gtrcPos);
	switch(checkrule)
	{
		// size 크기 지정 : length:7
		case "length":
			if( (itemValue+"").length != parseInt(arrItem2[1]))
			{
												this.gtrace(" titile--->"+ titile, gtrcPos);
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" "+arrItem2[1]+"자리 입니다.";
				// {0} 의 입력값은 {1} 자리이어야 합니다.
				return this.gfn_getMessage("msg.err.validator.length",[titile, arrItem2[1]]);
			}
			break;
		// size 크기의 범위 : rangelength:2:3
		case "rangelength":
			if( (itemValue+"").length < parseInt(arrItem2[1]) || (itemValue+"").length > parseInt(arrItem2[2]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" ("+arrItem2[1]+")자리에서 ("+arrItem2[2]+")자리로 등록해야 합니다.";
				// {0} 은(는) {1} 와(과) {2} 사이의 자리이어야 합니다.
				return this.gfn_getMessage("msg.err.validator.rangelength",[titile, arrItem2[1], arrItem2[2]]);
			}
			break;
		// 최대 size 크기: maxlength:7
		case "maxlength":
			if (itemValue.length > parseInt(arrItem2[1]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" 최대 "+arrItem2[1]+"자리 입니다.";
				// {0} 의 입력값의 길이는 {1} 이하이어야 합니다.
				return this.gfn_getMessage("msg.err.validator.maxlength",[titile, arrItem2[1]]);
			}
			break;
		// 최소 size 크기: minlength:7
		case "minlength":
			if (itemValue.length < parseInt(arrItem2[1]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" 최소 "+arrItem2[1]+"자리 이상이어야 합니다.";
				// {0} 의 입력값의 길이는 {1} 이상이어야 합니다.
				return this.gfn_getMessage("msg.err.validator.minlength",[titile, arrItem2[1]]);
			}
			break;
		// 최대 size 크기(Byte) : maxlengthB:3
		case "maxlengthbyte":
			if (this.lookupFunc("gfn_lengthByte").call(itemValue) > parseInt(arrItem2[1]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" 최대 "+arrItem2[1]+"자리 입니다.";
				// {0} 의 입력값의 길이는 {1} 이하이어야 합니다.
				return this.gfn_getMessage("msg.err.validator.maxlength",[titile, arrItem2[1]]);
			}
			break;
		// 최소 size 크기(Byte) : minlengthB:3
		case "minlengthbyte":
			if (this.lookupFunc("gfn_lengthByte").call(itemValue) < parseInt(arrItem2[1]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" 최소 "+arrItem2[1]+"자리 이상이어야 합니다.";
				// {0} 의 입력값의 길이는 {1} 이상이어야 합니다.
				return this.gfn_getMessage("msg.err.validator.minlength",[titile, arrItem2[1]]);
			}
			break;
		// 숫자 여부 : digits
		case "digits":		
			if (!this.lookupFunc("gfn_isDigit").call(itemValue))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" 숫자만 입력 가능합니다.";
				// {0} 은(는) 숫자만 입력 가능합니다.
				return this.gfn_getMessage("msg.err.validator.digits",[titile]);
			}
			break;
		// 해당 숫자 이하 : min:7
		case "min":
			if (parseFloat(itemValue) < parseFloat(arrItem2[1]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" "+arrItem2[1]+" 이상의 숫자만 입력 가능합니다.";
				// {0} 은(는) {1} 이상의 숫자만 입력 가능합니다.
				return this.gfn_getMessage("msg.err.validator.min",[titile, arrItem2[1]]);
			}
			break;
		// 해당 숫자 이상 : max:7
		case "max":
			if (parseFloat(itemValue) > parseFloat(arrItem2[1]))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" "+arrItem2[1]+" 이하의 숫자만 입력 가능합니다.";
				// {0} 은(는) {1} 이하의 숫자만 입력 가능합니다.
				return this.gfn_getMessage("msg.err.validator.max",[titile, arrItem2[1]]);
			}
			break;
		// 소숫점 자리수 비교 - declimit:3
		case "declimit":
			var isExistDot = itemValue.indexOf(".");	this.gtrace("isExistDot--->"+isExistDot, gtrcPos);
			if (isExistDot == -1)
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)")+" 소숫점 "+arrItem2[1]+" 자리로 구성되어야 합니다.";
				// {0} 은(는) 소숫점 {1} 자리로 구성되어야 합니다.
				return this.gfn_getMessage("msg.err.validator.declimit",[titile, arrItem2[1]]);
			}
			else
			{
				var decLen = itemValue.substr(isExistDot + 1, itemValue.length);	this.gtrace("parseInt(arrItem2[1])--->"+parseInt(arrItem2[1]), gtrcPos);
				if (decLen.length != parseInt(arrItem2[1]))
				{
					//return this.gfn_getKoreanTarget(titile, "은(는)")+" 소숫점 "+arrItem2[1]+" 자리로 구성되어야 합니다.";
					// {0} 은(는) 소숫점 {1} 자리로 구성되어야 합니다.
					return this.gfn_getMessage("msg.err.validator.declimit",[titile, arrItem2[1]]);
				}
			}
			break;
		// 날짜 년월일 체크 : date
		case "date":
			if (!this.lookupFunc("gfn_isYMD").call(itemValue))
			{
				//return titile + "에 등록된 날짜가 잘못되었습니다.";
				// {0} 은(는) 유효하지 않은 날짜 형식입니다.
				return this.gfn_getMessage("msg.err.validator.date",[titile]);
			}
			break;
		// 날짜 년월 체크 : dateym
		case "dateym":
			if (!this.lookupFunc("gfn_isYM").call(itemValue))
			{
				//return titile + "에 등록된 년월 형식의 날짜가 잘못되었습니다.";
				// {0} 은(는) 유효하지 않은 년월 형식입니다.
				return this.gfn_getMessage("msg.err.validator.dateym",[titile]);
			}
			break;
		// 사이의 값인지 비교 - range:40:100
		case "range":
			if (parseInt(itemValue) < parseInt(arrItem2[1]) || parseInt(itemValue) > parseInt(arrItem2[2]))
			{
				//return titile + "의 값은 "+arrItem2[1]+" 와(과) "+arrItem2[2]+" 사이의 값이어야 합니다.";
				// {0} 은(는) {1} 와(과) {2} 사이의 값입니다.
				return this.gfn_getMessage("msg.err.validator.range",[titile,arrItem2[1],arrItem2[2]]);
			}
			break;
		// 코드값이 목록내의 값인지 비교 - code:1:2:3
		case "code":
			for (var i = 1; i < arrItem2.length; i++)
			{
				if (parseInt(itemValue) == parseInt(arrItem2[i]))
				{
					return "";
				}
			}
			//return this.gfn_getKoreanTarget(titile, "은(는)")+" "+nexacro.replaceAll(validationRuleSet.split("code:")[1],":",",")+" 중 하나의 값이어야 합니다.";
			// {0} 은(는) {1} 중 하나의 값이어야 합니다.
			return this.gfn_getMessage("msg.err.validator.code",[titile,nexacro.replaceAll(validationRuleSet.split("code:")[1],":",",")]);
			break;
		// 타 칼럼값과 같은지 비교 - equalto:target칼럼명
		case "equalto":
			if( compare1 != compare2 )
			{
				if (itemName.indexOf(",") != -1 ) {
					//return this.gfn_getKoreanTarget(columname1, "이(가)") + " "+columname2+"과 일치하지 않습니다.";
					// {0} 이(가) {1} 와(과) 일치하지 않습니다.
					return this.gfn_getMessage("msg.err.validator.equalto",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					//return  titile + "의 값과 "+compare2+"와 일치하지 않습니다.";
					// {0} 이(가) {1} 와(과) 일치하지 않습니다.
					return this.gfn_getMessage("msg.err.validator.equalto",[titile,compare2]);
				}
			}
			break;
		// 날짜 from ~ to 비교 : comparedate:target칼럼명
		case "fromto":
			if (compare1 < compare2)
			{
				if( itemName.indexOf(",") > -1 )
				{
					//return columname1 + "의 날짜가 "+columname2+"의 날짜보다 작습니다.";
					// {0} 의 날짜가 {1} 의 날짜보다 작습니다.
					return this.gfn_getMessage("msg.err.validator.fromto",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					//return  titile + "의 날짜가 "+compare2+"일 보다 작습니다.";
					// {0} 의 날짜가 {1} 의 날짜보다 작습니다.
					return this.gfn_getMessage("msg.err.validator.fromto",[titile,compare2]);
				}
			}
			break;
		// 타 칼럼값보다 큰값인지 비교 - comparemax:target칼럼명
		case "comparebig":
			if( parseFloat(compare1) < parseFloat(compare2) )
			{
				if( itemName.indexOf(",") != -1 ) {
					//return columname1 + "의 값은 "+columname2+"의 값보다 커야 합니다.";
					// {0} 이(가) {1} 보다 작습니다.
					return this.gfn_getMessage("msg.err.validator.comparebig",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					//return titile + "의 값은 "+compare2+"보다 커야 합니다.";
					// {0} 이(가) {1} 보다 작습니다.
					return this.gfn_getMessage("msg.err.validator.comparebig",[titile,compare2]);
				}
			}
			break;
		// 타 칼럼값과 작은값인지 비교 - comparemin:comparetarget
		case "comparesmall":
			if( parseFloat(compare1) > parseFloat(compare2) )
			{
				if( itemName.indexOf(",") != -1 ) {
					//return columname1 + "의 값은 "+columname2+"의 값보다 작아야 합니다.";
					// {0} 이(가) {1} 보다 큽니다.
					return this.gfn_getMessage("msg.err.validator.comparesmall",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					//return titile + "의 값은 "+compare2+"보다 작아야 합니다.";
					// {0} 이(가) {1} 보다 큽니다.
					return this.gfn_getMessage("msg.err.validator.comparesmall",[titile,compare2]);
				}
			}
			break;

		// 아래부터는 해당 프로젝트에서 추가한 Validation 함수로 체크 로직 추가 가능

		// 주민등록번호 체크 - isssn
		case "isssn":
			if (!this.lookupFunc("gfn_isSSN").call(itemValue))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)") + " 올바른 주민번호가 아닙니다.";
				// {0} 은(는) 올바른 주민번호가 아닙니다.
				return this.gfn_getMessage("msg.err.validator.ssn",[titile]);
				
			}
			break;
		// 외국인등록번호 체크 - isfrn
		case "isfrn":
			if (!this.lookupFunc("gfn_isFrnrIdNo").call(itemValue))
			{
				return this.gfn_getKoreanTarget(titile, "은(는)") + " 올바른 외국인등록번호가 아닙니다.";
			}
			break;
		// 사업자등록번호 체크 - isbzid
		case "isbzid":
			if (!this.lookupFunc("gfn_isBzIdNo").call(itemValue))
			{
				return this.gfn_getKoreanTarget(titile, "은(는)") + " 올바른 사업자등록번호가 아닙니다.";
			}
			break;
		// 법인등록번호 체크 - isfirmid
		case "isfirmid":
			if (!this.lookupFunc("gfn_isFirmIdNo").call(itemValue))
			{
				return this.gfn_getKoreanTarget(titile, "은(는)") + " 올바른 법인등록번호가 아닙니다.";
			}
			break;
		// 신용카드번호 체크 - iscardno
		case "iscardno":
			if (!this.lookupFunc("gfn_isCardNo").call(itemValue))
			{
				return this.gfn_getKoreanTarget(titile, "은(는)") + " 올바른 신용카드번호가 아닙니다.";
			}
			break;
		// 이메일 체크 - isemail
		case "isemail":
			if (!this.lookupFunc("gfn_isEmail").call(itemValue))
			{
				//return this.gfn_getKoreanTarget(titile, "은(는)") + " 올바른 이메일이 아닙니다.";
				// e-mail이 잘못된 형태로 입력 되었습니다.
				return this.gfn_getMessage("msg.err.validator.email",[titile]);
			}
			break;

		default:
			return "";
			break;
	}
	return "";
};
/**
 * @class Validation 에러시 메세지 후 callBack함수
 * @param {String} sid - 팝업ID
 * @param {String} rtn - 전달값
 * @return N/A
 */
pForm.gfn_validationCallback = function(sid, rtn)
{
	// Validation 오류시 focus 처리
	this.gfn_setValidationFocus(this.validationObject, this.validationColumn);
};

/**
 * @class 정합성 체크 오류시 해당 콤포넌트의 ERROR 스타일 처리 및 포커스 처리
 * @param  {Object} obj - Grid 및 Dataset
 * @param  {String} bindcolumid - 입력오류항목 컬럼명
 * @return N/A
 */
pForm.gfn_setValidationFocus = function(obj, bindcolumid)
{
	var binddataset;

	if (obj instanceof Grid) {
		binddataset = obj.getBindDataset();
	}
	else {
		binddataset = obj;
	}
	// 바인딩된 Components
	for(var j=0;j<this.binds.length;j++)
	{
		if( eval("this."+this.binds[j].datasetid) == binddataset && this.binds[j].columnid == bindcolumid )
		{
			var targetobj = eval("this."+this.binds[j].compid);
			targetobj.setFocus();
			return;
		}
	}

	// 그리드
	if (obj instanceof Grid) {
		obj.setCellPos(obj.getBindCellIndex("Body", bindcolumid));
		obj.showEditor(true);
		obj.setFocus();
	}
	// 데이터셋
	else {
		if (!this.gfn_isNull(obj.bindgrid)) {
			var gridobj = obj.bindgrid;
			gridobj.setCellPos(gridobj.getBindCellIndex("Body", bindcolumid));
			gridobj.showEditor(true);
			gridobj.setFocus();
		}
	}
};




/**
 * @class 한글의 은(는) 이(가) 을(를)에 대한 메세지처리를 초정/중성/종성의 갯수로 파악해서 처리한다.
 * @param {String} itemName - 대상 한글
 * @param {String} option - 접미사
 * @return {String} 완성형 메세지
 */
pForm.gfn_getKoreanTarget = function(itemName, option)
{
    if (option == "은(는)")
    {
        if (itemName[itemName.length-1].toKorChars().length == 2) {
            return itemName+"는";
        } 
		else {
            return itemName+"은";
		}
    }
    else if (option == "이(가)")
    {
        if (itemName[itemName.length-1].toKorChars().length == 2) {
            return itemName+"가";
        } 
		else {
            return itemName+"이";
		}
    }
    else if (option == "을(를)")
    {
        if (itemName[itemName.length-1].toKorChars().length == 2) {
            return itemName+"를";
        } 
		else {
            return itemName+"은";
		}
    }
    else {
         itemName;
    }
};

/**
 * @class      	문자열(한글)의 초성/중성/종성의 정보를 가져온다.
 * @return 		{Array} 초성/중성/종성의 갯수만큼을 Array 배열로 리턴한다.
 */
String.prototype.toKorChars = function()
{
    var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
        cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cho, jung, jong;

    var str = this,
        cnt = str.length,
        chars = [],
        cCode;

    for (var i = 0; i < cnt; i++) 
	{
        cCode = str.charCodeAt(i);

		if (cCode == 32) { continue; }

        // 한글이 아닌 경우
        if (cCode < 0xAC00 || cCode > 0xD7A3) {
            chars.push(str.charAt(i));
            continue;
        }

        cCode  = str.charCodeAt(i) - 0xAC00;

        jong = cCode % 28; // 종성
        jung = ((cCode - jong) / 28 ) % 21 // 중성
        cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

        chars.push(cCho[cho], cJung[jung]);
		if (cJong[jong] !== '') { chars.push(cJong[jong]); }
    }

    return chars;
};


/************************************************************************************************
* Validation function List
************************************************************************************************/

/**
 * @class 숫자체크 <br>
 * @param {String} sValue
 * @return {Boolean}
 */
pForm.gfn_isDigit = function(sNum)
{
	var c;
	var point_cnt=0;
	var ret=true;

	if ( this.gfn_isNull(sNum) )	return false;

	for (var i=0; i<sNum.length; i++)
	{
		c = sNum.charAt(i);
		if (i == 0 && (c == "+" || c == "-"));
		else if (c >= "0" && c <= "9");
		else if (c == ".")
		{
			point_cnt++;
			if ( point_cnt > 1 )
			{
				ret = false;
				break;
			}
		}
		else
		{
			ret = false;
			break;
		}
	}
	return ret;
};

/**
 * @class 한글만으로 되어 있는지 Check한다. <br>
 * @param {String} strValue
 * @return {Boolean}
 */
pForm.gfn_isKoreanChar = function(strValue)
{
	var retVal = true;
	
	for (i = 0; i < strValue.length; i++){
		if (!((strValue.charCodeAt(i) > 0x3130 && strValue.charCodeAt(i) < 0x318F) || (strValue.charCodeAt(i) >= 0xAC00 && strValue.charCodeAt(i) <= 0xD7A3))){
			retVal = false;
		}
	}
	
	return retVal;
};

/**
 * @class 특수문자가 있는지 Check한다. <br>
 * @param {String} strValue
 * @return {Boolean}
 */
pForm.gfn_isSpecialChar = function(strValue)
{
	var retVal = false;
	if(strValue.search(/\W|\s/g) > -1) retVal = true;

	return retVal;
};

/**
 * @class 주민등록번호 여부를 확인한다. <br>
 * @param {String} sJuminNo - 입력문자열(주민번호 13자리)
 * @return {Boolean}
 */
pForm.gfn_isSSN = function(sJuminNo)
{
	var birthYear = this.gfn_getBirthYear(sJuminNo);
	
	birthYear += sJuminNo.substr(0, 2);
	var birthMonth = sJuminNo.substr(2, 2)-1;
	var birthDate = sJuminNo.substr(4, 2);
	var birth = new Date(birthYear, birthMonth, birthDate);

	if ( birth.getYear() % 100 != sJuminNo.substr(0, 2) ||
		birth.getMonth() != birthMonth ||
		birth.getDate() != birthDate) 
	{
		return false;
	}

	// Check Sum 코드의 유효성 검사
	buf = new Array(13);
	for (i = 0; i < 6; i++) buf[i] = parseInt(sJuminNo.charAt(i));
	for (i = 6; i < 13; i++) buf[i] = parseInt(sJuminNo.charAt(i));
	  
	multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
	for (i = 0, sum = 0; i < 12; i++) sum += (buf[i] *= multipliers[i]);

	if ((11 - (sum % 11)) % 10 != buf[12]) {
		return false;
	}else{
		return true;
	}
};

/**
 * @class 외국인 등록번호 여부를 확인한다. <br>
 * @param {String} strNo - 입력문자열(등록번호13자리)
 * @return {Boolean}
 */
pForm.gfn_isFrnrIdNo = function(strNo)
{
	if (strNo.length != 13 || !isNumber(strNo)) return false;
	
	var month = Number(strNo.substr(2, 2));
	var day	  = Number(strNo.substr(4, 2));
		
	if (month < 1 || month > 12) return false;
	if (day < 1 || day > 31) return false;
	
	var sum = 0;
	var odd = 0;
	var buf = array(13);
	var multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
	
	for (var i=0; i<13; i++) {
		buf[i] = Number(strNo.charAt(i));
	}
	
	if (buf[11] < 6) return false;
	
	odd = buf[7] * 10 + buf[8];
	if((odd%2) != 0) return false;
	
	for (var i=0; i<12; i++) {
		sum += (buf[i] * multipliers[i]);
	}
	
	sum = 11 - (sum % 11);
	
	if (sum >= 10) sum -= 10;
	sum += 2;
	if (sum >= 10) sum -= 10;
	
	if (buf[12] == sum) {
		return true;
	} else {
		return false;
	}
};

/**
 * @class 사업자 등록번호 여부를 확인한다.
 * @param {String} strCustNo - 입력문자열(등록번호10자리)
 * @return {Boolean}
 */
pForm.gfn_isBzIdNo = function(strCustNo)
{
	if (strCustNo.length != 10) return false;
	else {
		
		var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
		var tmpcustNo, i, chkSum=0, c2, remander;

		for (i=0; i<=7; i++) chkSum += checkID[i] * strCustNo.charAt(i);

		c2 = "0" + (checkID[8] * strCustNo.charAt(8));
		c2 = c2.substring(c2.length - 2, c2.length);

		chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));

		remander = (10 - (chkSum % 10)) % 10 ;

		if (Math.floor(strCustNo.charAt(9)) == remander) return true; // OK!
		return false;
	}

	return true;
};

/**
 * @class 법인 등록번호 여부를 확인한다. <br>
 * @param {String} strNo - 입력문자열(법인번호13자리)
 * @return {Boolean}
 */
pForm.gfn_isFirmIdNo = function(strNo)
{
	if (strNo.length != 13 || !isNumber(strNo)) return false;
	
	var sum = 0;
	var buf = new Array(13);
	var multipliers = [1,2,1,2,1,2,1,2,1,2,1,2];
	
	for (var i=0; i<13; i++) {
		buf[i] = Number(strNo.charAt(i));
	}
	
	for (var i=0; i<12; i++) {
		sum += (buf[i] * multipliers[i]);
	}
	
	sum = (10 - (sum % 10)) % 10;
	
	if (buf[12] == sum) {
		return true;
	} else {
		return false;
	}
};

/**
 * @class 신용카드번호 여부를 확인한다. <br>
 * @param {String} strNo - 카드번호16자리
 * @return {Boolean}
 */
pForm.gfn_isCardNo = function(strNo)
{
	if (strNo.length < 13 || strNo.length > 19 || !nexacro.isNumeric(strNo)) return false;
	
	var sum = 0;
	var buf = new Array();
	
	for (var i=0; i<strNo.length; i++) {
		buf[i] = Number(strNo.charAt(i));
	}
	
	var temp;
	for (var i=buf.length-1, j=0; i>=0; i--, j++) {
		temp = buf[i] * ((j%2) + 1);
		if (temp >= 10) {
			temp = temp - 9;
		}
		sum += temp;
	}
	
	if ((sum % 10) == 0) {
		return true;
	} else {
		return false;
	}
};

/**
 * @class 이메일 형식에 맞는지 Check한다.
 * @param {String} strValue
 * @return {Boolean}
 */
pForm.gfn_isEmail = function(strValue)
{
	var retVal = false;
	var sTmp = "";
	var sRegExp = "[a-z0-9]+[a-z0-9.,]+@[a-z0-9]+[a-z0-9.,]+\\.[a-z0-9]+";

	var regexp = new RegExp(sRegExp,"ig");
	sTmp = regexp.exec(strValue);

	if (sTmp == null) {
		retVal = false;
	} 
	else {
		if (( sTmp.index == 0 ) && (sTmp[0].length == strValue.length )) {
			retVal = true;
		} else {
			retVal = false;
		}
	}
	return retVal;
};


/**
 * @class 데이터셋에서 체크된 행이 있는지 확인하여 없을 경우 경고창 발생
 * @param {String} strMsg
 * @return
 */
pForm.gfn_rowCheckValidation = function(objDs, strMsg)
{
	if(objDs.findRow("ROW_CHK", "1") == -1){
		// 메시지 처리 : ${}
		//	this.gfn_alert("msg.err.validator.length", ["사원번호", "5자리"]);
		this.gfn_alert("msg.err.validator.selectrow");
		return false;
	}else{
		//	return this.gfn_validation(objDs, "R");
		return this.gfn_rowMessageValidation(objDs, "R");
	}
};



/**
 * @class Dataset에 등록된 데이터 정합성체크 RuleSet에의해 정합성을 체크를 하고  ds의 Message 컬럼에 메세지를 셋팅하고 이상여부를 리턴한다.
 * @param  {Dataset||Grid,String} Check 대상 Object(Dataset, Grid)
                                  Check 모드 A: 모든 row에 대해서 체크, U: 변경된 row에 대해서만 체크(default)
 * @return {Boolean} 정상 true / 오류 false
 */
pForm.gfn_rowMessageValidation = function()
{
							var gtrcPos = "Validation.xjs.gfn_rowMessageValidation";
								this.gtrace("●정합성결과 데이터셋메세지에 셋팅(gfn_rowMessageValidation)", gtrcPos);
	var nUpdateCnt = 0;
	var targetlist  = new Array();
	var sCheckMode   = "U";
												this.gtrace("입력파람(arguments.length)--->"+arguments.length, gtrcPos);
												this.gtrace("입력파람(arguments[0].name)--->"+arguments[0].name, gtrcPos);
												this.gtrace("입력파람(arguments[1])--->"+arguments[1], gtrcPos);
	var bFinalReturn ; 
	
	// Check 대상과 Check Mode(A/U)를 지정
	for(var m=0; m<arguments.length; m++)
	{    									//	this.gtrace("m--->"+m, gtrcPos);
		// Check 모드(A-전체 row, U-변경된 row, R-ROW_CHK체크된 것) 설정
			
		if(this.gfn_typeOf(arguments[m]) == "string")
		{
			if(arguments[m] == "A" || arguments[m] == "U" || arguments[m] == "R")
			{
				sCheckMode = arguments[m];	this.gtrace("	Check 모드(sCheckMode)---->"+sCheckMode, gtrcPos);
			}
		}
		// Check 대상 설정 : 데이타셋 or 그리드
		else
		{
			targetlist.push(arguments[m]);	this.gtrace("	Check 대상(targetlist)---->"+arguments[m].name, gtrcPos);
		}
	}
												
	// arguments로 넘어온 Object 만큼 정합성 체크
											this.gtrace("정합성 체크 : arguments로 넘어온 Object 만큼", gtrcPos);
											this.gtrace("타겟리스트 갯수는(targetlist.length)--->"+targetlist.length, gtrcPos);
	for(var m=0; m<targetlist.length; m++)
	{
											this.gtrace("타겟리스트의 "+m+"번째", gtrcPos);
		var objDs;
		var sObjtype = "";
		var arrRule = new Array();

		// 데이터셋
		if(targetlist[m] instanceof Dataset){
			objDs    = targetlist[m];
			sObjtype = "dataset";
		}
		// 그리드
		else if( targetlist[m] instanceof Grid ) {
			objDs    = targetlist[m].getBindDataset();
			sObjtype = "grid";
		}
		else {
			continue;
		}
												this.gtrace("오브젝트타입(sObjtype)--->"+sObjtype, gtrcPos);
												this.gtrace("오브젝트(objDs)--->"+objDs.name, gtrcPos);
		
		// 데이터셋의 RuleSet
		var arrValidation = new Array();
		if(!this.gfn_isNull(objDs.validationRuleSet) )
		{
			arrValidation = JSON.parse(objDs.validationRuleSet);
		}
		else {
			continue;
		}
												this.gtrace("(데이터셋의) RULE SET (arrValidation)--->"+arrValidation, gtrcPos);
												
		// 삭제된 row 정합성 체크 건수 증가
		nUpdateCnt += parseInt(objDs.getDeletedRowCount());
												this.gtrace("삭제된 Row갯수(nUpdateCnt)--->"+nUpdateCnt, gtrcPos);
		
		// 데이터셋의 row 만큼 정합성 체크
		for(var i=0; i<objDs.getRowCount(); i++)
		{
			if(sCheckMode=="R"){	// 체크된 것에 대해서만 체크
				if(objDs.getColumn(i, "ROW_CHK")!="1") continue;
			}
													this.gtrace("i--->"+i+"(데이터셋의 "+i+"번째 행 in FOR문)", gtrcPos);
			var nRowType = objDs.getRowType(i);		this.gtrace("행타입--->"+nRowType, gtrcPos);

			// 삭제된 row
			if (nRowType == 8) {
				++nUpdateCnt;						this.gtrace("삭제행 nUpdateCnt증가--->"+nUpdateCnt, gtrcPos);
				continue;
			}

			// sCheckMode에 따른 체크 대상 구분
													this.gtrace("체크모드(sCheckMode)--->"+sCheckMode+" (A: 모든 row에 대해서 체크, U: 변경된 row에 대해서만 체크(default), R:체크된 row에 대해서만 체크)", gtrcPos);
			if (sCheckMode == "U") {
				// 변경 안된 Row는 정합성 체크 SKIP
				if (nRowType == 1) {
					continue;
				}

				// 추가, 수정은 정합성 체크
				if (nRowType == 2 || nRowType == 4) {
					++nUpdateCnt;
				}
			}
			// 전체 row
			else {
				++nUpdateCnt;
			}
													this.gtrace("체크대상데이터셋행갯수(nUpdateCnt)--->"+nUpdateCnt, gtrcPos);
			
			// Rule 만큼 처리
													this.gtrace("	RULE SET 갯수만큼 처리 (arrValidation.length)--->"+arrValidation.length, gtrcPos);
													this.gtrace("첫번째체크룰 오브젝트만 확인(arrValidation[0]--->"+arrValidation[0], gtrcPos);
			for(var j=0; j<arrValidation.length; j++)
			{
																					
				var sColID     = arrValidation[j].name;								if(j==0)this.gtrace("	셋파람(sColID)--->"+sColID, gtrcPos);
				var sColName   = new String(arrValidation[j].title);				if(j==0)this.gtrace("	셋파람(sColName)--->"+sColName, gtrcPos);
				var sColValue  = String(objDs.getColumn(i, sColID)).trim();			if(j==0)this.gtrace("	셋파람(sColValue)--->"+sColValue, gtrcPos);
				var arrRule    = (""+arrValidation[j].value).split(","); //required,length:5
																					if(j==0)this.gtrace("	룰(arrRule)--->"+arrRule, gtrcPos);
				var bNullCheck = arrValidation[j].notnull;
																					if(j==0)this.gtrace("	널체크할것이지(bNullCheck)--->"+bNullCheck, gtrcPos);
				// 필수입력 체크
				if(bNullCheck == true){		//required가 있으므로 nullCheck를 하라
																					if(j==0)this.gtrace("	널체크할값은(sColValue)--->"+this.gfn_nvl(sColValue,""), gtrcPos);

				//	if(this.gfn_nvl(sColValue,"")==""){	//공백인 경우도체크 undefined인 경우는 ??
				
				if(sColID.indexOf("||") > -1)
				{
					var arrColId = sColID.split("||");
					
					for(var p=0 ; p<arrColId.length ;p++)
					{
						var tChkVal = String(objDs.getColumn(i, arrColId[p])).trim();
						if(!this.gfn_isNull(tChkVal)){sColValue = tChkVal;}
					}
				}
				
				if(j==0)this.gtrace("sColValue--->"+sColValue, gtrcPos);
					
					if(this.gfn_isNull(sColValue))
					{
																if(j==0)this.gtrace("	체크값이널이다!!--->"+sColValue+" (sColValue)", gtrcPos);
						// row 이동 및 focus 저장
						objDs.set_rowposition(i);
						this.validationObject = arguments[m];	if(j==0)this.gtrace("	체크오브젝트(this.validationObject)--->"+this.validationObject, gtrcPos);
						this.validationColumn = sColID;			if(j==0)this.gtrace("	체크컬럼--->"+this.validationColumn, gtrcPos);

						var titile = "";
						if (sColName.indexOf(",") != -1) {
							titile = sColName.split(",")[0];
						}
						else {
							titile = sColName;
						}
				
						// 예시 : 메시지 처리 : ${} 필수 입력 항목입니다. {0} 은(는) 필수 입력 항목입니다.
						//this.gfnAlert("msg.err.validator", [this.gfn_getKoreanTarget(titile, "은(는)")+" 필수 입력 항목입니다."], null, "gfnValidationCallback");

						//	this.gtrace("경고메세지---------(gfn_alert실행)(msg.err.validator.required)(in gds_Lang)(sColValue==null)", gtrcPos);
						//	this.gfn_alert("msg.err.validator.required", [titile], null, "gfn_validationCallback", "A");	
						
						// 메세지 띄우지 않고 컬럼에 셋팅
						objDs.setColumn(i, "Message", this.gfn_getMessage("msg.err.validator.required", [titile]));
						
						bFinalReturn = false;
						//	return false;
					}
				}

				// 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크(equalto,fromto,comparebig,comparesmall,comparesmall
				if(this.gfn_nvl(sColValue,"")!=""){		//공백도 체크되도록 수정함	//if(!this.gfn_isNull(sColValue)){ 
					// Rule에 따른 정합성 체크
												if(j==0)this.gtrace("arrRule.length-------->"+arrRule.length, gtrcPos);
					for(var k=0; k<arrRule.length; k++)
					{
						var msg = "";                        
						// 컬럼의 두개의 값을 이용해서 처리하는 check 대상
						var checkrule =  arrRule[k].split(":")[0];	if(j==0)this.gtrace("checkrule------->"+checkrule, gtrcPos);
						if (checkrule == "equalto"
						 || checkrule == "fromto" 
						 || checkrule == "comparebig" 
						 || checkrule == "comparesmall")
						{
							var compare1;
							var compare2;
							if(arrRule[k].split(":").length == 3){
								compare1 = objDs.getColumn(i, arrRule[k].split(":")[1]);
								compare2 = objDs.getColumn(i, arrRule[k].split(":")[2]);
							}
							else {
								compare1 = objDs.getColumn(i, sColID);
								compare2 = objDs.getColumn(i, arrRule[k].split(":")[1]);
							}
							msg = this.gfn_validationCheckRule(sColName, sColValue, arrRule[k], compare1, compare2);
						}
						// 컬럼의 한개 값을 이용해서 처리하는 check 대상
						else {
							msg = this.gfn_validationCheckRule(sColName, sColValue, arrRule[k]);
						}

						// 에러시
						if (!this.gfn_isNull(msg)){
							// row 이동 및 focus 저장
							objDs.set_rowposition(i);
							this.validationObject = arguments[m];
							this.validationColumn = sColID;

							// 메시지 처리 : ${}
							this.gfn_alert("msg.err.validator", [msg], null, "gfn_validationCallback", "A");
							
							bFinalReturn = false;
							//	return false;
						}
					}  // Rule에 따른 정합성 체크
				}	// 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크
			}  // Rule 만큼 처리
		}  // 데이터셋의 row 만큼 정합성 체크
	}  // arguments로 넘어온 체크 대상 만큼 정합성 체크

	
	// 정합성 체크 건수 확인
	if (nUpdateCnt == 0)
	{
		this.gtrace("정합성 체크 대상이 없어 Validation을 체크가 되지 않았습니다.", gtrcPos);
		//	return true; // 체크할 게 없는 경우 통과하도록 수정 191216.ADH.
		bFinalReturn = true;
	}
	
	if(bFinalReturn != false) bFinalReturn = true;
	
	this.gtrace("체크룰통과여부(gfn_rowMessageValidation)-------->"+bFinalReturn, gtrcPos);
	
	return bFinalReturn;
};
