(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSGantt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSGantt = void 0;
var jsGantt = require("./src/jsgantt");
module.exports = jsGantt.JSGantt;
exports.JSGantt = jsGantt.JSGantt;

},{"./src/jsgantt":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanttChart = void 0;
var lang_1 = require("./lang");
var events_1 = require("./events");
var general_utils_1 = require("./utils/general_utils");
var task_1 = require("./task");
var xml_1 = require("./xml");
var draw_columns_1 = require("./draw_columns");
var draw_utils_1 = require("./utils/draw_utils");
var draw_dependencies_1 = require("./draw_dependencies");
var options_1 = require("./options");
var date_utils_1 = require("./utils/date_utils");
/**
 * function that loads the main gantt chart properties and functions
 * @param pDiv (required) this is a div object created in HTML
 * @param pFormat (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
 */
var GanttChart = function (pDiv, pFormat) {
    this.vDiv = pDiv;
    this.vFormat = pFormat;
    this.vDivId = null;
    this.vUseFade = 1;
    this.vUseMove = 1;
    this.vUseRowHlt = 1;
    this.vUseToolTip = 1;
    this.vUseSort = 1;
    this.vUseSingleCell = 25000;
    this.vShowRes = 1;
    this.vShowDur = 1;
    this.vShowComp = 1;
    this.vShowStartDate = 1;
    this.vShowEndDate = 1;
    this.vShowPlanStartDate = 0;
    this.vShowPlanEndDate = 0;
    this.vShowCost = 0;
    this.vShowAddEntries = 0;
    this.vShowEndWeekDate = 1;
    this.vShowWeekends = 1;
    this.vShowTaskInfoRes = 1;
    this.vShowTaskInfoDur = 1;
    this.vShowTaskInfoComp = 1;
    this.vShowTaskInfoStartDate = 1;
    this.vShowTaskInfoEndDate = 1;
    this.vShowTaskInfoNotes = 1;
    this.vShowTaskInfoLink = 0;
    this.vShowDeps = 1;
    this.vTotalHeight = undefined;
    this.vWorkingDays = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true
    };
    this.vEventClickCollapse = null;
    this.vEventClickRow = null;
    this.vEvents = {
        taskname: null,
        res: null,
        dur: null,
        comp: null,
        startdate: null,
        enddate: null,
        planstartdate: null,
        planenddate: null,
        cost: null,
        beforeDraw: null,
        afterDraw: null,
        beforeLineDraw: null,
        afterLineDraw: null,
        onLineDraw: null,
        onLineContainerHover: null
    };
    this.vEventsChange = {
        taskname: null,
        res: null,
        dur: null,
        comp: null,
        startdate: null,
        enddate: null,
        planstartdate: null,
        planenddate: null,
        cost: null,
        line: null
    };
    this.vResources = null;
    this.vAdditionalHeaders = {};
    this.vColumnOrder = draw_columns_1.COLUMN_ORDER;
    this.vEditable = false;
    this.vDebug = false;
    this.vShowSelector = new Array('top');
    this.vDateInputFormat = 'yyyy-mm-dd';
    this.vDateTaskTableDisplayFormat = date_utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vDateTaskDisplayFormat = date_utils_1.parseDateFormatStr('dd month yyyy');
    this.vHourMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('day dd month yyyy');
    this.vHourMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('HH');
    this.vDayMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vDayMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('dd');
    this.vWeekMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('yyyy');
    this.vWeekMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('dd/mm');
    this.vMonthMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('yyyy');
    this.vMonthMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('mon');
    this.vQuarterMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('yyyy');
    this.vQuarterMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('qq');
    this.vUseFullYear = date_utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vCaptionType;
    this.vDepId = 1;
    this.vTaskList = new Array();
    this.vFormatArr = new Array('hour', 'day', 'week', 'month', 'quarter');
    this.vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.vProcessNeeded = true;
    this.vMinGpLen = 8;
    this.vScrollTo = '';
    this.vHourColWidth = 18;
    this.vDayColWidth = 18;
    this.vWeekColWidth = 36;
    this.vMonthColWidth = 36;
    this.vQuarterColWidth = 18;
    this.vRowHeight = 20;
    this.vTodayPx = -1;
    this.vLangs = lang_1.lang;
    this.vLang = navigator.language && navigator.language in lang_1.lang ? navigator.language : 'en';
    this.vChartBody = null;
    this.vChartHead = null;
    this.vListBody = null;
    this.vChartTable = null;
    this.vLines = null;
    this.vTimer = 20;
    this.vTooltipDelay = 1500;
    this.vTooltipTemplate = null;
    this.vMinDate = null;
    this.vMaxDate = null;
    this.includeGetSet = options_1.includeGetSet.bind(this);
    this.includeGetSet();
    this.mouseOver = events_1.mouseOver;
    this.mouseOut = events_1.mouseOut;
    this.addListener = events_1.addListener.bind(this);
    this.removeListener = events_1.removeListener.bind(this);
    this.createTaskInfo = task_1.createTaskInfo;
    this.AddTaskItem = task_1.AddTaskItem;
    this.AddTaskItemObject = task_1.AddTaskItemObject;
    this.RemoveTaskItem = task_1.RemoveTaskItem;
    this.ClearTasks = task_1.ClearTasks;
    this.getXMLProject = xml_1.getXMLProject;
    this.getXMLTask = xml_1.getXMLTask;
    this.CalcTaskXY = draw_utils_1.CalcTaskXY.bind(this);
    // sLine: Draw a straight line (colored one-pixel wide div)
    this.sLine = draw_utils_1.sLine.bind(this);
    this.drawDependency = draw_dependencies_1.drawDependency.bind(this);
    this.DrawDependencies = draw_dependencies_1.DrawDependencies.bind(this);
    this.getArrayLocationByID = draw_utils_1.getArrayLocationByID.bind(this);
    this.drawSelector = draw_utils_1.drawSelector.bind(this);
    this.clearDependencies = function () {
        var parent = this.getLines();
        if (this.vEventsChange.line &&
            typeof this.vEventsChange.line === 'function') {
            this.removeListener('click', this.vEventsChange.line, parent);
            this.addListener('click', this.vEventsChange.line, parent);
        }
        while (parent.hasChildNodes())
            parent.removeChild(parent.firstChild);
        this.vDepId = 1;
    };
    this.drawListHead = function (vLeftHeader) {
        var _this = this;
        var vTmpDiv = draw_utils_1.newNode(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
        var gListLbl = vTmpDiv;
        this.setListBody(vTmpDiv);
        var vTmpTab = draw_utils_1.newNode(vTmpDiv, 'table', null, 'gtasktableh');
        var vTmpTBody = draw_utils_1.newNode(vTmpTab, 'tbody');
        var vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr');
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
        var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gtaskname', null, null, null, null, this.getColumnOrder().length + 1);
        vTmpCell.appendChild(this.drawSelector('top'));
        vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr');
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskname', '\u00A0');
        this.getColumnOrder().forEach(function (column) {
            if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                draw_columns_1.draw_task_headings(column, vTmpRow, _this.vLangs, _this.vLang, _this.vAdditionalHeaders, _this.vEvents);
            }
        });
        return gListLbl;
    };
    this.drawListBody = function (vLeftHeader) {
        var _this = this;
        var vTmpContentTabOuterWrapper = draw_utils_1.newNode(vLeftHeader, 'div', null, 'gtasktableouterwrapper');
        var vTmpContentTabWrapper = draw_utils_1.newNode(vTmpContentTabOuterWrapper, 'div', null, 'gtasktablewrapper');
        vTmpContentTabWrapper.style.width = "calc(100% + " + general_utils_1.getScrollbarWidth() + "px)";
        var vTmpContentTab = draw_utils_1.newNode(vTmpContentTabWrapper, 'table', null, 'gtasktable');
        var vTmpContentTBody = draw_utils_1.newNode(vTmpContentTab, 'tbody');
        var vNumRows = 0;
        var _loop_1 = function (i) {
            var vBGColor = void 0;
            if (this_1.vTaskList[i].vGroup == 1)
                vBGColor = 'ggroupitem';
            else
                vBGColor = 'glineitem';
            console.log(this_1.vTaskList[i]);
            var vID = this_1.vTaskList[i].vID;
            var vTmpRow_1, vTmpCell_1 = void 0;
            if ((!(this_1.vTaskList[i].vParItem && this_1.vTaskList[i].vParItem.vGroup == 2)) || this_1.vTaskList[i].vGroup == 2) {
                if (!this_1.vTaskList[i].vVisible)
                    vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, 'tr', this_1.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
                else
                    vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, 'tr', this_1.vDivId + 'child_' + vID, 'gname ' + vBGColor);
                this_1.vTaskList[i].vListChildRow = vTmpRow_1;
                draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtasklist', '\u00A0');
                var editableClass = this_1.vEditable ? 'gtaskname gtaskeditable' : 'gtaskname';
                vTmpCell_1 = draw_utils_1.newNode(vTmpRow_1, 'td', null, editableClass);
                var vCellContents = '';
                for (var j = 1; j < this_1.vTaskList[i].vLevel; j++) {
                    vCellContents += '\u00A0\u00A0\u00A0\u00A0';
                }
                var task_2 = this_1.vTaskList[i];
                var vEventClickRow_1 = this_1.vEventClickRow;
                var vEventClickCollapse_1 = this_1.vEventClickCollapse;
                events_1.addListener('click', function (e) {
                    if (e.target.classList.contains('gfoldercollapse') === false) {
                        if (vEventClickRow_1 && typeof vEventClickRow_1 === "function") {
                            vEventClickRow_1(task_2);
                        }
                    }
                    else {
                        if (vEventClickCollapse_1 && typeof vEventClickCollapse_1 === "function") {
                            vEventClickCollapse_1(task_2);
                        }
                    }
                }, vTmpRow_1);
                if (this_1.vTaskList[i].vGroup == 1) {
                    var vTmpDiv = draw_utils_1.newNode(vTmpCell_1, 'div', null, null, vCellContents);
                    var vTmpSpan = draw_utils_1.newNode(vTmpDiv, 'span', this_1.vDivId + 'group_' + vID, 'gfoldercollapse', (this_1.vTaskList[i].vOpen) ? '-' : '+');
                    this_1.vTaskList[i].vGroupSpan = vTmpSpan;
                    events_1.addFolderListeners(this_1, vTmpSpan, vID);
                    var divTask = document.createElement('span');
                    divTask.innerHTML = '\u00A0' + this_1.vTaskList[i].vName;
                    vTmpDiv.appendChild(divTask);
                    // const text = makeInput(this.vTaskList[i].vName, this.vEditable, 'text');
                    // vTmpDiv.appendChild(document.createNode(text));
                    var callback = function (task, e) { return task.vName = e.target.value; };
                    events_1.addListenerInputCell(vTmpCell_1, this_1.vEventsChange, callback, this_1.vTaskList, i, 'taskname', this_1.Draw.bind(this_1));
                    events_1.addListenerClickCell(vTmpDiv, this_1.vEvents, this_1.vTaskList[i], 'taskname');
                }
                else {
                    vCellContents += '\u00A0\u00A0\u00A0\u00A0';
                    var text = draw_utils_1.makeInput(this_1.vTaskList[i].vName, this_1.vEditable, 'text');
                    var vTmpDiv = draw_utils_1.newNode(vTmpCell_1, 'div', null, null, vCellContents + text);
                    var callback = function (task, e) { return task.vName = e.target.value; };
                    events_1.addListenerInputCell(vTmpCell_1, this_1.vEventsChange, callback, this_1.vTaskList, i, 'taskname', this_1.Draw.bind(this_1));
                    events_1.addListenerClickCell(vTmpCell_1, this_1.vEvents, this_1.vTaskList[i], 'taskname');
                }
                this_1.getColumnOrder().forEach(function (column) {
                    if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                        draw_columns_1.draw_header(column, i, vTmpRow_1, _this.vTaskList, _this.vEditable, _this.vEventsChange, _this.vEvents, _this.vDateTaskTableDisplayFormat, _this.vAdditionalHeaders, _this.vFormat, _this.vLangs, _this.vLang, _this.vResources, _this.Draw.bind(_this));
                    }
                });
                vNumRows++;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.vTaskList.length; i++) {
            _loop_1(i);
        }
        // Render no daa in the chart
        if (this.vTaskList.length == 0) {
            var totalColumns = this.getColumnOrder()
                .filter(function (column) { return _this[column] == 1 || column === 'vAdditionalHeaders'; })
                .length;
            var vTmpRow_2 = draw_utils_1.newNode(vTmpContentTBody, 'tr', this.vDivId + 'child_', 'gname ');
            // this.vTaskList[i].setListChildRow(vTmpRow);
            var vTmpCell_2 = draw_utils_1.newNode(vTmpRow_2, 'td', null, 'gtasknolist', '', null, null, null, totalColumns);
            var vOutput = document.createDocumentFragment();
            draw_utils_1.newNode(vOutput, 'div', null, 'gtasknolist-label', this.vLangs[this.vLang]['nodata'] + '.');
            vTmpCell_2.appendChild(vOutput);
        }
        // DRAW the date format selector at bottom left.
        var vTmpRow = draw_utils_1.newNode(vTmpContentTBody, 'tr');
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
        var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
        vTmpCell.appendChild(this.drawSelector('bottom'));
        this.getColumnOrder().forEach(function (column) {
            if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                draw_columns_1.draw_bottom(column, vTmpRow, _this.vAdditionalHeaders);
            }
        });
        // Add some white space so the vertical scroll distance should always be greater
        // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
        // newNode(vTmpDiv2, 'br');
        // newNode(vTmpDiv2, 'br');
        return {
            vNumRows: vNumRows,
            vTmpContentTabWrapper: vTmpContentTabWrapper
        };
    };
    /**
     *
     * DRAW CHAR HEAD
     *
     */
    this.drawChartHead = function (vMinDate, vMaxDate, vColWidth, vNumRows) {
        var vRightHeader = document.createDocumentFragment();
        var vTmpDiv = draw_utils_1.newNode(vRightHeader, 'div', this.vDivId + 'gcharthead', 'gchartlbl gcontainercol');
        var gChartLbl = vTmpDiv;
        this.setChartHead(vTmpDiv);
        var vTmpTab = draw_utils_1.newNode(vTmpDiv, 'table', this.vDivId + 'chartTableh', 'gcharttableh');
        var vTmpTBody = draw_utils_1.newNode(vTmpTab, 'tbody');
        var vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr');
        var vTmpDate = new Date();
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
        if (this.vFormat == 'hour')
            vTmpDate.setHours(vMinDate.getHours());
        else
            vTmpDate.setHours(0);
        vTmpDate.setMinutes(0);
        vTmpDate.setSeconds(0);
        vTmpDate.setMilliseconds(0);
        var vColSpan = 1;
        // Major Date Header
        while (vTmpDate.getTime() <= vMaxDate.getTime()) {
            var vHeaderCellClass = 'gmajorheading';
            var vCellContents = '';
            if (this.vFormat == 'day') {
                var colspan = 7;
                if (!this.vShowWeekends) {
                    vHeaderCellClass += ' headweekends';
                    colspan = 5;
                }
                var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, colspan);
                vCellContents += date_utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                vTmpDate.setDate(vTmpDate.getDate() + 6);
                if (this.vShowEndWeekDate == 1)
                    vCellContents += ' - ' + date_utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                draw_utils_1.newNode(vTmpCell, 'div', null, null, vCellContents, vColWidth * colspan);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == 'week') {
                var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, vColWidth);
                draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                vTmpDate.setDate(vTmpDate.getDate() + 7);
            }
            else if (this.vFormat == 'month') {
                vColSpan = (12 - vTmpDate.getMonth());
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                    vColSpan -= (11 - vMaxDate.getMonth());
                var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            }
            else if (this.vFormat == 'quarter') {
                vColSpan = (4 - Math.floor(vTmpDate.getMonth() / 3));
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                    vColSpan -= (3 - Math.floor(vMaxDate.getMonth() / 3));
                var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            }
            else if (this.vFormat == 'hour') {
                vColSpan = (24 - vTmpDate.getHours());
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear() &&
                    vTmpDate.getMonth() == vMaxDate.getMonth() &&
                    vTmpDate.getDate() == vMaxDate.getDate())
                    vColSpan -= (23 - vMaxDate.getHours());
                var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr', null, 'footerdays');
        // Minor Date header and Cell Rows
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
        if (this.vFormat == 'hour')
            vTmpDate.setHours(vMinDate.getHours());
        var vNumCols = 0;
        while (vTmpDate.getTime() <= vMaxDate.getTime()) {
            var vMinorHeaderCellClass = 'gminorheading';
            if (this.vFormat == 'day') {
                if (vTmpDate.getDay() % 6 == 0) {
                    if (!this.vShowWeekends) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                        continue;
                    }
                    vMinorHeaderCellClass += 'wkend';
                }
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == 'week') {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 7);
            }
            else if (this.vFormat == 'month') {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 1);
                while (vTmpDate.getDate() > 1) {
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }
            else if (this.vFormat == 'quarter') {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 81);
                while (vTmpDate.getDate() > 1)
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == 'hour') {
                for (var i = vTmpDate.getHours(); i < 24; i++) {
                    vTmpDate.setHours(i); //works around daylight savings but may look a little odd on days where the clock goes forward
                    if (vTmpDate <= vMaxDate) {
                        var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, vMinorHeaderCellClass);
                        draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                }
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        var vDateRow = vTmpRow;
        // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
        var vTaskLeftPx = (vNumCols * (vColWidth + 3)) + 1;
        // Fix a small space at the end for day
        if (this.vFormat === 'day') {
            vTaskLeftPx += 2;
        }
        vTmpTab.style.width = vTaskLeftPx + 'px'; // Ensure that the headings has exactly the same width as the chart grid
        // const vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;
        var vSingleCell = false;
        if (this.vUseSingleCell !== 0 && this.vUseSingleCell < (vNumCols * vNumRows))
            vSingleCell = true;
        draw_utils_1.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
        vTmpDiv = draw_utils_1.newNode(vRightHeader, 'div', null, 'glabelfooter');
        return { gChartLbl: gChartLbl, vTaskLeftPx: vTaskLeftPx, vSingleCell: vSingleCell, vDateRow: vDateRow, vRightHeader: vRightHeader, vNumCols: vNumCols };
    };
    /**
     *
     * DRAW CHART BODY
     *
     */
    this.drawCharBody = function (vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow) {
        var vRightTable = document.createDocumentFragment();
        var vTmpDiv = draw_utils_1.newNode(vRightTable, 'div', this.vDivId + 'gchartbody', 'gchartgrid gcontainercol');
        this.setChartBody(vTmpDiv);
        var vTmpTab = draw_utils_1.newNode(vTmpDiv, 'table', this.vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
        this.setChartTable(vTmpTab);
        draw_utils_1.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
        var vTmpTBody = draw_utils_1.newNode(vTmpTab, 'tbody');
        var vTmpTFoot = draw_utils_1.newNode(vTmpTab, 'tfoot');
        events_1.syncScroll([vTmpContentTabWrapper, vTmpDiv], 'scrollTop');
        events_1.syncScroll([gChartLbl, vTmpDiv], 'scrollLeft');
        events_1.syncScroll([vTmpContentTabWrapper, gListLbl], 'scrollLeft');
        // Draw each row
        var i = 0;
        var j = 0;
        var bd;
        if (this.vDebug) {
            bd = new Date();
            console.info('before tasks loop', bd);
        }
        for (i = 0; i < this.vTaskList.length; i++) {
            var curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
            var curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();
            var vTaskLeftPx_1 = general_utils_1.getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends);
            var vTaskRightPx = general_utils_1.getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends);
            var curTaskPlanStart = void 0, curTaskPlanEnd = void 0;
            curTaskPlanStart = this.vTaskList[i].getPlanStart();
            curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
            var vTaskPlanLeftPx = 0;
            var vTaskPlanRightPx = 0;
            if (curTaskPlanStart && curTaskPlanEnd) {
                vTaskPlanLeftPx = general_utils_1.getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends);
                vTaskPlanRightPx = general_utils_1.getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends);
            }
            var vID = this.vTaskList[i].vID;
            var vComb = (this.vTaskList[i].vParItem && this.vTaskList[i].vParItem.vGroup == 2);
            var vCellFormat = '';
            var vTmpDiv_1 = null;
            var vTmpItem = this.vTaskList[i];
            var vCaptClass = null;
            // set cell width only for first row because of table-layout:fixed
            var taskCellWidth = i === 0 ? vColWidth : null;
            if (this.vTaskList[i].vMile && !vComb) {
                var vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, ((!this.vTaskList[i].vVisible) ? 'none' : null));
                this.vTaskList[i].vChildRow = vTmpRow;
                events_1.addThisRowListeners(this, this.vTaskList[i].vListChildRow, vTmpRow);
                var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskcell gtaskcellmile', null, vColWidth, null, null, null);
                vTmpDiv_1 = draw_utils_1.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                vTmpDiv_1 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, vTaskLeftPx_1 + vTaskRightPx - 6);
                this.vTaskList[i].vBarDiv = vTmpDiv_1;
                var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].vClass, null, 12);
                this.vTaskList[i].vTaskDiv = vTmpDiv2;
                if (this.vTaskList[i].getCompVal() < 100)
                    vTmpDiv2.appendChild(document.createTextNode('\u25CA'));
                else {
                    vTmpDiv2 = draw_utils_1.newNode(vTmpDiv2, 'div', null, 'gmilediamond');
                    draw_utils_1.newNode(vTmpDiv2, 'div', null, 'gmdtop');
                    draw_utils_1.newNode(vTmpDiv2, 'div', null, 'gmdbottom');
                }
                vCaptClass = 'gmilecaption';
                if (!vSingleCell && !vComb) {
                    this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                }
            }
            else {
                var vTaskWidth = vTaskRightPx;
                // Draw Group Bar which has outer div with inner group div
                // and several small divs to left and right to create angled-end indicators
                if (this.vTaskList[i].vGroup) {
                    vTaskWidth = (vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2) ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
                    vTaskWidth = (vTaskWidth < this.vMinGpLen) ? this.vMinGpLen : vTaskWidth; // expand to show one end point
                    var vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, ((this.vTaskList[i].vGroup == 2) ? 'glineitem gitem' : 'ggroupitem ggroup') + this.vFormat, null, null, null, ((!this.vTaskList[i].vVisible) ? 'none' : null));
                    this.vTaskList[i].vChildRow = vTmpRow;
                    events_1.addThisRowListeners(this, this.vTaskList[i].vListChildRow, vTmpRow);
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskcell gtaskcellbar', null, vColWidth, null, null);
                    vTmpDiv_1 = draw_utils_1.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                    this.vTaskList[i].vCellDiv = vTmpDiv_1;
                    if (this.vTaskList[i].vGroup == 1) {
                        vTmpDiv_1 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx_1);
                        this.vTaskList[i].vBarDiv = vTmpDiv_1;
                        var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].vClass, null, vTaskWidth);
                        this.vTaskList[i].vTaskDiv = vTmpDiv2;
                        draw_utils_1.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].vClass + 'complete', null, this.vTaskList[i].getCompStr());
                        draw_utils_1.newNode(vTmpDiv_1, 'div', null, this.vTaskList[i].vClass + 'endpointleft');
                        if (vTaskWidth >= this.vMinGpLen * 2)
                            draw_utils_1.newNode(vTmpDiv_1, 'div', null, this.vTaskList[i].vClass + 'endpointright');
                        vCaptClass = 'ggroupcaption';
                    }
                    if (!vSingleCell && !vComb) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
                else {
                    vTaskWidth = (vTaskWidth <= 0) ? 1 : vTaskWidth;
                    /**
                     * DRAW THE BOXES FOR GANTT
                     */
                    var vTmpDivCell = void 0, vTmpRow = void 0;
                    if (vComb) {
                        vTmpDivCell = vTmpDiv_1 = this.vTaskList[i].vParItem.vCellDiv;
                    }
                    else {
                        // Draw Task Bar which has colored bar div
                        vTmpRow = draw_utils_1.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'glineitem gitem' + this.vFormat, null, null, null, ((!this.vTaskList[i].vVisible) ? 'none' : null));
                        this.vTaskList[i].vChildRow = vTmpRow;
                        events_1.addThisRowListeners(this, this.vTaskList[i].vListChildRow, vTmpRow);
                        var vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskcell gtaskcellcolorbar', null, taskCellWidth, null, null);
                        vTmpDivCell = vTmpDiv_1 = draw_utils_1.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                    }
                    // DRAW TASK BAR
                    vTmpDiv_1 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx_1);
                    this.vTaskList[i].vBarDiv = vTmpDiv_1;
                    var vTmpDiv2 = void 0;
                    if (this.vTaskList[i].vStart) {
                        // textbar
                        vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].vClass, null, vTaskWidth);
                        if (this.vTaskList[i].vBarText) {
                            draw_utils_1.newNode(vTmpDiv2, 'span', this.vDivId + 'tasktextbar_' + vID, 'textbar', this.vTaskList[i].vBarText, this.vTaskList[i].getCompRestStr());
                        }
                        this.vTaskList[i].vTaskDiv = vTmpDiv2;
                    }
                    // PLANNED
                    // If exist and one of them are different, show plan bar... show if there is no real vStart as well (just plan dates)
                    if (vTaskPlanLeftPx && ((vTaskPlanLeftPx != vTaskLeftPx_1 || vTaskPlanRightPx != vTaskRightPx) || !this.vTaskList[i].vStart)) {
                        var vTmpPlanDiv = draw_utils_1.newNode(vTmpDivCell, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer gplan', null, vTaskPlanRightPx, vTaskPlanLeftPx);
                        var vTmpPlanDiv2 = draw_utils_1.newNode(vTmpPlanDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].vClass + ' gplan', null, vTaskPlanRightPx);
                        this.vTaskList[i].vPlanTaskDiv = vTmpPlanDiv2;
                    }
                    // and opaque completion div
                    if (vTmpDiv2) {
                        draw_utils_1.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].vClass + 'complete', null, this.vTaskList[i].getCompStr());
                    }
                    // caption
                    if (vComb)
                        vTmpItem = this.vTaskList[i].vParItem;
                    if (!vComb || (vComb && this.vTaskList[i].vParItem.getEnd() == this.vTaskList[i].getEnd()))
                        vCaptClass = 'gcaption';
                    // Background cells
                    if (!vSingleCell && !vComb && vTmpRow) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
            }
            if (this.getCaptionType() && vCaptClass !== null) {
                var vCaptionStr = void 0;
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
                draw_utils_1.newNode(vTmpDiv_1, 'div', null, vCaptClass, vCaptionStr, 120, (vCaptClass == 'gmilecaption') ? 12 : 0);
            }
            // Add Task Info div for tooltip
            if (this.vTaskList[i].vTaskDiv && vTmpDiv_1) {
                var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                var _a = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _a.component, callback = _a.callback;
                vTmpDiv2.appendChild(component);
                events_1.addTooltipListeners(this, this.vTaskList[i].vTaskDiv, vTmpDiv2, callback);
            }
            // Add Plan Task Info div for tooltip
            if (this.vTaskList[i].vPlanTaskDiv && vTmpDiv_1) {
                var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                var _b = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _b.component, callback = _b.callback;
                vTmpDiv2.appendChild(component);
                events_1.addTooltipListeners(this, this.vTaskList[i].vPlanTaskDiv, vTmpDiv2, callback);
            }
        }
        // Include the footer with the days/week/month...
        if (vSingleCell) {
            var vTmpTFootTRow = draw_utils_1.newNode(vTmpTFoot, 'tr');
            var vTmpTFootTCell = draw_utils_1.newNode(vTmpTFootTRow, 'td', null, null, null, '100%');
            var vTmpTFootTCellTable = draw_utils_1.newNode(vTmpTFootTCell, 'table', null, 'gcharttableh', null, '100%');
            var vTmpTFootTCellTableTBody = draw_utils_1.newNode(vTmpTFootTCellTable, 'tbody');
            vTmpTFootTCellTableTBody.appendChild(vDateRow.cloneNode(true));
        }
        else {
            vTmpTFoot.appendChild(vDateRow.cloneNode(true));
        }
        return { vRightTable: vRightTable };
    };
    this.drawColsChart = function (vNumCols, vTmpRow, taskCellWidth, pStartDate, pEndDate) {
        if (pStartDate === void 0) { pStartDate = null; }
        if (pEndDate === void 0) { pEndDate = null; }
        var columnCurrentDay = null;
        // Find the Current day cell to put a different class
        if (this.vShowWeekends !== false && pStartDate && pEndDate && (this.vFormat == 'day' || this.vFormat == 'week')) {
            var curTaskStart = new Date(pStartDate.getTime());
            var curTaskEnd = new Date();
            var onePeriod = 3600000;
            if (this.vFormat == 'day') {
                onePeriod *= 24;
            }
            else if (this.vFormat == 'week') {
                onePeriod *= 24 * 7;
            }
            columnCurrentDay = Math.floor(general_utils_1.calculateCurrentDateOffset(curTaskStart, curTaskEnd) / onePeriod) - 1;
        }
        for (var j = 0; j < vNumCols - 1; j++) {
            var vCellFormat = 'gtaskcell gtaskcellcols';
            if (this.vShowWeekends !== false && this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) {
                vCellFormat = 'gtaskcellwkend';
            }
            //When is the column is the current day/week,give a different class
            else if ((this.vFormat == 'week' || this.vFormat == 'day') && j === columnCurrentDay) {
                vCellFormat = 'gtaskcellcurrent';
            }
            draw_utils_1.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0', taskCellWidth);
        }
    };
    /**
     *
     *
     * DRAWING PROCESS
     *
     *  vTaskRightPx,vTaskWidth,vTaskPlanLeftPx,vTaskPlanRightPx,vID
     */
    this.Draw = function () {
        var vMaxDate = new Date();
        var vMinDate = new Date();
        var vColWidth = 0;
        var bd;
        if (this.vEvents && this.vEvents.beforeDraw) {
            this.vEvents.beforeDraw();
        }
        if (this.vDebug) {
            bd = new Date();
            console.info('before draw', bd);
        }
        // Process all tasks, reset parent date and completion % if task list has altered
        if (this.vProcessNeeded)
            task_1.processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
        this.vProcessNeeded = false;
        // get overall min/max dates plus padding
        vMinDate = date_utils_1.getMinDate(this.vTaskList, this.vFormat, this.getMinDate() && date_utils_1.coerceDate(this.getMinDate()));
        vMaxDate = date_utils_1.getMaxDate(this.vTaskList, this.vFormat, this.getMaxDate() && date_utils_1.coerceDate(this.getMaxDate()));
        // Calculate chart width variables.
        if (this.vFormat == 'day')
            vColWidth = this.vDayColWidth;
        else if (this.vFormat == 'week')
            vColWidth = this.vWeekColWidth;
        else if (this.vFormat == 'month')
            vColWidth = this.vMonthColWidth;
        else if (this.vFormat == 'quarter')
            vColWidth = this.vQuarterColWidth;
        else if (this.vFormat == 'hour')
            vColWidth = this.vHourColWidth;
        // DRAW the Left-side of the chart (names, resources, comp%)
        var vLeftHeader = document.createDocumentFragment();
        /**
         * LIST HEAD
        */
        var gListLbl = this.drawListHead(vLeftHeader);
        /**
         * LIST BODY
        */
        var _a = this.drawListBody(vLeftHeader), vNumRows = _a.vNumRows, vTmpContentTabWrapper = _a.vTmpContentTabWrapper;
        /**
         * CHART HEAD
         */
        var _b = this.drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows), gChartLbl = _b.gChartLbl, vTaskLeftPx = _b.vTaskLeftPx, vSingleCell = _b.vSingleCell, vRightHeader = _b.vRightHeader, vDateRow = _b.vDateRow, vNumCols = _b.vNumCols;
        /**
         * CHART GRID
         */
        var vRightTable = this.drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow).vRightTable;
        if (this.vDebug) {
            var ad = new Date();
            console.info('after tasks loop', ad, (ad.getTime() - bd.getTime()));
        }
        // MAIN VIEW: Appending all generated components to main view
        while (this.vDiv.hasChildNodes())
            this.vDiv.removeChild(this.vDiv.firstChild);
        var vTmpDiv = draw_utils_1.newNode(this.vDiv, 'div', null, 'gchartcontainer');
        vTmpDiv.style.height = this.vTotalHeight;
        var leftvTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', null, 'gmain gmainleft');
        leftvTmpDiv.appendChild(vLeftHeader);
        // leftvTmpDiv.appendChild(vLeftTable);
        var rightvTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', null, 'gmain gmainright');
        rightvTmpDiv.appendChild(vRightHeader);
        rightvTmpDiv.appendChild(vRightTable);
        vTmpDiv.appendChild(leftvTmpDiv);
        vTmpDiv.appendChild(rightvTmpDiv);
        draw_utils_1.newNode(vTmpDiv, 'div', null, 'ggridfooter');
        var vTmpDiv2 = draw_utils_1.newNode(this.getChartBody(), 'div', this.vDivId + 'Lines', 'glinediv');
        if (this.vEvents.onLineContainerHover && typeof this.vEvents.onLineContainerHover === 'function') {
            events_1.addListener('mouseover', this.vEvents.onLineContainerHover, vTmpDiv2);
            events_1.addListener('mouseout', this.vEvents.onLineContainerHover, vTmpDiv2);
        }
        vTmpDiv2.style.visibility = 'hidden';
        this.setLines(vTmpDiv2);
        /* Quick hack to show the generated HTML on older browsers
              let tmpGenSrc=document.createElement('textarea');
              tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
              vDiv.appendChild(tmpGenSrc);
        //*/
        // LISTENERS: Now all the content exists, register scroll listeners
        events_1.addScrollListeners(this);
        // SCROLL: now check if we are actually scrolling the pane
        if (this.vScrollTo != '') {
            var vScrollDate = new Date(vMinDate.getTime());
            var vScrollPx = 0;
            if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == 'px') {
                vScrollPx = parseInt(this.vScrollTo.substr(2));
            }
            else {
                if (this.vScrollTo === 'today') {
                    vScrollDate = new Date();
                }
                else if (this.vScrollTo instanceof Date) {
                    vScrollDate = this.vScrollTo;
                }
                else {
                    vScrollDate = date_utils_1.parseDateStr(this.vScrollTo, this.getDateInputFormat());
                }
                if (this.vFormat == 'hour')
                    vScrollDate.setMinutes(0, 0, 0);
                else
                    vScrollDate.setHours(0, 0, 0, 0);
                vScrollPx = general_utils_1.getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends) - 30;
            }
            this.getChartBody().scrollLeft = vScrollPx;
        }
        if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime()) {
            this.vTodayPx = general_utils_1.getOffset(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends);
        }
        else
            this.vTodayPx = -1;
        // DEPENDENCIES: Draw lines of Dependencies
        var bdd;
        if (this.vDebug) {
            bdd = new Date();
            console.info('before DrawDependencies', bdd);
        }
        if (this.vEvents && typeof this.vEvents.beforeLineDraw === 'function') {
            this.vEvents.beforeLineDraw();
        }
        this.DrawDependencies(this.vDebug);
        events_1.addListenerDependencies(this.vLineOptions);
        // EVENTS
        if (this.vEvents && typeof this.vEvents.afterLineDraw === 'function') {
            this.vEvents.afterLineDraw();
        }
        if (this.vDebug) {
            var ad = new Date();
            console.info('after DrawDependencies', ad, (ad.getTime() - bdd.getTime()));
        }
        this.drawComplete(vMinDate, vColWidth, bd);
    };
    /**
     * Actions after all the render process
     */
    this.drawComplete = function (vMinDate, vColWidth, bd) {
        if (this.vDebug) {
            var ad = new Date();
            console.info('after draw', ad, (ad.getTime() - bd.getTime()));
        }
        events_1.updateGridHeaderWidth(this);
        this.chartRowDateToX = function (date) {
            return general_utils_1.getOffset(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends);
        };
        if (this.vEvents && this.vEvents.afterDraw) {
            this.vEvents.afterDraw();
        }
    };
    if (this.vDiv && this.vDiv.nodeName && this.vDiv.nodeName.toLowerCase() == 'div')
        this.vDivId = this.vDiv.id;
}; //GanttChart
exports.GanttChart = GanttChart;

},{"./draw_columns":3,"./draw_dependencies":4,"./events":5,"./lang":8,"./options":9,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13,"./xml":14}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw_task_headings = exports.draw_bottom = exports.draw_header = exports.COLUMN_ORDER = void 0;
var date_utils_1 = require("./utils/date_utils");
var task_1 = require("./task");
var events_1 = require("./events");
var draw_utils_1 = require("./utils/draw_utils");
exports.COLUMN_ORDER = [
    'vShowRes',
    'vShowDur',
    'vShowComp',
    'vShowStartDate',
    'vShowEndDate',
    'vShowPlanStartDate',
    'vShowPlanEndDate',
    'vShowCost',
    'vAdditionalHeaders',
    'vShowAddEntries'
];
var COLUMNS_TYPES = {
    'vShowRes': 'res',
    'vShowDur': 'dur',
    'vShowComp': 'comp',
    'vShowStartDate': 'startdate',
    'vShowEndDate': 'enddate',
    'vShowPlanStartDate': 'planstartdate',
    'vShowPlanEndDate': 'planenddate',
    'vShowCost': 'cost',
    'vShowAddEntries': 'addentries'
};
var draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents, vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
    var vTmpCell, vTmpDiv;
    if ('vShowRes' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gres');
        var text = draw_utils_1.makeInput(vTaskList[i].vRes, vEditable, 'resource', vTaskList[i].vRes, vResources);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.vRes = e.target.value; };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'res', Draw, 'change');
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'res');
    }
    if ('vShowDur' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gdur');
        var text = draw_utils_1.makeInput(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.vDuration = e.target.value; };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'dur', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'dur');
    }
    if ('vShowComp' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcomp');
        var text = draw_utils_1.makeInput(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { task.vComp = e.target.value; task.vCompVal = e.target.value; };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'comp', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'comp');
    }
    if ('vShowStartDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gstartdate');
        var v = date_utils_1.formatDateStr(vTaskList[i].vStart, vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].vStart);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setStart(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'start', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'start');
    }
    if ('vShowEndDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'genddate');
        var v = date_utils_1.formatDateStr(vTaskList[i].vEnd, vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].vEnd);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setEnd(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'end', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'end');
    }
    if ('vShowPlanStartDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanstartdate');
        var v = vTaskList[i].getPlanStart() ? date_utils_1.formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanStart());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanStart(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planstart');
    }
    if ('vShowPlanEndDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanenddate');
        var v = vTaskList[i].getPlanEnd() ? date_utils_1.formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanEnd());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.planEnd = e.target.value; };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planend');
    }
    if ('vShowCost' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcost');
        var text = draw_utils_1.makeInput(vTaskList[i].vCost, vEditable, 'cost');
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.vCost = e.target.value; };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'cost', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'cost');
    }
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            var data = vTaskList[i].vDataObject;
            vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, "gadditional " + css);
            vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
            events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], "additional_" + key);
            // const callback = (task, e) => task.setCost(e.target.value);
            // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'costdate');
        }
    }
    if ('vShowAddEntries' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gaddentries');
        var button = "<button>+</button>";
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, button);
        var callback = function (task, e) {
            task_1.AddTaskItemObject({
                vParent: task.vParent
            });
        };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'addentries', Draw.bind(this));
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'addentries');
    }
};
exports.draw_header = draw_header;
var draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            draw_utils_1.newNode(vTmpRow, 'td', null, "gspanning gadditional " + css, '\u00A0');
        }
    }
    else {
        var type = COLUMNS_TYPES[column];
        draw_utils_1.newNode(vTmpRow, 'td', null, "gspanning g" + type, '\u00A0');
    }
};
exports.draw_bottom = draw_bottom;
// export const draw_list_headings = function (column, vTmpRow, vAdditionalHeaders, vEvents) {
//   let nodeCreated;
//   if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
//     for (const key in vAdditionalHeaders) {
//       const header = vAdditionalHeaders[key];
//       const css = header.class ? header.class : `gadditional-${key}`;
//       newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
//     }
//   } else {
//     const type = COLUMNS_TYPES[column];
//     nodeCreated = newNode(vTmpRow, 'td', null, `gspanning g${type}`, '\u00A0');
//     addListenerClickCell(nodeCreated, vEvents, { hader: true, column }, type);
//   }
// }
var draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders, vEvents) {
    var nodeCreated;
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var text = header.translate ? vLangs[vLang][header.translate] : header.title;
            var css = header.class ? header.class : "gadditional-" + key;
            nodeCreated = draw_utils_1.newNode(vTmpRow, 'td', null, "gtaskheading gadditional " + css, text);
        }
    }
    else {
        var type = COLUMNS_TYPES[column];
        nodeCreated = draw_utils_1.newNode(vTmpRow, 'td', null, "gtaskheading g" + type, vLangs[vLang][type]);
        events_1.addListenerClickCell(nodeCreated, vEvents, { hader: true, column: column }, type);
    }
};
exports.draw_task_headings = draw_task_headings;

},{"./events":5,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawDependencies = exports.drawDependency = void 0;
var drawDependency = function (x1, y1, x2, y2, pType, pClass) {
    var vDir = 1;
    var vBend = false;
    var vShort = 4;
    var vRow = Math.floor(this.getRowHeight() / 2);
    if (y2 < y1)
        vRow *= -1;
    switch (pType) {
        case 'SF':
            vShort *= -1;
            if (x1 - 10 <= x2 && y1 != y2)
                vBend = true;
            vDir = -1;
            break;
        case 'SS':
            if (x1 < x2)
                vShort *= -1;
            else
                vShort = x2 - x1 - (2 * vShort);
            break;
        case 'FF':
            if (x1 <= x2)
                vShort = x2 - x1 + (2 * vShort);
            vDir = -1;
            break;
        default:
            if (x1 + 10 >= x2 && y1 != y2)
                vBend = true;
            break;
    }
    if (vBend) {
        this.sLine(x1, y1, x1 + vShort, y1, pClass);
        this.sLine(x1 + vShort, y1, x1 + vShort, y2 - vRow, pClass);
        this.sLine(x1 + vShort, y2 - vRow, x2 - (vShort * 2), y2 - vRow, pClass);
        this.sLine(x2 - (vShort * 2), y2 - vRow, x2 - (vShort * 2), y2, pClass);
        this.sLine(x2 - (vShort * 2), y2, x2 - (1 * vDir), y2, pClass);
    }
    else if (y1 != y2) {
        this.sLine(x1, y1, x1 + vShort, y1, pClass);
        this.sLine(x1 + vShort, y1, x1 + vShort, y2, pClass);
        this.sLine(x1 + vShort, y2, x2 - (1 * vDir), y2, pClass);
    }
    else
        this.sLine(x1, y1, x2 - (1 * vDir), y2, pClass);
    var vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
    vTmpDiv.style.width = '0px';
    vTmpDiv.style.height = '0px';
};
exports.drawDependency = drawDependency;
var DrawDependencies = function (vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    if (this.getShowDeps() == 1) {
        this.CalcTaskXY(); //First recalculate the x,y
        this.clearDependencies();
        var vList = this.getList();
        for (var i = 0; i < vList.length; i++) {
            var vDepend = vList[i].vDepend;
            var vDependType = vList[i].vDependType;
            var n = vDepend.length;
            if (n > 0 && vList[i].vVisible) {
                for (var k = 0; k < n; k++) {
                    var vTask = this.getArrayLocationByID(vDepend[k]);
                    if (vTask >= 0 && vList[vTask].vGroup != 2) {
                        if (vList[vTask].vVisible) {
                            if (vDebug) {
                                console.info("init drawDependency ", vList[vTask].vID, new Date());
                            }
                            var cssClass = 'gDepId' + vList[vTask].vID +
                                ' ' + 'gDepNextId' + vList[i].vID;
                            var dependedData = vList[vTask].vDataObject;
                            var nextDependedData = vList[i].vDataObject;
                            if (dependedData && dependedData.pID && nextDependedData && nextDependedData.pID) {
                                cssClass += ' gDepDataId' + dependedData.pID + ' ' + 'gDepNextDataId' + nextDependedData.pID;
                            }
                            if (vDependType[k] == 'SS')
                                this.drawDependency(vList[vTask].x1 - 1, vList[vTask].y1, vList[i].x1 - 1, vList[i].y1, 'SS', cssClass + ' gDepSS');
                            else if (vDependType[k] == 'FF')
                                this.drawDependency(vList[vTask].x2, vList[vTask].y2, vList[i].x2, vList[i].y2, 'FF', cssClass + ' gDepFF');
                            else if (vDependType[k] == 'SF')
                                this.drawDependency(vList[vTask].x1 - 1, vList[vTask].y1, vList[i].x2, vList[i].y2, 'SF', cssClass + ' gDepSF');
                            else if (vDependType[k] == 'FS')
                                this.drawDependency(vList[vTask].x2, vList[vTask].y2, vList[i].x1 - 1, vList[i].y1, 'FS', cssClass + ' gDepFS');
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
exports.DrawDependencies = DrawDependencies;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addListenerDependencies = exports.addListenerInputCell = exports.addListenerClickCell = exports.addScrollListeners = exports.addFormatListeners = exports.addFolderListeners = exports.updateGridHeaderWidth = exports.addThisRowListeners = exports.addTooltipListeners = exports.syncScroll = exports.removeListener = exports.addListener = exports.showToolTip = exports.mouseOut = exports.mouseOver = exports.show = exports.hide = exports.folder = void 0;
var general_utils_1 = require("./utils/general_utils");
// Function to open/close and hide/show children of specified task
var folder = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].vID == pID) {
            if (vList[i].vOpen) {
                vList[i].vOpen = false;
                exports.hide(pID, ganttObj);
                if (general_utils_1.isIE())
                    vList[i].vGroupSpan.innerText = '+';
                else
                    vList[i].vGroupSpan.textContent = '+';
            }
            else {
                vList[i].vOpen = true;
                exports.show(pID, 1, ganttObj);
                if (general_utils_1.isIE())
                    vList[i].vGroupSpan.innerText = '-';
                else
                    vList[i].vGroupSpan.textContent = '-';
            }
        }
    }
    var bd;
    if (this.vDebug) {
        bd = new Date();
        console.info('after drawDependency', bd);
    }
    ganttObj.DrawDependencies(this.vDebug);
    if (this.vDebug) {
        var ad = new Date();
        console.info('after drawDependency', ad, (ad.getTime() - bd.getTime()));
    }
};
exports.folder = folder;
var hide = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].vParent == pID) {
            vID = vList[i].vID;
            // it's unlikely but if the task list has been updated since
            // the chart was drawn some of the rows may not exist
            if (vList[i].vListChildRow)
                vList[i].vListChildRow.style.display = 'none';
            if (vList[i].vChildRow)
                vList[i].vChildRow.style.display = 'none';
            vList[i].vVisible = false;
            if (vList[i].vGroup)
                exports.hide(vID, ganttObj);
        }
    }
};
exports.hide = hide;
// Function to show children of specified task
var show = function (pID, pTop, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    var vState = '';
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].vParent == pID) {
            if (!vList[i].vParItem) {
                console.error("Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)");
            }
            if (vList[i].vParItem.vGroupSpan) {
                if (general_utils_1.isIE())
                    vState = vList[i].vParItem.vGroupSpan.innerText;
                else
                    vState = vList[i].vParItem.vGroupSpan.textContent;
            }
            i = vList.length;
        }
    }
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].vParent == pID) {
            var vChgState = false;
            vID = vList[i].vID;
            if (pTop == 1 && vState == '+')
                vChgState = true;
            else if (vState == '-')
                vChgState = true;
            else if (vList[i].vParItem && vList[i].vParItem.vGroup == 2)
                vList[i].vVisible = true;
            if (vChgState) {
                if (vList[i].vListChildRow)
                    vList[i].vListChildRow.style.display = '';
                if (vList[i].vChildRow)
                    vList[i].vChildRow.style.display = '';
                vList[i].vVisible = true;
            }
            if (vList[i].vGroup)
                exports.show(vID, 0, ganttObj);
        }
    }
};
exports.show = show;
var mouseOver = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className += ' gitemhighlight';
        pObj2.className += ' gitemhighlight';
    }
};
exports.mouseOver = mouseOver;
var mouseOut = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
        pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    }
};
exports.mouseOut = mouseOut;
var showToolTip = function (pGanttChartObj, e, pContents, pWidth, pTimer) {
    var vTtDivId = pGanttChartObj.getDivId() + 'JSGanttToolTip';
    var vMaxW = 500;
    var vMaxAlpha = 100;
    var vShowing = pContents.id;
    if (pGanttChartObj.getUseToolTip()) {
        if (pGanttChartObj.vTool == null) {
            pGanttChartObj.vTool = document.createElement('div');
            pGanttChartObj.vTool.id = vTtDivId;
            pGanttChartObj.vTool.className = 'JSGanttToolTip';
            pGanttChartObj.vTool.vToolCont = document.createElement('div');
            pGanttChartObj.vTool.vToolCont.id = vTtDivId + 'cont';
            pGanttChartObj.vTool.vToolCont.className = 'JSGanttToolTipcont';
            pGanttChartObj.vTool.vToolCont.setAttribute('showing', '');
            pGanttChartObj.vTool.appendChild(pGanttChartObj.vTool.vToolCont);
            document.body.appendChild(pGanttChartObj.vTool);
            pGanttChartObj.vTool.style.opacity = 0;
            pGanttChartObj.vTool.setAttribute('currentOpacity', 0);
            pGanttChartObj.vTool.setAttribute('fadeIncrement', 10);
            pGanttChartObj.vTool.setAttribute('moveSpeed', 10);
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=0)';
            pGanttChartObj.vTool.style.visibility = 'hidden';
            pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : window.event.clientX) / 2) + 'px';
            pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : window.event.clientY) / 2) + 'px';
            this.addListener('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
            this.addListener('mouseout', function () { general_utils_1.delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
        }
        clearTimeout(pGanttChartObj.vTool.delayTimeout);
        var newHTML = pContents.innerHTML;
        if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
            pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
            // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
            general_utils_1.stripIds(pGanttChartObj.vTool.vToolCont);
            pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
        }
        if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
            if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
                pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
            }
            pGanttChartObj.vTool.style.visibility = 'visible';
            // Rather than follow the mouse just have it stay put
            general_utils_1.updateFlyingObj(e, pGanttChartObj, pTimer);
            pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
            if (!pWidth && general_utils_1.isIE()) {
                pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
            }
            if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
                pGanttChartObj.vTool.style.width = vMaxW + 'px';
            }
        }
        if (pGanttChartObj.getUseFade()) {
            clearInterval(pGanttChartObj.vTool.fadeInterval);
            pGanttChartObj.vTool.fadeInterval = setInterval(function () { general_utils_1.fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
        }
        else {
            pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
        }
    }
};
exports.showToolTip = showToolTip;
var addListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = general_utils_1.findObj(control);
    if (control.addEventListener) //Standard W3C
     {
        return control.addEventListener(eventName, handler, false);
    }
    else if (control.attachEvent) //IExplore
     {
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.addListener = addListener;
var removeListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = general_utils_1.findObj(control);
    if (control.removeEventListener) {
        //Standard W3C
        return control.removeEventListener(eventName, handler, false);
    }
    else if (control.detachEvent) {
        //IExplore
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.removeListener = removeListener;
var syncScroll = function (elements, attrName) {
    var syncFlags = new Map(elements.map(function (e) { return [e, false]; }));
    function scrollEvent(e) {
        if (!syncFlags.get(e.target)) {
            for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                var el = elements_2[_i];
                if (el !== e.target) {
                    syncFlags.set(el, true);
                    el[attrName] = e.target[attrName];
                }
            }
        }
        syncFlags.set(e.target, false);
    }
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var el = elements_1[_i];
        el.addEventListener('scroll', scrollEvent);
    }
};
exports.syncScroll = syncScroll;
var addTooltipListeners = function (pGanttChart, pObj1, pObj2, callback) {
    var isShowingTooltip = false;
    exports.addListener('mouseover', function (e) {
        if (isShowingTooltip || !callback) {
            exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
        }
        else if (callback) {
            isShowingTooltip = true;
            var promise = callback();
            exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
            if (promise && promise.then) {
                promise.then(function () {
                    if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id &&
                        pGanttChart.vTool.style.visibility === 'visible') {
                        exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
                    }
                });
            }
        }
    }, pObj1);
    exports.addListener('mouseout', function (e) {
        var outTo = e.relatedTarget;
        if (general_utils_1.isParentElementOrSelf(outTo, pObj1) || (pGanttChart.vTool && general_utils_1.isParentElementOrSelf(outTo, pGanttChart.vTool))) {
            // not actually out
        }
        else {
            isShowingTooltip = false;
        }
        general_utils_1.delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
    }, pObj1);
};
exports.addTooltipListeners = addTooltipListeners;
var addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
    exports.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
    exports.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
    exports.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
    exports.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};
