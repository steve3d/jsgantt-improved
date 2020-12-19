
export const makeInput = function (formattedValue, editable, type = 'text', value = null, choices = null) {
  if (!value) {
    value = formattedValue;
  }
  if (editable) {
    switch (type) {
      case 'date':
        // Take timezone into account before converting to ISO String
        value = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
        return `<input class="gantt-inputtable" type="date" value="${value}">`;
      case 'resource':
        if (choices) {
          const found = choices.filter(c => c.id == value || c.name == value);
          if (found && found.length > 0) {
            value = found[0].id;
          } else {
            choices.push({ id: value, name: value });
          }
          return `<select>` + choices.map(c => `<option value="${c.id}" ${value == c.id ? 'selected' : ''} >${c.name}</option>`).join('') + `</select>`;
        } else {
          return `<input class="gantt-inputtable" type="text" value="${value ? value : ''}">`;
        }
      case 'cost':
        return `<input class="gantt-inputtable" type="number" max="100" min="0" value="${value ? value : ''}">`;
      default:
        return `<input class="gantt-inputtable" value="${value ? value : ''}">`;
    }
  } else {
    return formattedValue;
  }
}

export function newNode(pParent: any,
                        pNodeType: string,
                        pId: string = null,
                        pClass: string = null,
                        pText: string = null,
                        pWidth: number | string = null,
                        pLeft: number | string = null,
                        pDisplay: string = null,
                        pColspan: number = null,
                        pAttribs = null) {
  let vNewNode = pParent.appendChild(document.createElement(pNodeType));
  if (pAttribs) {
    for (let i = 0; i + 1 < pAttribs.length; i += 2) {
      vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
    }
  }
  if (pId) vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
  if (pClass) vNewNode.className = pClass;
  if (pWidth) vNewNode.style.width = (typeof pWidth === 'string') ? pWidth : pWidth + 'px';
  if (pLeft) vNewNode.style.left = (typeof pLeft === 'string') ? pLeft : pLeft + 'px';
  if (pText) {
    if (pText.indexOf && pText.indexOf('<') === -1) {
      vNewNode.appendChild(document.createTextNode(pText));
    } else {
      vNewNode.insertAdjacentHTML('beforeend', pText);
    }
  }
  if (pDisplay) vNewNode.style.display = pDisplay;
  if (pColspan && vNewNode instanceof HTMLTableCellElement) vNewNode.colSpan = pColspan;
  return vNewNode;
}
