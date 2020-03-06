/*******************************************************************************************************
http://support.tobesoft.co.kr/Support/index.html
// 	ajax 통신에서 넥사함수 호출 방법
안녕하세요. 투비소프트 고객지원팀입니다.

문의하신 내용에 대해서는 아래와 같은 방법으로 처리가 가능합니다.
아래 예시와 같이 this에 대해 정의해 주시면됩니다.
Ex) 420400.

this.fn_ocrExecute = function(picture)
{
	var body = {Option: 'hybrid-web',Picture: picture};

	$.ajax({
	url			: "http://XXXXXXXXXX.XX",
	type		: "post",
	contentType	: "application/json",
	dataType	: "json",
	data		: JSON.stringify(body),
	timeout		: 10000,
	cache		: false,
	nexaform 	: this, // <<--이부분을 추가(nexaform명은 임의로 해도 됩니다)
	success		: function (data) {
			alert("성공.");
			this.nexaform.fn_rtn(JSON.stringify(JSON.parse(data))); //	<<--nexaform를 추가하여 호출한다.
		},
	error		: function (xhr, textStatus, errorThrown) {
			alert("실패.");
		}
	});
};



//	user_id제출 된 데이터에 정적 값 의 추가 매개 변수 ( 이 경우)를 추가하십시오 .
$('#example').dataTable( {
  "ajax": {
    "url": "data.json",
    "data": {
        "user_id": 451
    }
  }
} );

//	데이터 오브젝트를 조작하여 요청에 데이터를 추가하십시오 (함수에서 리턴되지 않음).
$('#example').dataTable( {
  "ajax": {
    "url": "data.json",
    "data": function ( d ) {
        d.extra_search = $('#extra').val();
    }
  }
} );

//	요청에 데이터 추가 (객체 반환) :
$('#example').dataTable( {
  "ajax": {
    "url": "data.json",
    "data": function ( d ) {
      return $.extend( {}, d, {
        "extra_search": $('#extra').val()
      } );
    }
  }
} );

//	요청 본문에 데이터를 JSON으로 제출하십시오.
$('#example').dataTable( {
  "ajax": {
    "url": "data.json",
    "contentType": "application/json",
    "type": "POST",
    "data": function ( d ) {
      return JSON.stringify( d );
    }
  }
} );
*******************************************************************************************************/


//////////////////////////////////////////////////////////////////////////////////////////

//	$NC
//	SaveCRUD
//	serviceCallAndWait

/**
*  @FileName 	SAP_RFC.js 
*  @Description
*/