exports.addThisRowListeners = addThisRowListeners;
var updateGridHeaderWidth = function (pGanttChart) {
    var head = pGanttChart.getChartHead();
    var body = pGanttChart.getChartBody();
    if (!head || !body)
        return;
    var isScrollVisible = body.scrollHeight > body.clientHeight;
    if (isScrollVisible) {
        head.style.width = "calc(100% - " + general_utils_1.getScrollbarWidth() + "px)";
    }
    else {
        head.style.width = '100%';
    }
};
exports.updateGridHeaderWidth = updateGridHeaderWidth;
var addFolderListeners = function (pGanttChart, pObj, pID) {
    exports.addListener('click', function () {
        exports.folder(pID, pGanttChart);
        exports.updateGridHeaderWidth(pGanttChart);
    }, pObj);
};
exports.addFolderListeners = addFolderListeners;
var addFormatListeners = function (pGanttChart, pFormat, pObj) {
    exports.addListener('click', function () { general_utils_1.changeFormat(pFormat, pGanttChart); }, pObj);
};
exports.addFormatListeners = addFormatListeners;
var addScrollListeners = function (pGanttChart) {
    exports.addListener('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
    exports.addListener('resize', function () {
        pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
    }, window);
};
exports.addScrollListeners = addScrollListeners;
var addListenerClickCell = function (vTmpCell, vEvents, task, column) {
    exports.addListener('click', function (e) {
        if (e.target.classList.contains('gfoldercollapse') === false &&
            vEvents[column] && typeof vEvents[column] === 'function') {
            vEvents[column](task, e, vTmpCell, column);
        }
    }, vTmpCell);
};
exports.addListenerClickCell = addListenerClickCell;
var addListenerInputCell = function (vTmpCell, vEventsChange, callback, tasks, index, column, draw, event) {
    if (draw === void 0) { draw = null; }
    if (event === void 0) { event = 'blur'; }
    var task = tasks[index];
    if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
        var tagName = vTmpCell.children[0].children[0].tagName;
        var selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';
        if (selectInputOrButton) {
            exports.addListener(event, function (e) {
                if (callback) {
                    callback(task, e);
                }
                if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
                    var q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);
                    if (q && q.then) {
                        q.then(function (e) { return draw(); });
                    }
                    else {
                        draw();
                    }
                }
                else {
                    draw();
                }
            }, vTmpCell.children[0].children[0]);
        }
    }
};
exports.addListenerInputCell = addListenerInputCell;
var addListenerDependencies = function (vLineOptions) {
    var elements = document.querySelectorAll('.gtaskbarcontainer');
    for (var i = 0; i < elements.length; i++) {
        var taskDiv = elements[i];
        taskDiv.addEventListener('mouseover', function (e) {
            toggleDependencies(e, vLineOptions);
        });
        taskDiv.addEventListener('mouseout', function (e) {
            toggleDependencies(e, vLineOptions);
        });
    }
};
exports.addListenerDependencies = addListenerDependencies;
var toggleDependencies = function (e, vLineOptions) {
    var target = e.currentTarget;
    var ids = target.getAttribute('id').split('_');
    var style = vLineOptions && vLineOptions.borderStyleHover !== undefined ? vLineOptions.hoverStyle : 'groove';
    if (e.type === 'mouseout') {
        style = '';
    }
    if (ids.length > 1) {
        var frameZones = Array.from(document.querySelectorAll(".gDepId" + ids[1]));
        frameZones.forEach(function (c) {
            c.style.borderStyle = style;
        });
        // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
        // c.style.borderStyle = style;
        // });
    }
};
var vColumnsNames = {
    taskname: 'pName',
    res: 'pRes',
    dur: '',
    comp: 'pComp',
    start: 'pStart',
    end: 'pEnd',
    planstart: 'pPlanStart',
    planend: 'pPlanEnd',
    link: 'pLink',
    cost: 'pCost',
    mile: 'pMile',
    group: 'pGroup',
    parent: 'pParent',
    open: 'pOpen',
    depend: 'pDepend',
    caption: 'pCaption',
    note: 'pNotes'
};

},{"./utils/general_utils":13}],6:[function(require,module,exports){
"use strict";
/*
    * Copyright (c) 2013-2018, Paul Geldart, Eduardo Rodrigues, Ricardo Cardoso and Mario Mol.
    *
    * Redistribution and use in source and binary forms, with or without
    * modification, are permitted provided that the following conditions are met:
    *     * Redistributions of source code must retain the above copyright
    *       notice, this list of conditions and the following disclaimer.
    *     * Redistributions in binary form must reproduce the above copyright
    *       notice, this list of conditions and the following disclaimer in the
    *       documentation and/or other materials provided with the distribution.
    *     * Neither the name of AUTHORS nor the names of its contributors
    *       may be used to endorse or promote products derived from this software
    *       without specific prior written permission.
    *
    * THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY EXPRESS OR
    * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
    * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
    * IN NO EVENT SHALL AUTHORS BE LIABLE FOR ANY DIRECT,
    * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    This project is based on jsGantt 1.2, (which can be obtained from
    https://code.google.com/p/jsgantt/) and remains under the original BSD license.
    Copyright (c) 2009, Shlomy Gantz BlueBrick Inc.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSGantt = void 0;
var events_1 = require("./events");
var general_utils_1 = require("./utils/general_utils");
var xml_1 = require("./xml");
var task_1 = require("./task");
var draw_1 = require("./draw");
var json_1 = require("./json");
var date_utils_1 = require("./utils/date_utils");
if (!exports.JSGantt)
    exports.JSGantt = {};
exports.JSGantt.isIE = general_utils_1.isIE;
exports.JSGantt.TaskItem = task_1.TaskItem;
exports.JSGantt.GanttChart = draw_1.GanttChart;
exports.JSGantt.updateFlyingObj = general_utils_1.updateFlyingObj;
exports.JSGantt.showToolTip = events_1.showToolTip;
exports.JSGantt.stripIds = general_utils_1.stripIds;
exports.JSGantt.stripUnwanted = general_utils_1.stripUnwanted;
exports.JSGantt.delayedHide = general_utils_1.delayedHide;
exports.JSGantt.hideToolTip = general_utils_1.hideToolTip;
exports.JSGantt.fadeToolTip = general_utils_1.fadeToolTip;
exports.JSGantt.moveToolTip = general_utils_1.moveToolTip;
exports.JSGantt.getZoomFactor = general_utils_1.getZoomFactor;
exports.JSGantt.getOffset = general_utils_1.getOffset;
exports.JSGantt.getScrollPositions = general_utils_1.getScrollPositions;
exports.JSGantt.processRows = task_1.processRows;
exports.JSGantt.sortTasks = task_1.sortTasks;
// Used to determine the minimum date of all tasks and set lower bound based on format
exports.JSGantt.getMinDate = date_utils_1.getMinDate;
// Used to determine the maximum date of all tasks and set upper bound based on format
exports.JSGantt.getMaxDate = date_utils_1.getMaxDate;
// This function finds the document id of the specified object
exports.JSGantt.findObj = general_utils_1.findObj;
exports.JSGantt.changeFormat = general_utils_1.changeFormat;
// Tasks
exports.JSGantt.folder = events_1.folder;
exports.JSGantt.hide = events_1.hide;
exports.JSGantt.show = events_1.show;
exports.JSGantt.taskLink = task_1.taskLink;
exports.JSGantt.parseDateStr = date_utils_1.parseDateStr;
exports.JSGantt.formatDateStr = date_utils_1.formatDateStr;
exports.JSGantt.parseDateFormatStr = date_utils_1.parseDateFormatStr;
// XML 
exports.JSGantt.parseXML = xml_1.parseXML;
exports.JSGantt.parseXMLString = xml_1.parseXMLString;
exports.JSGantt.findXMLNode = xml_1.findXMLNode;
exports.JSGantt.getXMLNodeValue = xml_1.getXMLNodeValue;
exports.JSGantt.AddXMLTask = xml_1.AddXMLTask;
// JSON
exports.JSGantt.parseJSON = json_1.parseJSON;
exports.JSGantt.parseJSONString = json_1.parseJSONString;
exports.JSGantt.addJSONTask = json_1.addJSONTask;
exports.JSGantt.benchMark = general_utils_1.benchMark;
exports.JSGantt.getIsoWeek = date_utils_1.getIsoWeek;
exports.JSGantt.addListener = events_1.addListener;
exports.JSGantt.addTooltipListeners = events_1.addTooltipListeners;
exports.JSGantt.addThisRowListeners = events_1.addThisRowListeners;
exports.JSGantt.addFolderListeners = events_1.addFolderListeners;
exports.JSGantt.addFormatListeners = events_1.addFormatListeners;
exports.JSGantt.addScrollListeners = events_1.addScrollListeners;
exports.JSGantt.criticalPath = general_utils_1.criticalPath;

},{"./draw":2,"./events":5,"./json":7,"./task":10,"./utils/date_utils":11,"./utils/general_utils":13,"./xml":14}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJSONTask = exports.parseJSONString = exports.parseJSON = void 0;
var task_1 = require("./task");
var general_utils_1 = require("./utils/general_utils");
/**
 *
 * @param pFile
 * @param pGanttlet
 */
var parseJSON = function (pFile, pGanttVar, vDebug, redrawAfter) {
    if (vDebug === void 0) { vDebug = false; }
    if (redrawAfter === void 0) { redrawAfter = true; }
    return __awaiter(this, void 0, void 0, function () {
        var jsonObj, bd, ad;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, general_utils_1.makeRequest(pFile, true, true)];
                case 1:
                    jsonObj = _a.sent();
                    if (vDebug) {
                        bd = new Date();
                        console.info('before jsonparse', bd);
                    }
                    exports.addJSONTask(pGanttVar, jsonObj);
                    if (this.vDebug) {
                        ad = new Date();
                        console.info('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
                    }
                    if (redrawAfter) {
                        pGanttVar.Draw();
                    }
                    return [2 /*return*/, jsonObj];
            }
        });
    });
};
exports.parseJSON = parseJSON;
var parseJSONString = function (pStr, pGanttVar) {
    exports.addJSONTask(pGanttVar, JSON.parse(pStr));
};
exports.parseJSONString = parseJSONString;
var addJSONTask = function (pGanttVar, pJsonObj) {
    for (var index = 0; index < pJsonObj.length; index++) {
        var id = void 0;
        var name_1 = void 0;
        var start = void 0;
        var end = void 0;
        var planstart = void 0;
        var planend = void 0;
        var itemClass = void 0;
        var link = '';
        var milestone = false;
        var resourceName = '';
        var completion = void 0;
        var group = 0;
        var parent_1 = void 0;
        var open_1 = void 0;
        var dependsOn = '';
        var caption = '';
        var notes = '';
        var cost = void 0;
        var duration = '';
        var bartext = '';
        var additionalObject = {};
        for (var prop in pJsonObj[index]) {
            var property = prop;
            var value = pJsonObj[index][property];
            switch (property.toLowerCase()) {
                case 'pid':
                case 'id':
                    id = value;
                    break;
                case 'pname':
                case 'name':
                    name_1 = value;
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
                    parent_1 = value;
                    break;
                case 'popen':
                case 'open':
                    open_1 = value;
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
                    additionalObject[property.toLowerCase()] = value;
            }
        }
        //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
        pGanttVar.AddTaskItem(new task_1.TaskItem(id, name_1, start, end, itemClass, link, milestone, resourceName, completion, group, parent_1, open_1, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, duration, bartext, additionalObject));
        //}
    }
};
exports.addJSONTask = addJSONTask;

},{"./task":10,"./utils/general_utils":13}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lang = void 0;
var en = {
    format: 'Format',
    hour: 'Hour',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    quarter: 'Quarter',
    hours: 'Hours',
    days: 'Days',
    weeks: 'Weeks',
    months: 'Months',
    quarters: 'Quarters',
    hr: 'Hr',
    dy: 'Day',
    wk: 'Wk',
    mth: 'Mth',
    qtr: 'Qtr',
    hrs: 'Hrs',
    dys: 'Days',
    wks: 'Wks',
    mths: 'Mths',
    qtrs: 'Qtrs',
    res: 'Resource',
    dur: 'Duration',
    comp: '% Comp.',
    completion: 'Completion',
    startdate: 'Start Date',
    planstartdate: 'Plan Start Date',
    enddate: 'End Date',
    planenddate: 'Plan End Date',
    duration: 'Duration',
    resource: 'Resource',
    cost: 'Cost',
    moreinfo: 'More Information',
    nodata: 'No tasks found',
    notes: 'Notes',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    maylong: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    tooltipLoading: 'Loading...'
};
var cn = {
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    maylong: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月',
    jan: '一月',
    feb: '二月',
    mar: '三月',
    apr: '四月',
    may: '五月',
    jun: '六月',
    jul: '七月',
    aug: '八月',
    sep: '九月',
    oct: '十月',
    nov: '十一',
    dec: '十二',
    sunday: '星期日',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sun: '日',
    mon: '一',
    tue: '二',
    wed: '三',
    thu: '四',
    fri: '五',
    sat: '六',
    res: '资源',
    dur: '用时',
    comp: '完成率',
    completion: '已完成',
    startdate: '起始日期',
    planstartdate: '计划起始日期',
    enddate: '结束日期',
    planenddate: '计划结束日期',
    cost: '成本',
    duration: '用时',
    resource: '资源',
    moreinfo: '更多信息',
    nodata: '没有任何任务数据',
    notes: '备注',
    format: '格式',
    hour: '时',
    day: '日',
    week: '星期',
    month: '月',
    quarter: '季',
    hours: '小时',
    days: '天',
    weeks: '周',
    months: '月',
    quarters: '季',
    hr: '小时',
    dy: '天',
    wk: '周',
    mth: '月',
    qtr: '季',
    hrs: '小时',
    dys: '天',
    wks: '周',
    mths: '月',
    qtrs: '季',
    tooltipLoading: '加载中'
};
exports.lang = { en: en, cn: cn };

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeGetSet = void 0;
var date_utils_1 = require("./utils/date_utils");
var draw_columns_1 = require("./draw_columns");
var includeGetSet = function () {
    /**
     * SETTERS
     */
    this.setOptions = function (options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = options[key];
            if (key === 'vResources' || key === 'vColumnOrder') {
                // ev = `this.set${key.substr(1)}(val)`;
                this['set' + key.substr(1)](val);
            }
            else if (val instanceof Array) {
                // ev = `this.set${key.substr(1)}(...val)`;
                this['set' + key.substr(1)].apply(this, val);
            }
            else {
                // ev = `this.set${key.substr(1)}(val)`;
                this['set' + key.substr(1)](val);
            }
        }
    };
    this.setUseFade = function (pVal) { this.vUseFade = pVal; };
    this.setUseMove = function (pVal) { this.vUseMove = pVal; };
    this.setUseRowHlt = function (pVal) { this.vUseRowHlt = pVal; };
    this.setUseToolTip = function (pVal) { this.vUseToolTip = pVal; };
    this.setUseSort = function (pVal) { this.vUseSort = pVal; };
    this.setUseSingleCell = function (pVal) { this.vUseSingleCell = pVal * 1; };
    this.setFormatArr = function () {
        var vValidFormats = 'hour day week month quarter';
        this.vFormatArr = new Array();
        for (var i = 0, j = 0; i < arguments.length; i++) {
            if (vValidFormats.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vFormatArr[j++] = arguments[i].toLowerCase();
                var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidFormats = vValidFormats.replace(vRegExp, '');
            }
        }
    };
    this.setShowRes = function (pVal) { this.vShowRes = pVal; };
    this.setShowDur = function (pVal) { this.vShowDur = pVal; };
    this.setShowComp = function (pVal) { this.vShowComp = pVal; };
    this.setShowStartDate = function (pVal) { this.vShowStartDate = pVal; };
    this.setShowEndDate = function (pVal) { this.vShowEndDate = pVal; };
    this.setShowPlanStartDate = function (pVal) { this.vShowPlanStartDate = pVal; };
    this.setShowPlanEndDate = function (pVal) { this.vShowPlanEndDate = pVal; };
    this.setShowCost = function (pVal) { this.vShowCost = pVal; };
    this.setShowAddEntries = function (pVal) { this.vShowAddEntries = pVal; };
    this.setShowTaskInfoRes = function (pVal) { this.vShowTaskInfoRes = pVal; };
    this.setShowTaskInfoDur = function (pVal) { this.vShowTaskInfoDur = pVal; };
    this.setShowTaskInfoComp = function (pVal) { this.vShowTaskInfoComp = pVal; };
    this.setShowTaskInfoStartDate = function (pVal) { this.vShowTaskInfoStartDate = pVal; };
    this.setShowTaskInfoEndDate = function (pVal) { this.vShowTaskInfoEndDate = pVal; };
    this.setShowTaskInfoNotes = function (pVal) { this.vShowTaskInfoNotes = pVal; };
    this.setShowTaskInfoLink = function (pVal) { this.vShowTaskInfoLink = pVal; };
    this.setShowEndWeekDate = function (pVal) { this.vShowEndWeekDate = pVal; };
    this.setShowWeekends = function (pVal) { this.vShowWeekends = pVal; };
    this.setShowSelector = function () {
        var vValidSelectors = 'top bottom';
        this.vShowSelector = new Array();
        for (var i = 0, j = 0; i < arguments.length; i++) {
            if (vValidSelectors.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vShowSelector[j++] = arguments[i].toLowerCase();
                var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidSelectors = vValidSelectors.replace(vRegExp, '');
            }
        }
    };
    this.setShowDeps = function (pVal) { this.vShowDeps = pVal; };
    this.setDateInputFormat = function (pVal) { this.vDateInputFormat = pVal; };
    this.setDateTaskTableDisplayFormat = function (pVal) { this.vDateTaskTableDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setDateTaskDisplayFormat = function (pVal) { this.vDateTaskDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setHourMajorDateDisplayFormat = function (pVal) { this.vHourMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setHourMinorDateDisplayFormat = function (pVal) { this.vHourMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setDayMajorDateDisplayFormat = function (pVal) { this.vDayMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setDayMinorDateDisplayFormat = function (pVal) { this.vDayMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setWeekMajorDateDisplayFormat = function (pVal) { this.vWeekMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setWeekMinorDateDisplayFormat = function (pVal) { this.vWeekMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setMonthMajorDateDisplayFormat = function (pVal) { this.vMonthMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setMonthMinorDateDisplayFormat = function (pVal) { this.vMonthMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setQuarterMajorDateDisplayFormat = function (pVal) { this.vQuarterMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setQuarterMinorDateDisplayFormat = function (pVal) { this.vQuarterMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setCaptionType = function (pType) { this.vCaptionType = pType; };
    this.setFormat = function (pFormat) {
        this.vFormat = pFormat;
        this.Draw();
    };
    this.setWorkingDays = function (workingDays) { this.vWorkingDays = workingDays; };
    this.setMinGpLen = function (pMinGpLen) { this.vMinGpLen = pMinGpLen; };
    this.setScrollTo = function (pDate) { this.vScrollTo = pDate; };
    this.setHourColWidth = function (pWidth) { this.vHourColWidth = pWidth; };
    this.setDayColWidth = function (pWidth) { this.vDayColWidth = pWidth; };
    this.setWeekColWidth = function (pWidth) { this.vWeekColWidth = pWidth; };
    this.setMonthColWidth = function (pWidth) { this.vMonthColWidth = pWidth; };
    this.setQuarterColWidth = function (pWidth) { this.vQuarterColWidth = pWidth; };
    this.setRowHeight = function (pHeight) { this.vRowHeight = pHeight; };
    this.setLang = function (pLang) { if (this.vLangs[pLang])
        this.vLang = pLang; };
    this.setChartBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vChartBody = pDiv; };
    this.setChartHead = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vChartHead = pDiv; };
    this.setListBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vListBody = pDiv; };
    this.setChartTable = function (pTable) { if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement)
        this.vChartTable = pTable; };
    this.setLines = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vLines = pDiv; };
    this.setLineOptions = function (lineOptions) { this.vLineOptions = lineOptions; };
    this.setTimer = function (pVal) { this.vTimer = pVal * 1; };
    this.setTooltipDelay = function (pVal) { this.vTooltipDelay = pVal * 1; };
    this.setTooltipTemplate = function (pVal) { this.vTooltipTemplate = pVal; };
    this.setMinDate = function (pVal) { this.vMinDate = pVal; };
    this.setMaxDate = function (pVal) { this.vMaxDate = pVal; };
    this.addLang = function (pLang, pVals) {
        if (!this.vLangs[pLang]) {
            this.vLangs[pLang] = new Object();
            for (var vKey in this.vLangs['en'])
                this.vLangs[pLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
        }
    };
    this.setTotalHeight = function (pVal) { this.vTotalHeight = pVal; };
    // EVENTS
    this.setEvents = function (pEvents) { this.vEvents = pEvents; };
    this.setEventsChange = function (pEventsChange) { this.vEventsChange = pEventsChange; };
    this.setEventClickRow = function (fn) { this.vEventClickRow = fn; };
    this.setEventClickCollapse = function (fn) { this.vEventClickCollapse = fn; };
    this.setResources = function (resources) { this.vResources = resources; };
    this.setAdditionalHeaders = function (headers) { this.vAdditionalHeaders = headers; };
    this.setColumnOrder = function (order) { this.vColumnOrder = order; };
    this.setEditable = function (editable) { this.vEditable = editable; };
    this.setDebug = function (debug) { this.vDebug = debug; };
    /**
     * GETTERS
     */
    this.getDivId = function () { return this.vDivId; };
    this.getUseFade = function () { return this.vUseFade; };
    this.getUseMove = function () { return this.vUseMove; };
    this.getUseRowHlt = function () { return this.vUseRowHlt; };
    this.getUseToolTip = function () { return this.vUseToolTip; };
    this.getUseSort = function () { return this.vUseSort; };
    this.getUseSingleCell = function () { return this.vUseSingleCell; };
    this.getFormatArr = function () { return this.vFormatArr; };
    this.getShowRes = function () { return this.vShowRes; };
    this.getShowDur = function () { return this.vShowDur; };
    this.getShowComp = function () { return this.vShowComp; };
    this.getShowStartDate = function () { return this.vShowStartDate; };
    this.getShowEndDate = function () { return this.vShowEndDate; };
    this.getShowPlanStartDate = function () { return this.vShowPlanStartDate; };
    this.getShowPlanEndDate = function () { return this.vShowPlanEndDate; };
    this.getShowCost = function () { return this.vShowCost; };
    this.getShowAddEntries = function () { return this.vShowAddEntries; };
    this.getShowTaskInfoRes = function () { return this.vShowTaskInfoRes; };
    this.getShowTaskInfoDur = function () { return this.vShowTaskInfoDur; };
    this.getShowTaskInfoComp = function () { return this.vShowTaskInfoComp; };
    this.getShowTaskInfoStartDate = function () { return this.vShowTaskInfoStartDate; };
    this.getShowTaskInfoEndDate = function () { return this.vShowTaskInfoEndDate; };
    this.getShowTaskInfoNotes = function () { return this.vShowTaskInfoNotes; };
    this.getShowTaskInfoLink = function () { return this.vShowTaskInfoLink; };
    this.getShowEndWeekDate = function () { return this.vShowEndWeekDate; };
    this.getShowWeekends = function () { return this.vShowWeekends; };
    this.getShowSelector = function () { return this.vShowSelector; };
    this.getShowDeps = function () { return this.vShowDeps; };
    this.getDateInputFormat = function () { return this.vDateInputFormat; };
    this.getDateTaskTableDisplayFormat = function () { return this.vDateTaskTableDisplayFormat; };
    this.getDateTaskDisplayFormat = function () { return this.vDateTaskDisplayFormat; };
    this.getHourMajorDateDisplayFormat = function () { return this.vHourMajorDateDisplayFormat; };
    this.getHourMinorDateDisplayFormat = function () { return this.vHourMinorDateDisplayFormat; };
    this.getDayMajorDateDisplayFormat = function () { return this.vDayMajorDateDisplayFormat; };
    this.getDayMinorDateDisplayFormat = function () { return this.vDayMinorDateDisplayFormat; };
    this.getWeekMajorDateDisplayFormat = function () { return this.vWeekMajorDateDisplayFormat; };
    this.getWeekMinorDateDisplayFormat = function () { return this.vWeekMinorDateDisplayFormat; };
    this.getMonthMajorDateDisplayFormat = function () { return this.vMonthMajorDateDisplayFormat; };
    this.getMonthMinorDateDisplayFormat = function () { return this.vMonthMinorDateDisplayFormat; };
    this.getQuarterMajorDateDisplayFormat = function () { return this.vQuarterMajorDateDisplayFormat; };
    this.getQuarterMinorDateDisplayFormat = function () { return this.vQuarterMinorDateDisplayFormat; };
    this.getCaptionType = function () { return this.vCaptionType; };
    this.getMinGpLen = function () { return this.vMinGpLen; };
    this.getScrollTo = function () { return this.vScrollTo; };
    this.getHourColWidth = function () { return this.vHourColWidth; };
    this.getDayColWidth = function () { return this.vDayColWidth; };
    this.getWeekColWidth = function () { return this.vWeekColWidth; };
    this.getMonthColWidth = function () { return this.vMonthColWidth; };
    this.getQuarterColWidth = function () { return this.vQuarterColWidth; };
    this.getRowHeight = function () { return this.vRowHeight; };
    this.getChartBody = function () { return this.vChartBody; };
    this.getChartHead = function () { return this.vChartHead; };
    this.getListBody = function () { return this.vListBody; };
    this.getChartTable = function () { return this.vChartTable; };
    this.getLines = function () { return this.vLines; };
    this.getTimer = function () { return this.vTimer; };
    this.getMinDate = function () { return this.vMinDate; };
    this.getMaxDate = function () { return this.vMaxDate; };
    this.getTooltipDelay = function () { return this.vTooltipDelay; };
    this.getList = function () { return this.vTaskList; };
    //EVENTS
    this.getEventsClickCell = function () { return this.vEvents; };
    this.getEventsChange = function () { return this.vEventsChange; };
    this.getEventClickRow = function () { return this.vEventClickRow; };
    this.getEventClickCollapse = function () { return this.vEventClickCollapse; };
    this.getResources = function () { return this.vResources; };
    this.getAdditionalHeaders = function () { return this.vAdditionalHeaders; };
    this.getColumnOrder = function () { return this.vColumnOrder || draw_columns_1.COLUMN_ORDER; };
};
exports.includeGetSet = includeGetSet;

},{"./draw_columns":3,"./utils/date_utils":11}],10:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRows = exports.ClearTasks = exports.RemoveTaskItem = exports.AddTaskItemObject = exports.AddTaskItem = exports.createTaskInfo = exports.TaskItem = exports.TaskItemObject = exports.sortTasks = exports.taskLink = void 0;
var date_utils_1 = require("./utils/date_utils");
var draw_utils_1 = require("./utils/draw_utils");
var general_utils_1 = require("./utils/general_utils");
// function to open window to display task link
var taskLink = function (pRef, pWidth, pHeight) {
    var vWidth, vHeight;
    if (pWidth)
        vWidth = pWidth;
    else
        vWidth = 400;
    if (pHeight)
        vHeight = pHeight;
    else
        vHeight = 400;
    window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};
exports.taskLink = taskLink;
var sortTasks = function (pList, pID, pIdx) {
    if (pList.length < 2) {
        return pIdx;
    }
    var sortIdx = pIdx;
    var sortArr = [];
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].vParent == pID)
            sortArr.push(pList[i]);
    }
    if (sortArr.length > 0) {
        sortArr.sort(function (a, b) {
            var i = a.getStart().getTime() - b.getStart().getTime();
            if (i == 0)
                i = a.getEnd().getTime() - b.getEnd().getTime();
            if (i == 0)
                return a.vID - b.vID;
            else
                return i;
        });
    }
    for (var j = 0; j < sortArr.length; j++) {
        for (var i = 0; i < pList.length; i++) {
            if (pList[i].vID == sortArr[j].vID) {
                pList[i].vSortIdx = sortIdx++;
                sortIdx = exports.sortTasks(pList, pList[i].vID, sortIdx);
            }
        }
    }
    return sortIdx;
};
exports.sortTasks = sortTasks;
var TaskItemObject = function (object) {
    var pDataObject = __assign({}, object);
    general_utils_1.internalProperties.forEach(function (property) {
        delete pDataObject[property];
    });
    return new TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object.pDuration, object.pBarText, object);
};
exports.TaskItemObject = TaskItemObject;
var TaskItem = /** @class */ (function () {
    function TaskItem(vID, vName, pStart, pEnd, vClass, vLink, vMile, pRes, vComp, vGroup, vParent, pOpen, pDepend, vCaption, pNotes, vGantt, vCost, pPlanStart, pPlanEnd, vDuration, vBarText, vDataObject) {
        var _a;
        this.vID = vID;
        this.vName = vName;
        this.vClass = vClass;
        this.vLink = vLink;
        this.vMile = vMile;
        this.pRes = pRes;
        this.vComp = vComp;
        this.vGroup = vGroup;
        this.vParent = vParent;
        this.vCaption = vCaption;
        this.vGantt = vGantt;
        this.vCost = vCost;
        this.vDuration = vDuration;
        this.vBarText = vBarText;
        this.vDataObject = vDataObject;
        this.vStart = null;
        this.vEnd = null;
        this.vPlanStart = null;
        this.vPlanEnd = null;
        this.vGroupMinStart = null;
        this.vGroupMinEnd = null;
        this.vGroupMinPlanStart = null;
        this.vGroupMinPlanEnd = null;
        this.vRes = '\u00A0';
        this.vDepend = null;
        this.vDependType = null;
        this.vLevel = 0;
        this.vNumKid = 0;
        this.vWeight = 0;
        this.vVisible = true;
        this.vSortIdx = 0;
        this.vToDelete = false;
        this.vListChildRow = null;
        this.vChildRow = null;
        this.vGroupSpan = null;
        this.vGantt = (_a = this.vGantt) !== null && _a !== void 0 ? _a : this;
        this.vID = general_utils_1.hashKey(this.vID.toString());
        this.vRes = document.createTextNode(pRes).data;
        if (this.vParent && this.vParent !== 0) {
            this.vParent = general_utils_1.hashKey(this.vParent.toString()).toString();
        }
        this.vOpen = (this.vGroup == 2) ? true : parseInt(document.createTextNode(pOpen).data) === 1;
        this.vDepend = [];
        this.vDependType = [];
        this.vNotes = document.createElement('span');
        this.vNotes.className = 'gTaskNotes';
        if (pNotes != null) {
            this.vNotes.innerHTML = pNotes;
            general_utils_1.stripUnwanted(this.vNotes);
        }
        if (pStart != null && pStart != '') {
            this.vStart = (pStart instanceof Date) ? pStart : date_utils_1.parseDateStr(document.createTextNode(pStart).data, this.vGantt.getDateInputFormat());
            this.vGroupMinStart = this.vStart;
        }
        if (pEnd != null && pEnd != '') {
            this.vEnd = (pEnd instanceof Date) ? pEnd : date_utils_1.parseDateStr(document.createTextNode(pEnd).data, this.vGantt.getDateInputFormat());
            this.vGroupMinEnd = this.vEnd;
        }
        if (pPlanStart != null && pPlanStart != '') {
            this.vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : date_utils_1.parseDateStr(document.createTextNode(pPlanStart).data, this.vGantt.getDateInputFormat());
            this.vGroupMinPlanStart = this.vPlanStart;
        }
        if (pPlanEnd != null && pPlanEnd != '') {
            this.vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : date_utils_1.parseDateStr(document.createTextNode(pPlanEnd).data, this.vGantt.getDateInputFormat());
            this.vGroupMinPlanEnd = this.vPlanEnd;
        }
        if (pDepend != null) {
            var vDependStr = pDepend + '';
            var vDepList = vDependStr.split(',');
            var n = vDepList.length;
            for (var k = 0; k < n; k++) {
                if (vDepList[k].toUpperCase().endsWith('SS')) {
                    this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                    this.vDependType[k] = 'SS';
                }
                else if (vDepList[k].toUpperCase().endsWith('FF')) {
                    this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                    this.vDependType[k] = 'FF';
                }
                else if (vDepList[k].toUpperCase().endsWith('SF')) {
                    this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                    this.vDependType[k] = 'SF';
                }
                else if (vDepList[k].toUpperCase().endsWith('FS')) {
                    this.vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                    this.vDependType[k] = 'FS';
                }
                else {
                    this.vDepend[k] = vDepList[k];
                    this.vDependType[k] = 'FS';
                }
                if (this.vDepend[k]) {
                    this.vDepend[k] = general_utils_1.hashKey(this.vDepend[k]).toString();
                }
            }
        }
    }
    TaskItem.prototype.getStart = function () {
        var _a, _b;
        return (_b = (_a = this.vStart) !== null && _a !== void 0 ? _a : this.vPlanStart) !== null && _b !== void 0 ? _b : new Date();
    };
    ;
    TaskItem.prototype.getEnd = function () {
        if (this.vEnd)
            return this.vEnd;
        else if (this.vPlanEnd)
            return this.vPlanEnd;
        else if (this.vStart && this.vDuration) {
            var date = new Date(this.vStart);
            var vUnits = this.vDuration.split(' ');
            var value = parseInt(vUnits[0]);
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
        }
        else
            return new Date();
    };
    ;
    TaskItem.prototype.getPlanStart = function () {
        var _a;
        return (_a = this.vPlanStart) !== null && _a !== void 0 ? _a : this.vStart;
    };
    ;
    TaskItem.prototype.getPlanEnd = function () {
        var _a;
        return (_a = this.vPlanEnd) !== null && _a !== void 0 ? _a : this.vEnd;
    };
    ;
    TaskItem.prototype.getCompVal = function () {
        var _a, _b;
        return (_b = (_a = this.vComp) !== null && _a !== void 0 ? _a : this.vCompVal) !== null && _b !== void 0 ? _b : 0;
    };
    ;
    TaskItem.prototype.getCompStr = function () {
        if (this.vComp)
            return this.vComp + '%';
        else if (this.vCompVal)
            return this.vCompVal + '%';
        else
            return '';
    };
    ;
    TaskItem.prototype.getCompRestStr = function () {
        if (this.vComp)
            return (100 - this.vComp) + '%';
        else if (this.vCompVal)
            return (100 - this.vCompVal) + '%';
        else
            return '';
    };
    ;
    TaskItem.prototype.getDuration = function (pFormat, pLang) {
        if (this.vMile) {
            this.vDuration = '-';
        }
        else if (!this.vEnd && !this.vStart && this.vPlanStart && this.vPlanEnd) {
            return this.calculateVDuration(pFormat, pLang, this.getPlanStart(), this.getPlanEnd());
        }
        else if (!this.vEnd && this.vDuration) {
            return this.vDuration;
        }
        else {
            this.vDuration = this.calculateVDuration(pFormat, pLang, this.getStart(), this.getEnd());
        }
        return this.vDuration;
    };
    ;
    TaskItem.prototype.calculateVDuration = function (pFormat, pLang, start, end) {
        var vUnits = null;
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
        var hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
        var tmpPer;
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
    };
    TaskItem.prototype.setStart = function (pStart) {
        if (pStart instanceof Date) {
            this.vStart = pStart;
        }
        else {
            var temp = new Date(pStart);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                this.vStart = temp;
            }
        }
    };
    ;
    TaskItem.prototype.setEnd = function (pEnd) {
        if (pEnd instanceof Date) {
            this.vEnd = pEnd;
        }
        else {
            var temp = new Date(pEnd);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                this.vEnd = temp;
            }
        }
    };
    ;
    TaskItem.prototype.setPlanStart = function (pPlanStart) {
        if (pPlanStart instanceof Date)
            this.vPlanStart = pPlanStart;
        else
            this.vPlanStart = new Date(pPlanStart);
    };
    ;
    TaskItem.prototype.setPlanEnd = function (pPlanEnd) {
        if (pPlanEnd instanceof Date)
            this.vPlanEnd = pPlanEnd;
        else
            this.vPlanEnd = new Date(pPlanEnd);
    };
    ;
    TaskItem.prototype.setGroup = function (pGroup) {
        if (pGroup === 1) {
            this.vGroup = 1;
        }
        else if (pGroup === 0) {
            this.vGroup = 0;
        }
        else {
            this.vGroup = pGroup;
        }
    };
    ;
    Object.defineProperty(TaskItem.prototype, "allData", {
        get: function () {
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
        },
        enumerable: false,
        configurable: true
    });
    return TaskItem;
}());
exports.TaskItem = TaskItem;
/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */
var createTaskInfo = function (pTask, templateStrOrFn) {
    var _this = this;
    if (templateStrOrFn === void 0) { templateStrOrFn = null; }
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = draw_utils_1.newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');
    var setupTemplate = function (template) {
        vTaskInfo.innerHTML = '';
        if (template) {
            var allData_1 = pTask.allData;
            general_utils_1.internalProperties.forEach(function (key) {
                var lang;
                if (general_utils_1.internalPropertiesLang[key]) {
                    lang = _this.vLangs[_this.vLang][general_utils_1.internalPropertiesLang[key]];
                }
                if (!lang) {
                    lang = key;
                }
                var val = allData_1[key];
                template = template.replace("{{" + key + "}}", val);
                if (lang) {
                    template = template.replace("{{Lang:" + key + "}}", lang);
                }
                else {
                    template = template.replace("{{Lang:" + key + "}}", key);
                }
            });
            draw_utils_1.newNode(vTaskInfo, 'span', null, 'gTtTemplate', template);
        }
        else {
            draw_utils_1.newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.vName);
            if (_this.vShowTaskInfoStartDate == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['startdate'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', date_utils_1.formatDateStr(pTask.getStart(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoEndDate == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['enddate'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', date_utils_1.formatDateStr(pTask.getEnd(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoDur == 1 && !pTask.vMile) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTId');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['duration'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(_this.vFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoComp == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['completion'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
            }
            if (_this.vShowTaskInfoRes == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['resource'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.vRes);
            }
            if (_this.vShowTaskInfoLink == 1 && pTask.vLink != '') {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
                var vTmpNode = draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel');
                vTmpNode = draw_utils_1.newNode(vTmpNode, 'a', null, 'gTaskText', _this.vLangs[_this.vLang]['moreinfo']);
                vTmpNode.setAttribute('href', pTask.vLink);
            }
            if (_this.vShowTaskInfoNotes == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['notes'] + ': ');
                if (pTask.vNotes)
                    vTmpDiv.appendChild(pTask.vNotes);
            }
        }
    };
    var callback;
    if (typeof templateStrOrFn === 'function') {
        callback = function () {
            var strOrPromise = templateStrOrFn(pTask);
            if (!strOrPromise || typeof strOrPromise === 'string') {
                setupTemplate(strOrPromise);
            }
            else if (strOrPromise.then) {
                setupTemplate(_this.vLangs[_this.vLang]['tooltipLoading'] || _this.vLangs['en']['tooltipLoading']);
                return strOrPromise.then(setupTemplate);
            }
        };
    }
    else {
        setupTemplate(templateStrOrFn);
    }
    return { component: vTaskInfoBox, callback: callback };
};
exports.createTaskInfo = createTaskInfo;
var AddTaskItem = function (value) {
    var vExists = false;
    for (var i = 0; i < this.vTaskList.length; i++) {
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
exports.AddTaskItem = AddTaskItem;
var AddTaskItemObject = function (object) {
    if (!object.pGantt) {
        object.pGantt = this;
    }
    return this.AddTaskItem(exports.TaskItemObject(object));
};
exports.AddTaskItemObject = AddTaskItemObject;
var RemoveTaskItem = function (pID) {
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].vID == pID)
            this.vTaskList[i].vToDelete = true;
        else if (this.vTaskList[i].vParent == pID)
            this.RemoveTaskItem(this.vTaskList[i].vID);
    }
    this.vProcessNeeded = true;
};
exports.RemoveTaskItem = RemoveTaskItem;
var ClearTasks = function () {
    var _this = this;
    this.vTaskList.map(function (task) { return _this.RemoveTaskItem(task.vID); });
    this.vProcessNeeded = true;
};
exports.ClearTasks = ClearTasks;
// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
var processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var vMinDate = null;
    var vMaxDate = null;
    var vMinPlanDate = null;
    var vMaxPlanDate = null;
    var vVisible = pOpen;
    var vCurItem = null;
    var vCompSum = 0;
    var vMinSet = 0;
    var vMaxSet = 0;
    var vMinPlanSet = 0;
    var vMaxPlanSet = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vLevel = pLevel;
    var vList = pList;
    var vComb = false;
    var i = 0;
    for (i = 0; i < pList.length; i++) {
        if (pList[i].vToDelete) {
            pList.splice(i, 1);
            i--;
        }
        if (i >= 0 && pList[i].vID == pID)
            vCurItem = pList[i];
    }
    for (i = 0; i < pList.length; i++) {
        if (pList[i].vParent == pID) {
            vVisible = pOpen;
            pList[i].vParItem = vCurItem;
            pList[i].vVisible = vVisible;
            if (vVisible == 1 && !pList[i].vOpen)
                vVisible = 0;
            if (pList[i].vMile && pList[i].vParItem && pList[i].vParItem.vGroup == 2) { //remove milestones owned by combined groups
                pList.splice(i, 1);
                i--;
                continue;
            }
            pList[i].vLevel = vLevel;
            if (pList[i].vGroup) {
                if (pList[i].vParItem && pList[i].vParItem.vGroup == 2)
                    pList[i].setGroup(2);
                exports.processRows(vList, pList[i].vID, i, vLevel + 1, vVisible, 0);
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
    if (pID == 0 && pUseSort == 1) {
        var bd = void 0;
        if (vDebug) {
            bd = new Date();
            console.info('before afterTasks', bd);
        }
        exports.sortTasks(pList, 0, 0);
        if (vDebug) {
            var ad = new Date();
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
                var bd = void 0;
                if (vDebug) {
                    bd = new Date();
                    console.info('before sortTasks', bd);
                }
                exports.sortTasks(pList, pList[i].vID, pList[i].vSortIdx + 1);
                if (vDebug) {
                    var ad = new Date();
                    console.info('after sortTasks', ad, (ad.getTime() - bd.getTime()));
                }
            }
        }
        if (vComb == true)
            pList.sort(function (a, b) {
                return a.vSortIdx - b.vSortIdx;
            });
    }
};
exports.processRows = processRows;

},{"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsoWeek = exports.parseDateFormatStr = exports.formatDateStr = exports.parseDateStr = exports.coerceDate = exports.getMaxDate = exports.getMinDate = void 0;
/**
 * DATES
 */
var getMinDate = function (pList, pFormat, pMinDate) {
    var vDate = new Date();
    if (pList.length <= 0)
        return pMinDate || vDate;
    vDate.setTime((pMinDate && pMinDate.getTime()) || pList[0].getStart().getTime());
    // Parse all Task Start dates to find min
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getStart().getTime());
        if (pList[i].getPlanStart() && pList[i].getPlanStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getPlanStart().getTime());
    }
    // Adjust min date to specific format boundaries (first of week or first of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() % 7 != 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'week') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() % 7 != 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'month') {
        vDate.setDate(vDate.getDate() - 15);
        while (vDate.getDate() > 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'quarter') {
        vDate.setDate(vDate.getDate() - 31);
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 0, 1);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 3, 1);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 6, 1);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 9, 1);
    }
    else if (pFormat == 'hour') {
        vDate.setHours(vDate.getHours() - 1);
        while (vDate.getHours() % 6 != 0)
            vDate.setHours(vDate.getHours() - 1);
    }
    if (pFormat == 'hour')
        vDate.setMinutes(0, 0);
    else
        vDate.setHours(0, 0, 0);
    return (vDate);
};
exports.getMinDate = getMinDate;
var getMaxDate = function (pList, pFormat, pMaxDate) {
    var vDate = new Date();
    if (pList.length <= 0)
        return pMaxDate || vDate;
    vDate.setTime((pMaxDate && pMaxDate.getTime()) || pList[0].getEnd().getTime());
    // Parse all Task End dates to find max
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getEnd().getTime());
        if (pList[i].getPlanEnd() && pList[i].getPlanEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getPlanEnd().getTime());
    }
    // Adjust max date to specific format boundaries (end of week or end of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() + 1);
        while (vDate.getDay() % 7 != 0)
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'week') {
        //For weeks, what is the last logical boundary?
        vDate.setDate(vDate.getDate() + 1);
        while (vDate.getDay() % 7 != 0)
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'month') {
        // Set to last day of current Month
        while (vDate.getDate() > 1)
            vDate.setDate(vDate.getDate() + 1);
        vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'quarter') {
        // Set to last day of current Quarter
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 2, 31);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 5, 30);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 8, 30);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 11, 31);
    }
    else if (pFormat == 'hour') {
        if (vDate.getHours() == 0)
            vDate.setDate(vDate.getDate() + 1);
        vDate.setHours(vDate.getHours() + 1);
        while (vDate.getHours() % 6 != 5)
            vDate.setHours(vDate.getHours() + 1);
    }
    return (vDate);
};
exports.getMaxDate = getMaxDate;
var coerceDate = function (date) {
    if (date instanceof Date) {
        return date;
    }
    else {
        var temp = new Date(date);
        if (temp instanceof Date && !isNaN(temp.valueOf())) {
            return temp;
        }
    }
};
exports.coerceDate = coerceDate;
var parseDateStr = function (pDateStr, pFormatStr) {
    var vDate = new Date();
    var vDateParts = pDateStr.split(/[^0-9]/);
    if (pDateStr.length >= 10 && vDateParts.length >= 3) {
        while (vDateParts.length < 5)
            vDateParts.push(0);
        switch (pFormatStr) {
            case 'mm/dd/yyyy':
                vDate = new Date(vDateParts[2], vDateParts[0] - 1, vDateParts[1], vDateParts[3], vDateParts[4]);
                break;
            case 'dd/mm/yyyy':
                vDate = new Date(vDateParts[2], vDateParts[1] - 1, vDateParts[0], vDateParts[3], vDateParts[4]);
                break;
            case 'yyyy-mm-dd':
                vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4]);
                break;
            case 'yyyy-mm-dd HH:MI:SS':
                vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4], vDateParts[5]);
                break;
        }
    }
    return (vDate);
};
exports.parseDateStr = parseDateStr;
var formatDateStr = function (pDate, pDateFormatArr, pL) {
    // Fix on issue #303 - getXMLTask is passing null as pDates
    if (!pDate) {
        return;
    }
    var vDateStr = '';
    var vYear2Str = pDate.getFullYear().toString().substring(2, 4);
    var vMonthStr = (pDate.getMonth() + 1) + '';
    var vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
    var vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
    var vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
    var vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);
    for (var i = 0; i < pDateFormatArr.length; i++) {
        switch (pDateFormatArr[i]) {
            case 'dd':
                if (pDate.getDate() < 10)
                    vDateStr += '0'; // now fall through
            case 'd':
                vDateStr += pDate.getDate();
                break;
            case 'day':
                vDateStr += vDyArr[pDate.getDay()];
                break;
            case 'DAY':
                vDateStr += vDayArr[pDate.getDay()];
                break;
            case 'mm':
                if (parseInt(vMonthStr, 10) < 10)
                    vDateStr += '0'; // now fall through
            case 'm':
                vDateStr += vMonthStr;
                break;
            case 'mon':
                vDateStr += vMthArr[pDate.getMonth()];
                break;
            case 'month':
                vDateStr += vMonthArr[pDate.getMonth()];
                break;
            case 'yyyy':
                vDateStr += pDate.getFullYear();
                break;
            case 'yy':
                vDateStr += vYear2Str;
                break;
            case 'qq':
                vDateStr += pL['qtr']; // now fall through
            case 'q':
                vDateStr += Math.floor(pDate.getMonth() / 3) + 1;
                break;
            case 'hh':
                if ((((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12) < 10)
                    vDateStr += '0'; // now fall through
            case 'h':
                vDateStr += ((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12;
                break;
            case 'HH':
                if ((pDate.getHours()) < 10)
                    vDateStr += '0'; // now fall through
            case 'H':
                vDateStr += (pDate.getHours());
                break;
            case 'MI':
                if (pDate.getMinutes() < 10)
                    vDateStr += '0'; // now fall through
            case 'mi':
                vDateStr += pDate.getMinutes();
                break;
            case 'SS':
                if (pDate.getSeconds() < 10)
                    vDateStr += '0'; // now fall through
            case 'ss':
                vDateStr += pDate.getSeconds();
                break;
            case 'pm':
                vDateStr += ((pDate.getHours()) < 12) ? 'am' : 'pm';
                break;
            case 'PM':
                vDateStr += ((pDate.getHours()) < 12) ? 'AM' : 'PM';
                break;
            case 'ww':
                if (exports.getIsoWeek(pDate) < 10)
                    vDateStr += '0'; // now fall through
            case 'w':
                vDateStr += exports.getIsoWeek(pDate);
                break;
            case 'week':
                var vWeekNum = exports.getIsoWeek(pDate);
                var vYear = pDate.getFullYear();
                var vDayOfWeek = (pDate.getDay() == 0) ? 7 : pDate.getDay();
                if (vWeekNum >= 52 && parseInt(vMonthStr, 10) === 1)
                    vYear--;
                if (vWeekNum == 1 && parseInt(vMonthStr, 10) === 12)
                    vYear++;
                if (vWeekNum < 10)
                    vWeekNum = parseInt('0' + vWeekNum, 10);
                vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
                break;
            default:
                if (pL[pDateFormatArr[i].toLowerCase()])
                    vDateStr += pL[pDateFormatArr[i].toLowerCase()];
                else
                    vDateStr += pDateFormatArr[i];
                break;
        }
    }
    return vDateStr;
};
exports.formatDateStr = formatDateStr;
var parseDateFormatStr = function (pFormatStr) {
    var vComponantStr = '';
    var vCurrChar = '';
    var vSeparators = new RegExp('[\/\\ -.,\'":]');
    var vDateFormatArray = new Array();
    for (var i = 0; i < pFormatStr.length; i++) {
        vCurrChar = pFormatStr.charAt(i);
        if ((vCurrChar.match(vSeparators)) || (i + 1 == pFormatStr.length)) // separator or end of string
         {
            if ((i + 1 == pFormatStr.length) && (!(vCurrChar.match(vSeparators)))) // at end of string add any non-separator chars to the current component
             {
                vComponantStr += vCurrChar;
            }
            vDateFormatArray.push(vComponantStr);
            if (vCurrChar.match(vSeparators))
                vDateFormatArray.push(vCurrChar);
            vComponantStr = '';
        }
        else {
            vComponantStr += vCurrChar;
        }
    }
    return vDateFormatArray;
};
exports.parseDateFormatStr = parseDateFormatStr;
/**
 * We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
 * 60*60*24*1000=86400000
 * @param pDate
 */
var getIsoWeek = function (pDate) {
    var dayMiliseconds = 86400000;
    var keyDay = new Date(pDate.getFullYear(), 0, 4, 0, 0, 0);
    var keyDayOfWeek = (keyDay.getDay() == 0) ? 6 : keyDay.getDay() - 1; // define monday as 0
    var firstMondayYearTime = keyDay.getTime() - (keyDayOfWeek * dayMiliseconds);
    var thisDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), 0, 0, 0); // This at 00:00:00
    var thisTime = thisDate.getTime();
    var daysFromFirstMonday = Math.round(((thisTime - firstMondayYearTime) / dayMiliseconds));
    var lastWeek = 99;
    var thisWeek = 99;
    var firstMondayYear = new Date(firstMondayYearTime);
    thisWeek = Math.ceil((daysFromFirstMonday + 1) / 7);
    if (thisWeek <= 0)
        thisWeek = exports.getIsoWeek(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));
    else if (thisWeek == 53 && (new Date(pDate.getFullYear(), 0, 1, 0, 0, 0)).getDay() != 4 && (new Date(pDate.getFullYear(), 11, 31, 0, 0, 0)).getDay() != 4)
        thisWeek = 1;
    return thisWeek;
};
exports.getIsoWeek = getIsoWeek;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSelector = exports.sLine = exports.CalcTaskXY = exports.getArrayLocationByID = exports.newNode = exports.makeInput = void 0;
var events_1 = require("../events");
var makeInput = function (formattedValue, editable, type, value, choices) {
    if (type === void 0) { type = 'text'; }
    if (value === void 0) { value = null; }
    if (choices === void 0) { choices = null; }
    if (!value) {
        value = formattedValue;
    }
    if (editable) {
        switch (type) {
            case 'date':
                // Take timezone into account before converting to ISO String
                value = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
                return "<input class=\"gantt-inputtable\" type=\"date\" value=\"" + value + "\">";
            case 'resource':
                if (choices) {
                    var found = choices.filter(function (c) { return c.id == value || c.name == value; });
                    if (found && found.length > 0) {
                        value = found[0].id;
                    }
                    else {
                        choices.push({ id: value, name: value });
                    }
                    return "<select>" + choices.map(function (c) { return "<option value=\"" + c.id + "\" " + (value == c.id ? 'selected' : '') + " >" + c.name + "</option>"; }).join('') + "</select>";
                }
                else {
                    return "<input class=\"gantt-inputtable\" type=\"text\" value=\"" + (value ? value : '') + "\">";
                }
            case 'cost':
                return "<input class=\"gantt-inputtable\" type=\"number\" max=\"100\" min=\"0\" value=\"" + (value ? value : '') + "\">";
            default:
                return "<input class=\"gantt-inputtable\" value=\"" + (value ? value : '') + "\">";
        }
    }
    else {
        return formattedValue;
    }
};
exports.makeInput = makeInput;
var newNode = function (pParent, pNodeType, pId, pClass, pText, pWidth, pLeft, pDisplay, pColspan, pAttribs) {
    if (pId === void 0) { pId = null; }
    if (pClass === void 0) { pClass = null; }
    if (pText === void 0) { pText = null; }
    if (pWidth === void 0) { pWidth = null; }
    if (pLeft === void 0) { pLeft = null; }
    if (pDisplay === void 0) { pDisplay = null; }
    if (pColspan === void 0) { pColspan = null; }
    if (pAttribs === void 0) { pAttribs = null; }
    var vNewNode = pParent.appendChild(document.createElement(pNodeType));
    if (pAttribs) {
        for (var i = 0; i + 1 < pAttribs.length; i += 2) {
            vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
        }
    }
    if (pId)
        vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
    if (pClass)
        vNewNode.className = pClass;
    if (pWidth)
        vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
    if (pLeft)
        vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
    if (pText) {
        if (pText.indexOf && pText.indexOf('<') === -1) {
            vNewNode.appendChild(document.createTextNode(pText));
        }
        else {
            vNewNode.insertAdjacentHTML('beforeend', pText);
        }
    }
    if (pDisplay)
        vNewNode.style.display = pDisplay;
    if (pColspan)
        vNewNode.colSpan = pColspan;
    return vNewNode;
};
exports.newNode = newNode;
var getArrayLocationByID = function (pId) {
    var vList = this.getList();
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].vID == pId)
            return i;
    }
    return -1;
};
exports.getArrayLocationByID = getArrayLocationByID;
var CalcTaskXY = function () {
    var vID;
    var vList = this.getList();
    var vBarDiv;
    var vTaskDiv;
    var vParDiv;
    var vLeft, vTop, vWidth;
    var vHeight = Math.floor((this.getRowHeight() / 2));
    for (var i = 0; i < vList.length; i++) {
        vID = vList[i].vID;
        vBarDiv = vList[i].vBarDiv;
        vTaskDiv = vList[i].vTaskDiv;
        if ((vList[i].vParItem && vList[i].vParItem.vGroup == 2)) {
            vParDiv = vList[i].vParItem.vChildRow;
        }
        else
            vParDiv = vList[i].vChildRow;
        if (vBarDiv) {
            vList[i].x1 = vBarDiv.offsetLeft + 1;
            vList[i].y1 = vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1;
            vList[i].x2 = vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1;
            vList[i].y2 = vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1;
        }
    }
};
exports.CalcTaskXY = CalcTaskXY;
var sLine = function (x1, y1, x2, y2, pClass) {
    var vLeft = Math.min(x1, x2);
    var vTop = Math.min(y1, y2);
    var vWid = Math.abs(x2 - x1) + 1;
    var vHgt = Math.abs(y2 - y1) + 1;
    var vTmpDiv = document.createElement('div');
    vTmpDiv.id = this.vDivId + 'line' + this.vDepId++;
    vTmpDiv.style.position = 'absolute';
    vTmpDiv.style.overflow = 'hidden';
    vTmpDiv.style.zIndex = '0';
    vTmpDiv.style.left = vLeft + 'px';
    vTmpDiv.style.top = vTop + 'px';
    vTmpDiv.style.width = vWid + 'px';
    vTmpDiv.style.height = vHgt + 'px';
    vTmpDiv.style.visibility = 'visible';
    if (vWid == 1)
        vTmpDiv.className = 'glinev';
    else
        vTmpDiv.className = 'glineh';
    if (pClass)
        vTmpDiv.className += ' ' + pClass;
    this.getLines().appendChild(vTmpDiv);
    if (this.vEvents.onLineDraw && typeof this.vEvents.onLineDraw === 'function') {
        this.vEvents.onLineDraw(vTmpDiv);
    }
    return vTmpDiv;
};
exports.sLine = sLine;
var drawSelector = function (pPos) {
    var vOutput = document.createDocumentFragment();
    var vDisplay = false;
    for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
        if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase())
            vDisplay = true;
    }
    if (vDisplay) {
        var vTmpDiv = exports.newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');
        if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
            events_1.addFormatListeners(this, 'hour', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));
        if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
            events_1.addFormatListeners(this, 'day', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));
        if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
            events_1.addFormatListeners(this, 'week', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));
        if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
            events_1.addFormatListeners(this, 'month', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));
        if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
            events_1.addFormatListeners(this, 'quarter', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
    }
    else {
        exports.newNode(vOutput, 'div', null, 'gselector');
    }
    return vOutput;
};
exports.drawSelector = drawSelector;

},{"../events":5}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStartEndFromDepend = exports.makeRequestOldBrowsers = exports.makeRequest = exports.moveToolTip = exports.updateFlyingObj = exports.isParentElementOrSelf = exports.criticalPath = exports.hashKey = exports.hashString = exports.fadeToolTip = exports.hideToolTip = exports.isIE = exports.getOffset = exports.calculateCurrentDateOffset = exports.getScrollbarWidth = exports.getScrollPositions = exports.benchMark = exports.getZoomFactor = exports.delayedHide = exports.stripUnwanted = exports.stripIds = exports.changeFormat = exports.findObj = exports.internalPropertiesLang = exports.internalProperties = void 0;
exports.internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent',
    'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd'];
