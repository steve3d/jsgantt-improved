import { GanttChart } from './chart';
import { formatDateStr, parseDateStr } from './utils/date_utils';
import { newNode } from './utils/draw_utils';
import { hashString, internalProperties, internalPropertiesLang, stripUnwanted } from './utils/general_utils';

export interface TaskItemObject {
  pID: number;
  pName: string;
  pStart: string | Date;
  pEnd: string | Date;
  pPlanStart: string | Date;
  pPlanEnd: string | Date;
  pClass?: string;
  pLink?: string;
  pMile?: boolean;
  pRes?: string;
  pComp?: number;
  pGroup?: boolean;
  pParent?: number;
  pOpen?: boolean;
  pDepend?: string;
  pCaption?: string;
  pCost?: number;
  pNotes?: string;
  pSortIdx?: number;
  pUserData?: any;
}

// function to open window to display task link
export function taskLink (pRef, pWidth, pHeight) {
  let vWidth, vHeight;
  if (pWidth) vWidth = pWidth; else vWidth = 400;
  if (pHeight) vHeight = pHeight; else vHeight = 400;

  window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
}

export function sortTasks (pList, pID, pIdx) {
  console.log('sorting', pList, pID, pIdx);
  if (pList.length < 2) {
    return pIdx;
  }
  let sortIdx = pIdx;
  let sortArr = [];

  for (let i = 0; i < pList.length; i++) {
    if (pList[i].vParent == pID) sortArr.push(pList[i]);
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
        pList[i].vSortIdx = sortIdx++;
        sortIdx = sortTasks(pList, pList[i].vID, sortIdx);
      }
    }
  }
  return sortIdx;
}

export class TaskItem {
  vStart: Date = null;
  vEnd: Date = null;
  vPlanStart: Date = null;
  vPlanEnd: Date = null;
  vGroupMinStart: Date = null;
  vGroupMinEnd: Date = null;
  vGroupMinPlanStart: Date = null;
  vGroupMinPlanEnd: Date = null;
  vCompVal: number;

  vDepend: any[] = null;
  vDependType: any[] = null;

  vLevel = 0;
  vNumKid = 0;
  vWeight = 0;
  vVisible = true;
  vSortIdx = 0;
  vToDelete = false;
  x1;
  y1;
  x2;
  y2;
  vNotes: HTMLElement;
  vParItem: TaskItem;
  vCellDiv: HTMLDivElement;
  vBarDiv: HTMLDivElement;
  vTaskDiv: HTMLDivElement;
  vPlanTaskDiv: HTMLDivElement;
  vListChildRow: HTMLElement;
  vChildRow: HTMLElement;
  vGroupSpan: HTMLSpanElement;
  vUserData: any;

