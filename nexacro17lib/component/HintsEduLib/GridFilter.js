/**
*  @FileName 	GridFilter.xjs 
*/

var pForm = nexacro.Form.prototype;

/*
Grid Filter
 
  ============================= 포함기능 =============================
  
 1. 그리드 헤드 마우스 오버 필터 기능
	- 하나의 컬럼에 대해 여러 필터 조건을 지정할 수 있다.
	- 필터가 적용된 조건이 그리드에 바로 표시되지 않는다.
 
 2. 그리드 헤드 영역 추가 필터 기능
	- 여러 컬럼에 적용된 필터 조건이 그리드에 표현된다.
	- 하나의 컬럼에 대해 하나의 필터 조건만 가능하다. (콤보형 제외)
   
 ============================= 확인사항 =============================   
  
 - 두가지 기능을 하나의 그리드에 동시에 지정하는 것은 고려되지 않았습니다.
 
 - format 이 변경되거나 데이터가 갱신되는 경우 아래 함수를 호출해야 함.
    removeOverFilterComps (마우스 오버 필터) or removeAppendFilterComps (영역 추가 필터)

 - column size 변경 시 아래 함수를 호출해야 함.
	arrangeOverFilterComps(마우스 오버 필터) or arrangeAppendFilterComps (영역 추가 필터)
 
*/

/******************************************************************************
	1. 예제 실행을 위한 function
******************************************************************************/


/******************************************************************************
	3. 그리드 헤드 영역 추가 필터기능 관련 function
******************************************************************************/

/**
 * Grid head에 filer 기능 추가하기 초기화
 * @param {Grid} grid 대상 Grid Component
 */
pForm.initGridHeadAppendFilter = function(grid)
{
    // 필터영역(Div) 를 담아둘 속성 추가
    if (this.fnIsUndefined(grid.makeCompList))
    {
		
        grid.makeCompList = [];
    }
	
    // 필터적용 정보를 담아둘 속성 추가
    if (this.fnIsUndefined(grid.filterItems))
    {
		
        grid.filterItems = {};
    }
	
    // add ondragmove handler
    grid.addEventHandler("ondragmove", this.filterGridOnDragMoveHandler, this);
	
    // add ondrop handler
    grid.addEventHandler("ondrop", this.headAppendFilterOnDropHandler, this);
	
    // add onlbuttonup handler
    grid.addEventHandler("onlbuttonup", this.headAppendFilterOnLButtonUpHandler, this);
	
    // add onmousemove handler
    grid.addEventHandler("onmousemove", this.headAppendFilterOnMouseMoveHandler, this);
	
    // add onhscroll handler
    grid.addEventHandler("onhscroll", this.arrangeFilterComps, this);
	
}

/**
* Grid head append filter 보이기
* @param {Grid} grid 대상 Grid Component
*/
pForm.showHeadAppendFilter = function(grid)
{
    var rowIdx = grid.appendContentsRow("head");
	grid.setFormatRowProperty( rowIdx, "size", 34 );//추가된 head 높이조절 2019-11-21 bok
	
    // 추가된 head row index를 담아두자.    
    grid.appendHeadRowIndex = rowIdx;
	
    this.arrangeFilterComps(grid);
}

/**
* Grid head append filter 숨기기 (필터제거 포함)
* @param {Grid} grid 대상 Grid Component
*/
pForm.hideHeadAppendFilter = function(grid)
{
    var index = grid.appendHeadRowIndex;
    if (!this.fnIsUndefined(index))
    {
        grid.deleteContentsRow("head", index);
		
        // Div 숨기기 및 값 초기화
        var comps = grid.parent.components;
        var comp, list;
		list = grid.makeCompList;
        for (var i = 0, len = list.length; i < len; i++)
        {
            comp = comps[list[i]];
			
            if (comp)
            {
                comp.set_visible(false);
                comp.form.initValue();
            }
        }
		
        // 데이터셋 필터 제거
        var ds = grid.getBindDataset();
        ds.filter("");
		
        grid.appendHeadRowIndex = null;
    }
}


