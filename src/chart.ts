import { ChartOptions } from './chart-options';
import { COLUMN_ORDER, draw_bottom, draw_header, draw_task_headings } from './draw_columns';
import {
    addListenerClickCell,
    addListenerDependencies,
    addListenerInputCell,
    addTooltipListeners,
    syncScroll,
    updateGridHeaderWidth
} from './events';
import { cn, en, GanttLanguage } from './lang';
import { processRows, TaskItem, TaskItemObject } from './task';
import {
    coerceDate,
    formatDateStr,
    getMaxDate,
    getMinDate,
    parseDateFormatStr,
    parseDateStr
} from './utils/date_utils';
import { makeInput, newNode } from './utils/draw_utils';
import {
    calculateCurrentDateOffset,
    findObj,
    getOffset,
    getScrollbarWidth,
    internalProperties,
    internalPropertiesLang,
    makeRequest
} from './utils/general_utils';

export class GanttChart {

    vContainerDiv: HTMLDivElement;
    vDivId: string = null;
    vUseFade = true;
    vUseMove = true;
    vUseRowHlt = true;
    vUseToolTip = true;
    vUseSort = true;
    vUseSingleCell = 25000;
    vShowRes = true;
    vShowDur = true;
    vShowComp = true;
    vShowStartDate = true;
    vShowEndDate = true;
    vShowPlanStartDate = false;
    vShowPlanEndDate = false;
    vShowCost = false;
    vShowAddEntries = false;
    vShowEndWeekDate = true;
    vShowWeekends = true;
    vShowTaskInfoRes = true;
    vShowTaskInfoDur = true;
    vShowTaskInfoComp = true;
    vShowTaskInfoStartDate = true;
    vShowTaskInfoEndDate = true;
    vShowTaskInfoNotes = true;
    vShowTaskInfoLink = false;

    vShowDeps = true;
    vTotalHeight: string;
    vWorkingDays: Record<number, boolean> = {
        0: true, // sunday
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true
    };

    vEventClickCollapse: (e: TaskItem) => void;
    vEventClickRow: (e: TaskItem) => void;
    vEvents: Record<string, (e?) => void>;
    vEventsChange: Record<string, (e?) => void>;
    vResources: string[];
    vAdditionalHeaders = {};
    vColumnOrder: string[] = COLUMN_ORDER;
    vEditable = false;
    vDebug = false;
    vShowSelector = new Array('top');
    vDateInputFormat = 'yyyy-mm-dd';
    vDateTaskTableDisplayFormat = parseDateFormatStr('dd/mm/yyyy');
    vDateTaskDisplayFormat = parseDateFormatStr('dd month yyyy');
    vHourMajorDateDisplayFormat = parseDateFormatStr('day dd month yyyy');
    vHourMinorDateDisplayFormat = parseDateFormatStr('HH');
    vDayMajorDateDisplayFormat = parseDateFormatStr('dd/mm/yyyy');
    vDayMinorDateDisplayFormat = parseDateFormatStr('dd');
    vWeekMajorDateDisplayFormat = parseDateFormatStr('yyyy');
    vWeekMinorDateDisplayFormat = parseDateFormatStr('dd/mm');
    vMonthMajorDateDisplayFormat = parseDateFormatStr('yyyy');
    vMonthMinorDateDisplayFormat = parseDateFormatStr('mon');
    vQuarterMajorDateDisplayFormat = parseDateFormatStr('yyyy');
    vQuarterMinorDateDisplayFormat = parseDateFormatStr('qq');
    vUseFullYear = parseDateFormatStr('dd/mm/yyyy');
    vCaptionType: 'Caption' | 'Resource' | 'Duration' | 'Complete';
    vDepId = 1;
    vTaskList: TaskItem[] = [];
    vFormatArr = ['hour', 'day', 'week', 'month', 'quarter'];
    vMonthDaysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    vProcessNeeded = true;
    vMinGpLen = 8;
    vScrollTo: Date | string;
    vHourColWidth = 18;
    vDayColWidth = 18;
    vWeekColWidth = 36;
    vMonthColWidth = 36;
    vQuarterColWidth = 18;
    vRowHeight = 20;
    vTodayPx = -1;
    vLangs = { en: en, cn: cn };
    vChartBody: HTMLElement;
    vChartHead: HTMLElement;
    vListBody: HTMLElement;
    vChartTable: HTMLTableElement;
    vLines: HTMLElement;
    vTimer = 20;
    vTool: any;
    vTooltipDelay = 1500;
    vTooltipTemplate = null;
    vMinDate: Date = null;
    vMaxDate: Date = null;
    vLineOptions: any;

    vExpandedIcon = 'fa-plus-circle';
    vCollapsedIcon = 'fa-minus-circle';

    chartRowDateToX: any;

    private taskIdMap: Map<number, TaskItem> = new Map<number, TaskItem>();
    private currentLang: string;
    private scrollPos: { x: number, y: number };

    constructor(public vDiv: HTMLElement, public vFormat: 'hour' | 'day' | 'week' | 'month' | 'quarter') {
        this.vDivId = vDiv?.id ?? null;
        this.vLang = this.vLangs.hasOwnProperty(navigator.language) ? navigator.language : 'en';

        window.addEventListener('resize', (e) => {
            if(this.vChartHead && this.vChartBody) {
                this.vChartHead.scrollLeft = this.vChartBody.scrollLeft;
            }

            if(this.vListBody && this.vChartBody) {
                this.vListBody.scrollTop = this.vChartBody.scrollTop;
            }
        });
    }

    get vLang(): string {
        return this.currentLang;
    }

    set vLang(val: string) {
        if (this.vLangs.hasOwnProperty(val))
            this.currentLang = val;
    }

    destroy() {
        if(this.vTool instanceof HTMLElement) {
            this.vTool.remove();
        }
    }

    /**
     * SETTERS
     */
    setOptions(options: ChartOptions) {
        Object.keys(options)
            .forEach(key => {
                if (options.hasOwnProperty(key)) {
                    switch (key) {
                        case 'vDateTaskTableDisplayFormat':
                        case 'vDateTaskDisplayFormat':
                        case 'vHourMajorDateDisplayFormat':
                        case 'vHourMinorDateDisplayFormat':
                        case 'vDayMajorDateDisplayFormat':
                        case 'vDayMinorDateDisplayFormat':
                        case 'vWeekMajorDateDisplayFormat':
                        case 'vWeekMinorDateDisplayFormat':
                        case 'vMonthMajorDateDisplayFormat':
                        case 'vMonthMinorDateDisplayFormat':
                        case 'vQuarterMajorDateDisplayFormat':
                        case 'vQuarterMinorDateDisplayFormat':
                            this[key] = parseDateFormatStr(options[key]);
                            break;
                        default:
                            this[key] = options[key];
                    }
                }
            });
    }


    setFormatArr() {
        let vValidFormats = 'hour day week month quarter';
        this.vFormatArr = [];
        for (let i = 0, j = 0; i < arguments.length; i++) {
            if (vValidFormats.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vFormatArr[j++] = arguments[i].toLowerCase();
                let vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidFormats = vValidFormats.replace(vRegExp, '');
            }
        }
    };

    setShowRes(pVal: boolean) {
        this.vShowRes = pVal;
    };

    setShowDur(pVal: boolean) {
        this.vShowDur = pVal;
    };

    setShowComp(pVal: boolean) {
        this.vShowComp = pVal;
    };

    setShowStartDate(pVal: boolean) {
        this.vShowStartDate = pVal;
    };

    setShowEndDate(pVal: boolean) {
        this.vShowEndDate = pVal;
    };

    setShowPlanStartDate(pVal: boolean) {
        this.vShowPlanStartDate = pVal;
    };

    setShowPlanEndDate(pVal: boolean) {
        this.vShowPlanEndDate = pVal;
    };

    setShowCost(pVal: boolean) {
        this.vShowCost = pVal;
    };

    setShowAddEntries(pVal: boolean) {
        this.vShowAddEntries = pVal;
    };

    setShowTaskInfoRes(pVal: boolean) {
        this.vShowTaskInfoRes = pVal;
    };

    setShowTaskInfoDur(pVal: boolean) {
        this.vShowTaskInfoDur = pVal;
    };

    setShowTaskInfoComp(pVal: boolean) {
        this.vShowTaskInfoComp = pVal;
    };

    setShowTaskInfoStartDate(pVal: boolean) {
        this.vShowTaskInfoStartDate = pVal;
    };

    setShowTaskInfoEndDate(pVal: boolean) {
        this.vShowTaskInfoEndDate = pVal;
    };

    setShowTaskInfoNotes(pVal: boolean) {
        this.vShowTaskInfoNotes = pVal;
    };

    setShowTaskInfoLink(pVal: boolean) {
        this.vShowTaskInfoLink = pVal;
    };

    setShowEndWeekDate(pVal: boolean) {
        this.vShowEndWeekDate = pVal;
    };

    setShowWeekends(pVal: boolean) {
        this.vShowWeekends = pVal;
    };

    setShowSelector() {
        let vValidSelectors = 'top bottom';
        this.vShowSelector = [];
        for (let i = 0, j = 0; i < arguments.length; i++) {
            if (vValidSelectors.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vShowSelector[j++] = arguments[i].toLowerCase();
                let vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidSelectors = vValidSelectors.replace(vRegExp, '');
            }
        }
    };

    setShowDeps(pVal: boolean) {
        this.vShowDeps = pVal;
    };

    setDateInputFormat(pVal: string) {
        this.vDateInputFormat = pVal;
    };

    setDateTaskTableDisplayFormat(pVal: string) {
        this.vDateTaskTableDisplayFormat = parseDateFormatStr(pVal);
    };

    setDateTaskDisplayFormat(pVal: string) {
        this.vDateTaskDisplayFormat = parseDateFormatStr(pVal);
    };