exports.internalPropertiesLang = {
    'pID': 'id',
    'pName': 'name',
    'pStart': 'startdate',
    'pEnd': 'enddate',
    'pLink': 'link',
    'pMile': 'mile',
    'pRes': 'resource',
    'pComp': 'comp',
    'pGroup': 'group',
    'pParent': 'parent',
    'pOpen': 'open',
    'pDepend': 'depend',
    'pCaption': 'caption',
    'pNotes': 'notes',
    'pCost': 'cost',
    'pPlanStart': 'planstartdate',
    'pPlanEnd': 'planenddate'
};
var findObj = function (theObj, theDoc) {
    if (theDoc === void 0) { theDoc = null; }
    var p, i, foundObj;
    if (!theDoc)
        theDoc = document;
    if (document.getElementById)
        foundObj = document.getElementById(theObj);
    return foundObj;
};
exports.findObj = findObj;
var changeFormat = function (pFormat, ganttObj) {
    if (ganttObj)
        ganttObj.setFormat(pFormat);
    else
        alert('Chart undefined');
};
exports.changeFormat = changeFormat;
var stripIds = function (pNode) {
    for (var i = 0; i < pNode.childNodes.length; i++) {
        if ('removeAttribute' in pNode.childNodes[i])
            pNode.childNodes[i].removeAttribute('id');
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripIds(pNode.childNodes[i]);
    }
};
exports.stripIds = stripIds;
var stripUnwanted = function (pNode) {
    var vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');
    for (var i = 0; i < pNode.childNodes.length; i++) {
        /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
        if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
            pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
        }
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripUnwanted(pNode.childNodes[i]);
    }
};
exports.stripUnwanted = stripUnwanted;
var delayedHide = function (pGanttChartObj, pTool, pTimer) {
    var vDelay = pGanttChartObj.getTooltipDelay() || 1500;
    if (pTool)
        pTool.delayTimeout = setTimeout(function () { exports.hideToolTip(pGanttChartObj, pTool, pTimer); }, vDelay);
};
exports.delayedHide = delayedHide;
var getZoomFactor = function () {
    var vFactor = 1;
    if (document.body.getBoundingClientRect) {
        // rect is only in physical pixel size in IE before version 8
        var vRect = document.body.getBoundingClientRect();
        var vPhysicalW = vRect.right - vRect.left;
        var vLogicalW = document.body.offsetWidth;
        // the zoom level is always an integer percent value
        vFactor = Math.round((vPhysicalW / vLogicalW) * 100) / 100;
    }
    return vFactor;
};
exports.getZoomFactor = getZoomFactor;
var benchMark = function (pItem) {
    var vEndTime = new Date().getTime();
    alert(pItem + ': Elapsed time: ' + ((vEndTime - this.vBenchTime) / 1000) + ' seconds.');
    this.vBenchTime = new Date().getTime();
};
exports.benchMark = benchMark;
var getScrollPositions = function () {
    var vScrollLeft = window.pageXOffset;
    var vScrollTop = window.pageYOffset;
    if (!('pageXOffset' in window)) // Internet Explorer before version 9
     {
        var vZoomFactor = exports.getZoomFactor();
        vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
        vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
    }
    return { x: vScrollLeft, y: vScrollTop };
};
exports.getScrollPositions = getScrollPositions;
var scrollbarWidth = undefined;
var getScrollbarWidth = function () {
    if (scrollbarWidth)
        return scrollbarWidth;
    var outer = document.createElement('div');
    outer.className = 'gscrollbar-calculation-container';
    document.body.appendChild(outer);
    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);
    // Calculating difference between container's full width and the child width
    scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
};
exports.getScrollbarWidth = getScrollbarWidth;
var calculateCurrentDateOffset = function (curTaskStart, curTaskEnd) {
    var tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
    var tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
    return (tmpTaskEnd - tmpTaskStart);
};
exports.calculateCurrentDateOffset = calculateCurrentDateOffset;
var getOffset = function (pStartDate, pEndDate, pColWidth, pFormat, pShowWeekends) {
    var DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
    var WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
    var MONTH_CELL_MARGIN_WIDTH = 3; // Cell margin for 'month' format
    var QUARTER_CELL_MARGIN_WIDTH = 3; // Cell margin for 'quarter' format
    var HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format
    var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var curTaskStart = new Date(pStartDate.getTime());
    var curTaskEnd = new Date(pEndDate.getTime());
    var vTaskRightPx = 0;
    // Length of task in hours
    var oneHour = 3600000;
    var vTaskRight = exports.calculateCurrentDateOffset(curTaskStart, curTaskEnd) / oneHour;
    var vPosTmpDate;
    if (pFormat == 'day') {
        if (!pShowWeekends) {
            var start = curTaskStart;
            var end = curTaskEnd;
            var countWeekends = 0;
            while (start < end) {
                var day = start.getDay();
                if (day === 6 || day == 0) {
                    countWeekends++;
                }
                start = new Date(start.getTime() + 24 * oneHour);
            }
            vTaskRight -= countWeekends * 24;
        }
        vTaskRightPx = Math.ceil((vTaskRight / 24) * (pColWidth + DAY_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'week') {
        vTaskRightPx = Math.ceil((vTaskRight / (24 * 7)) * (pColWidth + WEEK_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'month') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH)) + (vDaysCrctn * (pColWidth / vMonthDaysArr[curTaskEnd.getMonth()])) - 1);
    }
    else if (pFormat == 'quarter') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * ((pColWidth + QUARTER_CELL_MARGIN_WIDTH) / 3)) + (vDaysCrctn * (pColWidth / 90)) - 1);
    }
    else if (pFormat == 'hour') {
        // can't just calculate sum because of daylight savings changes
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setMinutes(curTaskStart.getMinutes(), 0);
        var vMinsCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (3600000);
        vTaskRightPx = Math.ceil((vTaskRight * (pColWidth + HOUR_CELL_MARGIN_WIDTH)) + (vMinsCrctn * (pColWidth)));
    }
    return vTaskRightPx;
};
exports.getOffset = getOffset;
var isIE = function () {
    if (typeof document.all != 'undefined') {
        if ('pageXOffset' in window)
            return false; // give IE9 and above the benefit of the doubt!
        else
            return true;
    }
    else
        return false;
};
exports.isIE = isIE;
var hideToolTip = function (pGanttChartObj, pTool, pTimer) {
    if (pGanttChartObj.getUseFade()) {
        clearInterval(pTool.fadeInterval);
        pTool.fadeInterval = setInterval(function () { exports.fadeToolTip(-1, pTool, 0); }, pTimer);
    }
    else {
        pTool.style.opacity = 0;
        pTool.style.filter = 'alpha(opacity=0)';
        pTool.style.visibility = 'hidden';
        pTool.vToolCont.setAttribute("showing", null);
    }
};
exports.hideToolTip = hideToolTip;
var fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
    var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
    var vAlpha = pTool.getAttribute('currentOpacity');
    var vCurAlpha = parseInt(vAlpha);
    if ((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)) {
        var i = vIncrement;
        if (pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1) {
            i = pMaxAlpha - vCurAlpha;
        }
        else if (vAlpha < vIncrement && pDirection == -1) {
            i = vCurAlpha;
        }
        vAlpha = vCurAlpha + (i * pDirection);
        pTool.style.opacity = vAlpha * 0.01;
        pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
        pTool.setAttribute('currentOpacity', vAlpha);
    }
    else {
        clearInterval(pTool.fadeInterval);
        if (pDirection == -1) {
            pTool.style.opacity = 0;
            pTool.style.filter = 'alpha(opacity=0)';
            pTool.style.visibility = 'hidden';
            pTool.vToolCont.setAttribute("showing", null);
        }
    }
};
exports.fadeToolTip = fadeToolTip;
var hashString = function (key) {
    if (!key) {
        key = 'default';
    }
    key += '';
    var hash = 5381;
    for (var i = 0; i < key.length; i++) {
        if (key.charCodeAt) {
            // tslint:disable-next-line:no-bitwise
            hash = (hash << 5) + hash + key.charCodeAt(i);
        }
        // tslint:disable-next-line:no-bitwise
        hash = hash & hash;
    }
    // tslint:disable-next-line:no-bitwise
    return hash >>> 0;
};
exports.hashString = hashString;
var hashKey = function (key) {
    return this.hashString(key);
};
exports.hashKey = hashKey;
var criticalPath = function (tasks) {
    var path = {};
    // calculate duration
    tasks.forEach(function (task) {
        task.duration = new Date(task.pEnd).getTime() - new Date(task.pStart).getTime();
    });
    tasks.forEach(function (task) {
        if (!path[task.pID]) {
            path[task.pID] = task;
        }
        if (!path[task.pParent]) {
            path[task.pParent] = {
                childrens: []
            };
        }
        if (!path[task.pID].childrens) {
            path[task.pID].childrens = [];
        }
        path[task.pParent].childrens.push(task);
        var max = path[task.pParent].childrens[0].duration;
        path[task.pParent].childrens.forEach(function (t) {
            if (t.duration > max) {
                max = t.duration;
            }
        });
        path[task.pParent].duration = max;
    });
    var finalNodes = { 0: path[0] };
    var node = path[0];
    var _loop_1 = function () {
        if (node.childrens.length > 0) {
            var found_1 = node.childrens[0];
            var max_1 = found_1.duration;
            node.childrens.forEach(function (c) {
                if (c.duration > max_1) {
                    found_1 = c;
                    max_1 = c.duration;
                }
            });
            finalNodes[found_1.pID] = found_1;
            node = found_1;
        }
        else {
            node = null;
        }
    };
    while (node) {
        _loop_1();
    }
};
exports.criticalPath = criticalPath;
function isParentElementOrSelf(child, parent) {
    while (child) {
        if (child === parent)
            return true;
        child = child.parentElement;
    }
}
exports.isParentElementOrSelf = isParentElementOrSelf;
var updateFlyingObj = function (e, pGanttChartObj, pTimer) {
    var vCurTopBuf = 3;
    var vCurLeftBuf = 5;
    var vCurBotBuf = 3;
    var vCurRightBuf = 15;
    var vMouseX = (e) ? e.clientX : window.event.clientX;
    var vMouseY = (e) ? e.clientY : window.event.clientY;
    var vViewportX = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    var vViewportY = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var vNewX = vMouseX;
    var vNewY = vMouseY;
    var screenX = screen.availWidth || window.innerWidth;
    var screenY = screen.availHeight || window.innerHeight;
    var vOldX = parseInt(pGanttChartObj.vTool.style.left);
    var vOldY = parseInt(pGanttChartObj.vTool.style.top);
    if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
        // the clientX and clientY properties include the left and top borders of the client area
        vMouseX -= document.documentElement.clientLeft;
        vMouseY -= document.documentElement.clientTop;
        var vZoomFactor = exports.getZoomFactor();
        if (vZoomFactor != 1) { // IE 7 at non-default zoom level
            vMouseX = Math.round(vMouseX / vZoomFactor);
            vMouseY = Math.round(vMouseY / vZoomFactor);
        }
    }
    var vScrollPos = exports.getScrollPositions();
    /* Code for positioned right of the mouse by default*/
    /*
    if (vMouseX+vCurRightBuf+pGanttChartObj.vTool.offsetWidth>vViewportX)
    {
        if (vMouseX-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth<0) vNewX=vScrollPos.x;
        else vNewX=vMouseX+vScrollPos.x-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth;
    }
    else vNewX=vMouseX+vScrollPos.x+vCurRightBuf;
    */
    /* Code for positioned left of the mouse by default */
    if (vMouseX - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth < 0) {
        if (vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX)
            vNewX = vScrollPos.x;
        else
            vNewX = vMouseX + vScrollPos.x + vCurRightBuf;
    }
    else
        vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth;
    /* Code for positioned below the mouse by default */
    if (vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY) {
        if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0)
            vNewY = vScrollPos.y;
        else
            vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight;
    }
    else
        vNewY = vMouseY + vScrollPos.y + vCurBotBuf;
    /* Code for positioned above the mouse by default */
    /*
    if (vMouseY-vCurTopBuf-pGanttChartObj.vTool.offsetHeight<0)
    {
        if (vMouseY+vCurBotBuf+pGanttChartObj.vTool.offsetHeight>vViewportY) vNewY=vScrollPos.y;
        else vNewY=vMouseY+vScrollPos.y+vCurBotBuf;
    }
    else vNewY=vMouseY+vScrollPos.y-vCurTopBuf-pGanttChartObj.vTool.offsetHeight;
    */
    var outViewport = Math.abs(vOldX - vNewX) > screenX || Math.abs(vOldY - vNewY) > screenY;
    if (pGanttChartObj.getUseMove() && !outViewport) {
        clearInterval(pGanttChartObj.vTool.moveInterval);
        pGanttChartObj.vTool.moveInterval = setInterval(function () { exports.moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
    }
    else {
        pGanttChartObj.vTool.style.left = vNewX + 'px';
        pGanttChartObj.vTool.style.top = vNewY + 'px';
    }
};
exports.updateFlyingObj = updateFlyingObj;
var moveToolTip = function (pNewX, pNewY, pTool, timer) {
    var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
    var vOldX = parseInt(pTool.style.left);
    var vOldY = parseInt(pTool.style.top);
    if (pTool.style.visibility != 'visible') {
        pTool.style.left = pNewX + 'px';
        pTool.style.top = pNewY + 'px';
        clearInterval(pTool.moveInterval);
    }
    else {
        if (pNewX != vOldX && pNewY != vOldY) {
            vOldX += Math.ceil((pNewX - vOldX) / vSpeed);
            vOldY += Math.ceil((pNewY - vOldY) / vSpeed);
            pTool.style.left = vOldX + 'px';
            pTool.style.top = vOldY + 'px';
        }
        else {
            clearInterval(pTool.moveInterval);
        }
    }
};
exports.moveToolTip = moveToolTip;
var makeRequest = function (pFile, json, vDebug) {
    if (json === void 0) { json = true; }
    if (vDebug === void 0) { vDebug = false; }
    if (window.fetch) {
        var f = fetch(pFile);
        if (json) {
            return f.then(function (res) { return res.json(); });
        }
        else {
            return f;
        }
    }
    else {
        return exports.makeRequestOldBrowsers(pFile, vDebug)
            .then(function (xhttp) {
            if (json) {
                var jsonObj = JSON.parse(xhttp.response);
                return jsonObj;
            }
            else {
                var xmlDoc = xhttp.responseXML;
                return xmlDoc;
            }
        });
    }
};
exports.makeRequest = makeRequest;
var makeRequestOldBrowsers = function (pFile, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    return new Promise(function (resolve, reject) {
        var bd;
        if (vDebug) {
            bd = new Date();
            console.info('before jsonparse', bd);
        }
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        }
        else { // IE 5/6
            xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhttp.open('GET', pFile, true);
        xhttp.send(null);
        xhttp.onload = function (e) {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // resolve(xhttp.responseText);
                }
                else {
                    console.error(xhttp.statusText);
                }
                if (vDebug) {
                    bd = new Date();
                    console.info('before jsonparse', bd);
                }
                resolve(xhttp);
            }
        };
        xhttp.onerror = function (e) {
            reject(xhttp.statusText);
        };
    });
};
exports.makeRequestOldBrowsers = makeRequestOldBrowsers;
var calculateStartEndFromDepend = function (tasksList) {
};
exports.calculateStartEndFromDepend = calculateStartEndFromDepend;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXMLTask = exports.getXMLProject = exports.AddXMLTask = exports.getXMLNodeValue = exports.findXMLNode = exports.parseXMLString = exports.parseXML = void 0;
var task_1 = require("./task");
var date_utils_1 = require("./utils/date_utils");
var draw_utils_1 = require("./utils/draw_utils");
var general_utils_1 = require("./utils/general_utils");
var parseXML = function (pFile, pGanttVar) {
    return general_utils_1.makeRequest(pFile, false, false)
        .then(function (xmlDoc) {
        exports.AddXMLTask(pGanttVar, xmlDoc);
    });
};
exports.parseXML = parseXML;
var parseXMLString = function (pStr, pGanttVar) {
    var xmlDoc;
    if (typeof window.DOMParser != 'undefined') {
        xmlDoc = (new window.DOMParser()).parseFromString(pStr, 'text/xml');
    }
    else if (typeof window.ActiveXObject != 'undefined' &&
        new window.ActiveXObject('Microsoft.XMLDOM')) {
        xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(pStr);
    }
    exports.AddXMLTask(pGanttVar, xmlDoc);
};
exports.parseXMLString = parseXMLString;
var findXMLNode = function (pRoot, pNodeName) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName);
    }
    catch (error) {
        ;
    } // do nothing, we'll return undefined
    return vRetValue;
};
exports.findXMLNode = findXMLNode;
// pType can be 1=numeric, 2=String, all other values just return raw data
var getXMLNodeValue = function (pRoot, pNodeName, pType, pDefault) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName)[0].childNodes[0].nodeValue;
    }
    catch (error) {
        if (typeof pDefault != 'undefined')
            vRetValue = pDefault;
    }
    if (typeof vRetValue != 'undefined' && vRetValue != null) {
        if (pType == 1)
            vRetValue *= 1;
        else if (pType == 2)
            vRetValue = vRetValue.toString();
    }
    return vRetValue;
};
exports.getXMLNodeValue = getXMLNodeValue;
var AddXMLTask = function (pGanttVar, pXmlDoc) {
    var project = '';
    var Task;
    var n = 0;
    var m = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var maxPID = 0;
    var ass = new Array();
    var assRes = new Array();
    var res = new Array();
    var pars = new Array();
    var projNode = exports.findXMLNode(pXmlDoc, 'Project');
    if (typeof projNode != 'undefined' && projNode.length > 0) {
        project = projNode[0].getAttribute('xmlns');
    }
    if (project == 'http://schemas.microsoft.com/project') {
        pGanttVar.setDateInputFormat('yyyy-mm-dd');
        Task = exports.findXMLNode(pXmlDoc, 'Task');
        if (typeof Task == 'undefined')
            n = 0;
        else
            n = Task.length;
        var resources = exports.findXMLNode(pXmlDoc, 'Resource');
        if (typeof resources == 'undefined') {
            n = 0;
            m = 0;
        }
        else
            m = resources.length;
        for (i = 0; i < m; i++) {
            var resname = exports.getXMLNodeValue(resources[i], 'Name', 2, '');
            var uid = exports.getXMLNodeValue(resources[i], 'UID', 1, -1);
            if (resname.length > 0 && uid > 0)
                res[uid] = resname;
        }
        var assignments = exports.findXMLNode(pXmlDoc, 'Assignment');
        if (typeof assignments == 'undefined')
            j = 0;
        else
            j = assignments.length;
        for (i = 0; i < j; i++) {
            var uid = void 0;
            var resUID = exports.getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
            uid = exports.getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);
            if (uid > 0) {
                if (resUID > 0)
                    assRes[uid] = res[resUID];
                ass[uid] = assignments[i];
            }
        }
        // Store information about parent UIDs in an easily searchable form
        for (i = 0; i < n; i++) {
            var uid = void 0;
            uid = exports.getXMLNodeValue(Task[i], 'UID', 1, 0);
            var vOutlineNumber = void 0;
            if (uid != 0)
                vOutlineNumber = exports.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
            if (uid > 0)
                pars[vOutlineNumber] = uid;
            if (uid > maxPID)
                maxPID = uid;
        }
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = exports.getXMLNodeValue(Task[i], 'UID', 1, 0);
            if (pID != 0) {
                var pName = exports.getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
                var pStart = exports.getXMLNodeValue(Task[i], 'Start', 2, '');
                var pEnd = exports.getXMLNodeValue(Task[i], 'Finish', 2, '');
                var pPlanStart = exports.getXMLNodeValue(Task[i], 'PlanStart', 2, '');
                var pPlanEnd = exports.getXMLNodeValue(Task[i], 'PlanFinish', 2, '');
                var pDuration = exports.getXMLNodeValue(Task[i], 'Duration', 2, '');
                var pLink = exports.getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
                var pMile = exports.getXMLNodeValue(Task[i], 'Milestone', 1, 0);
                var pComp = exports.getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
                var pCost = exports.getXMLNodeValue(Task[i], 'Cost', 2, 0);
                var pGroup = exports.getXMLNodeValue(Task[i], 'Summary', 1, 0);
                var pParent = 0;
                var vOutlineLevel = exports.getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);
                var vOutlineNumber = void 0;
                if (vOutlineLevel > 1) {
                    vOutlineNumber = exports.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
                    pParent = pars[vOutlineNumber.substr(0, vOutlineNumber.lastIndexOf('.'))];
                }
                var pNotes = void 0;
                try {
                    pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
                }
                catch (error) {
                    pNotes = '';
                }
                var pRes = void 0;
                if (typeof assRes[pID] != 'undefined')
                    pRes = assRes[pID];
                else
                    pRes = '';
                var predecessors = exports.findXMLNode(Task[i], 'PredecessorLink');
                if (typeof predecessors == 'undefined')
                    j = 0;
                else
                    j = predecessors.length;
                var pDepend = '';
                for (k = 0; k < j; k++) {
                    var depUID = exports.getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
                    var depType = exports.getXMLNodeValue(predecessors[k], 'Type', 1, 1);
                    if (depUID > 0) {
                        if (pDepend.length > 0)
                            pDepend += ',';
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
                var pOpen = 1;
                var pCaption = '';
                var pClass = void 0;
                if (pGroup > 0)
                    pClass = 'ggroupblack';
                else if (pMile > 0)
                    pClass = 'gmilestone';
                else
                    pClass = 'gtaskblue';
                // check for split tasks
                var splits = exports.findXMLNode(ass[pID], 'TimephasedData');
                if (typeof splits == 'undefined')
                    j = 0;
                else
                    j = splits.length;
                var vSplitStart = pStart;
                var vSplitEnd = pEnd;
                var vSubCreated = false;
                var vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');
                for (k = 0; k < j; k++) {
                    var vDuration = exports.getXMLNodeValue(splits[k], 'Value', 2, '0');
                    //remove all text
                    vDuration = '0' + vDuration.replace(/\D/g, '');
                    vDuration *= 1;
                    if ((vDuration == 0 && !vSubCreated) || (k + 1 == j && pGroup == 2)) {
                        // No time booked in the given period (or last entry)
                        // Make sure the parent task is set as a combined group
                        pGroup = 2;
                        // Handle last loop
                        if (k + 1 == j)
                            vDepend = pDepend.replace(/,*[0-9]+[FS]S/g, '');
                        // Now create a subtask
                        maxPID++;
                        vSplitEnd = exports.getXMLNodeValue(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
                        pGanttVar.AddTaskItem(new task_1.TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
                        vSubCreated = true;
                        vDepend = '';
                    }
                    else if (vDuration != 0 && vSubCreated) {
                        vSplitStart = exports.getXMLNodeValue(splits[k], 'Start', 2, '');
                        vSubCreated = false;
                    }
                }
                if (vSubCreated)
                    pDepend = '';
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
            }
        }
    }
    else {
        Task = pXmlDoc.getElementsByTagName('task');
        n = Task.length;
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = exports.getXMLNodeValue(Task[i], 'pID', 1, 0);
            if (pID != 0) {
                var pName = exports.getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');
                var pStart = exports.getXMLNodeValue(Task[i], 'pStart', 2, '');
                var pEnd = exports.getXMLNodeValue(Task[i], 'pEnd', 2, '');
                var pPlanStart = exports.getXMLNodeValue(Task[i], 'pPlanStart', 2, '');
                var pPlanEnd = exports.getXMLNodeValue(Task[i], 'pPlanEnd', 2, '');
                var pDuration = exports.getXMLNodeValue(Task[i], 'pDuration', 2, '');
                var pLink = exports.getXMLNodeValue(Task[i], 'pLink', 2, '');
                var pMile = exports.getXMLNodeValue(Task[i], 'pMile', 1, 0);
                var pComp = exports.getXMLNodeValue(Task[i], 'pComp', 1, 0);
                var pCost = exports.getXMLNodeValue(Task[i], 'pCost', 2, 0);
                var pGroup = exports.getXMLNodeValue(Task[i], 'pGroup', 1, 0);
                var pParent = exports.getXMLNodeValue(Task[i], 'pParent', 1, 0);
                var pRes = exports.getXMLNodeValue(Task[i], 'pRes', 2, '');
                var pOpen = exports.getXMLNodeValue(Task[i], 'pOpen', 1, 1);
                var pDepend = exports.getXMLNodeValue(Task[i], 'pDepend', 2, '');
                var pCaption = exports.getXMLNodeValue(Task[i], 'pCaption', 2, '');
                var pNotes = exports.getXMLNodeValue(Task[i], 'pNotes', 2, '');
                var pClass = exports.getXMLNodeValue(Task[i], 'pClass', 2, '');
                if (typeof pClass == 'undefined') {
                    if (pGroup > 0)
                        pClass = 'ggroupblack';
                    else if (pMile > 0)
                        pClass = 'gmilestone';
                    else
                        pClass = 'gtaskblue';
                }
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
            }
        }
    }
};
exports.AddXMLTask = AddXMLTask;
var getXMLProject = function () {
    var vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    for (var i = 0; i < this.vTaskList.length; i++) {
        vProject += this.getXMLTask(i, true);
    }
    vProject += '</project>';
    return vProject;
};
exports.getXMLProject = getXMLProject;
var getXMLTask = function (pID, pIdx) {
    var i = 0;
    var vIdx = -1;
    var vTask = '';
    var vOutFrmt = date_utils_1.parseDateFormatStr(this.getDateInputFormat() + ' HH:MI:SS');
    if (pIdx === true)
        vIdx = pID;
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
        vTask += '<pStart>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
        vTask += '<pEnd>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
        vTask += '<pPlanStart>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getPlanStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanStart>';
        vTask += '<pPlanEnd>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getPlanEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanEnd>';
        vTask += '<pDuration>' + this.vTaskList[vIdx].getDuration() + '</pDuration>';
        vTask += '<pClass>' + this.vTaskList[vIdx].vClass + '</pClass>';
        vTask += '<pLink>' + this.vTaskList[vIdx].vLink + '</pLink>';
        vTask += '<pMile>' + this.vTaskList[vIdx].vMile + '</pMile>';
        if (this.vTaskList[vIdx].vRes != '\u00A0')
            vTask += '<pRes>' + this.vTaskList[vIdx].vRes + '</pRes>';
        vTask += '<pComp>' + this.vTaskList[vIdx].getCompVal() + '</pComp>';
        vTask += '<pCost>' + this.vTaskList[vIdx].vCost + '</pCost>';
        vTask += '<pGroup>' + this.vTaskList[vIdx].vGroup + '</pGroup>';
        vTask += '<pParent>' + this.vTaskList[vIdx].vParent + '</pParent>';
        vTask += '<pOpen>' + this.vTaskList[vIdx].vOpen + '</pOpen>';
        vTask += '<pDepend>';
        var vDepList = this.vTaskList[vIdx].vDepend;
        for (i = 0; i < vDepList.length; i++) {
            if (i > 0)
                vTask += ',';
            if (vDepList[i] > 0)
                vTask += vDepList[i] + this.vTaskList[vIdx].vDependType[i];
        }
        vTask += '</pDepend>';
        vTask += '<pCaption>' + this.vTaskList[vIdx].vCaption + '</pCaption>';
        var vTmpFrag = document.createDocumentFragment();
        var vTmpDiv = draw_utils_1.newNode(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].vNotes.innerHTML);
        vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
        vTask += '</task>';
    }
    return vTask;
};
exports.getXMLTask = getXMLTask;

},{"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}]},{},[1])(1)
});