/******************************************************************************
	4. 필터 처리 core function
******************************************************************************/

// 필터 가능 표시 이미지
pForm.FILTER_ENABLE_IMAGE_URL = "Images::grd_filter_combo.png";
pForm.FILTER_ENABLE_IMAGE_SIZE = [17, 15];

// 필터 적용 표시 이미지
pForm.FILTER_APPLY_IMAGE_URL = "Images::grd_filter_check.png";
pForm.FILTER_APPLY_IMAGE_SIZE = [17, 15];

/**
* 필터 실행
* @param {Grid} grid 대상 Grid Component
* @param {number} headCellIndex head cell index
* @param {string} filterString 적용할 조건식
* @param {*=} filterData filter 조건 데이터
*/
pForm.executeFilter = function(grid, headCellIndex, filterString, filterData)
{
    var bodyCellIndex = this.getBodyCellIndex(grid, headCellIndex);
    var column = this.getBindColumnNameByIndex(grid, bodyCellIndex);
    var ds = grid.getBindDataset();
    var filterItems = grid.filterItems;
    var filterItem = filterItems[column];
    // 선택 컬럼명의 필터정보 확인 및 지정
    if (this.fnIsUndefined(filterItem))
    {
        filterItem = filterItems[column] = {
            filterData: filterData,
            filterString: filterString
        };
		
    }
    else
    {
        filterItem.filterData = filterData;
        filterItem.filterString = filterString;
    }
	
    // 필터정보에서 필터스트링 조합
    var resultString = "";
    var tempString = "";
	
    for (var p in filterItems)
    {
		
        if (!filterItems.hasOwnProperty(p)) return;
		
        filterItem = filterItems[p];
        tempString = filterItem.filterString;
		
        if (!this.gfn_isNull(tempString))
        {
			
            resultString += (this.gfn_isNull(resultString) ? "" : " && ") + tempString;
        }
    }
	
    // 필터 적용
    ds.filter(resultString);
}

/******************************************************************************
	5. Grid Utility function
******************************************************************************/

/**
 * Cell object 를 반환 (Grid 내부 속성이므로 get 용도로만 사용)
 * @param {Grid} grid 대상 Grid Component
 * @param {string} band 얻고자 하는 cell 의 band (head/body/summ);
 * @param {number} index 얻고자 하는 cell 의 index
 * @return {object} cell object
 */
pForm.getGridCellObject = function(grid, band, index)
{
	// 내부속성을 통해 얻어온다.
	var refCell;
	var format = grid._curFormat;
	if (format)
	{
		if ( band == "head" )
		{
			refCell = format._headcells[index];
		}
		else if ( band == "body" )
		{
			refCell = format._bodycells[index];
		}
		else if ( band == "summ" || band == "summary" )
		{
			refCell = format._summcells[index];
		}
	}
	
	return refCell;
}

/**
 * cell object에서 index 를 얻어온다. (Grid 내부 속성이므로 get 용도로만 사용)
 * @param {object} cell 대상 cell object
 * @return {number} cell index
 */
pForm.getCellObjectIndex = function(cell)
{
	return cell._cellidx;
}

/**
 * body cell index로 binding 된 컬럼명을 얻어온다.
 * @param {Grid} grid 대상 Grid Component
 * @param {number} index body cell index
 */