    setHourMajorDateDisplayFormat(pVal: string) {
        this.vHourMajorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setHourMinorDateDisplayFormat(pVal: string) {
        this.vHourMinorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setDayMajorDateDisplayFormat(pVal: string) {
        this.vDayMajorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setDayMinorDateDisplayFormat(pVal: string) {
        this.vDayMinorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setWeekMajorDateDisplayFormat(pVal: string) {
        this.vWeekMajorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setWeekMinorDateDisplayFormat(pVal: string) {
        this.vWeekMinorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setMonthMajorDateDisplayFormat(pVal: string) {
        this.vMonthMajorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setMonthMinorDateDisplayFormat(pVal: string) {
        this.vMonthMinorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setQuarterMajorDateDisplayFormat(pVal: string) {
        this.vQuarterMajorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setQuarterMinorDateDisplayFormat(pVal: string) {
        this.vQuarterMinorDateDisplayFormat = parseDateFormatStr(pVal);
    };

    setCaptionType(pType) {
        this.vCaptionType = pType;
    };

    setFormat(pFormat: 'hour' | 'day' | 'week' | 'month' | 'quarter') {
        this.vFormat = pFormat;
        this.Draw();
    };

    setWorkingDays(workingDays: Record<number, boolean>) {
        this.vWorkingDays = workingDays;
    };

    setMinGpLen(pMinGpLen: number) {
        this.vMinGpLen = pMinGpLen;
    };

    setScrollTo(pDate) {
        this.vScrollTo = pDate;
    };

    setHourColWidth(pWidth: number) {
        this.vHourColWidth = pWidth;
    };

    setDayColWidth(pWidth: number) {
        this.vDayColWidth = pWidth;
    };

    setWeekColWidth(pWidth: number) {
        this.vWeekColWidth = pWidth;
    };

    setMonthColWidth(pWidth: number) {
        this.vMonthColWidth = pWidth;
    };

    setQuarterColWidth(pWidth: number) {
        this.vQuarterColWidth = pWidth;
    };

    setRowHeight(pHeight: number) {
        this.vRowHeight = pHeight;
    };

    setLang(pLang: string) {
        if (this.vLangs?.hasOwnProperty(pLang)) this.vLang = pLang;
    };

    setChartBody(pDiv: HTMLElement) {
        if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vChartBody = pDiv;
    };

    setChartHead(pDiv: HTMLElement) {
        if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vChartHead = pDiv;
    };

    setListBody(pDiv: HTMLElement) {
        if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vListBody = pDiv;
    };

    setChartTable(pTable) {
        if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement) this.vChartTable = pTable;
    };

    setLines(pDiv: HTMLElement) {
        if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vLines = pDiv;
    };

    setLineOptions(lineOptions) {
        this.vLineOptions = lineOptions;
    };

    setTimer(pVal) {
        this.vTimer = pVal * 1;
    };

    setTooltipDelay(pVal) {
        this.vTooltipDelay = pVal * 1;
    };

    setTooltipTemplate(pVal) {
        this.vTooltipTemplate = pVal;
    };

    setMinDate(pVal) {
        this.vMinDate = pVal;
    };

    setMaxDate(pVal) {
        this.vMaxDate = pVal;
    };

    setTotalHeight(pVal) {
        this.vTotalHeight = pVal;
    };

    addLang(pLang: string, pVals: GanttLanguage) {
        if (!this.vLangs.hasOwnProperty(pLang)) {
            const en = this.vLangs['en'] ?? {};
            this.vLangs[pLang] = Object.keys(en)
                .reduce((acc, key) => {
                    if (en.hasOwnProperty(key)) {
                        acc[key] = pVals[key] ?? en[key];
                    }

                    return acc;
                }, {}) as GanttLanguage;
        }
    };

    // EVENTS
    setEvents(pEvents) {
        this.vEvents = pEvents;
    };

    setEventsChange(pEventsChange) {
        this.vEventsChange = pEventsChange;
    };

    setEventClickRow(fn) {
        this.vEventClickRow = fn;
    };

    setEventClickCollapse(fn) {
        this.vEventClickCollapse = fn;
    };

    setResources(resources) {
        this.vResources = resources;
    };

    setAdditionalHeaders(headers) {
        this.vAdditionalHeaders = headers;
    };

    setColumnOrder(order) {
        this.vColumnOrder = order;
    };

    setEditable(editable) {
        this.vEditable = editable;
    }

    setDebug(debug) {
        this.vDebug = debug;
    }

    /**
     * GETTERS
     */
    getDivId() {
        return this.vDivId;
    };

    getUseFade() {
        return this.vUseFade;
    };

    getUseMove() {
        return this.vUseMove;
    };

    getUseRowHlt() {
        return this.vUseRowHlt;
    };

    getUseToolTip() {
        return this.vUseToolTip;
    };

    getUseSort() {
        return this.vUseSort;
    };

    getUseSingleCell() {
        return this.vUseSingleCell;
    };

    getFormatArr() {
        return this.vFormatArr;
    };

    getShowRes() {
        return this.vShowRes;
    };

    getShowDur() {
        return this.vShowDur;
    };

    getShowComp() {
        return this.vShowComp;
    };

    getShowStartDate() {
        return this.vShowStartDate;
    };

    getShowEndDate() {
        return this.vShowEndDate;
    };

    getShowPlanStartDate() {
        return this.vShowPlanStartDate;
    };

    getShowPlanEndDate() {
        return this.vShowPlanEndDate;
    };

    getShowCost() {
        return this.vShowCost;
    };

    getShowAddEntries() {
        return this.vShowAddEntries;
    };

    getShowTaskInfoRes() {
        return this.vShowTaskInfoRes;
    };

    getShowTaskInfoDur() {
        return this.vShowTaskInfoDur;
    };

    getShowTaskInfoComp() {
        return this.vShowTaskInfoComp;
    };

    getShowTaskInfoStartDate() {
        return this.vShowTaskInfoStartDate;
    };

    getShowTaskInfoEndDate() {
        return this.vShowTaskInfoEndDate;
    };

    getShowTaskInfoNotes() {
        return this.vShowTaskInfoNotes;
    };

    getShowTaskInfoLink() {
        return this.vShowTaskInfoLink;
    };

    getShowEndWeekDate() {
        return this.vShowEndWeekDate;
    };

    getShowWeekends() {
        return this.vShowWeekends;
    };

    getShowSelector() {
        return this.vShowSelector;
    };

    getShowDeps() {
        return this.vShowDeps;
    };

    getDateInputFormat() {
        return this.vDateInputFormat;
    };

    getDateTaskTableDisplayFormat() {
        return this.vDateTaskTableDisplayFormat;
    };

    getDateTaskDisplayFormat() {
        return this.vDateTaskDisplayFormat;
    };

    getHourMajorDateDisplayFormat() {
        return this.vHourMajorDateDisplayFormat;
    };

    getHourMinorDateDisplayFormat() {
        return this.vHourMinorDateDisplayFormat;
    };

    getDayMajorDateDisplayFormat() {
        return this.vDayMajorDateDisplayFormat;
    };

    getDayMinorDateDisplayFormat() {
        return this.vDayMinorDateDisplayFormat;
    };

    getWeekMajorDateDisplayFormat() {
        return this.vWeekMajorDateDisplayFormat;
    };

    getWeekMinorDateDisplayFormat() {
        return this.vWeekMinorDateDisplayFormat;
    };

    getMonthMajorDateDisplayFormat() {
        return this.vMonthMajorDateDisplayFormat;
    };

    getMonthMinorDateDisplayFormat() {
        return this.vMonthMinorDateDisplayFormat;
    };

    getQuarterMajorDateDisplayFormat() {
        return this.vQuarterMajorDateDisplayFormat;
    };

    getQuarterMinorDateDisplayFormat() {
        return this.vQuarterMinorDateDisplayFormat;
    };

    getCaptionType() {
        return this.vCaptionType;
    };

    getMinGpLen() {
        return this.vMinGpLen;
    };

    getScrollTo() {
        return this.vScrollTo;
    };

    getHourColWidth() {
        return this.vHourColWidth;
    };

    getDayColWidth() {
        return this.vDayColWidth;
    };

    getWeekColWidth() {
        return this.vWeekColWidth;
    };

    getMonthColWidth() {
        return this.vMonthColWidth;
    };

    getQuarterColWidth() {
        return this.vQuarterColWidth;
    };

    getRowHeight() {
        return this.vRowHeight;
    };

    getChartBody() {
        return this.vChartBody;
    };

    getChartHead() {
        return this.vChartHead;
    };

    getListBody() {
        return this.vListBody;
    };

    getChartTable() {
        return this.vChartTable;
    };

    getLines() {
        return this.vLines;
    };

    getTimer() {
        return this.vTimer;
    };

    getMinDate() {
        return this.vMinDate;
    };

    getMaxDate() {
        return this.vMaxDate;
    };

    getTooltipDelay() {
        return this.vTooltipDelay;
    };

    getList() {
        return this.vTaskList;
    };

    //EVENTS
    getEventsClickCell() {
        return this.vEvents;
    };

    getEventsChange() {
        return this.vEventsChange;
    };

    getEventClickRow() {
        return this.vEventClickRow;
    };

    getEventClickCollapse() {
        return this.vEventClickCollapse;
    };

    getResources() {
        return this.vResources;
    };

    getAdditionalHeaders() {
        return this.vAdditionalHeaders;
    };

    getColumnOrder() {
        return this.vColumnOrder || COLUMN_ORDER;
    };

    AddTaskItem(value: TaskItem) {

        if(!this.taskIdMap.has(value.vID)) {
            value.vGantt = this;
            this.vTaskList.push(value);
            this.taskIdMap[value.vID] = value;
            this.vProcessNeeded = true;
        }
    };

    AddTaskItemObject(object: TaskItemObject) {
        const item = new TaskItem(
            object.pID, // public vID: number,
            object.pName, // public vName: string,
            object.pStart, // pStart: Date | string,
            object.pEnd, // pEnd: Date | string,
            object.pClass, // public vClass: string,
            object.pLink, // public vLink: string,
            object.pMile, // public vMile: boolean,
            object.pRes, // public pRes,
            object.pComp,// public vComp: number,
            object.pGroup ? 1 : 0, // public vGroup: number,
            object.pParent, // public vParent: number,
            object.pOpen, // public vOpen: boolean,
            object.pDepend, // pDepend: string,
            object.pCaption, // public vCaption: string,
            object.pNotes, // pNotes: string,
            this,
            object.pCost, // public vCost?: number,
            object.pPlanStart, // pPlanStart?: Date | string,
            object.pPlanEnd, // pPlanEnd?: Date | string,
            null, // public vDuration?: string,
            null, // public vBarText?: string,
            object// public vDataObject?: any
        );


        item.vSortIdx = object.pSortIdx ?? 0;
        item.vUserData = object.pUserData;

        this.AddTaskItem(item);
    };


    CalcTaskXY() {
        let vID;
        let vList = this.getList();
        let vBarDiv;
        let vTaskDiv;
        let vParDiv;
        let vLeft, vTop, vWidth;
        let vHeight = Math.floor((this.getRowHeight() / 2));

        for (let i = 0; i < vList.length; i++) {
            vID = vList[i].vID;
            vBarDiv = vList[i].vBarDiv;
            vTaskDiv = vList[i].vTaskDiv;
            if ((vList[i].vParItem && vList[i].vParItem.vGroup == 2)) {
                vParDiv = vList[i].vParItem.vChildRow;
            } else vParDiv = vList[i].vChildRow;

            if (vBarDiv) {
                vList[i].x1 = vBarDiv.offsetLeft + 1;
                vList[i].y1 = vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1;
                vList[i].x2 = vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1;
                vList[i].y2 = vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1;
            }
        }
    };

    sLine(x1: number, y1: number, x2: number, y2: number, pClass: string) {
        let vLeft = Math.min(x1, x2);
        let vTop = Math.min(y1, y2);
        let vWid = Math.abs(x2 - x1) + 1;
        let vHgt = Math.abs(y2 - y1) + 1;

        let vTmpDiv = document.createElement('div');
        vTmpDiv.id = this.vDivId + 'line' + this.vDepId++;
        vTmpDiv.style.position = 'absolute';
        vTmpDiv.style.overflow = 'hidden';
        vTmpDiv.style.zIndex = '0';
        vTmpDiv.style.left = vLeft + 'px';
        vTmpDiv.style.top = vTop + 'px';
        vTmpDiv.style.width = vWid + 'px';
        vTmpDiv.style.height = vHgt + 'px';

        vTmpDiv.style.visibility = 'visible';

        if (vWid == 1) vTmpDiv.className = 'glinev';
        else vTmpDiv.className = 'glineh';

        if (pClass) vTmpDiv.className += ' ' + pClass;

        this.getLines().appendChild(vTmpDiv);

        if (this.vEvents?.onLineDraw && typeof this.vEvents.onLineDraw === 'function') {
            this.vEvents.onLineDraw(vTmpDiv);
        }

        return vTmpDiv;
    };

    mouseOver(pObj1, pObj2) {
        if (this.getUseRowHlt()) {
            pObj1.className += ' gitemhighlight';
            pObj2.className += ' gitemhighlight';
        }
    }

    mouseOut(pObj1, pObj2) {
        if (this.getUseRowHlt()) {
            pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
            pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
        }
    };

    addListener(eventName, handler, control) {
        // Check if control is a string
        if (control === String(control)) control = findObj(control);

        if (control.addEventListener) //Standard W3C
        {
            return control.addEventListener(eventName, handler, false);
        } else if (control.attachEvent) //IExplore
        {
            return control.attachEvent('on' + eventName, handler);
        } else {
            return false;
        }
    }

    removeListener(eventName, handler, control) {
        // Check if control is a string
        if (control === String(control)) control = findObj(control);
        if (control.removeEventListener) {
            //Standard W3C
            return control.removeEventListener(eventName, handler, false);
        } else if (control.detachEvent) {
            //IExplore
            return control.attachEvent('on' + eventName, handler);
        } else {
            return false;
        }
    };

    createTaskInfo(pTask: TaskItem, templateStrOrFn = null) {
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
                if (this.vShowTaskInfoStartDate) {
                    vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
                    newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['startdate'] + ': ');
                    newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getStart(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
                }
                if (this.vShowTaskInfoEndDate) {
                    vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
                    newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['enddate'] + ': ');
                    newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getEnd(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
                }
                if (this.vShowTaskInfoDur) {
                    vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTId');
                    newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['duration'] + ': ');
                    newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(this.vFormat, this.vLangs[this.vLang]));
                }
                if (this.vShowTaskInfoComp &&pTask.vComp) {
                    vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
                    newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['completion'] + ': ');
                    newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
                }
                if (this.vShowTaskInfoRes && pTask.vRes) {
                    vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
                    newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['resource'] + ': ');
                    newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.vRes);
                }
                if (this.vShowTaskInfoLink && pTask.vLink) {
                    vTmpDiv = newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
                    let vTmpNode = newNode(vTmpDiv, 'span', null, 'gTaskLabel');
                    vTmpNode = newNode(vTmpNode, 'a', null, 'gTaskText', this.vLangs[this.vLang]['moreinfo']);
                    vTmpNode.setAttribute('href', pTask.vLink);
                }
                if (this.vShowTaskInfoNotes && pTask.vNotes) {
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

        return { component: vTaskInfoBox, callback };
    };

    RemoveTaskItem(pID) {
        // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
        for (let i = 0; i < this.vTaskList.length; i++) {
            if (this.vTaskList[i].vID == pID) this.vTaskList[i].vToDelete = true;
            else if (this.vTaskList[i].vParent == pID) this.RemoveTaskItem(this.vTaskList[i].vID);
        }
        this.vProcessNeeded = true;
    }

    ClearTasks() {
        this.vTaskList.map(task => this.RemoveTaskItem(task.vID));
        this.vProcessNeeded = true;
    };

    getXMLProject() {
        let vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
        for (let i = 0; i < this.vTaskList.length; i++) {
            vProject += this.getXMLTask(i, true);
        }
        vProject += '</project>';
        return vProject;
    };

    getXMLTask(pID, pIdx) {
        let i = 0;
        let vIdx = -1;
        let vTask = '';
        let vOutFrmt = parseDateFormatStr(this.getDateInputFormat() + ' HH:MI:SS');
        if (pIdx === true) vIdx = pID;
        else {
            for (i = 0; i < this.vTaskList.length; i++) {
                if (this.vTaskList[i].vID == pID) {
                    vIdx = i;
                    break;
                }
            }
        }
        if (vIdx >= 0 && vIdx < this.vTaskList.length) {
            /* Simplest way to return case sensitive node names is to just build a string */
            vTask = '<task>';
            vTask += '<pID>' + this.vTaskList[vIdx].vID + '</pID>';
            vTask += '<pName>' + this.vTaskList[vIdx].vName + '</pName>';
            vTask += '<pStart>' + formatDateStr(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
            vTask += '<pEnd>' + formatDateStr(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
            vTask += '<pPlanStart>' + formatDateStr(this.vTaskList[vIdx].getPlanStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanStart>';
            vTask += '<pPlanEnd>' + formatDateStr(this.vTaskList[vIdx].getPlanEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanEnd>';
            vTask += '<pDuration>' + this.vTaskList[vIdx].getDuration(this.vFormat, this.vLang) + '</pDuration>';
            vTask += '<pClass>' + this.vTaskList[vIdx].vClass + '</pClass>';
            vTask += '<pLink>' + this.vTaskList[vIdx].vLink + '</pLink>';
            vTask += '<pMile>' + this.vTaskList[vIdx].vMile + '</pMile>';
            if (this.vTaskList[vIdx].vRes != '\u00A0') vTask += '<pRes>' + this.vTaskList[vIdx].vRes + '</pRes>';
            vTask += '<pComp>' + this.vTaskList[vIdx].getCompVal() + '</pComp>';
            vTask += '<pCost>' + this.vTaskList[vIdx].vCost + '</pCost>';
            vTask += '<pGroup>' + this.vTaskList[vIdx].vGroup + '</pGroup>';
            vTask += '<pParent>' + this.vTaskList[vIdx].vParent + '</pParent>';
            vTask += '<pOpen>' + this.vTaskList[vIdx].vOpen + '</pOpen>';
            vTask += '<pDepend>';
            let vDepList = this.vTaskList[vIdx].vDepend;
            for (i = 0; i < vDepList.length; i++) {
                if (i > 0) vTask += ',';
                if (vDepList[i] > 0) vTask += vDepList[i] + this.vTaskList[vIdx].vDependType[i];
            }
            vTask += '</pDepend>';
            vTask += '<pCaption>' + this.vTaskList[vIdx].vCaption + '</pCaption>';

            let vTmpFrag = document.createDocumentFragment();
            let vTmpDiv = newNode(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].vNotes.innerHTML);
            vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
            vTask += '</task>';
        }
        return vTask;
    };

    drawDependency(x1, y1, x2, y2, pType, pClass) {
        let vDir = 1;
        let vBend = false;
        let vShort = 4;
        let vRow = Math.floor(this.getRowHeight() / 2);

        if (y2 < y1) vRow *= -1;

        switch (pType) {
            case 'SF':
                vShort *= -1;
                if (x1 - 10 <= x2 && y1 != y2) vBend = true;
                vDir = -1;
                break;
            case 'SS':
                if (x1 < x2) vShort *= -1;
                else vShort = x2 - x1 - (2 * vShort);
                break;
            case 'FF':
                if (x1 <= x2) vShort = x2 - x1 + (2 * vShort);
                vDir = -1;
                break;
            default:
                if (x1 + 10 >= x2 && y1 != y2) vBend = true;
                break;
        }

        if (vBend) {
            this.sLine(x1, y1, x1 + vShort, y1, pClass);
            this.sLine(x1 + vShort, y1, x1 + vShort, y2 - vRow, pClass);
            this.sLine(x1 + vShort, y2 - vRow, x2 - (vShort * 2), y2 - vRow, pClass);
            this.sLine(x2 - (vShort * 2), y2 - vRow, x2 - (vShort * 2), y2, pClass);
            this.sLine(x2 - (vShort * 2), y2, x2 - vDir, y2, pClass);
        } else if (y1 != y2) {
            this.sLine(x1, y1, x1 + vShort, y1, pClass);
            this.sLine(x1 + vShort, y1, x1 + vShort, y2, pClass);
            this.sLine(x1 + vShort, y2, x2 - vDir, y2, pClass);
        } else this.sLine(x1, y1, x2 - vDir, y2, pClass);

        let vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
        vTmpDiv.style.width = '0px';
        vTmpDiv.style.height = '0px';
    }

    DrawDependencies() {
        if (this.getShowDeps()) {

            this.CalcTaskXY(); //First recalculate the x,y
            this.clearDependencies();

            let vList = this.getList();
            for (let i = 0; i < vList.length; i++) {
                let vDepend = vList[i].vDepend;
                let vDependType = vList[i].vDependType;
                let n = vDepend.length;

                if (n > 0 && vList[i].vVisible) {
                    for (let k = 0; k < n; k++) {
                        let vTask = this.getArrayLocationByID(vDepend[k]);
                        if (vTask >= 0 && vList[vTask].vGroup != 2) {
                            if (vList[vTask].vVisible) {
                                this.debugInfo(`init drawDependency `, vList[vTask].vID, new Date());
                                var cssClass = 'gDepId' + vList[vTask].vID +
                                    ' ' + 'gDepNextId' + vList[i].vID;

                                var dependedData = vList[vTask].vDataObject;
                                var nextDependedData = vList[i].vDataObject;
                                if (dependedData && dependedData.pID && nextDependedData && nextDependedData.pID) {
                                    cssClass += ' gDepDataId' + dependedData.pID + ' ' + 'gDepNextDataId' + nextDependedData.pID;
                                }

                                if (vDependType[k] == 'SS') this.drawDependency(vList[vTask].x1 - 1, vList[vTask].y1, vList[i].x1 - 1, vList[i].y1, 'SS', cssClass + ' gDepSS');
                                else if (vDependType[k] == 'FF') this.drawDependency(vList[vTask].x2, vList[vTask].y2, vList[i].x2, vList[i].y2, 'FF', cssClass + ' gDepFF');
                                else if (vDependType[k] == 'SF') this.drawDependency(vList[vTask].x1 - 1, vList[vTask].y1, vList[i].x2, vList[i].y2, 'SF', cssClass + ' gDepSF');
                                else if (vDependType[k] == 'FS') this.drawDependency(vList[vTask].x2, vList[vTask].y2, vList[i].x1 - 1, vList[i].y1, 'FS', cssClass + ' gDepFS');
                            }
                        }
                    }
                }
            }
        }
        // draw the current date line
        if (this.vTodayPx >= 0) {
            this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
        }
    };

    getArrayLocationByID(pId) {
        let vList = this.getList();
        for (let i = 0; i < vList.length; i++) {
            if (vList[i].vID == pId)
                return i;
        }
        return -1;
    };

    drawSelector(pPos) {
        let vOutput = document.createDocumentFragment();
        let vDisplay = false;

        for (let i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
            if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase()) vDisplay = true;
        }

        if (vDisplay) {
            let vTmpDiv = newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');

            const vFormatArr = this.vFormatArr.map(f => f.toLowerCase());

            if (vFormatArr.includes('hour'))
                newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour'])
                    .addEventListener('click', () => this.setFormat('hour'));

            if (vFormatArr.includes('day'))
                newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day'])
                    .addEventListener('click', () => this.setFormat('day'));

            if (vFormatArr.includes('week'))
                newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week'])
                    .addEventListener('click', () => this.setFormat('week'));

            if (vFormatArr.includes('month'))
                newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month'])
                    .addEventListener('click', () => this.setFormat('month'));

            if (vFormatArr.includes('quarter'))
                newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter'])
                    .addEventListener('click', () => this.setFormat('quarter'));

        } else {
            newNode(vOutput, 'div', null, 'gselector');
        }
        return vOutput;
    };


    clearDependencies() {
        let parent = this.getLines();
        if (this.vEventsChange?.line && typeof this.vEventsChange.line === 'function') {
            this.removeListener('click', this.vEventsChange.line, parent);
            this.addListener('click', this.vEventsChange.line, parent);
        }
        while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
        this.vDepId = 1;
    };

    drawListHead(vLeftHeader) {
        let vTmpDiv = newNode(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
        const gListLbl = vTmpDiv;
        this.setListBody(vTmpDiv);
        let vTmpTab = newNode(vTmpDiv, 'table', null, 'gtasktableh');
        let vTmpTBody = newNode(vTmpTab, 'tbody');
        let vTmpRow = newNode(vTmpTBody, 'tr');
        newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
        let vTmpCell = newNode(vTmpRow, 'td', null, 'gspanning gtaskname', null, null, null, null, this.getColumnOrder().length + 1);
        vTmpCell.appendChild(this.drawSelector('top'));

        vTmpRow = newNode(vTmpTBody, 'tr');
        newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
        newNode(vTmpRow, 'td', null, 'gtaskname', '\u00A0');

        this.getColumnOrder().forEach(column => {
            if (this[column] == 1 || column === 'vAdditionalHeaders') {
                draw_task_headings(column, vTmpRow, this.vLangs, this.vLang, this.vAdditionalHeaders, this.vEvents);
            }
        });
        return gListLbl;
    }

    drawListBody(vLeftHeader) {
        let vTmpContentTabOuterWrapper = newNode(vLeftHeader, 'div', null, 'gtasktableouterwrapper');
        let vTmpContentTabWrapper = newNode(vTmpContentTabOuterWrapper, 'div', null, 'gtasktablewrapper');
        vTmpContentTabWrapper.style.width = `calc(100% + ${getScrollbarWidth()}px)`;
        let vTmpContentTab = newNode(vTmpContentTabWrapper, 'table', null, 'gtasktable');
        let vTmpContentTBody = newNode(vTmpContentTab, 'tbody');
        let vNumRows = 0;
        for (let i = 0; i < this.vTaskList.length; i++) {
            let vBGColor;
            if (this.vTaskList[i].vGroup == 1) vBGColor = 'ggroupitem';
            else vBGColor = 'glineitem';

            let vID = this.vTaskList[i].vID;
            let vTmpRow: HTMLElement, vTmpCell: HTMLElement;
            if ((!(this.vTaskList[i].vParItem && this.vTaskList[i].vParItem.vGroup == 2)) || this.vTaskList[i].vGroup == 2) {
                if (!this.vTaskList[i].vVisible) vTmpRow = newNode(vTmpContentTBody, 'tr', this.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
                else vTmpRow = newNode(vTmpContentTBody, 'tr', this.vDivId + 'child_' + vID, 'gname ' + vBGColor);
                this.vTaskList[i].vListChildRow = vTmpRow;
                const vTaskHeaderCell = newNode(vTmpRow, 'td', null, 'gtasklist');
                const editableClass = this.vEditable ? 'gtaskname gtaskeditable' : 'gtaskname';
                vTmpCell = newNode(vTmpRow, 'td', null, editableClass);
                vTmpCell.classList.add(`gtaskname-level-${this.vTaskList[i].vLevel}`);
                if(this.vTaskList[i].vMile) vTmpCell.classList.add('gtaskname-milestone');

                let vCellContents = '';
                // for (let j = 1; j < this.vTaskList[i].vLevel; j++) {
                //     console.log(this.vTaskList[i].vName, this.vTaskList[i].vLevel);
                //     vCellContents += '\u00A0\u00A0\u00A0\u00A0';
                // }

                const task = this.vTaskList[i];
                const vEventClickRow = this.vEventClickRow;
                const vEventClickCollapse = this.vEventClickCollapse;
                vTmpRow.addEventListener('click', e => {
                    if ((e.target as HTMLElement).classList.contains('gfoldercollapse') === false) {
                        if (vEventClickRow && typeof vEventClickRow === "function") {
                            vEventClickRow(task);
                        }
                    } else {
                        if (vEventClickCollapse && typeof vEventClickCollapse === "function") {
                            vEventClickCollapse(task);
                        }
                    }
                })

                if (this.vTaskList[i].vGroup == 1) {
                    let vTmpDiv = newNode(vTmpCell, 'div', null, null, vCellContents);
                    let vTmpSpan = newNode(vTaskHeaderCell, 'span', this.vDivId + 'group_' + vID, 'gfoldercollapse fa', );
                    // (this.vTaskList[i].vOpen) ? '-' : '+'
                    vTmpSpan.classList.add(this.vTaskList[i].vOpen ? this.vCollapsedIcon : this.vExpandedIcon);
                    this.vTaskList[i].vGroupSpan = vTmpSpan;
                    vTmpSpan.addEventListener('click', () => {
                        this.folder(vID);
                        updateGridHeaderWidth(this);
                    });

                    const divTask = document.createElement('span');
                    divTask.innerHTML = this.vTaskList[i].vName;

                    vTmpDiv.appendChild(divTask);
                    // const text = makeInput(this.vTaskList[i].vName, this.vEditable, 'text');
                    // vTmpDiv.appendChild(document.createNode(text));
                    const callback = (task, e) => task.vName = e.target.value;
                    addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList, i, 'taskname', this.Draw.bind(this));
                    addListenerClickCell(vTmpDiv, this.vEvents, this.vTaskList[i], 'taskname');
                } else {
                    // vCellContents += '\u00A0\u00A0\u00A0\u00A0';
                    const text = makeInput(this.vTaskList[i].vName, this.vEditable, 'text');
                    let vTmpDiv = newNode(vTmpCell, 'div', null, null, vCellContents + text);
                    const callback = (task, e) => task.vName = e.target.value;
                    addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList, i, 'taskname', this.Draw.bind(this));
                    addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'taskname');
                }

                this.getColumnOrder().forEach(column => {
                    if (this[column] == 1 || column === 'vAdditionalHeaders') {
                        draw_header(column, i, vTmpRow, this.vTaskList, this.vEditable, this.vEventsChange, this.vEvents,
                            this.vDateTaskTableDisplayFormat, this.vAdditionalHeaders, this.vFormat, this.vLangs, this.vLang, this.vResources, this.Draw.bind(this));
                    }
                });

                vNumRows++;
            }
        }

        // Render no daa in the chart
        if (this.vTaskList.length == 0) {

            let totalColumns = this.getColumnOrder()
                .filter(column => this[column] == 1 || column === 'vAdditionalHeaders')
                .length;
            let vTmpRow = newNode(vTmpContentTBody, 'tr', this.vDivId + 'child_', 'gname ');
            // this.vTaskList[i].setListChildRow(vTmpRow);
            let vTmpCell = newNode(vTmpRow, 'td', null, 'gtasknolist', '', null, null, null, totalColumns);
            let vOutput = document.createDocumentFragment();
            newNode(vOutput, 'div', null, 'gtasknolist-label', this.vLangs[this.vLang]['nodata'] + '.');
            vTmpCell.appendChild(vOutput);
        }
        // DRAW the date format selector at bottom left.
        let vTmpRow = newNode(vTmpContentTBody, 'tr');
        newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
        let vTmpCell = newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
        vTmpCell.appendChild(this.drawSelector('bottom'));

        this.getColumnOrder().forEach(column => {
            if (this[column] == 1 || column === 'vAdditionalHeaders') {
                draw_bottom(column, vTmpRow, this.vAdditionalHeaders);
            }
        });

        // Add some white space so the vertical scroll distance should always be greater
        // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
        // newNode(vTmpDiv2, 'br');
        // newNode(vTmpDiv2, 'br');

        return {
            vNumRows,
            vTmpContentTabWrapper
        };
    }

    /**
     *
     * DRAW CHAR HEAD
     *
     */
    drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows) {
        let vRightHeader = document.createDocumentFragment();
        let vTmpDiv = newNode(vRightHeader, 'div', this.vDivId + 'gcharthead', 'gchartlbl gcontainercol');
        const gChartLbl = vTmpDiv;
        this.setChartHead(vTmpDiv);
        let vTmpTab = newNode(vTmpDiv, 'table', this.vDivId + 'chartTableh', 'gcharttableh');
        let vTmpTBody = newNode(vTmpTab, 'tbody');
        let vTmpRow = newNode(vTmpTBody, 'tr');

        let vTmpDate = new Date();
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
        if (this.vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
        else vTmpDate.setHours(0);
        vTmpDate.setMinutes(0);
        vTmpDate.setSeconds(0);
        vTmpDate.setMilliseconds(0);

        let vColSpan = 1;
        // Major Date Header
        while (vTmpDate.getTime() <= vMaxDate.getTime()) {
            let vHeaderCellClass = 'gmajorheading';
            let vCellContents = '';

            if (this.vFormat == 'day') {
                let colspan = 7;
                if (!this.vShowWeekends) {
                    vHeaderCellClass += ' headweekends';
                    colspan = 5;
                }

                let vTmpCell = newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, colspan);
                vCellContents += formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                vTmpDate.setDate(vTmpDate.getDate() + 6);

                if (this.vShowEndWeekDate) vCellContents += ' - ' + formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);

                newNode(vTmpCell, 'div', null, null, vCellContents, vColWidth * colspan);

                vTmpDate.setDate(vTmpDate.getDate() + 1);
            } else if (this.vFormat == 'week') {
                const vTmpCell = newNode(vTmpRow, 'td', null, vHeaderCellClass, null, vColWidth);
                newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                vTmpDate.setDate(vTmpDate.getDate() + 7);
            } else if (this.vFormat == 'month') {
                vColSpan = (12 - vTmpDate.getMonth());
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (11 - vMaxDate.getMonth());
                const vTmpCell = newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            } else if (this.vFormat == 'quarter') {
                vColSpan = (4 - Math.floor(vTmpDate.getMonth() / 3));
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (3 - Math.floor(vMaxDate.getMonth() / 3));
                const vTmpCell = newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            } else if (this.vFormat == 'hour') {
                vColSpan = (24 - vTmpDate.getHours());
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear() &&
                    vTmpDate.getMonth() == vMaxDate.getMonth() &&
                    vTmpDate.getDate() == vMaxDate.getDate()) vColSpan -= (23 - vMaxDate.getHours());
                const vTmpCell = newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }

        vTmpRow = newNode(vTmpTBody, 'tr', null, 'footerdays');

        // Minor Date header and Cell Rows
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
        if (this.vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
        let vNumCols: number = 0;

        while (vTmpDate.getTime() <= vMaxDate.getTime()) {
            let vMinorHeaderCellClass = 'gminorheading';

            if (this.vFormat == 'day') {
                if (vTmpDate.getDay() % 6 == 0) {
                    if (!this.vShowWeekends) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                        continue;
                    }
                    vMinorHeaderCellClass += 'wkend';
                }

                if (vTmpDate <= vMaxDate) {
                    const vTmpCell = newNode(vTmpRow, 'td', null, vMinorHeaderCellClass, null, vColWidth);
                    newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]));
                    vNumCols++;
                }

                vTmpDate.setDate(vTmpDate.getDate() + 1);
            } else if (this.vFormat == 'week') {
                if (vTmpDate <= vMaxDate) {
                    const vTmpCell = newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }

                vTmpDate.setDate(vTmpDate.getDate() + 7);
            } else if (this.vFormat == 'month') {
                if (vTmpDate <= vMaxDate) {
                    const vTmpCell = newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }

                vTmpDate.setDate(vTmpDate.getDate() + 1);

                while (vTmpDate.getDate() > 1) {
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            } else if (this.vFormat == 'quarter') {
                if (vTmpDate <= vMaxDate) {
                    const vTmpCell = newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }

                vTmpDate.setDate(vTmpDate.getDate() + 81);

                while (vTmpDate.getDate() > 1) vTmpDate.setDate(vTmpDate.getDate() + 1);
            } else if (this.vFormat == 'hour') {
                for (let i = vTmpDate.getHours(); i < 24; i++) {
                    vTmpDate.setHours(i);//works around daylight savings but may look a little odd on days where the clock goes forward
                    if (vTmpDate <= vMaxDate) {
                        const vTmpCell = newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                        newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                }
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        const vDateRow = vTmpRow;

        // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
        let vTaskLeftPx = (vNumCols * (vColWidth + 3));
        vTmpTab.style.width = vTaskLeftPx + 'px'; // Ensure that the headings has exactly the same width as the chart grid
        // const vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;
        let vSingleCell = false;

        if (this.vUseSingleCell !== 0 && this.vUseSingleCell < (vNumCols * vNumRows)) vSingleCell = true;

        newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);

        vTmpDiv = newNode(vRightHeader, 'div', null, 'glabelfooter');

        return { gChartLbl, vTaskLeftPx, vSingleCell, vDateRow, vRightHeader, vNumCols };
    }

    /**
     *
     * DRAW CHART BODY
     *
     */
    drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl,
                 vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow) {
        let vRightTable = document.createDocumentFragment();
        const vTmpDiv = newNode(vRightTable, 'div', this.vDivId + 'gchartbody', 'gchartgrid gcontainercol');
        this.setChartBody(vTmpDiv);
        const vTmpTab = newNode(vTmpDiv, 'table', this.vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
        this.setChartTable(vTmpTab);
        newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
        const vTmpTBody = newNode(vTmpTab, 'tbody');
        const vTmpTFoot = newNode(vTmpTab, 'tfoot');

        syncScroll([vTmpContentTabWrapper, vTmpDiv], 'scrollTop');
        syncScroll([gChartLbl, vTmpDiv], 'scrollLeft');
        syncScroll([vTmpContentTabWrapper, gListLbl], 'scrollLeft');

        // Draw each row

        let i = 0;
        let j = 0;
        this.debugInfo('before tasks loop', new Date());

        this.vTaskList?.forEach(vTask => {
            let curTaskStart = vTask.getStart() ? vTask.getStart() : vTask.getPlanStart();
            let curTaskEnd = vTask.getEnd() ? vTask.getEnd() : vTask.getPlanEnd();

            const vTaskLeftPx = getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends);
            const vTaskRightPx = getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends);

            let curTaskPlanStart, curTaskPlanEnd;

            curTaskPlanStart = vTask.getPlanStart();
            curTaskPlanEnd = vTask.getPlanEnd();
            let vTaskPlanLeftPx = 0;
            let vTaskPlanRightPx = 0;
            if (curTaskPlanStart && curTaskPlanEnd) {
                vTaskPlanLeftPx = getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends);
                vTaskPlanRightPx = getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends);
            }


            const vID = vTask.vID;
            let vComb = (vTask.vParItem && vTask.vParItem.vGroup == 2);
            let vCellFormat = '';
            let vTmpDiv = null;
            let vTmpItem = vTask;
            let vCaptClass = null;
            // set cell width only for first row because of table-layout:fixed
            let taskCellWidth = i === 0 ? vColWidth : null;
            if (vTask.vMile && !vComb) {
                let vTmpRow = newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, ((!vTask.vVisible) ? 'none' : null));
                vTask.vChildRow = vTmpRow;
                this.addThisRowListeners(vTask.vListChildRow, vTmpRow);

                const vTmpCell = newNode(vTmpRow, 'td', null, 'gtaskcell gtaskcellmile', null, vColWidth, null, null, null);

                vTmpDiv = newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                vTmpDiv = newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, vTaskLeftPx + vTaskRightPx - 6);

                vTask.vBarDiv = vTmpDiv;
                let vTmpDiv2 = newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, vTask.vClass, null, 12);
                vTask.vTaskDiv = vTmpDiv2;

