/**
 * DATES
 */
export declare function getMinDate(pList: any, pFormat: any, pMinDate: any): any;
export declare function getMaxDate(pList: any, pFormat: any, pMaxDate: any): any;
export declare function coerceDate(date: any): Date;
export declare function parseDateStr(pDateStr: any, pFormatStr: any): Date;
export declare function formatDateStr(pDate: any, pDateFormatArr: any, pL: any): string;
export declare function parseDateFormatStr(pFormatStr: any): any[];
/**
 * We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
 * 60*60*24*1000=86400000
 * @param pDate
 */
export declare function getIsoWeek(pDate: any): number;