// 저장 성공
var sucessEBELN = "";
function onSaveEnd(ajaxData) {
  sucessEBELN = "";
  var resultData = $NC.toArray(ajaxData);

  if (resultData.O_MSG == "OK") {

    var PDATA = "P_CRUD|" + SaveCRUD + "ⁿ";

    var RFCCRUD = "";
    if (SaveCRUD == "C" || SaveCRUD == "U") {
      RFCCRUD = SaveCRUD;
    } else {
      RFCCRUD = "D";
    }

    var updateYN = "N";

    $NC.serviceCallAndWait("/LI02010E/getDataSet.do", {
      P_QUERY_ID: "WC.POP_CMCODE",
      P_QUERY_PARAMS: $NC.getParams({
        P_CODE_GRP: "POUUSER",
        P_CODE_CD: $NC.G_USERINFO.USER_ID,
        P_SUB_CD1: "",
        P_SUB_CD2: "",
        P_SUB_CD3: ""
      })
    }, function(ajaxData) {
      var resultData = $NC.toArray(ajaxData);
      if (resultData.length > 0) {
        updateYN = "Y";
      }
    });
    
    $NC.serviceCallAndWait("/LI02010E/getDataSet.do", {
      P_QUERY_ID: "WC.POP_CMCODE",
      P_QUERY_PARAMS: $NC.getParams({
        P_CODE_GRP: "POUTEAM",
        P_CODE_CD: $NC.G_USERINFO.BU_CD,
        P_SUB_CD1: "",
        P_SUB_CD2: "",
        P_SUB_CD3: ""
      })
    }, function(ajaxData) {
      var resultData = $NC.toArray(ajaxData);
      if (resultData.length > 0) {
        updateYN = "Y";
      }
    });

    var CHECK = $NC.getValue("#chkQOrder_Yn");
    if (CHECK == "Y") {
      CHECK = "X";
    } else {
      CHECK = "";
    }
    var ErrorCount = 0;
    $NC.serviceCallAndWait("/RFC/call.do", {
      P_QUERY_ID: "ZQME_RFC_PO_CREATE",
      P_QUERY_PARAMS: $NC.getParams({
        P_FUNCTION_NM: "ZQME_RFC_PO_CREATE",
        P_CRUD: RFCCRUD, // 삭제일때만 D 나머지는 C
        P_DATA_STR: PDATA,
        P_CENTER_CD: '',
        P_SO_KEY: '',
        I_CHECK: CHECK,
        P_RETURN_TYPE: "RETURN_LIST",
        P_USER_ID: $NC.G_USERINFO.USER_ID,
        P_CAN_UPDATE_YN: updateYN
      })
    }, function(ajaxData) {
      var resultData = $NC.toArray(ajaxData);

  //    console.log("resultData::::",resultData);
      
      var currentTab = $("#divMasterView").tabs("option", "active");
      ErrorCount = 0;
      var G_GRID;
      if (currentTab == 0) {
        G_GRID = G_GRDPOLIST;
      } else {
        G_GRID = G_GRDPOHISTORY;
      }
      for (var i = 0; i < resultData.length; i++) {
        var returnData = resultData[i];
        if (returnData.RETURN != "S") {
          if (currentTab == 1) {
            for (var j = 0; j < G_GRDPOHISTORY.data.getLength(); j++) {
              var rowchkData = G_GRDPOHISTORY.data.getItem(j)
              //if (rowchkData.CHECK_YN == "Y" && rowchkData.ZQME_PO == returnData.ZQME_PO) {
              if (rowchkData.CHECK_YN == "Y") {  // 20190502 RFC 리턴값 ->  ZQME_PO: "000000000000000" 체크된 모든데이타에 MESSAGE처리
                if(returnData.ZQME_PO == "000000000000000"){
                  rowchkData.STATUS_F = "X";
                  rowchkData.MESSAGE = returnData.MESSAGE;
                  G_GRID.data.updateItem(rowchkData.id, rowchkData);
                }else{
                        rowchkData.STATUS_F = "X";
                        rowchkData.MESSAGE = returnData.MESSAGE;
                        G_GRDPOHISTORY.data.updateItem(rowchkData.id, rowchkData);
                }
              }
            }
          } else {
            for (var listJ = 0; listJ < G_GRDPOLIST.data.getLength(); listJ++) {
              var rowchkListData = G_GRDPOLIST.data.getItem(listJ);
              if (rowchkListData.CHECK_YN == "Y"
                  && rowchkListData.SUPPLIER_CODE1 == returnData.LIFNR
                  && (($NC.getValue("#chkQOrder_Yn") == "Y" && rowchkListData.VBELN == returnData.VBELN) || $NC
                      .getValue("#chkQOrder_Yn") == "N")) {
                rowchkListData.STATUS = "X";
                rowchkListData.MESSAGE = returnData.MESSAGE;
                G_GRID.data.updateItem(rowchkListData.id, rowchkListData);
              }
              
              if(rowchkListData.CHECK_YN == "Y" && returnData.ZQME_PO == "000000000000000"){
                      rowchkListData.STATUS = "X";
                  rowchkListData.MESSAGE = returnData.MESSAGE;
                  G_GRID.data.updateItem(rowchkListData.id, rowchkListData);
              }
            }
            /*alert(returnData.MESSAGE);
            break;*/
          }
          ErrorCount++;
        } else {
          if (currentTab == 0) {
            for (var j = 0; j < G_GRID.data.getLength(); j++) {
              var rowchkData = G_GRID.data.getItem(j)
              if (rowchkData.CHECK_YN == "Y"
                  && rowchkData.SUPPLIER_CODE1 == returnData.LIFNR
                  && (($NC.getValue("#chkQOrder_Yn") == "Y" && rowchkData.VBELN == returnData.VBELN) || $NC
                      .getValue("#chkQOrder_Yn") == "N")) {
                rowchkData.STATUS = "O";
                rowchkData.MESSAGE = "SUCCESS"; 
                
                rowchkData.CHECK_YN = "N";
                
                
                if (sucessEBELN.indexOf(returnData.EBELN) == -1) {
                  sucessEBELN += returnData.EBELN + ",";
                }
                G_GRID.data.updateItem(rowchkData.id, rowchkData);
              }
            }
          } else if (currentTab == 1) {
            for (var j = 0; j < G_GRDPOHISTORY.data.getLength(); j++) {
              var rowchkData = G_GRDPOHISTORY.data.getItem(j)
              if (rowchkData.CHECK_YN == "Y" && rowchkData.ZQME_PO == returnData.ZQME_PO) {
                rowchkData.STATUS_F = "O";
                rowchkData.MESSAGE = "SUCCESS"; 
                
                rowchkData.CHECK_YN = "N";
                
                G_GRDPOHISTORY.data.updateItem(rowchkData.id, rowchkData);
              }
            }
            onSavePOEnd(returnData.ZQME_PO);
          }
        }
      }

      //console.log("ErrorCount::::",ErrorCount);
      
      if (ErrorCount > 0) {

        var chkParam = {
          P_USER_ID: $NC.G_USERINFO.USER_ID
        };

        $NC.serviceCallAndWait("/OD01110E/callSP.do", {
          P_QUERY_ID: "PO00010E.SAVE_FAIL_CHK",
          P_QUERY_PARAMS: $NC.getParams(chkParam)
        }, function(ajaxData) {
          var resultData = $NC.toArray(ajaxData);
          if (resultData.O_MSG != "OK") {
            alert(resultData.O_MSG);
          }
        });
        
        if (currentTab == 0) {
          alert("Please Check Error Message!");
        } else if (currentTab == 1) {
          alert("Please Check Error Message!");
        }


      } else {
        if (!$NC.isNull(sucessEBELN)) {
          alert($NC.G_MAIN.getMsg("정상적으로 저장되었습니다.") + "(" + sucessEBELN.substring(0, sucessEBELN.length - 1) + ")");
        } else {
          alert($NC.G_MAIN.getMsg("정상적으로 저장되었습니다."));
        }
        _Inquiry();
      }
      // alert($NC.G_MAIN.getMsg("정상적으로 저장되었습니다."));
      // _Inquiry();
    }, function(ajaxData) {
      var result = $NC.toArray(ajaxData.data);
      
      var chkParam = {
        P_USER_ID: $NC.G_USERINFO.USER_ID
      };

      $NC.serviceCallAndWait("/OD01110E/callSP.do", {
        P_QUERY_ID: "PO00010E.SAVE_FAIL_CHK",
        P_QUERY_PARAMS: $NC.getParams(chkParam)
      }, function(ajaxData) {
        var resultData = $NC.toArray(ajaxData);
        if (resultData.O_MSG != "OK") {
          alert(resultData.O_MSG);
        }
      });
      
      ErrorCount++;
      //  console.log("result2222:::",result);
      if (result.RESULT_DATA != "OK") {
        if (Object.keys($NC.toArray(result.RESULT_DATA)).length > 2) {
          var resultcomp = $NC.toArray(result.RESULT_DATA);
          if (!(resultcomp.RETURN == "S" || resultcomp.E_RETURN == "S")) {
            if ($NC.isNull(resultcomp.MESSAGE)) {
              alert(resultcomp.E_MESSAGE);
              $NC.hideProgressMessage();
              grdPOListSetcellFormatter();
              grdPOHistorySetcellFormatter();
              // return;
            } else {
              alert(resultcomp.MESSAGE);
              $NC.hideProgressMessage();
              grdPOListSetcellFormatter();
              grdPOHistorySetcellFormatter();
              // return;
            }
          }
        } else {
          alert(result.RESULT_DATA);

          $NC.hideProgressMessage();
          grdPOListSetcellFormatter();
          grdPOHistorySetcellFormatter();
          // return;
        }
      }
    });

  } else {
    // 현재선택된 텝의 자재필터설정을 위해 실행
    if ($NC.isNull(resultData.RESULT_DATA)) {
      alert(resultData.O_MSG);
    }

    if ($NC.isNull(resultData.O_MSG)) {
      alert(resultData.RESULT_DATA);
    }

    var G_GRID = $("#divMasterView").tabs("option", "active") == 0 ? G_GRDPOLIST : G_GRDPOHISTORY;

    for (var i = 0; i < G_GRID.data.getLength(); i++) {
      var rowData = G_GRID.data.getItem(i);
      var LIFNR = G_GRID == G_GRDPOLIST ? rowData.SUPPLIER_CODE1 : rowData.LIFNR;
      if (G_GRID == G_GRDPOLIST) {
        if (rowData.CHECK_YN == "Y" && (rowData.VBELN == resultData.O_VBELN && LIFNR == resultData.O_LIFNR)) {
          rowData.STATUS = "X";
          rowData.MESSAGE = $NC.isNull(resultData.O_MSG) ? resultData.RESULT_DATA : resultData.O_MSG;
          G_GRID.data.updateItem(rowData.id, rowData);
        }
      } else {
        if (rowData.CHECK_YN == "Y" && (rowData.ZQME_PO == resultData.O_ZQME_PO)) {
          rowData.STATUS_F = "X";
          rowData.MESSAGE = $NC.isNull(resultData.O_MSG) ? resultData.RESULT_DATA : resultData.O_MSG;
          G_GRID.data.updateItem(rowData.id, rowData);
        }
      }
    }
    grdPOListSetcellFormatter();
    grdPOHistorySetcellFormatter();
    // alert($NC.G_MAIN.getMsg(resultData.RESULT_DATA));
    return;
  }
  
  if(ErrorCount == 0){
    var chkParam = {
      P_USER_ID: $NC.G_USERINFO.USER_ID
    };

    $NC.serviceCallAndWait("/OD01110E/callSP.do", {
      P_QUERY_ID: "PO00010E.SAVE_FAIL_CHK",
      P_QUERY_PARAMS: $NC.getParams(chkParam)
    }, function(ajaxData) {
      var resultData = $NC.toArray(ajaxData);
      if (resultData.O_MSG != "OK") {
        alert(resultData.O_MSG);
      }
    });
  }
}