                if (vTask.getCompVal() < 100)
                    vTmpDiv2.appendChild(document.createTextNode('\u25CA'));
                else {
                    vTmpDiv2 = newNode(vTmpDiv2, 'div', null, 'gmilediamond');
                    newNode(vTmpDiv2, 'div', null, 'gmdtop');
                    newNode(vTmpDiv2, 'div', null, 'gmdbottom');
                }

                vCaptClass = 'gmilecaption';
                if (!vSingleCell && !vComb) {
                    this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                }
            } else {
                let vTaskWidth = vTaskRightPx;

                // Draw Group Bar which has outer div with inner group div
                // and several small divs to left and right to create angled-end indicators
                if (vTask.vGroup) {
                    vTaskWidth = (vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2) ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
                    vTaskWidth = (vTaskWidth < this.vMinGpLen) ? this.vMinGpLen : vTaskWidth; // expand to show one end point

                    const vTmpRow = newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, ((vTask.vGroup == 2) ? 'glineitem gitem' : 'ggroupitem ggroup') + this.vFormat, null, null, null, ((!vTask.vVisible) ? 'none' : null));
                    vTask.vChildRow = vTmpRow;
                    this.addThisRowListeners(vTask.vListChildRow, vTmpRow);

                    const vTmpCell = newNode(vTmpRow, 'td', null, 'gtaskcell gtaskcellbar', null, vColWidth, null, null);

                    vTmpDiv = newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                    vTask.vCellDiv = vTmpDiv;
                    if (vTask.vGroup == 1) {
                        vTmpDiv = newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
                        vTask.vBarDiv = vTmpDiv;
                        const vTmpDiv2 = newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, vTask.vClass, null, vTaskWidth);
                        vTask.vTaskDiv = vTmpDiv2;

                        newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, vTask.vClass + 'complete', null, vTask.getCompStr());

                        newNode(vTmpDiv, 'div', null, vTask.vClass + 'endpointleft');
                        if (vTaskWidth >= this.vMinGpLen * 2) newNode(vTmpDiv, 'div', null, vTask.vClass + 'endpointright');

                        vCaptClass = 'ggroupcaption';
                    }

                    if (!vSingleCell && !vComb) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                } else {
                    vTaskWidth = (vTaskWidth <= 0) ? 1 : vTaskWidth;


                    /**
                     * DRAW THE BOXES FOR GANTT
                     */
                    let vTmpDivCell, vTmpRow;
                    if (vComb) {
                        vTmpDivCell = vTmpDiv = vTask.vParItem.vCellDiv;
                    } else {
                        // Draw Task Bar which has colored bar div
                        vTmpRow = newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'glineitem gitem' + this.vFormat, null, null, null, ((!vTask.vVisible) ? 'none' : null));
                        vTask.vChildRow = vTmpRow;
                        this.addThisRowListeners(vTask.vListChildRow, vTmpRow);

                        const vTmpCell = newNode(vTmpRow, 'td', null, 'gtaskcell gtaskcellcolorbar', null, taskCellWidth, null, null);
                        vTmpDivCell = vTmpDiv = newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                    }

                    // DRAW TASK BAR
                    vTmpDiv = newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
                    vTask.vBarDiv = vTmpDiv;
                    let vTmpDiv2;
                    if (vTask.vStart) {

                        // textbar
                        vTmpDiv2 = newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, vTask.vClass, null, vTaskWidth);
                        if (vTask.vBarText) {
                            newNode(vTmpDiv2, 'span', this.vDivId + 'tasktextbar_' + vID, 'textbar', vTask.vBarText, vTask.getCompRestStr());
                        }
                        vTask.vTaskDiv = vTmpDiv2;
                    }


                    // PLANNED
                    // If exist and one of them are different, show plan bar... show if there is no real vStart as well (just plan dates)
                    if (vTaskPlanLeftPx && ((vTaskPlanLeftPx != vTaskLeftPx || vTaskPlanRightPx != vTaskRightPx) || !vTask.vStart)) {
                        const vTmpPlanDiv = newNode(vTmpDivCell, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer gplan', null, vTaskPlanRightPx, vTaskPlanLeftPx);
                        const vTmpPlanDiv2 = newNode(vTmpPlanDiv, 'div', this.vDivId + 'taskbar_' + vID, vTask.vClass + ' gplan', null, vTaskPlanRightPx);
                        vTask.vPlanTaskDiv = vTmpPlanDiv2;
                    }

                    // and opaque completion div
                    if (vTmpDiv2) {
                        newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, vTask.vClass + 'complete', null, vTask.getCompStr());
                    }

                    // caption
                    if (vComb) vTmpItem = vTask.vParItem;
                    if (!vComb || (vComb && vTask.vParItem.getEnd() == vTask.getEnd())) vCaptClass = 'gcaption';

                    // Background cells
                    if (!vSingleCell && !vComb && vTmpRow) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
            }

            if (this.getCaptionType() && vCaptClass !== null) {
                let vCaptionStr: any;
                switch (this.getCaptionType()) {
                    case 'Caption':
                        vCaptionStr = vTmpItem.vCaption;
                        break;
                    case 'Resource':
                        vCaptionStr = vTmpItem.vRes;
                        break;
                    case 'Duration':
                        vCaptionStr = vTmpItem.getDuration(this.vFormat, this.vLangs[this.vLang]);
                        break;
                    case 'Complete':
                        vCaptionStr = vTmpItem.getCompStr();
                        break;
                }
                newNode(vTmpDiv, 'div', null, vCaptClass, vCaptionStr, 120, (vCaptClass == 'gmilecaption') ? 12 : 0);
            }

            // Add Task Info div for tooltip
            if (vTask.vTaskDiv && vTmpDiv) {
                vTask.vTaskDiv.addEventListener('click', () => this.vEventClickRow ? this.vEventClickRow(vTask) : 0);
                const vTmpDiv2 = newNode(vTmpDiv, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                const { component, callback } = this.createTaskInfo(vTask, this.vTooltipTemplate);
                vTmpDiv2.appendChild(component);
                addTooltipListeners(this, vTask.vTaskDiv, vTmpDiv2, callback);
            }
            // Add Plan Task Info div for tooltip
            if (vTask.vPlanTaskDiv && vTmpDiv) {
                vTask.vPlanTaskDiv.addEventListener('click', () => this.vEventClickRow ? this.vEventClickRow(vTask) : 0);
                const vTmpDiv2 = newNode(vTmpDiv, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                const { component, callback } = this.createTaskInfo(vTask, this.vTooltipTemplate);
                vTmpDiv2.appendChild(component);
                addTooltipListeners(this, vTask.vPlanTaskDiv, vTmpDiv2, callback);
            }
        });

        // Include the footer with the days/week/month...
        if (vSingleCell) {
            const vTmpTFootTRow = newNode(vTmpTFoot, 'tr');
            const vTmpTFootTCell = newNode(vTmpTFootTRow, 'td', null, null, null, '100%');
            const vTmpTFootTCellTable = newNode(vTmpTFootTCell, 'table', null, 'gcharttableh', null, '100%');
            const vTmpTFootTCellTableTBody = newNode(vTmpTFootTCellTable, 'tbody');
            vTmpTFootTCellTableTBody.appendChild(vDateRow.cloneNode(true));
        } else {
            vTmpTFoot.appendChild(vDateRow.cloneNode(true));
        }

        return { vRightTable };
    }

    drawColsChart(vNumCols, vTmpRow, taskCellWidth, pStartDate = null, pEndDate = null) {
        let columnCurrentDay = null;
        // Find the Current day cell to put a different class
        if (this.vShowWeekends !== false && pStartDate && pEndDate && (
            this.vFormat == 'day' || this.vFormat == 'week'
        )) {
            let curTaskStart = new Date(pStartDate.getTime());
            let curTaskEnd = new Date();
            let onePeriod = 3600000;
            if (this.vFormat == 'day') {
                onePeriod *= 24;
            } else if (this.vFormat == 'week') {
                onePeriod *= 24 * 7;
            }
            columnCurrentDay = Math.floor(calculateCurrentDateOffset(curTaskStart, curTaskEnd) / onePeriod) - 1;
        }

        for (let j = 0; j < vNumCols - 1; j++) {
            let vCellFormat = 'gtaskcell gtaskcellcols';
            if (this.vShowWeekends !== false && this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) {
                vCellFormat = 'gtaskcellwkend';
            }
            //When is the column is the current day/week,give a different class
            else if ((this.vFormat == 'week' || this.vFormat == 'day') && j === columnCurrentDay) {
                vCellFormat = 'gtaskcellcurrent';
            }
            newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0', taskCellWidth);
        }
    }

    /**
     *
     *
     * DRAWING PROCESS
     *
     *  vTaskRightPx,vTaskWidth,vTaskPlanLeftPx,vTaskPlanRightPx,vID
     */
    Draw() {
        let vMaxDate = new Date();
        let vMinDate = new Date();
        let vColWidth = 0;

        if (this.vEvents?.beforeDraw) {
            this.vEvents.beforeDraw();
        }

        let bd = new Date()

        this.debugInfo('before draw', bd);

        // Process all tasks, reset parent date and completion % if task list has altered
        if (this.vProcessNeeded) processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
        this.vProcessNeeded = false;

        // get overall min/max dates plus padding
        vMinDate = getMinDate(this.vTaskList, this.vFormat, this.getMinDate() && coerceDate(this.getMinDate()));
        vMaxDate = getMaxDate(this.vTaskList, this.vFormat, this.getMaxDate() && coerceDate(this.getMaxDate()));

        // Calculate chart width variables.
        if (this.vFormat == 'day') vColWidth = this.vDayColWidth;
        else if (this.vFormat == 'week') vColWidth = this.vWeekColWidth;
        else if (this.vFormat == 'month') vColWidth = this.vMonthColWidth;
        else if (this.vFormat == 'quarter') vColWidth = this.vQuarterColWidth;
        else if (this.vFormat == 'hour') vColWidth = this.vHourColWidth;

        // DRAW the Left-side of the chart (names, resources, comp%)
        let vLeftHeader = document.createDocumentFragment();


        /**
         * LIST HEAD
         */
        const gListLbl = this.drawListHead(vLeftHeader);


        /**
         * LIST BODY
         */
        const {
            vNumRows,
            vTmpContentTabWrapper
        } = this.drawListBody(vLeftHeader);


        /**
         * CHART HEAD
         */
        const {
            gChartLbl, vTaskLeftPx, vSingleCell, vRightHeader,
            vDateRow, vNumCols
        } = this.drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows);


        /**
         * CHART GRID
         */
        const { vRightTable } = this.drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl,
            vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow);

        let ad = new Date();
        this.debugInfo('after tasks loop', ad, (ad.getTime() - bd.getTime()));

        // MAIN VIEW: Appending all generated components to main view
        while (this.vDiv.hasChildNodes()) this.vDiv.removeChild(this.vDiv.firstChild);
        const vTmpDiv = this.vContainerDiv = newNode(this.vDiv, 'div', null, 'gchartcontainer');
        this.vContainerDiv.classList.add(`gchartformat-${this.vFormat}`);
        vTmpDiv.style.height = this.vTotalHeight;

        let leftvTmpDiv = newNode(vTmpDiv, 'div', null, 'gmain gmainleft');
        leftvTmpDiv.appendChild(vLeftHeader);
        // leftvTmpDiv.appendChild(vLeftTable);

        let rightvTmpDiv = newNode(vTmpDiv, 'div', null, 'gmain gmainright');
        rightvTmpDiv.appendChild(vRightHeader);
        rightvTmpDiv.appendChild(vRightTable);

        vTmpDiv.appendChild(leftvTmpDiv);
        vTmpDiv.appendChild(rightvTmpDiv);

        newNode(vTmpDiv, 'div', null, 'ggridfooter');
        const vTmpDiv2 = newNode(this.getChartBody(), 'div', this.vDivId + 'Lines', 'glinediv');
        if (this.vEvents?.onLineContainerHover && typeof this.vEvents.onLineContainerHover === 'function') {
            vTmpDiv2.addEventListener('mouseover', this.vEvents.onLineContainerHover);
            vTmpDiv2.addEventListener('mouseout', this.vEvents.onLineContainerHover);
        }
        vTmpDiv2.style.visibility = 'hidden';
        this.setLines(vTmpDiv2);

        /* Quick hack to show the generated HTML on older browsers
              let tmpGenSrc=document.createElement('textarea');
              tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
              vDiv.appendChild(tmpGenSrc);
        //*/


        // LISTENERS: Now all the content exists, register scroll listeners
        // addScrollListeners(this);

        // SCROLL: now check if we are actually scrolling the pane
        if (this.vScrollTo) {
            let vScrollDate = new Date(vMinDate.getTime());
            let vScrollPx = 0;

            if (typeof this.vScrollTo === 'string') {
                if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == 'px') {
                    vScrollPx = parseInt(this.vScrollTo.substr(2));
                } else {
                    if (this.vScrollTo === 'today') {
                        vScrollDate = new Date();
                    } else {
                        vScrollDate = parseDateStr(this.vScrollTo, this.getDateInputFormat());
                    }
                }
            } else if (this.vScrollTo instanceof Date) {
                vScrollDate = this.vScrollTo;
            }

            if (this.vFormat == 'hour') vScrollDate.setMinutes(0, 0, 0);
            else vScrollDate.setHours(0, 0, 0, 0);
            vScrollPx = getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends) - 30;

            this.getChartBody().scrollLeft = vScrollPx;
        }

        if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime()) {
            this.vTodayPx = getOffset(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends);
        } else this.vTodayPx = -1;

        // DEPENDENCIES: Draw lines of Dependencies
        let bdd = new Date();
        this.debugInfo('before DrawDependencies', bdd);

        if (this.vEvents?.beforeLineDraw && typeof this.vEvents.beforeLineDraw === 'function') {
            this.vEvents.beforeLineDraw();
        }
        this.DrawDependencies();
        addListenerDependencies(this.vLineOptions);

        // EVENTS
        if (this.vEvents?.afterLineDraw && typeof this.vEvents.afterLineDraw === 'function') {
            this.vEvents.afterLineDraw();
        }
        ad = new Date();
        this.debugInfo('after DrawDependencies', ad, (ad.getTime() - bdd.getTime()))

        this.drawComplete(vMinDate, vColWidth, bd);
    };

    /**
     * Actions after all the render process
     */
    drawComplete(vMinDate, vColWidth, bd) {
        if (this.vDebug) {
            const ad = new Date();
            console.info('after draw', ad, (ad.getTime() - bd.getTime()));
        }

        updateGridHeaderWidth(this);
        this.chartRowDateToX = function (date) {
            return getOffset(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends);
        };

        if (this.vEvents?.afterDraw && this.vEvents.afterDraw) {
            this.vEvents.afterDraw();
        }
    }

    async parseJSON(pFile: string, redrawAfter = true) {
        const jsonObj = await makeRequest(pFile, true, true);
        let bd;
        if (this.vDebug) {
            bd = new Date();
            console.info('before jsonparse', bd);
        }
        this.addJSONTask(jsonObj);
        if (this.vDebug) {
            const ad = new Date();
            console.info('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
        }
        if (redrawAfter) {
            this.Draw();
        }
        return jsonObj;
    }

    parseJSONString(pStr: string) {
        this.addJSONTask(JSON.parse(pStr));
    }

    addJSONTask(pJsonObj: any[]) {
        pJsonObj?.forEach((obj: any) => {
            let id;
            let name;
            let start;
            let end;
            let planstart;
            let planend;
            let itemClass;
            let link = '';
            let milestone: boolean = false;
            let resourceName = '';
            let completion;
            let group = 0;
            let parent;
            let open;
            let dependsOn = '';
            let caption = '';
            let notes = '';
            let cost;
            let duration = '';
            let bartext = '';
            const additionalObject = {};

            Object.keys(obj)
                .forEach(prop => {
                    const value = obj[prop];
                    switch (prop.toLowerCase()) {
                        case 'pid':
                        case 'id':
                            id = value;
                            break;
                        case 'pname':
                        case 'name':
                            name = value;
                            break;
                        case 'pstart':
                        case 'start':
                            start = value;
                            break;
                        case 'pend':
                        case 'end':
                            end = value;
                            break;
                        case 'pplanstart':
                        case 'planstart':
                            planstart = value;
                            break;
                        case 'pplanend':
                        case 'planend':
                            planend = value;
                            break;
                        case 'pclass':
                        case 'class':
                            itemClass = value;
                            break;
                        case 'plink':
                        case 'link':
                            link = value;
                            break;
                        case 'pmile':
                        case 'mile':
                            milestone = value;
                            break;
                        case 'pres':
                        case 'res':
                            resourceName = value;
                            break;
                        case 'pcomp':
                        case 'comp':
                            completion = value;
                            break;
                        case 'pgroup':
                        case 'group':
                            group = value;
                            break;
                        case 'pparent':
                        case 'parent':
                            parent = value;
                            break;
                        case 'popen':
                        case 'open':
                            open = value;
                            break;
                        case 'pdepend':
                        case 'depend':
                            dependsOn = value;
                            break;
                        case 'pcaption':
                        case 'caption':
                            caption = value;
                            break;
                        case 'pnotes':
                        case 'notes':
                            notes = value;
                            break;
                        case 'pcost':
                        case 'cost':
                            cost = value;
                            break;
                        case 'duration':
                        case 'pduration':
                            duration = value;
                            break;
                        case 'bartext':
                        case 'pbartext':
                            bartext = value;
                            break;
                        default:
                            additionalObject[prop.toLowerCase()] = value;
                    }
                });

            //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
            this.AddTaskItem(new TaskItem(id, name, start, end, itemClass, link,
                milestone, resourceName, completion, group, parent, open, dependsOn,
                caption, notes, this, cost, planstart, planend, duration, bartext,
                additionalObject));
            //}
        });
    }

    parseXML(pFile) {
        return makeRequest(pFile, false, false)
            .then(xmlDoc => {
                this.AddXMLTask(xmlDoc);
            });
    }

    parseXMLString(pStr) {
        let xmlDoc;
        if (typeof (<any>window).DOMParser != 'undefined') {
            xmlDoc = (new (<any>window).DOMParser()).parseFromString(pStr, 'text/xml');
        } else if (typeof (<any>window).ActiveXObject != 'undefined' &&
            new (<any>window).ActiveXObject('Microsoft.XMLDOM')) {
            xmlDoc = new (<any>window).ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(pStr);
        }

        this.AddXMLTask(xmlDoc);
    }


    private findXMLNode(pRoot, pNodeName) {
        let vRetValue;

        try {
            vRetValue = pRoot.getElementsByTagName(pNodeName);
        } catch (error) {
        } // do nothing, we'll return undefined

        return vRetValue;
    }

// pType can be 1=numeric, 2=String, all other values just return raw data
    private getXMLNodeValue(pRoot, pNodeName, pType, pDefault) {
        let vRetValue;

        try {
            vRetValue = pRoot.getElementsByTagName(pNodeName)[0].childNodes[0].nodeValue;
        } catch (error) {
            if (typeof pDefault != 'undefined') vRetValue = pDefault;
        }

        if (typeof vRetValue != 'undefined' && vRetValue != null) {
            if (pType == 1) vRetValue *= 1;
            else if (pType == 2) vRetValue = vRetValue.toString();
        }
        return vRetValue;
    }

    AddXMLTask(pXmlDoc) {
        let project = '';
        let Task;
        let n = 0;
        let m = 0;
        let i = 0;
        let j = 0;
        let k = 0;
        let maxPID = 0;
        let ass = [];
        let assRes = [];
        let res = [];
        let pars = [];

        let projNode = this.findXMLNode(pXmlDoc, 'Project');
        if (typeof projNode != 'undefined' && projNode.length > 0) {
            project = projNode[0].getAttribute('xmlns');
        }

        if (project == 'http://schemas.microsoft.com/project') {
            this.setDateInputFormat('yyyy-mm-dd');
            Task = this.findXMLNode(pXmlDoc, 'Task');
            if (typeof Task == 'undefined') n = 0;
            else n = Task.length;

            let resources = this.findXMLNode(pXmlDoc, 'Resource');
            if (typeof resources == 'undefined') {
                n = 0;
                m = 0;
            } else m = resources.length;

            for (i = 0; i < m; i++) {
                let resname = this.getXMLNodeValue(resources[i], 'Name', 2, '');
                let uid = this.getXMLNodeValue(resources[i], 'UID', 1, -1);

                if (resname.length > 0 && uid > 0) res[uid] = resname;
            }

            let assignments = this.findXMLNode(pXmlDoc, 'Assignment');
            if (typeof assignments == 'undefined') j = 0;
            else j = assignments.length;

            for (i = 0; i < j; i++) {
                let uid;
                let resUID = this.getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
                uid = this.getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);

                if (uid > 0) {
                    if (resUID > 0) assRes[uid] = res[resUID];
                    ass[uid] = assignments[i];
                }
            }

            // Store information about parent UIDs in an easily searchable form
            for (i = 0; i < n; i++) {
                let uid;
                uid = this.getXMLNodeValue(Task[i], 'UID', 1, 0);
                let vOutlineNumber;
                if (uid != 0) vOutlineNumber = this.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
                if (uid > 0) pars[vOutlineNumber] = uid;
                if (uid > maxPID) maxPID = uid;
            }

            for (i = 0; i < n; i++) {
                // optional parameters may not have an entry
                // Task ID must NOT be zero otherwise it will be skipped
                let pID = this.getXMLNodeValue(Task[i], 'UID', 1, 0);

                if (pID != 0) {
                    let pName = this.getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
                    let pStart = this.getXMLNodeValue(Task[i], 'Start', 2, '');
                    let pEnd = this.getXMLNodeValue(Task[i], 'Finish', 2, '');
                    let pPlanStart = this.getXMLNodeValue(Task[i], 'PlanStart', 2, '');
                    let pPlanEnd = this.getXMLNodeValue(Task[i], 'PlanFinish', 2, '');
                    let pDuration = this.getXMLNodeValue(Task[i], 'Duration', 2, '');
                    let pLink = this.getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
                    let pMile = this.getXMLNodeValue(Task[i], 'Milestone', 1, 0);
                    let pComp = this.getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
                    let pCost = this.getXMLNodeValue(Task[i], 'Cost', 2, 0);
                    let pGroup = this.getXMLNodeValue(Task[i], 'Summary', 1, 0);

                    let pParent = 0;

                    let vOutlineLevel = this.getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);
                    let vOutlineNumber;
                    if (vOutlineLevel > 1) {
                        vOutlineNumber = this.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
                        pParent = pars[vOutlineNumber.substr(0, vOutlineNumber.lastIndexOf('.'))];
                    }

                    let pNotes;
                    try {
                        pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
                    } catch (error) {
                        pNotes = '';
                    }

                    let pRes;
                    if (typeof assRes[pID] != 'undefined') pRes = assRes[pID];
                    else pRes = '';

                    let predecessors = this.findXMLNode(Task[i], 'PredecessorLink');
                    if (typeof predecessors == 'undefined') j = 0;
                    else j = predecessors.length;
                    let pDepend = '';

                    for (k = 0; k < j; k++) {
                        let depUID = this.getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
                        let depType = this.getXMLNodeValue(predecessors[k], 'Type', 1, 1);

                        if (depUID > 0) {
                            if (pDepend.length > 0) pDepend += ',';
                            switch (depType) {
                                case 0:
                                    pDepend += depUID + 'FF';
                                    break;
                                case 1:
                                    pDepend += depUID + 'FS';
                                    break;
                                case 2:
                                    pDepend += depUID + 'SF';
                                    break;
                                case 3:
                                    pDepend += depUID + 'SS';
                                    break;
                                default:
                                    pDepend += depUID + 'FS';
                                    break;
                            }
                        }
                    }

                    let pOpen = true;
                    let pCaption = '';

                    let pClass;
                    if (pGroup > 0) pClass = 'ggroupblack';
                    else if (pMile > 0) pClass = 'gmilestone';
                    else pClass = 'gtaskblue';

                    // check for split tasks

                    let splits = this.findXMLNode(ass[pID], 'TimephasedData');
                    if (typeof splits == 'undefined') j = 0;
                    else j = splits.length;

                    let vSplitStart = pStart;
                    let vSplitEnd = pEnd;
                    let vSubCreated = false;
                    let vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');

                    for (k = 0; k < j; k++) {
                        let vDuration = this.getXMLNodeValue(splits[k], 'Value', 2, '0');
                        //remove all text
                        vDuration = '0' + vDuration.replace(/\D/g, '');
                        vDuration *= 1;
                        if ((vDuration == 0 && !vSubCreated) || (k + 1 == j && pGroup == 2)) {
                            // No time booked in the given period (or last entry)
                            // Make sure the parent task is set as a combined group
                            pGroup = 2;
                            // Handle last loop
                            if (k + 1 == j) vDepend = pDepend.replace(/,*[0-9]+[FS]S/g, '');
                            // Now create a subtask
                            maxPID++;
                            vSplitEnd = this.getXMLNodeValue(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
                            this.AddTaskItem(new TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue',
                                pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pCost,
                                pPlanStart, pPlanEnd, pDuration));
                            vSubCreated = true;
                            vDepend = '';
                        } else if (vDuration != 0 && vSubCreated) {
                            vSplitStart = this.getXMLNodeValue(splits[k], 'Start', 2, '');
                            vSubCreated = false;
                        }
                    }
                    if (vSubCreated) pDepend = '';

                    // Finally add the task
                    this.AddTaskItem(new TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup,
                        pParent, pOpen, pDepend, pCaption, pNotes, pCost, pPlanStart, pPlanEnd, pDuration));
                }
            }
        } else {
            Task = pXmlDoc.getElementsByTagName('task');
            n = Task.length;

            for (i = 0; i < n; i++) {
                // optional parameters may not have an entry
                // Task ID must NOT be zero otherwise it will be skipped
                let pID = this.getXMLNodeValue(Task[i], 'pID', 1, 0);

                if (pID != 0) {
                    let pName = this.getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');
                    let pStart = this.getXMLNodeValue(Task[i], 'pStart', 2, '');
                    let pEnd = this.getXMLNodeValue(Task[i], 'pEnd', 2, '');
                    let pPlanStart = this.getXMLNodeValue(Task[i], 'pPlanStart', 2, '');
                    let pPlanEnd = this.getXMLNodeValue(Task[i], 'pPlanEnd', 2, '');
                    let pDuration = this.getXMLNodeValue(Task[i], 'pDuration', 2, '');
                    let pLink = this.getXMLNodeValue(Task[i], 'pLink', 2, '');
                    let pMile = this.getXMLNodeValue(Task[i], 'pMile', 1, 0);
                    let pComp = this.getXMLNodeValue(Task[i], 'pComp', 1, 0);
                    let pCost = this.getXMLNodeValue(Task[i], 'pCost', 2, 0);
                    let pGroup = this.getXMLNodeValue(Task[i], 'pGroup', 1, 0);
                    let pParent = this.getXMLNodeValue(Task[i], 'pParent', 1, 0);
                    let pRes = this.getXMLNodeValue(Task[i], 'pRes', 2, '');
                    let pOpen = this.getXMLNodeValue(Task[i], 'pOpen', 1, 1);
                    let pDepend = this.getXMLNodeValue(Task[i], 'pDepend', 2, '');
                    let pCaption = this.getXMLNodeValue(Task[i], 'pCaption', 2, '');
                    let pNotes = this.getXMLNodeValue(Task[i], 'pNotes', 2, '');
                    let pClass = this.getXMLNodeValue(Task[i], 'pClass', 2, '');
                    if (typeof pClass == 'undefined') {
                        if (pGroup > 0) pClass = 'ggroupblack';
                        else if (pMile > 0) pClass = 'gmilestone';
                        else pClass = 'gtaskblue';
                    }

                    // Finally add the task
                    this.AddTaskItem(new TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp,
                        pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pCost, pPlanStart, pPlanEnd, pDuration));
                }
            }
        }


    }

    // Events
    // Function to open/close and hide/show children of specified task
    folder(pID) {
        let vList = this.vTaskList;

        this.clearDependencies(); // clear these first so slow rendering doesn't look odd

        const target = this.vTaskList?.find(task => task.vID === pID);

        if(target) {
            if(target.vOpen) {
                target.vOpen = false;
                this.hide(pID);
                // target.vGroupSpan.innerText = '+';
                target.vGroupSpan.classList.remove(target.vGantt.vCollapsedIcon);
                target.vGroupSpan.classList.add(target.vGantt.vExpandedIcon);
            } else {
                target.vOpen = true;
                this.show(pID, true);

                target.vGroupSpan.classList.add(target.vGantt.vCollapsedIcon);
                target.vGroupSpan.classList.remove(target.vGantt.vExpandedIcon);
            }
        }

        let bd = new Date();
        this.debugInfo('before drawDependency', bd)

        this.DrawDependencies();

        const ad = new Date();
        this.debugInfo('after drawDependency', ad, (ad.getTime() - bd.getTime()))
    }

    hide(pID) {
        let vList = this.getList();
        let vID = 0;

        this.vTaskList?.forEach(task => {
            if (task.vParent == pID) {
                vID = task.vID;
                // it's unlikely but if the task list has been updated since
                // the chart was drawn some of the rows may not exist
                if (task.vListChildRow) task.vListChildRow.style.display = 'none';
                if (task.vChildRow) task.vChildRow.style.display = 'none';
                task.vVisible = false;
                if (task.vGroup) this.hide(vID);
            }
        })
    }

