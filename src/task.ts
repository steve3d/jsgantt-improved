import { formatDateStr, parseDateStr } from './utils/date_utils';
import { newNode } from './utils/draw_utils';
import { hashKey, internalProperties, internalPropertiesLang, stripUnwanted } from './utils/general_utils';

declare let g: any;

// function to open window to display task link
export const taskLink = function (pRef, pWidth, pHeight) {
  let vWidth, vHeight;
  if (pWidth) vWidth = pWidth; else vWidth = 400;
  if (pHeight) vHeight = pHeight; else vHeight = 400;

  window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};

export const sortTasks = function (pList, pID, pIdx) {
  if (pList.length < 2) {
    return pIdx;
  }
  let sortIdx = pIdx;
  let sortArr = new Array();

  for (let i = 0; i < pList.length; i++) {
    if (pList[i].getParent() == pID) sortArr.push(pList[i]);
  }

  if (sortArr.length > 0) {
    sortArr.sort(function (a, b) {
      let i = a.getStart().getTime() - b.getStart().getTime();
      if (i == 0) i = a.getEnd().getTime() - b.getEnd().getTime();
      if (i == 0) return a.vID - b.vID;
      else return i;
    });
  }

  for (let j = 0; j < sortArr.length; j++) {
    for (let i = 0; i < pList.length; i++) {
      if (pList[i].vID == sortArr[j].vID) {
        pList[i].setSortIdx(sortIdx++);
        sortIdx = sortTasks(pList, pList[i].vID, sortIdx);
      }
    }
  }
  return sortIdx;
};

export const TaskItemObject = function (object) {
  const pDataObject = {...object};

  internalProperties.forEach(property => {
    delete pDataObject[property];
  });

  return new TaskItem(object.pID,
    object.pName,
    object.pStart,
    object.pEnd,
    object.pClass,
    object.pLink,
    object.pMile,
    object.pRes,
    object.pComp,
    object.pGroup,
    object.pParent,
    object.pOpen,
    object.pDepend,
    object.pCaption,
    object.pNotes,
    object.pGantt,
    object.pCost,
    object.pPlanStart,
    object.pPlanEnd,
    object.pDuration,
    object.pBarText,
    object
  );
};

export class TaskItem {
  vGantt: any;
  _id: string;
  vID: string;
  vName: string;
  vStart: Date = null;
  vEnd: Date = null;
  vPlanStart: Date = null;
  vPlanEnd: Date = null;
  vGroupMinStart: Date = null;
  vGroupMinEnd: Date = null;
  vGroupMinPlanStart: Date = null;
  vGroupMinPlanEnd: Date = null;
  vClass: string;
  vLink: string;
  vMile: boolean;
  vRes: string;
  vComp: number;
  vCost: number;
  vGroup: number;
  vDataObject: any;
  vCompVal: number;
  vParent: string;

  vOpen: boolean;
  vDepend: any[];
  vDependType: any[];
  vCaption: string;
  vDuration: string;
  vBarText: string;
  vLevel: number;
  vNumKid: number;
  vWeight: number;
  vVisible: boolean = true;
  vSortIdx: number;
  vToDelete = false;
  x1;
  y1;
  x2;
  y2;
  vNotes: HTMLElement;
  vParItem: TaskItem;
  vCellDiv: HTMLElement;
  vBarDiv: HTMLElement;
  vTaskDiv: HTMLElement;
  vPlanTaskDiv: HTMLElement;
  vListChildRow = null;
  vChildRow = null;
  vGroupSpan = null;