function onSavePOEnd(ZQME_PO) {
  var chkParam = {
    P_ZQME_PO: ZQME_PO,
    P_USER_ID: $NC.G_USERINFO.USER_ID
  };

  $NC.serviceCallAndWait("/OD01110E/callSP.do", {
    P_QUERY_ID: "PO00010E.SAVE_END",
    P_QUERY_PARAMS: $NC.getParams(chkParam)
  }, function(ajaxData) {
    var resultData = $NC.toArray(ajaxData);
    if (resultData.O_MSG != "OK") {
      alert(resultData.O_MSG);
    }
  });

}

// 저장중 오류 발생
function onSaveFail(ajaxData) {
  var resultData = $NC.toArray(ajaxData);
  alert(resultData.RESULT_DATA);
}

function _Delete() {
  var G_GRID = G_GRDPOHISTORY;
  SaveCRUD = "D";

  deleteAllDS = [ ];
  if (G_GRID.view.getEditorLock().isActive()) {
    G_GRID.view.getEditorLock().commitCurrentEdit();
  }

  var saveCount = 0;
  var saveDetailMDS = [ ];
  for (var DTi = 0; DTi < G_GRID.data.getLength(); DTi++) {
    var rowDTData = G_GRID.data.getItem(DTi);
    if (rowDTData.CHECK_YN == "Y") {
      rowDTData.MESSAGE = "";
      G_GRID.data.updateItem(rowDTData.id, rowDTData);

      var EINDT = rowDTData.EINDT;
      var BSART = rowDTData.BSART;
      var LIFNR = rowDTData.LIFNR;
      var WAERS = rowDTData.WAERS;
      var MENGE = rowDTData.MENGE;
      var NETPR = rowDTData.NETPR;
      var NETWR = rowDTData.NETWR;
      var TXZ01 = rowDTData.TXZ01;
      var EKGRP = rowDTData.EKGRP;
      var saveDetailDS = {
        P_ZQME_PO: rowDTData.ZQME_PO,
        P_BUKRS: $NC.G_USERINFO.CENTER_CD,
        P_BSART: BSART,
        P_LIFNR: LIFNR,
        P_WAERS: WAERS,
        P_EKGRP: EKGRP,
        P_ZTERM: rowDTData.ZTERM,
        P_INCO1: rowDTData.INCO1,
        P_EKORG: $NC.G_USERINFO.CENTER_CD,
        P_VBELN: rowDTData.VBELN,
        P_USER_ID: $NC.G_USERINFO.USER_ID,
        P_EBELP: rowDTData.EBELP,
        P_LOEKZ: "",
        P_AEDAT: "",
        P_TXZ01: TXZ01,
        P_MATNR: rowDTData.MATNR,
        P_WERKS: $NC.G_USERINFO.CENTER_CD,
        P_MENGE: MENGE,
        P_MEINS: rowDTData.MEINS,
        P_EINDT: EINDT.replace(/-/gi, ""),
        P_UEBTO: rowDTData.UEBTO,
        P_UNTTO: rowDTData.UNTTO,
        P_NETPR: NETPR,
        P_PEINH: rowDTData.PEINH,
        P_NETWR: NETWR,
        P_WEBRE: BSART,// rowDTData.BSART,
        P_VBELP: rowDTData.VBELP,
        P_REMARK1: rowDTData.REMARK1,
        P_CRUD: SaveCRUD,
        P_J_3ASIZE: rowDTData.J_3ASIZE,
        P_J_3AEBSP: rowDTData.J_3AEBSP,
        P_ITEM_CD : rowDTData.ITEM_CD,
        P_LOT_NO: rowDTData.LOT_NO,
        P_ELIKZ: rowDTData.ELIKZ,
        P_MTL_ITEM_CD:rowDTData.MTL_ITEM_CD,
        P_MTL_COLOR_KEY:rowDTData.MTL_COLOR_KEY,
        P_MTL_SIZE_KEY:rowDTData.MTL_SIZE_KEY,
        
        P_USAGE:rowDTData.USAGE,
        P_BUYER_ITEM_CD:rowDTData.BUYER_ITEM_CD
        
      };
      saveDetailMDS.push(saveDetailDS);
      saveCount++;
    }
  }

  if (saveCount == 0) {
    alert("Please select Delete data.");
    return;
  }
  deleteAllDS.push(saveDetailMDS);

  if (saveDetailMDS.length == 0) {
    alert("Please Check Message!");
    return;
  }

  $NC.showProgressMessage({
    type: 2,
    message: $NC.G_MAIN.getMsg("PO 삭제 중 입니다. 잠시만 기다려 주십시오...")
  });

  setTimeout(function() {
    $NC.serviceCallAndWait("/PO00010E/updatePO.do", {
      P_QUERY_PARAMS: $NC.getParams(deleteAllDS)
    }, onSaveEnd, onSaveFail);
  }, 300);

}