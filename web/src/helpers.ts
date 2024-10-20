export function getCaretCharacterOffsetWithin(element: any) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

export function setCaretPosition(element: HTMLElement, offset: number) {
  var range = document.createRange();
  var sel = window.getSelection();

  //select appropriate node
  var currentNode = null;
  var previousNode = null;

  for (var i = 0; i < element.childNodes.length; i++) {
    //save previous node
    previousNode = currentNode;

    //get current node
    currentNode = element.childNodes[i];
    //if we get span or something else then we should get child node
    while (currentNode.childNodes.length > 0) {
      currentNode = currentNode.childNodes[0];
    }

    //calc offset in current node
    if (previousNode != null) {
      offset -= (previousNode as any).length;
    }
    //check whether current node has enough length
    if (offset <= (currentNode as any).length) {
      break;
    }
  }
  //move caret to specified offset
  if (currentNode != null) {
    range.setStart(currentNode, offset);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

export const formatNumber = (num: string) => {
  var useDelimeter = false;
  var right = "";
  var left = "";

  let chars = num.split("");
  chars.forEach((char) => {
    const isNumber = char >= "0" && char <= "9";
    if (isNumber && useDelimeter) right += char;
    else if (isNumber && !useDelimeter) left += char;
    else if (char === "." || char === "," || char === ",") {
      if (left == "") left = "0";
      useDelimeter = true;
    }
  });

  return useDelimeter ? `${+left}.${right}` : `${+left}`;
};

export default function copyTextToClipboard(text: string, { target = document.body } = {}) {
  if (typeof text !== "string") {
    throw new TypeError(`Expected parameter \`text\` to be a \`string\`, got \`${typeof text}\`.`);
  }

  const element = document.createElement("textarea");
  const previouslyFocusedElement = document.activeElement as HTMLElement;

  element.value = text;

  // Prevent keyboard from showing on mobile
  element.setAttribute("readonly", "");

  element.style.contain = "strict";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.fontSize = "12pt"; // Prevent zooming on iOS

  const selection = document.getSelection() as any;
  const originalRange = selection.rangeCount > 0 && selection.getRangeAt(0);

  target.append(element);
  element.select();

  // Explicit selection workaround for iOS
  element.selectionStart = 0;
  element.selectionEnd = text.length;

  let isSuccess = false;
  try {
    isSuccess = document.execCommand("copy");
  } catch {}

  element.remove();

  if (originalRange) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }

  // Get the focus back on the previously focused element, if any
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }

  return isSuccess;
}