  constructor(pID,
              pName,
              pStart,
              pEnd,
              pClass,
              pLink,
              pMile,
              pRes,
              pComp,
              pGroup,
              pParent,
              pOpen,
              pDepend,
              pCaption,
              pNotes,
              pGantt,
              pCost?,
              pPlanStart?,
              pPlanEnd?,
              pDuration?,
              pBarText?,
              pDataObject?) {
    this.vGantt = pGantt ? pGantt : this;
    this._id = document.createTextNode(pID).data;
    this.vID = hashKey(document.createTextNode(pID).data);
    this.vName = document.createTextNode(pName).data;
    this.vClass = document.createTextNode(pClass).data;
    this.vLink = document.createTextNode(pLink).data;
    this.vMile = parseInt(document.createTextNode(pMile).data) == 1;
    this.vRes = document.createTextNode(pRes).data;
    this.vComp = parseFloat(document.createTextNode(pComp).data);
    this.vCost = parseInt(document.createTextNode(pCost).data);
    this.vGroup = parseInt(document.createTextNode(pGroup).data);
    this.vDataObject = pDataObject;

    let parent = document.createTextNode(pParent).data;
    if (parent && parent !== '0') {
      parent = hashKey(parent).toString();
    }

    this.vParent = parent;

    this.vOpen = (this.vGroup == 2) ? true : parseInt(document.createTextNode(pOpen).data) === 1;
    this.vDepend = new Array();
    this.vDependType = new Array();
    this.vCaption = document.createTextNode(pCaption).data;
    this.vDuration = pDuration || '';
    this.vBarText = pBarText || '';
    this.vLevel = 0;
    this.vNumKid = 0;
    this.vWeight = 0;
    this.vVisible = true;
    this.vSortIdx = 0;
    this.vToDelete = false;

    this.vNotes = document.createElement('span');
    this.vNotes.className = 'gTaskNotes';
    if (pNotes != null) {
      this.vNotes.innerHTML = pNotes;
      stripUnwanted(this.vNotes);
    }

    if (pStart != null && pStart != '') {
      this.vStart = (pStart instanceof Date) ? pStart : parseDateStr(document.createTextNode(pStart).data, this.vGantt.getDateInputFormat());
      this.vGroupMinStart = this.vStart;
    }

    if (pEnd != null && pEnd != '') {
      this.vEnd = (pEnd instanceof Date) ? pEnd : parseDateStr(document.createTextNode(pEnd).data, this.vGantt.getDateInputFormat());
      this.vGroupMinEnd = this.vEnd;
    }

    if (pPlanStart != null && pPlanStart != '') {
      this.vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : parseDateStr(document.createTextNode(pPlanStart).data, this.vGantt.getDateInputFormat());
      this.vGroupMinPlanStart = this.vPlanStart;
    }

    if (pPlanEnd != null && pPlanEnd != '') {
      this.vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : parseDateStr(document.createTextNode(pPlanEnd).data, this.vGantt.getDateInputFormat());
      this.vGroupMinPlanEnd = this.vPlanEnd;
    }

    if (pDepend != null) {
      let vDependStr = pDepend + '';
      let vDepList = vDependStr.split(',');
      let n = vDepList.length;

      for (let k = 0; k < n; k++) {
        if (vDepList[k].toUpperCase().endsWith('SS')) {
          this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
          this.vDependType[k] = 'SS';
        } else if (vDepList[k].toUpperCase().endsWith('FF')) {
          this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
          this.vDependType[k] = 'FF';
        } else if (vDepList[k].toUpperCase().endsWith('SF')) {
          this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
          this.vDependType[k] = 'SF';
        } else if (vDepList[k].toUpperCase().endsWith('FS')) {
          this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
          this.vDependType[k] = 'FS';
        } else {
          this.vDepend[k] = vDepList[k];
          this.vDependType[k] = 'FS';
        }

        if (this.vDepend[k]) {
          this.vDepend[k] = hashKey(this.vDepend[k]).toString();
        }
      }
    }

  }

  getID() {
    return this.vID;
  };

  getOriginalID() {
    return this._id;
  };

  getGantt() {
    return this.vGantt;
  }

  getName() {
    return this.vName;
  };

  getStart() {
    return this.vStart ?? this.vPlanStart ?? new Date();
  };

  getStartVar() {
    return this.vStart;
  };

  getEnd() {
    if (this.vEnd) return this.vEnd;
    else if (this.vPlanEnd) return this.vPlanEnd;

    else if (this.vStart && this.vDuration) {
      let date = new Date(this.vStart);
      const vUnits = this.vDuration.split(' ');
      const value = parseInt(vUnits[0]);
      switch (vUnits[1]) {
        case 'hour':
          date.setMinutes(date.getMinutes() + (value * 60));
          break;
        case 'day':
          date.setMinutes(date.getMinutes() + (value * 60 * 24));
          break;
        case 'week':
          date.setMinutes(date.getMinutes() + (value * 60 * 24 * 7));
          break;
        case 'month':
          date.setMonth(date.getMonth() + (value));
          break;
        case 'quarter':
          date.setMonth(date.getMonth() + (value * 3));
          break;
      }
      return date;
    } else return new Date();
  };

  getEndVar() {
    return this.vEnd;
  };

  getPlanStart() {
    return this.vPlanStart ?? this.vStart;
  };

  getPlanEnd() {
    return this.vPlanEnd ?? this.vEnd;
  };