// Function to show children of specified task
    show(pID, pTop) {
        let vID = 0;
        let vClassList: DOMTokenList;

        this.vTaskList?.forEach(task => {
            if (task.vParent == pID) {
                if (!task.vParItem) {
                    console.error(`Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)`);
                }
                if (task.vParItem.vGroupSpan) {
                    vClassList = task.vParItem.vGroupSpan.classList;
                }
                // i = vList.length;
            }
        })

        this.vTaskList?.forEach(task => {
            if (task.vParent == pID) {
                let vChgState = false;
                vID = task.vID;

                if (pTop == 1 && vClassList?.contains(this.vExpandedIcon)) vChgState = true;
                else if (vClassList?.contains(this.vCollapsedIcon)) vChgState = true;
                else if (task.vParItem && task.vParItem.vGroup == 2) task.vVisible = true;

                if (vChgState) {
                    if (task.vListChildRow) task.vListChildRow.style.display = '';
                    if (task.vChildRow) task.vChildRow.style.display = '';
                    task.vVisible = true;
                }
                if (task.vGroup) this.show(vID, false);
            }
        });
    }


    addThisRowListeners(pObj1: HTMLElement, pObj2: HTMLElement) {
        pObj1.addEventListener('mouseover', () => this.mouseOver(pObj1, pObj2));
        pObj2.addEventListener('mouseover', () => this.mouseOver(pObj1, pObj2));
        pObj1.addEventListener('mouseout', () => this.mouseOut(pObj1, pObj2));
        pObj2.addEventListener('mouseout', () => this.mouseOut(pObj1, pObj2));
    }

    private debugInfo(message: string, ...args) {
        if(this.vDebug) {
            console.info(message, ...args);
        }
    }
}
