/**
*  @FileName 	Message.js 
*/

var pForm = nexacro.Form.prototype;
//	var pForm = this;

/**
 * @class 메세지팝업오픈
 * @param {String} strMsgId - 메세지ID	
 * @param {Array} arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
 * @param {String} [strPopId] - 팝업ID(하나의 callback함수에서 중복된 메시지 처리를 할 경우 PopId구분을 위해 unique한 ID 반드시 사용)
 * @param {String} [strCallback] - 팝업콜백 (confirm성 메시지를 사용시 반드시 필요)
 * @param {String} [strMsgType] - alert / confirm 구분
  * @return N/A
 * @example
 * this.gfnAlert(this, "A", "확인하세요");	
 */
 pForm.gfn_alert = function (strMsgId, arrArg, strPopId, strCallback, strMsgType)
{
											var gtrcPos = "Message.xjs.gfn_alert";
	this.gtrace("● 메세지창(gfn_alert)", gtrcPos);
	
    var objApp = pForm.gfn_getApplication();

	//	if(objApp.gds_message.findRow("MSG_ID", strMsgId) < 0) return false;
												this.gtrace("strMsgId------>"+strMsgId,gtrcPos);
												this.gtrace("gds_Language.findRow------>"+objApp.gds_Language.findRow("DEFAULT_LANG", strMsgId), gtrcPos);
	
	//	메세지셋에 없으면 strMsgId를 그대로 출력 하도록 수정하기 위해 아래 막음
	//	if(objApp.gds_Language.findRow("DEFAULT_LANG", strMsgId) < 0) return false;
	
	// var strMsg = objApp.gds_message.lookup("MSG_ID", strMsgId, "MSG_TEXT");
	var strMsg = objApp.gds_Language.lookup("DEFAULT_LANG", strMsgId, "LANGUAGE");
												this.gtrace("strMsg------>"+strMsg, gtrcPos);
		strMsg = this.gfn_nvl(strMsg, strMsgId);	//	메세지셋에 없으면 strMsgId를 그대로 출력
    //	if(this.gfn_isNull(strMsg)) strMsg = "확인";
	
    // 줄바꿈 변경
	strMsg = strMsg.replace(/\\n/g, String.fromCharCode(10));
	strMsg = pForm.gfn_convertMessage(strMsg, arrArg);
												this.gtrace("strMsg(converted)------>"+strMsg, gtrcPos);
//    trace("strMsg : " + strMsg);
//	var strMsgType = objApp.gds_Language.lookup("DEFAULT_LANG", strMsgId, "MSG_TYPE");	

	if(this.gfn_isNull(strPopId)) strPopId = strMsgId;
	if(this.gfn_isNull(strMsgType)) strMsgType = "A";	// 기본 alert 으로 세팅
	
	switch(strMsgType) {
		case "A":
			strMsgUrl = "Comm::Comm_Alert.xfdl";
			break;
		case "C":
			strMsgUrl = "Comm::Comm_Confirm.xfdl";
			break;
	}
	
	var oArg = {paramContents:strMsg};
	var oOption = {titlebar:"false"};	
	
	// messagePopup
		this.gtrace("ev_messagePopup-->"+nexacro.getEnvironmentVariable("ev_messagePopup"), gtrcPos);
	if (nexacro.getEnvironmentVariable("ev_messagePopup") == "true") {
		this.gfn_openPopup(strPopId,strMsgUrl,oArg,strCallback,oOption);
	}
	// alert-cofirm
	else {
		if (strMsgType == "A") {
			alert(strMsg);
		}
		else {
			return confirm(strMsg);
		}
	}
};

/**
 * @class 메세지 치환
 * @param {String} msg - 메세지	
 * @param {Array} values - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
 * @return {String}
 */
pForm.gfn_convertMessage = function(msg, values) 
{
    return msg.replace(/\{(\d+)\}/g, function() {
        return values[arguments[1]];
    });
};


/**
 * @class 메세지 치환 후 완성된 메시지 리턴
 * @param {String} sMsgId - 메세지ID	
 * @param {Array}  arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
 * @return {String}
 */
pForm.gfn_getMessage = function(sMsgId, arrArg) 
{
    var objApp = pForm.gfn_getApplication();
	
	if(objApp.gds_Language.findRow("DEFAULT_LANG", sMsgId) < 0) {
		return sMsgId.replace(/\\n/g, String.fromCharCode(10));
	}
	
	var sMsg = objApp.gds_Language.lookup("DEFAULT_LANG", sMsgId, "LANGUAGE");
	
	// 줄바꿈 변경
	sMsg = sMsg.replace(/\\n/g, String.fromCharCode(10));
	sMsg =  pForm.gfn_convertMessage(sMsg, arrArg);	
	
	return sMsg;
};

/**
 * @class  다국어 처리를 위한 용어 검색
 * @param  {String} sTargetVal - 검색할 용어
 * @return {String} 변경할 용어
 */
pForm.gfn_getWord = function (sWord)
{
	var objApp 	  = this.gfn_getApplication();
	var sVal = sWord;
	var nRow = objApp.gds_Language.findRow("DEFAULT_LANG",sWord);
	if (nRow != -1){
		sVal = objApp.gds_Language.getColumn(nRow, "LANGUAGE");
	}
	return sVal;
};