  getCost() {
    return this.vCost;
  };

  getGroupMinStart() {
    return this.vGroupMinStart;
  };

  getGroupMinEnd() {
    return this.vGroupMinEnd;
  };

  getGroupMinPlanStart() {
    return this.vGroupMinPlanStart;
  };

  getGroupMinPlanEnd() {
    return this.vGroupMinPlanEnd;
  };

  getClass() {
    return this.vClass;
  };

  getLink() {
    return this.vLink;
  };

  getMile() {
    return this.vMile;
  };

  getDepend() {
    return this.vDepend ?? null;
  };

  getDataObject() {
    return this.vDataObject;
  };

  getDepType() {
    return this.vDependType ?? null;
  };

  getCaption() {
    return this.vCaption ?? '';
  };

  getResource() {
    return this.vRes ?? '\u00A0';
  };

  getCompVal() {
    return this.vComp ?? this.vCompVal ?? 0;
  };

  getCompStr() {
    if (this.vComp) return this.vComp + '%'; else if (this.vCompVal) return this.vCompVal + '%'; else return '';
  };

  getCompRestStr() {
    if (this.vComp) return (100 - this.vComp) + '%'; else if (this.vCompVal) return (100 - this.vCompVal) + '%'; else return '';
  };

  getNotes() {
    return this.vNotes;
  };

  getSortIdx() {
    return this.vSortIdx;
  };

  getToDelete() {
    return this.vToDelete;
  };

  getDuration(pFormat, pLang) {
    if (this.vMile) {
      this.vDuration = '-';
    } else if (!this.vEnd && !this.vStart && this.vPlanStart && this.vPlanEnd) {
      return this.calculateVDuration(pFormat, pLang, this.getPlanStart(), this.getPlanEnd());
    } else if (!this.vEnd && this.vDuration) {
      return this.vDuration;
    } else {
      this.vDuration = this.calculateVDuration(pFormat, pLang, this.getStart(), this.getEnd());
    }
    return this.vDuration;
  };

  calculateVDuration(pFormat, pLang, start, end) {
    let vUnits = null;
    switch (pFormat) {
      case 'week':
        vUnits = 'day';
        break;
      case 'month':
        vUnits = 'week';
        break;
      case 'quarter':
        vUnits = 'month';
        break;
      default:
        vUnits = pFormat;
        break;
    }

    // let vTaskEnd = new Date(this.getEnd().getTime());
    // if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
    //   vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
    // }
    // let tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;

    const hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    let tmpPer;
    switch (vUnits) {
      case 'hour':
        tmpPer = Math.round(hours);
        this.vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']);
        break;
      case 'day':
        tmpPer = Math.round(hours / 24);
        this.vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']);
        break;
      case 'week':
        tmpPer = Math.round(hours / 24 / 7);
        this.vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']);
        break;
      case 'month':
        tmpPer = Math.round(hours / 24 / 7 / 30);
        this.vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']);
        break;
      case 'quarter':
        tmpPer = Math.round(hours / 24 / 7 / 30 / 3);
        this.vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']);
        break;
    }
    return this.vDuration;
  }

  getBarText() {
    return this.vBarText;
  };

  getParent() {
    return this.vParent;
  };

  getGroup() {
    return this.vGroup;
  };

  getOpen() {
    return this.vOpen;
  };

  getLevel() {
    return this.vLevel;
  };

  getNumKids() {
    return this.vNumKid;
  };

  getWeight() {
    return this.vWeight;
  };

  getStartX() {
    return this.x1;
  };

  getStartY() {
    return this.y1;
  };

  getEndX() {
    return this.x2;
  };

  getEndY() {
    return this.y2;
  };

  getVisible() {
    return this.vVisible;
  };

  getParItem() {
    return this.vParItem;
  };

  getCellDiv() {
    return this.vCellDiv;
  };

  getBarDiv() {
    return this.vBarDiv;
  };

  getTaskDiv() {
    return this.vTaskDiv;
  };

  getPlanTaskDiv() {
    return this.vPlanTaskDiv;
  };

  getChildRow() {
    return this.vChildRow;
  };

  getListChildRow() {
    return this.vListChildRow;
  };

  getGroupSpan() {
    return this.vGroupSpan;
  };

  setName(pName) {
    this.vName = pName;
  };

  setNotes(pNotes) {
    this.vNotes = pNotes;
  };

  setClass(pClass) {
    this.vClass = pClass;
  };

  setCost(pCost) {
    this.vCost = pCost;
  };

