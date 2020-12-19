import {
    delayedHide,
    fadeToolTip,
    findObj,
    getScrollbarWidth,
    isParentElementOrSelf,
    stripIds,
    updateFlyingObj
} from "./utils/general_utils";

export function showToolTip(pGanttChartObj, e, pContents, pWidth, pTimer) {
    let vTtDivId = pGanttChartObj.getDivId() + 'JSGanttToolTip';
    let vMaxW = 500;
    let vMaxAlpha = 100;
    let vShowing = pContents.id;

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
            pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : (window.event as MouseEvent).clientX) / 2) + 'px';
            pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : (window.event as MouseEvent).clientY) / 2) + 'px';
            pGanttChartObj.addListener('mouseover', function () {
                clearTimeout(pGanttChartObj.vTool.delayTimeout);
            }, pGanttChartObj.vTool);
            pGanttChartObj.addListener('mouseout', function () {
                delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer);
            }, pGanttChartObj.vTool);
        }
        clearTimeout(pGanttChartObj.vTool.delayTimeout);

        const newHTML = pContents.innerHTML;

        if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
            pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
            // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
            stripIds(pGanttChartObj.vTool.vToolCont);
            pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
        }

        if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
            if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
                pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
            }

            pGanttChartObj.vTool.style.visibility = 'visible';
            // Rather than follow the mouse just have it stay put
            updateFlyingObj(e, pGanttChartObj, pTimer);
            pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
            if (!pWidth) {
                pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
            }
            if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
                pGanttChartObj.vTool.style.width = vMaxW + 'px';
            }
        }

        if (pGanttChartObj.getUseFade()) {
            clearInterval(pGanttChartObj.vTool.fadeInterval);
            pGanttChartObj.vTool.fadeInterval = setInterval(function () {
                fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha);
            }, pTimer);
        } else {
            pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
        }
    }
}

export function syncScroll(elements, attrName) {
    let syncFlags = new Map(elements.map(e => [e, false]));

    function scrollEvent(e) {
        if (!syncFlags.get(e.target)) {
            for (const el of elements) {
                if (el !== e.target) {
                    syncFlags.set(el, true);
                    el[attrName] = e.target[attrName];
                }
            }
        }

        syncFlags.set(e.target, false);
    }

    for (const el of elements) {
        el.addEventListener('scroll', scrollEvent);
    }
}

export function addTooltipListeners(pGanttChart, pObj1: HTMLElement, pObj2: HTMLElement, callback) {
    let isShowingTooltip = false;

    pObj1.addEventListener('mouseover', e => {
        if (isShowingTooltip || !callback) {
            showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
        } else if (callback) {
            isShowingTooltip = true;
            const promise = callback();
            showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
            if (promise && promise.then) {
                promise.then(() => {
                    if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id &&
                        pGanttChart.vTool.style.visibility === 'visible') {
                        showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
                    }
                });
            }
        }
    });

    pObj1.addEventListener('mouseout', e => {
        const outTo = e.relatedTarget;
        if (isParentElementOrSelf(outTo, pObj1) || (pGanttChart.vTool && isParentElementOrSelf(outTo, pGanttChart.vTool))) {
            // not actually out
        } else {
            isShowingTooltip = false;
        }

        delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
    });
}


export function updateGridHeaderWidth(pGanttChart) {
    const head = pGanttChart.getChartHead();
    const body = pGanttChart.getChartBody();
    if (!head || !body) return;
    const isScrollVisible = body.scrollHeight > body.clientHeight;
    if (isScrollVisible) {
        head.style.width = `calc(100% - ${getScrollbarWidth()}px)`;
    } else {
        head.style.width = '100%';
    }
}

export function addListenerClickCell(vTmpCell: HTMLElement, vEvents, task, column) {
    if(vEvents?.hasOwnProperty(column)) {
        vTmpCell.addEventListener('click', e => {
            if ((e.target as HTMLElement)?.classList.contains('gfoldercollapse') === false &&
                vEvents[column] && typeof vEvents[column] === 'function') {
                vEvents[column](task, e, vTmpCell, column);
            }
        })
    }
}

export function addListenerInputCell(vTmpCell, vEventsChange, callback, tasks, index, column, draw = null, event = 'blur') {
    const task = tasks[index];
    if (vEventsChange?.hasOwnProperty(event) && vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
        const tagName = vTmpCell.children[0].children[0].tagName;
        const selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';
        if (selectInputOrButton) {
            vTmpCell.children[0].children[0].addEventListener(event, e => {
                if (callback) {
                    callback(task, e);
                }
                if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
                    const q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);
                    if (q && q.then) {
                        q.then(e => draw());
                    } else {
                        draw();
                    }
                } else {
                    draw();
                }
            });
        }
    }
}

export function addListenerDependencies(vLineOptions) {
    const elements = document.querySelectorAll('.gtaskbarcontainer');
    for (let i = 0; i < elements.length; i++) {
        const taskDiv = elements[i];
        taskDiv.addEventListener('mouseover', e => {
            toggleDependencies(e, vLineOptions);
        });
        taskDiv.addEventListener('mouseout', e => {
            toggleDependencies(e, vLineOptions);
        });
    }
}

function toggleDependencies(e, vLineOptions) {
    const target: any = e.currentTarget;
    const ids = target.getAttribute('id').split('_');
    let style = vLineOptions && vLineOptions.borderStyleHover !== undefined ? vLineOptions.hoverStyle : 'groove';
    if (e.type === 'mouseout') {
        style = '';
    }
    if (ids.length > 1) {
        const frameZones = Array.from(document.querySelectorAll(`.gDepId${ids[1]}`));
        frameZones.forEach((c: any) => {
            c.style.borderStyle = style;
        });
        // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
        // c.style.borderStyle = style;
        // });
    }
}

const vColumnsNames = {
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