  constructor(public vID: number,
              public vName: string,
              pStart: Date | string,
              pEnd: Date | string,
              public vClass: string,
              public vLink: string,
              public vMile: boolean,
              public vRes: string,
              public vComp: number,
              public vGroup: number,
              public vParent: number,
              public vOpen: boolean,
              pDepend: string,
              public vCaption: string,
              pNotes: string,
              public vGantt: GanttChart,
              public vCost?: number,
              pPlanStart?: Date | string,
              pPlanEnd?: Date | string,
              public vDuration?: string,
              public vBarText?: string,
              public vDataObject?: any) {

    this.vID = hashString(this.vID.toString());

    if (this.vParent && this.vParent !== 0) {
      this.vParent = hashString(this.vParent.toString());
    }

    this.vOpen = (this.vGroup == 2) ? true : this.vOpen;
    this.vDepend = [];
    this.vDependType = [];


    this.vNotes = document.createElement('span');
    this.vNotes.className = 'gTaskNotes';
    if (pNotes != null) {
      this.vNotes.innerHTML = pNotes;
      stripUnwanted(this.vNotes);
    }

    if (pStart != null && pStart != '') {
      this.vStart = (pStart instanceof Date) ? pStart : parseDateStr(pStart, this.vGantt.getDateInputFormat());
      this.vGroupMinStart = this.vStart;
    }

    if (pEnd != null && pEnd != '') {
      this.vEnd = (pEnd instanceof Date) ? pEnd : parseDateStr(pEnd, this.vGantt.getDateInputFormat());
      this.vGroupMinEnd = this.vEnd;
    }

    if (pPlanStart != null && pPlanStart != '') {
      this.vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : parseDateStr(pPlanStart, this.vGantt.getDateInputFormat());
      this.vGroupMinPlanStart = this.vPlanStart;
    }

    if (pPlanEnd != null && pPlanEnd != '') {
      this.vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : parseDateStr(pPlanEnd, this.vGantt.getDateInputFormat());
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
          this.vDepend[k] = hashString(this.vDepend[k]).toString();
        }
      }
    }

  }

  getStart() {
    return this.vStart ?? this.vPlanStart ?? new Date();
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

  getPlanStart() {
    return this.vPlanStart ?? this.vStart;
  };

  getPlanEnd() {
    return this.vPlanEnd ?? this.vEnd;
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

  getDuration(pFormat: string, pLang): string {
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

  private calculateVDuration(pFormat: string, pLang, start: Date, end: Date): string {
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

  setStart(pStart: Date | string) {
    if (pStart instanceof Date) {
      this.vStart = pStart;
    } else {
      const temp = new Date(pStart);
      if (temp instanceof Date && !isNaN(temp.valueOf())) {
        this.vStart = temp;
      }
    }
  };

  setEnd(pEnd: Date | string) {
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

  setPlanEnd(pPlanEnd: Date | string) {
    if (pPlanEnd instanceof Date) this.vPlanEnd = pPlanEnd;
    else this.vPlanEnd = new Date(pPlanEnd);
  };

  setGroup(pGroup: 0 | 1 | 2) {
    if (pGroup === 1) {
      this.vGroup = 1;
    } else if (pGroup === 0) {
      this.vGroup = 0;
    } else {
      this.vGroup = pGroup;
    }
  };

  get allData() {
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
      pDataObject: this.vDataObject,
      pUserData: this.vUserData
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
export function createTaskInfo (pTask, templateStrOrFn = null) {
  let vTmpDiv;
  let vTaskInfoBox = document.createDocumentFragment();
  let vTaskInfo = newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');

  const setupTemplate = template => {
    vTaskInfo.innerHTML = '';
    if (template) {
      let allData = pTask.allData;
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
      newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.vName);
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
      if (this.vShowTaskInfoDur == 1 && !pTask.vMile) {
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
        newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.vRes);
      }
      if (this.vShowTaskInfoLink == 1 && pTask.vLink != '') {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
        let vTmpNode = newNode(vTmpDiv, 'span', null, 'gTaskLabel');
        vTmpNode = newNode(vTmpNode, 'a', null, 'gTaskText', this.vLangs[this.vLang]['moreinfo']);
        vTmpNode.setAttribute('href', pTask.vLink);
      }
      if (this.vShowTaskInfoNotes == 1) {
        vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
        newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['notes'] + ': ');
        if (pTask.vNotes) vTmpDiv.appendChild(pTask.vNotes);
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
}

// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
export function processRows (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug = false) {
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
    if (pList[i].vToDelete) {
      pList.splice(i, 1);
      i--;
    }
    if (i >= 0 && pList[i].vID == pID) vCurItem = pList[i];
  }

  for (i = 0; i < pList.length; i++) {
    if (pList[i].vParent == pID) {
      vVisible = pOpen;
      pList[i].vParItem = vCurItem;
      pList[i].vVisible = vVisible;
      if (vVisible == 1 && !pList[i].vOpen) vVisible = 0;

      if (pList[i].vMile && pList[i].vParItem && pList[i].vParItem.vGroup == 2) {//remove milestones owned by combined groups
        pList.splice(i, 1);
        i--;
        continue;
      }

      pList[i].vLevel = vLevel;

      if (pList[i].vGroup) {
        if (pList[i].vParItem && pList[i].vParItem.vGroup == 2) pList[i].setGroup(2);
        processRows(vList, pList[i].vID, i, vLevel + 1, vVisible, 0);
      }

      if (pList[i].vStart && (vMinSet == 0 || pList[i].vStart < vMinDate)) {
        vMinDate = pList[i].vStart;
        vMinSet = 1;
      }

      if (pList[i].vEnd && (vMaxSet == 0 || pList[i].vEnd > vMaxDate)) {
        vMaxDate = pList[i].vEnd;
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
      pList[i].vSortIdx = i * pList.length;
    }
  }

  if (pRow >= 0) {
    if (pList[pRow].vGroupMinStart != null && pList[pRow].vGroupMinStart < vMinDate) {
      vMinDate = pList[pRow].vGroupMinStart;
    }

    if (pList[pRow].vGroupMinEnd != null && pList[pRow].vGroupMinEnd > vMaxDate) {
      vMaxDate = pList[pRow].vGroupMinEnd;
    }
    if (vMinDate) {
      pList[pRow].setStart(vMinDate);
    }
    if (vMaxDate) {
      pList[pRow].setEnd(vMaxDate);
    }

    if (pList[pRow].vGroupMinPlanStart != null && pList[pRow].vGroupMinPlanStart < vMinPlanDate) {
      vMinPlanDate = pList[pRow].vGroupMinPlanStart;
    }

    if (pList[pRow].vGroupMinPlanEnd != null && pList[pRow].vGroupMinPlanEnd > vMaxPlanDate) {
      vMaxPlanDate = pList[pRow].vGroupMinPlanEnd;
    }
    if (vMinPlanDate) {
      pList[pRow].setPlanStart(vMinPlanDate);
    }
    if (vMaxPlanDate) {
      pList[pRow].setPlanEnd(vMaxPlanDate);
    }
    pList[pRow].vNumKid = vNumKid;
    pList[pRow].vWeight = vWeight;
    pList[pRow].vCompVal = Math.ceil(vCompSum / vWeight);
  }

  if (!pID && pUseSort) {
    let bd;
    if (vDebug) {
      bd = new Date();
      console.info('before afterTasks', bd);
    }
    // sortTasks(pList, 0, 0);
    if (vDebug) {
      const ad = new Date();
      console.info('after afterTasks', ad, (ad.getTime() - bd.getTime()));
    }
    pList.sort(function (a, b) {
      return a.vSortIdx - b.vSortIdx;
    });
  }
  if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
  {
    for (i = 0; i < pList.length; i++) {
      if (pList[i].vGroup == 2) {
        vComb = true;
        let bd;
        if (vDebug) {
          bd = new Date();
          console.info('before sortTasks', bd);
        }
        // sortTasks(pList, pList[i].vID, pList[i].vSortIdx + 1);
        if (vDebug) {
          const ad = new Date();
          console.info('after sortTasks', ad, (ad.getTime() - bd.getTime()));
        }
      }
    }
    if (vComb == true) pList.sort(function (a, b) {
      return a.vSortIdx - b.vSortIdx;
    });
  }
}