  setResource(pRes) {
    this.vRes = pRes;
  };

  setDuration(pDuration) {
    this.vDuration = pDuration;
  };

  setDataObject(pDataObject) {
    this.vDataObject = pDataObject;
  };

  setStart(pStart) {
    if (pStart instanceof Date) {
      this.vStart = pStart;
    } else {
      const temp = new Date(pStart);
      if (temp instanceof Date && !isNaN(temp.valueOf())) {
        this.vStart = temp;
      }
    }
  };

  setEnd(pEnd) {
    if (pEnd instanceof Date) {
      this.vEnd = pEnd;
    } else {
      const temp = new Date(pEnd);
      if (temp instanceof Date && !isNaN(temp.valueOf())) {
        this.vEnd = temp;
      }
    }
  };

  setPlanStart(pPlanStart) {
    if (pPlanStart instanceof Date) this.vPlanStart = pPlanStart;
    else this.vPlanStart = new Date(pPlanStart);
  };

  setPlanEnd(pPlanEnd) {
    if (pPlanEnd instanceof Date) this.vPlanEnd = pPlanEnd;
    else this.vPlanEnd = new Date(pPlanEnd);
  };

  setGroupMinStart(pStart) {
    if (pStart instanceof Date) this.vGroupMinStart = pStart;
  };

  setGroupMinEnd(pEnd) {
    if (pEnd instanceof Date) this.vGroupMinEnd = pEnd;
  };

  setLevel(pLevel) {
    this.vLevel = parseInt(document.createTextNode(pLevel).data);
  };

  setNumKid(pNumKid) {
    this.vNumKid = parseInt(document.createTextNode(pNumKid).data);
  };

  setWeight(pWeight) {
    this.vWeight = parseInt(document.createTextNode(pWeight).data);
  };

  setCompVal(pCompVal) {
    this.vCompVal = parseFloat(document.createTextNode(pCompVal).data);
  };

  setComp(pComp) {
    this.vComp = parseInt(document.createTextNode(pComp).data);
  };

  setStartX(pX) {
    this.x1 = parseInt(document.createTextNode(pX).data);
  };

  setStartY(pY) {
    this.y1 = parseInt(document.createTextNode(pY).data);
  };

  setEndX(pX) {
    this.x2 = parseInt(document.createTextNode(pX).data);
  };

  setEndY(pY) {
    this.y2 = parseInt(document.createTextNode(pY).data);
  };

  setOpen(pOpen) {
    this.vOpen = parseInt(document.createTextNode(pOpen).data) === 1;
  };

  setVisible(pVisible) {
    this.vVisible = parseInt(document.createTextNode(pVisible).data) === 1;
  };

  setSortIdx(pSortIdx) {
    this.vSortIdx = parseInt(document.createTextNode(pSortIdx).data);
  };

  setToDelete(pToDelete) {
    if (pToDelete) this.vToDelete = true; else this.vToDelete = false;
  };

  setParItem(pParItem) {
    if (pParItem) this.vParItem = pParItem;
  };

  setCellDiv(pCellDiv) {
    if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement) this.vCellDiv = pCellDiv;
  }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7
  setGroup(pGroup) {
    if (pGroup === true || pGroup === 'true') {
      this.vGroup = 1;
    } else if (pGroup === false || pGroup === 'false') {
      this.vGroup = 0;
    } else {
      this.vGroup = parseInt(document.createTextNode(pGroup).data);
    }
  };

  setBarText(pBarText) {
    if (pBarText) this.vBarText = pBarText;
  };

  setBarDiv(pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vBarDiv = pDiv;
  };

  setTaskDiv(pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vTaskDiv = pDiv;
  };

  setPlanTaskDiv(pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vPlanTaskDiv = pDiv;
  };

  setChildRow(pRow) {
    if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement) this.vChildRow = pRow;
  };

  setListChildRow(pRow) {
    if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement) this.vListChildRow = pRow;
  };

  setGroupSpan(pSpan) {
    if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement) this.vGroupSpan = pSpan;
  };

  getAllData() {
    return {
      pID: this.vID,
      pName: this.vName,
      pStart: this.vStart,
      pEnd: this.vEnd,
      pPlanStart: this.vPlanStart,
      pPlanEnd: this.vPlanEnd,
      pGroupMinStart: this.vGroupMinStart,
      pGroupMinEnd: this.vGroupMinEnd,
      pClass: this.vClass,
      pLink: this.vLink,
      pMile: this.vMile,
      pRes: this.vRes,
      pComp: this.vComp,
      pCost: this.vCost,
      pGroup: this.vGroup,
      pDataObjec: this.vDataObject
    };
  }
}

