import { ChartOptions } from './chart-options';
import { GanttLanguage } from './lang';
import { TaskItem, TaskItemObject } from './task';
export declare class GanttChart {
    vDiv: HTMLElement;
    vFormat: 'hour' | 'day' | 'week' | 'month' | 'quarter';
    vContainerDiv: HTMLDivElement;
    vDivId: string;
    vUseFade: boolean;
    vUseMove: boolean;
    vUseRowHlt: boolean;
    vUseToolTip: boolean;
    vUseSort: boolean;
    vUseSingleCell: number;
    vShowRes: boolean;
    vShowDur: boolean;
    vShowComp: boolean;
    vShowStartDate: boolean;
    vShowEndDate: boolean;
    vShowPlanStartDate: boolean;
    vShowPlanEndDate: boolean;
    vShowCost: boolean;
    vShowAddEntries: boolean;
    vShowEndWeekDate: boolean;
    vShowWeekends: boolean;
    vShowTaskInfoRes: boolean;
    vShowTaskInfoDur: boolean;
    vShowTaskInfoComp: boolean;
    vShowTaskInfoStartDate: boolean;
    vShowTaskInfoEndDate: boolean;
    vShowTaskInfoNotes: boolean;
    vShowTaskInfoLink: boolean;
    vShowDeps: boolean;
    vTotalHeight: string;
    vWorkingDays: Record<number, boolean>;
    vEventClickCollapse: any;
    vEventClickRow: any;
    vEvents: Record<string, (e?: any) => void>;
    vEventsChange: Record<string, (e?: any) => void>;
    vResources: string[];
    vAdditionalHeaders: {};
    vColumnOrder: string[];
    vEditable: boolean;
    vDebug: boolean;
    vShowSelector: string[];
    vDateInputFormat: string;
    vDateTaskTableDisplayFormat: any[];
    vDateTaskDisplayFormat: any[];
    vHourMajorDateDisplayFormat: any[];
    vHourMinorDateDisplayFormat: any[];
    vDayMajorDateDisplayFormat: any[];
    vDayMinorDateDisplayFormat: any[];
    vWeekMajorDateDisplayFormat: any[];
    vWeekMinorDateDisplayFormat: any[];
    vMonthMajorDateDisplayFormat: any[];
    vMonthMinorDateDisplayFormat: any[];
    vQuarterMajorDateDisplayFormat: any[];
    vQuarterMinorDateDisplayFormat: any[];
    vUseFullYear: any[];
    vCaptionType: 'Caption' | 'Resource' | 'Duration' | 'Complete';
    vDepId: number;
    vTaskList: TaskItem[];
    vFormatArr: string[];
    vMonthDaysArr: number[];
    vProcessNeeded: boolean;
    vMinGpLen: number;
    vScrollTo: Date | string;
    vHourColWidth: number;
    vDayColWidth: number;
    vWeekColWidth: number;
    vMonthColWidth: number;
    vQuarterColWidth: number;
    vRowHeight: number;
    vTodayPx: number;
    vLangs: {
        en: GanttLanguage;
        cn: GanttLanguage;
    };
    vChartBody: HTMLElement;
    vChartHead: HTMLElement;
    vListBody: HTMLElement;
    vChartTable: HTMLTableElement;
    vLines: HTMLElement;
    vTimer: number;
    vTooltipDelay: number;
    vTooltipTemplate: any;
    vMinDate: Date;
    vMaxDate: Date;
    vLineOptions: any;
    chartRowDateToX: any;
    private taskIdMap;
    private currentLang;
    private scrollPos;
    constructor(vDiv: HTMLElement, vFormat: 'hour' | 'day' | 'week' | 'month' | 'quarter');
    get vLang(): string;
    set vLang(val: string);
    /**
     * SETTERS
     */
    setOptions(options: ChartOptions): void;
    setFormatArr(): void;
    setShowRes(pVal: boolean): void;
    setShowDur(pVal: boolean): void;
    setShowComp(pVal: boolean): void;
    setShowStartDate(pVal: boolean): void;
    setShowEndDate(pVal: boolean): void;
    setShowPlanStartDate(pVal: boolean): void;
    setShowPlanEndDate(pVal: boolean): void;
    setShowCost(pVal: boolean): void;
    setShowAddEntries(pVal: boolean): void;
    setShowTaskInfoRes(pVal: boolean): void;
    setShowTaskInfoDur(pVal: boolean): void;
    setShowTaskInfoComp(pVal: boolean): void;
    setShowTaskInfoStartDate(pVal: boolean): void;
    setShowTaskInfoEndDate(pVal: boolean): void;
    setShowTaskInfoNotes(pVal: boolean): void;
    setShowTaskInfoLink(pVal: boolean): void;
    setShowEndWeekDate(pVal: boolean): void;
    setShowWeekends(pVal: boolean): void;
    setShowSelector(): void;
    setShowDeps(pVal: boolean): void;
    setDateInputFormat(pVal: string): void;
    setDateTaskTableDisplayFormat(pVal: string): void;
    setDateTaskDisplayFormat(pVal: string): void;
    setHourMajorDateDisplayFormat(pVal: string): void;
    setHourMinorDateDisplayFormat(pVal: string): void;
    setDayMajorDateDisplayFormat(pVal: string): void;
    setDayMinorDateDisplayFormat(pVal: string): void;
    setWeekMajorDateDisplayFormat(pVal: string): void;
    setWeekMinorDateDisplayFormat(pVal: string): void;
    setMonthMajorDateDisplayFormat(pVal: string): void;
    setMonthMinorDateDisplayFormat(pVal: string): void;
    setQuarterMajorDateDisplayFormat(pVal: string): void;
    setQuarterMinorDateDisplayFormat(pVal: string): void;
    setCaptionType(pType: any): void;
    setFormat(pFormat: 'hour' | 'day' | 'week' | 'month' | 'quarter'): void;
    setWorkingDays(workingDays: Record<number, boolean>): void;
    setMinGpLen(pMinGpLen: number): void;
    setScrollTo(pDate: any): void;
    setHourColWidth(pWidth: number): void;
    setDayColWidth(pWidth: number): void;
    setWeekColWidth(pWidth: number): void;
    setMonthColWidth(pWidth: number): void;
    setQuarterColWidth(pWidth: number): void;
    setRowHeight(pHeight: number): void;
    setLang(pLang: string): void;
    setChartBody(pDiv: HTMLElement): void;
    setChartHead(pDiv: HTMLElement): void;
    setListBody(pDiv: HTMLElement): void;
    setChartTable(pTable: any): void;
    setLines(pDiv: HTMLElement): void;
    setLineOptions(lineOptions: any): void;
    setTimer(pVal: any): void;
    setTooltipDelay(pVal: any): void;
    setTooltipTemplate(pVal: any): void;
    setMinDate(pVal: any): void;
    setMaxDate(pVal: any): void;
    setTotalHeight(pVal: any): void;
    addLang(pLang: string, pVals: GanttLanguage): void;
    setEvents(pEvents: any): void;
    setEventsChange(pEventsChange: any): void;
    setEventClickRow(fn: any): void;
    setEventClickCollapse(fn: any): void;
    setResources(resources: any): void;
    setAdditionalHeaders(headers: any): void;
    setColumnOrder(order: any): void;
    setEditable(editable: any): void;
    setDebug(debug: any): void;
    /**
     * GETTERS
     */
    getDivId(): string;
    getUseFade(): boolean;
    getUseMove(): boolean;
    getUseRowHlt(): boolean;
    getUseToolTip(): boolean;
    getUseSort(): boolean;
    getUseSingleCell(): number;
    getFormatArr(): string[];
    getShowRes(): boolean;
    getShowDur(): boolean;
    getShowComp(): boolean;
    getShowStartDate(): boolean;
    getShowEndDate(): boolean;
    getShowPlanStartDate(): boolean;
    getShowPlanEndDate(): boolean;
    getShowCost(): boolean;
    getShowAddEntries(): boolean;
    getShowTaskInfoRes(): boolean;
    getShowTaskInfoDur(): boolean;
    getShowTaskInfoComp(): boolean;
    getShowTaskInfoStartDate(): boolean;
    getShowTaskInfoEndDate(): boolean;
    getShowTaskInfoNotes(): boolean;
    getShowTaskInfoLink(): boolean;
    getShowEndWeekDate(): boolean;
    getShowWeekends(): boolean;
    getShowSelector(): string[];
    getShowDeps(): boolean;
    getDateInputFormat(): string;
    getDateTaskTableDisplayFormat(): any[];
    getDateTaskDisplayFormat(): any[];
    getHourMajorDateDisplayFormat(): any[];
    getHourMinorDateDisplayFormat(): any[];
    getDayMajorDateDisplayFormat(): any[];
    getDayMinorDateDisplayFormat(): any[];
    getWeekMajorDateDisplayFormat(): any[];
    getWeekMinorDateDisplayFormat(): any[];
    getMonthMajorDateDisplayFormat(): any[];
    getMonthMinorDateDisplayFormat(): any[];
    getQuarterMajorDateDisplayFormat(): any[];
    getQuarterMinorDateDisplayFormat(): any[];
    getCaptionType(): "Resource" | "Duration" | "Caption" | "Complete";
    getMinGpLen(): number;
    getScrollTo(): string | Date;
    getHourColWidth(): number;
    getDayColWidth(): number;
    getWeekColWidth(): number;
    getMonthColWidth(): number;
    getQuarterColWidth(): number;
    getRowHeight(): number;
    getChartBody(): HTMLElement;
    getChartHead(): HTMLElement;
    getListBody(): HTMLElement;
    getChartTable(): HTMLTableElement;
    getLines(): HTMLElement;
    getTimer(): number;
    getMinDate(): Date;
    getMaxDate(): Date;
    getTooltipDelay(): number;
    getList(): TaskItem[];
    getEventsClickCell(): Record<string, (e?: any) => void>;
    getEventsChange(): Record<string, (e?: any) => void>;
    getEventClickRow(): any;
    getEventClickCollapse(): any;
    getResources(): string[];
    getAdditionalHeaders(): {};
    getColumnOrder(): string[];
    AddTaskItem(value: TaskItem): void;
    AddTaskItemObject(object: TaskItemObject): void;
    CalcTaskXY(): void;
    sLine(x1: number, y1: number, x2: number, y2: number, pClass: string): HTMLDivElement;
    mouseOver(pObj1: any, pObj2: any): void;
    mouseOut(pObj1: any, pObj2: any): void;
    addListener(eventName: any, handler: any, control: any): any;
    removeListener(eventName: any, handler: any, control: any): any;
    createTaskInfo(pTask: any, templateStrOrFn?: any): {
        component: DocumentFragment;
        callback: any;
    };
    RemoveTaskItem(pID: any): void;
    ClearTasks(): void;
    getXMLProject(): string;
    getXMLTask(pID: any, pIdx: any): string;
    drawDependency(x1: any, y1: any, x2: any, y2: any, pType: any, pClass: any): void;
    DrawDependencies(vDebug?: boolean): void;
    getArrayLocationByID(pId: any): number;
    drawSelector(pPos: any): DocumentFragment;
    clearDependencies(): void;
    drawListHead(vLeftHeader: any): any;
    drawListBody(vLeftHeader: any): {
        vNumRows: number;
        vTmpContentTabWrapper: any;
    };
    /**
     *
     * DRAW CHAR HEAD
     *
     */
    drawChartHead(vMinDate: any, vMaxDate: any, vColWidth: any, vNumRows: any): {
        gChartLbl: any;
        vTaskLeftPx: number;
        vSingleCell: boolean;
        vDateRow: any;
        vRightHeader: DocumentFragment;
        vNumCols: number;
    };
    /**
     *
     * DRAW CHART BODY
     *
     */
    drawCharBody(vTaskLeftPx: any, vTmpContentTabWrapper: any, gChartLbl: any, gListLbl: any, vMinDate: any, vMaxDate: any, vSingleCell: any, vNumCols: any, vColWidth: any, vDateRow: any): {
        vRightTable: DocumentFragment;
    };
    drawColsChart(vNumCols: any, vTmpRow: any, taskCellWidth: any, pStartDate?: any, pEndDate?: any): void;
    /**
     *
     *
     * DRAWING PROCESS
     *
     *  vTaskRightPx,vTaskWidth,vTaskPlanLeftPx,vTaskPlanRightPx,vID
     */
    Draw(): void;
    /**
     * Actions after all the render process
     */
    drawComplete(vMinDate: any, vColWidth: any, bd: any): void;
    parseJSON(pFile: string, redrawAfter?: boolean): Promise<any>;
    parseJSONString(pStr: string): void;
    addJSONTask(pJsonObj: any[]): void;
    parseXML(pFile: any): Promise<void>;
    parseXMLString(pStr: any): void;
    private findXMLNode;
    private getXMLNodeValue;
    AddXMLTask(pXmlDoc: any): void;
    folder(pID: any): void;
    hide(pID: any): void;
    show(pID: any, pTop: any): void;
    addThisRowListeners(pObj1: HTMLElement, pObj2: HTMLElement): void;
}
