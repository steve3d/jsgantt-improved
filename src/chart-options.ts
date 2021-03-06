import { TaskItem } from './task';

export interface ChartOptions {
    vUseFade?: boolean;
    vUseMove?: boolean;
    vUseRowHlt?: boolean;
    vUseToolTip?: boolean;
    vUseSort?: boolean;
    vUseSingleCell?: boolean;
    vFormatArr?: string[];
    vShowRes?: boolean;
    vShowDur?: boolean;
    vShowComp?: boolean;
    vShowStartDate?: boolean;
    vShowEndDate?: boolean;
    vShowPlanStartDate?: boolean;
    vShowPlanEndDate?: boolean;
    vShowCost?: boolean;
    vShowAddEntries?: boolean;
    vShowTaskInfoRes?: boolean;
    vShowTaskInfoDur?: boolean;
    vShowTaskInfoComp?: boolean;
    vShowTaskInfoStartDate?: boolean;
    vShowTaskInfoEndDate?: boolean;
    vShowTaskInfoNotes?: boolean;
    vShowTaskInfoLink?: boolean;
    vShowEndWeekDate?: boolean;
    vShowWeekends?: boolean;
    vShowSelector?: boolean;
    vShowDeps?: boolean;
    vDateInputFormat?: string;
    vDateTaskTableDisplayFormat?: string;
    vDateTaskDisplayFormat?: string;
    vHourMajorDateDisplayFormat?: string;
    vHourMinorDateDisplayFormat?: string;
    vDayMajorDateDisplayFormat?: string;
    vDayMinorDateDisplayFormat?: string;
    vWeekMajorDateDisplayFormat?: string;
    vWeekMinorDateDisplayFormat?: string;
    vMonthMajorDateDisplayFormat?: string;
    vMonthMinorDateDisplayFormat?: string;
    vQuarterMajorDateDisplayFormat?: string;
    vQuarterMinorDateDisplayFormat?: string;
    vCaptionType?: 'Caption' | 'Resource' | 'Duration' | 'Complete';
    vFormat?: 'hour'| 'day'| 'week'| 'month'| 'quarter';
    vScrollTo?: string | Date;
    vHourColWidth?: number;
    vDayColWidth?: number;
    vWeekColWidth?: number;
    vMonthColWidth?: number;
    vQuarterColWidth?: number;
    vRowHeight?: number;
    vLang?: string;
    vTimer?: number;
    vTooltipDelay?: number;
    vTooltipTemplate?: string;
    vTotalHeight?: string;

// EVENTS
    vEvents?: {
        taskname?: (task: TaskItem, e: Event, vTmpCell: HTMLTableCellElement, column: string) => void;
        res?: (tasks: TaskItem[], task: TaskItem, e: Event, vTmpCell: HTMLTableCellElement, name: string) => void,
        dur?: (e) => void,
        comp?: (e) => void,
        startdate?: (e) => void,
        enddate?: (e) => void,
        planstartdate?: (e) => void,
        planenddate?: (e) => void,
        cost?: (e) => void,
        beforeDraw?: () => void,
        afterDraw?: () => void,
        beforeLineDraw?: () => void,
        afterLineDraw?: () => void,
        onLineDraw?: (e) => void,
        onLineContainerHover?: (e) => void
    };
    vEventsChange?: {
        taskname: (task: TaskItem, e, vTmpCell: HTMLTableCellElement, column: string) => void,
        res?: (e) => void,
        dur?: (e) => void,
        comp?: (e) => void,
        startdate?: (e) => void,
        enddate?: (e) => void,
        planstartdate?: (e) => void,
        planenddate?: (e) => void,
        cost?: (e) => void,
        line?: (e) => void
    };
    vEventClickRow?: (e) => void;
    vEventClickCollapse?: (e) => void;

    vResources?: string[];
    vAdditionalHeaders?: any;
    vColumnOrder?: string[];

    vEditable?: boolean;
    vDebug?: boolean;
}