/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */
export const createTaskInfo = function (pTask, templateStrOrFn = null) {
  let vTmpDiv;
  let vTaskInfoBox = document.createDocumentFragment();
  let vTaskInfo = newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');

  const setupTemplate = template => {
    vTaskInfo.innerHTML = '';
    if (template) {
      let allData = pTask.getAllData();
      internalProperties.forEach(key => {
        let lang;
        if (internalPropertiesLang[key]) {
          lang = this.vLangs[this.vLang][internalPropertiesLang[key]];
        }

        if (!lang) {
          lang = key;
        }
        const val = allData[key];

        template = template.replace(`{{${key}}}`, val);
        if (lang) {
          template = template.replace(`{{Lang:${key}}}`, lang);
        } else {
          template = template.replace(`{{Lang:${key}}}`, key);
        }
      });
      newNode(vTaskInfo, 'span', null, 'gTtTemplate', template);
    } else {
      newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
      if (this.vShowTaskInfoStartDate == 1) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['startdate'] + ': ');
        newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getStart(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
      }
      if (this.vShowTaskInfoEndDate == 1) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['enddate'] + ': ');
        newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getEnd(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
      }
      if (this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTId');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['duration'] + ': ');
        newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(this.vFormat, this.vLangs[this.vLang]));
      }
      if (this.vShowTaskInfoComp == 1) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['completion'] + ': ');
        newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
      }
      if (this.vShowTaskInfoRes == 1) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['resource'] + ': ');
        newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
      }
      if (this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
        let vTmpNode = newNode(vTmpDiv, 'span', null, 'gTaskLabel');
        vTmpNode = newNode(vTmpNode, 'a', null, 'gTaskText', this.vLangs[this.vLang]['moreinfo']);
        vTmpNode.setAttribute('href', pTask.getLink());
      }
      if (this.vShowTaskInfoNotes == 1) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['notes'] + ': ');
        if (pTask.getNotes()) vTmpDiv.appendChild(pTask.getNotes());
      }
    }
  };

  let callback;
  if (typeof templateStrOrFn === 'function') {
    callback = () => {
      const strOrPromise = templateStrOrFn(pTask);
      if (!strOrPromise || typeof strOrPromise === 'string') {
        setupTemplate(strOrPromise);
      } else if (strOrPromise.then) {
        setupTemplate(this.vLangs[this.vLang]['tooltipLoading'] || this.vLangs['en']['tooltipLoading']);
        return strOrPromise.then(setupTemplate);
      }
    };
  } else {
    setupTemplate(templateStrOrFn);
  }

  return {component: vTaskInfoBox, callback};
};


export const AddTaskItem = function (value) {
  let vExists = false;
  for (let i = 0; i < this.vTaskList.length; i++) {
    if (this.vTaskList[i].vID == value.vID) {
      i = this.vTaskList.length;
      vExists = true;
    }
  }
  if (!vExists) {
    this.vTaskList.push(value);
    this.vProcessNeeded = true;
  }
};

export const AddTaskItemObject = function (object) {
  if (!object.pGantt) {
    object.pGantt = this;
  }
  return this.AddTaskItem(TaskItemObject(object));
};

export const RemoveTaskItem = function (pID) {
  // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
  for (let i = 0; i < this.vTaskList.length; i++) {
    if (this.vTaskList[i].vID == pID) this.vTaskList[i].setToDelete(true);
    else if (this.vTaskList[i].getParent() == pID) this.RemoveTaskItem(this.vTaskList[i].vID);
  }
  this.vProcessNeeded = true;
};

export const ClearTasks = function () {
  this.vTaskList.map(task => this.RemoveTaskItem(task.vID));
  this.vProcessNeeded = true;
};


// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
export const processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug = false) {
  let vMinDate = null;
  let vMaxDate = null;
  let vMinPlanDate = null;
  let vMaxPlanDate = null;
  let vVisible = pOpen;
  let vCurItem = null;
  let vCompSum = 0;
  let vMinSet = 0;
  let vMaxSet = 0;
  let vMinPlanSet = 0;
  let vMaxPlanSet = 0;
  let vNumKid = 0;
  let vWeight = 0;
  let vLevel = pLevel;
  let vList = pList;
  let vComb = false;
  let i = 0;

  for (i = 0; i < pList.length; i++) {
    if (pList[i].getToDelete()) {
      pList.splice(i, 1);
      i--;
    }
    if (i >= 0 && pList[i].vID == pID) vCurItem = pList[i];
  }

  for (i = 0; i < pList.length; i++) {
    if (pList[i].getParent() == pID) {
      vVisible = pOpen;
      pList[i].setParItem(vCurItem);
      pList[i].setVisible(vVisible);
      if (vVisible == 1 && pList[i].getOpen() == 0) vVisible = 0;

      if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) {//remove milestones owned by combined groups
        pList.splice(i, 1);
        i--;
        continue;
      }

      pList[i].setLevel(vLevel);

      if (pList[i].getGroup()) {
        if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) pList[i].setGroup(2);
        processRows(vList, pList[i].vID, i, vLevel + 1, vVisible, 0);
      }

      if (pList[i].getStartVar() && (vMinSet == 0 || pList[i].getStartVar() < vMinDate)) {
        vMinDate = pList[i].getStartVar();
        vMinSet = 1;
      }

      if (pList[i].getEndVar() && (vMaxSet == 0 || pList[i].getEndVar() > vMaxDate)) {
        vMaxDate = pList[i].getEndVar();
        vMaxSet = 1;
      }

      if (vMinPlanSet == 0 || pList[i].getPlanStart() < vMinPlanDate) {
        vMinPlanDate = pList[i].getPlanStart();
        vMinPlanSet = 1;
      }

      if (vMaxPlanSet == 0 || pList[i].getPlanEnd() > vMaxPlanDate) {
        vMaxPlanDate = pList[i].getPlanEnd();
        vMaxPlanSet = 1;
      }

      vNumKid++;
      vWeight += pList[i].getEnd() - pList[i].getStart() + 1;
      vCompSum += pList[i].getCompVal() * (pList[i].getEnd() - pList[i].getStart() + 1);
      pList[i].setSortIdx(i * pList.length);
    }
  }

  if (pRow >= 0) {
    if (pList[pRow].getGroupMinStart() != null && pList[pRow].getGroupMinStart() < vMinDate) {
      vMinDate = pList[pRow].getGroupMinStart();
    }

    if (pList[pRow].getGroupMinEnd() != null && pList[pRow].getGroupMinEnd() > vMaxDate) {
      vMaxDate = pList[pRow].getGroupMinEnd();
    }
    if (vMinDate) {
      pList[pRow].setStart(vMinDate);
    }
    if (vMaxDate) {
      pList[pRow].setEnd(vMaxDate);
    }

    if (pList[pRow].getGroupMinPlanStart() != null && pList[pRow].getGroupMinPlanStart() < vMinPlanDate) {
      vMinPlanDate = pList[pRow].getGroupMinPlanStart();
    }

    if (pList[pRow].getGroupMinPlanEnd() != null && pList[pRow].getGroupMinPlanEnd() > vMaxPlanDate) {
      vMaxPlanDate = pList[pRow].getGroupMinPlanEnd();
    }
    if (vMinPlanDate) {
      pList[pRow].setPlanStart(vMinPlanDate);
    }
    if (vMaxPlanDate) {
      pList[pRow].setPlanEnd(vMaxPlanDate);
    }
    pList[pRow].setNumKid(vNumKid);
    pList[pRow].setWeight(vWeight);
    pList[pRow].setCompVal(Math.ceil(vCompSum / vWeight));
  }

  if (pID == 0 && pUseSort == 1) {
    let bd;
    if (vDebug) {
      bd = new Date();
      console.info('before afterTasks', bd);
    }
    sortTasks(pList, 0, 0);
    if (vDebug) {
      const ad = new Date();
      console.info('after afterTasks', ad, (ad.getTime() - bd.getTime()));
    }
    pList.sort(function (a, b) {
      return a.getSortIdx() - b.getSortIdx();
    });
  }
  if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
  {
    for (i = 0; i < pList.length; i++) {
      if (pList[i].getGroup() == 2) {
        vComb = true;
        let bd;
        if (vDebug) {
          bd = new Date();
          console.info('before sortTasks', bd);
        }
        sortTasks(pList, pList[i].vID, pList[i].getSortIdx() + 1);
        if (vDebug) {
          const ad = new Date();
          console.info('after sortTasks', ad, (ad.getTime() - bd.getTime()));
        }
      }
    }
    if (vComb == true) pList.sort(function (a, b) {
      return a.getSortIdx() - b.getSortIdx();
    });
  }
};