pForm.getBindColumnNameByIndex = function(grid, index) 
{
	var text = "";
	var columnid = "";
	var subCell = grid.getCellProperty("body", index, "subcell");
	if ( subCell > 0 )
	{
		text = grid.getSubCellProperty("body", index, 0, "text");
	}
	else
	{
		text = grid.getCellProperty("body", index, "text");
	}
	
	if ( text != "" )
	{
		if ( text.search(/^BIND\(/) > -1 ) 
		{	
			columnid = text.replace(/^BIND\(/, "");
			columnid = columnid.substr(0, columnid.length-1);
		} 
		else if ( text.search(/^bind:/) > -1 ) 
		{
			columnid = text.replace(/^bind:/, "");
		}
	}
	
	return columnid;
}

/**
 * head cell에 match되는 body cell을 얻어온다
 * @param {Grid} grid 대상 Grid Component
 * @param {number} headCellIndex head cell index
 * @param {boolean=} useColspan head cell 이 colspan 일 경우에도 반환값을 받을지 여부
 */
pForm.getBodyCellIndex = function(grid, headCellIndex, useColspan) 
{	
	// Max Head Row Index
	var maxHeadRow = 0;
	for (var i=0, len=grid.getCellCount("head"); i<len; i++) 
	{
		var row = grid.getCellProperty("head", i, "row");
		if (maxHeadRow < row) 
		{
			maxHeadRow = row;
		}
	}
	// Max Body Row Index
	var maxBodyRow = 0;
	for (var i=0, len=grid.getCellCount("body"); i<len; i++) 
	{
		var row = grid.getCellProperty("body", i, "row");
		if (maxBodyRow < row) 
		{
			maxBodyRow = row;
		}
	}
	
	if (maxHeadRow == 0 && maxBodyRow == 0) 
	{
		return headCellIndex;
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
	
	var cRow, cCol, cColspan;
	for (var i=0, len=grid.getCellCount("body"); i<len; i++) 
	{
		cRow = parseInt(grid.getCellProperty("body", i, "row"));
		cCol = parseInt(grid.getCellProperty("body", i, "col"));	
		cColspan = parseInt(grid.getCellProperty("body", i, "colspan"));					

		// colspan 이 적용된 cell 도 반환값을 사용할 경우 첫번째 항목에 매칭되는 index
		if ( useColspan )
		{
			if (sRow == cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
			{		
				cellIndex = i;
				break;
			}		
		}
		else
		{
			if (sRow == cRow && nCol == cCol && nColspan == cColspan) 
			{		
				cellIndex = i;
				break;
			}
		}
	}
	return cellIndex;
}

/**
 * Grid column 이 사용자에 의해 resizing 중인지 여부를 반환
 * @param {Grid} grid 대상 Grid Component
 * @return {boolean} resizing 여부 반환
 */
pForm.isGridColResizing = function(grid)
{
	// 내부 속성을 확인한다.
	var resizer = grid._resizer_elem;
	if ( resizer && resizer._is_tracking )
	{
		return true;
	}
	return false;
}


/**
* ondragmove Event Handler
* @param {Grid} obj Event가 발생한 Grid Component
* @param {GridDragEventInfo} e GridDragEventInfo
*/
pForm.filterGridOnDragMoveHandler = function(obj, e)
{
    // cell moving 을 체크하기 위해 내부 속성 확인...
    if (obj._movingcell)
    {
		
        var curCol = e.col;
        var col, colspan;
        var merged = false;
        var movingStartCol = obj._movingcell._refobj._col;
        var movingEndCol = curCol;
		
        // 병합된 cell 이 존재하는 col 에 들어올 수 없으므로 체크
        for (var i = 0, len = obj.getCellCount("head"); i < len; i++)
        {
			
            colspan = obj.getCellProperty("head", i, "colspan") - 1;
			
            if (colspan > 0)
            {
				
                col = obj.getCellProperty("head", i, "col");
				
                if ((col <= curCol && curCol <= (col + colspan)) || ((col + colspan) <= curCol && curCol <= col))
                {
					
                    if (movingStartCol > movingEndCol)
                    {
						
                        movingEndCol = col;
						
                    }
                    else
                    {
						
                        movingEndCol = (col + colspan);
                    }
                    break;
                }
            }
        }
		
        if (movingStartCol != movingEndCol)
        {
			
            obj.isMovingCell = true;
            obj.movingStartCol = movingStartCol;
            obj.movingEndCol = movingEndCol;
            return;
        }
    }
	
    obj.isMovingCell = false;
}


/**
* ondrop Event Handler
* @param {Grid} obj Event가 발생한 Grid Component
* @param {GridDragEventInfo} e GridDragEventInfo
*/
pForm.headAppendFilterOnDropHandler = function(obj, e)
{
    // onformatchanged 기능이 현재 없어서 movecell 이 발생될 때를 알 수 없다. 
    // 따라서 ondrop 에서 내부 속성값을 체크하여 기능처리
    var s = e.sourcereferenceobject;
    var f = e.fromreferenceobject;
	
    if (s._type_name == "GridCell" && f._type_name == "GridCell")
    {
		
        if (s.parent == f.parent && s._cellidx != f._cellidx)
        {
			
            this.arrangeFilterComps(obj);
        }
    }
}


/**
* onlbuttonup Event Handler
* @param {Grid} obj Event가 발생한 Grid Component
* @param {GridMouseEventInfo} e GridMouseEventInfo
*/
pForm.headAppendFilterOnLButtonUpHandler = function(obj, e)
{
    // oncolresized 가 현재 지원되지 않아서 기능을 사용하기 위해 추가
    var resizer = obj._resizer_elem;
    if (obj.colResizing && resizer && resizer._movedPos != 0)
    {
		
        this.arrangeFilterComps(obj);
    }
}

/**
* onmousemove Event Handler
* @param {Grid} obj Event가 발생한 Grid Component
* @param {GridMouseEventInfo} e GridMouseEventInfo
*/
pForm.headAppendFilterOnMouseMoveHandler = function(obj, e)
{
    // oncolresized 가 현재 지원되지 않아서 기능을 사용하기 위해 추가
    var resizer = obj._resizer_elem;
    if (resizer && resizer._is_tracking)
    {
		
        obj.colResizing = true;
		
    }
    else
    {
		
        obj.colResizing = false;
    }
}

/**
* Grid head append filter 기능에 필요한 컴포넌트 생성 및 위치 조정
* @param {Grid} grid 대상 Grid Component
*/
pForm.arrangeFilterComps = function(grid)
{
    var form = grid.parent;
    var index = grid.appendHeadRowIndex;
    var rect, rects = [];
    var cellCnt = grid.getCellCount("head");
    var bodyCellIndex, column, comp, name, type;
    var l, t, w, h;
    var list = grid.makeCompList;
    var seq = 0;
    var gridLeftPos = grid.getOffsetLeft();
    var gridTopPos = grid.getOffsetTop();
    var gridPos = [gridLeftPos, gridTopPos, gridLeftPos + grid.getOffsetWidth(), gridTopPos + grid.getOffsetBottom()];
    var first = true;
    var col, band, pivotIndex;
	
    // 각 cell 영역에 필터 입력 영역 생성
    for (var i = 0; i < cellCnt; i++)
    {
        if (grid.getCellProperty("head", i, "row") == index)
        {
            col = grid.getCellProperty("head", i, "col");
            band = grid.getFormatColProperty(col, "band");
            pivotIndex = this.gfn_decode(band, "left", -1, "right", -2, 0);
            rect = grid.getCellRect(-1, i, pivotIndex);
            bodyCellIndex = this.getBodyCellIndex(grid, i);
            column = this.getBindColumnNameByIndex(grid, bodyCellIndex);
            type = grid.getCellProperty("body", bodyCellIndex, "displaytype");
			
            if (this.fnIsUndefined(type)) type = "normal";
			
            name = grid.name + "_headAppendComp" + seq;
			
            var borderWidths = this.fnGetBorderWidth(grid);
            l = gridPos[0] + rect.left;
            t = gridPos[1] + rect.top + borderWidths[1];
            w = rect.width - 1;
            h = rect.height - 1;
			
            // 컴포넌트가 존재하지 않으면 추가
            if (this.fnIndexOf(list, name) < 0)
            {
                list.push(name);
                comp = new Div(name, l, t, w, h);
				//필터
				//comp.style.set_border("0px none white");
                comp.set_border("0px none white");
                comp.form.set_scrollbartype("none");
				comp.form.set_scrolltype("none");
                comp.set_async(false);
                comp.set_visible(false);
                //comp.style.set_background("red");
                form.addChild(comp.name, comp);
				
                comp.set_url("GridFilter::GridFilterDiv.xfdl");
				
                comp.show();
            }
            else
            {
                comp = form.components[name];
            }
			
            // Div에 참조값 지정
            comp.grid = grid;
            comp.headCellIndex = i;
            comp.bodyCellIndex = bodyCellIndex;
            comp.filterType = type;
            comp.filterColumn = column;
			
            var filterItems = grid.filterItems;
            var filterItem = filterItems[column];
            if (!this.gfn_isNull(filterItem))
            {
                comp.filterData = filterItem.filterData;
            }
			
            // 필터타입 지정
            comp.form.setFilterType();
			
            // 위치 조정
            if (l < gridPos[0])
            {
                l = gridPos[0];
            }
			
            if (l + grid.vscrollbar.getOffsetWidth() > gridPos[2])
            {
                comp.set_visible(false);
            }
            else
            {
                var scrollWidth = grid.vscrollbar.getOffsetWidth();
                if ((l + w) > gridPos[2] - scrollWidth)
                {
                    w = gridPos[2] - l;
                    if (grid.vscrollbar)
                    {
                        w = w - scrollWidth - 1;
                    }
                }
                comp.move(l + 1, t + 1, w, h);
                comp.set_visible(true);
            }
			
            seq++;
        }
    }
	
    var div = form.components[list[0]];
	
    if (!this.gfn_isNull(div)) div.setFocus();
}

/************************************************************************************************
 * Function Name: fnIsUndefined
 * Description  : value의 undefined 여부 반환.
 * Arguments    : @param {*} value 확인할 value.		
 * Return       : @return {boolean} undefined 여부.
*************************************************************************************************/
pForm.fnIsUndefined = function(value)
{
	return value === undefined;
};


/************************************************************************************************
 * Function Name: fnGetBorderWidth
 * Description  : nexacro Component의 border width(px)를 반환한다.
 * Arguments    : @param {XComp} xComp nexacro Component
		 		  
 * Return       : @return {array.<number>} [ leftWdith, topWdith, rightWdith, bottomWdith ]
*************************************************************************************************/
pForm.fnGetBorderWidth = function(xComp)
{
	var border = xComp._getCurrentStyleBorder();
	var leftWidth = 0,topWidth = 0,rightWidth = 0,bottomWidth = 0;
	
	if (border)
	{
		leftWidth   = border.left.width;
		topWidth    = border.top.width;
		rightWidth  = border.right.width;
		bottomWidth = border.bottom.width;
		
		leftWidth   = nexacro.toNumber(leftWidth.replace("px",""), 0);
		topWidth    = nexacro.toNumber(topWidth.replace("px",""), 0);
		rightWidth  = nexacro.toNumber(rightWidth.replace("px",""), 0);
		bottomWidth = nexacro.toNumber(bottomWidth.replace("px",""), 0);
		
		return [leftWidth, topWidth, rightWidth, bottomWidth];
	}

	return [0, 0, 0, 0];
};

/************************************************************************************************
 * Function Name: fnIndexOf
 * Description  : 지정된 항목이 처음 나오는 배열 위치를 반환한다. 
 * Arguments    : @param {array} array 검색 대상 Array.
		 		  @param {object} item 찾고자 하는 Item.
				  @param {number=} from 검색의 시작 위치 (default: 0).
				  @param {boolean=} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * Return       : @return {number} 검색된 배열 위치. 없다면 -1 리턴.
*************************************************************************************************/
pForm.fnIndexOf = function(array, item, from, strict)
{
	var len = array.length;
	
	if (from == null)
		from = 0;
		
	strict == !!strict;
	
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	
	if (from < 0)
	{
		from += len;
	}
	
	if (strict)
	{
		for (; from < len; from++) 
		{
			if ( array[from] === item)
			{
				return from;
			}
		}
	}
	else
	{
		for (; from < len; from++) 
		{
			if ( array[from] == item)
			{
				return from;
			}
		}
	}
	
	return -1;
};
