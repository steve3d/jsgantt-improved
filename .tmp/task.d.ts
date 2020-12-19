import { GanttChart } from './chart';
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
}
export declare function taskLink(pRef: any, pWidth: any, pHeight: any): void;
export declare function sortTasks(pList: any, pID: any, pIdx: any): any;
export declare class TaskItem {
    vID: number;
    vName: string;
    vClass: string;
    vLink: string;
    vMile: boolean;
    pRes: string;
    vComp: number;
    vGroup: number;
    vParent: number;
    vOpen: boolean;
    vCaption: string;
    vGantt: GanttChart;
    vCost?: number;
    vDuration?: string;
    vBarText?: string;
    vDataObject?: any;
    vStart: Date;
    vEnd: Date;
    vPlanStart: Date;
    vPlanEnd: Date;
    vGroupMinStart: Date;
    vGroupMinEnd: Date;
    vGroupMinPlanStart: Date;
    vGroupMinPlanEnd: Date;
    vRes: string | null;
    vCompVal: number;
    vDepend: any[];
    vDependType: any[];
    vLevel: number;
    vNumKid: number;
    vWeight: number;
    vVisible: boolean;
    vSortIdx: number;
    vToDelete: boolean;
    x1: any;
    y1: any;
    x2: any;
    y2: any;
    vNotes: HTMLElement;
    vParItem: TaskItem;
    vCellDiv: HTMLDivElement;
    vBarDiv: HTMLDivElement;
    vTaskDiv: HTMLDivElement;
    vPlanTaskDiv: HTMLDivElement;
    vListChildRow: HTMLElement;
    vChildRow: HTMLElement;
    vGroupSpan: HTMLSpanElement;
    constructor(vID: number, vName: string, pStart: Date | string, pEnd: Date | string, vClass: string, vLink: string, vMile: boolean, pRes: string, vComp: number, vGroup: number, vParent: number, vOpen: boolean, pDepend: string, vCaption: string, pNotes: string, vGantt: GanttChart, vCost?: number, pPlanStart?: Date | string, pPlanEnd?: Date | string, vDuration?: string, vBarText?: string, vDataObject?: any);
    getStart(): Date;
    getEnd(): Date;
    getPlanStart(): Date;
    getPlanEnd(): Date;
    getCompVal(): number;
    getCompStr(): string;
    getCompRestStr(): string;
    getDuration(pFormat: string, pLang: any): string;
    private calculateVDuration;
    setStart(pStart: Date | string): void;
    setEnd(pEnd: Date | string): void;
    setPlanStart(pPlanStart: any): void;
    setPlanEnd(pPlanEnd: Date | string): void;
    setGroup(pGroup: 0 | 1 | 2): void;
    get allData(): {
        pID: number;
        pName: string;
        pStart: Date;
        pEnd: Date;
        pPlanStart: Date;
        pPlanEnd: Date;
        pGroupMinStart: Date;
        pGroupMinEnd: Date;
        pClass: string;
        pLink: string;
        pMile: boolean;
        pRes: string;
        pComp: number;
        pCost: number;
        pGroup: number;
        pDataObjec: any;
    };
}
/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */
export declare function createTaskInfo(pTask: any, templateStrOrFn?: any): {
    component: DocumentFragment;
    callback: any;
};
export declare function processRows(pList: any, pID: any, pRow: any, pLevel: any, pOpen: any, pUseSort: any, vDebug?: boolean): void;
