
const workspace = document.getElementById('workspace');
const addTextBtn = document.getElementById('add-text');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const fontSelector = document.getElementById('font-selector');
const sizeSelector = document.getElementById('size-selector');


let textElements = [];
let actionHistory = [];
let redoActions = [];
let activeElement = null;


const createTextBlock = () => {
    const textBlock = document.createElement('div');
    textBlock.contentEditable = true;
    textBlock.className = 'text-block';
    textBlock.textContent = 'Enter your text here...';
    textBlock.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
    textBlock.style.top = `${Math.random() * (window.innerHeight - 50)}px`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => removeTextBlock(textBlock));

    textBlock.appendChild(deleteButton);
    enableDrag(textBlock);
    workspace.appendChild(textBlock);

    textElements.push(textBlock);
    logAction('create', textBlock);

    textBlock.addEventListener('click', () => (activeElement = textBlock));
};


const enableDrag = (element) => {
    let isDragging = false, offsetX, offsetY;

    element.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('delete-btn')) return;
        isDragging = true;
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            element.style.left = `${event.clientX - offsetX}px`;
            element.style.top = `${event.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            logAction('move', element);
            isDragging = false;
            element.style.cursor = 'move';
        }
    });
};


const removeTextBlock = (block) => {
    workspace.removeChild(block);
    textElements = textElements.filter((el) => el !== block);
    logAction('delete', block);
};


const changeFontStyle = () => {
    const selectedFont = fontSelector.value;
    textElements.forEach((block) => {
        block.style.fontFamily = selectedFont;
    });
};


const changeFontSize = () => {
    if (activeElement) {
        activeElement.style.fontSize = `${sizeSelector.value}px`;
    }
};


const logAction = (type, block) => {
    actionHistory.push({
        type,
        block,
        left: block.style.left,
        top: block.style.top,
    });
    redoActions = [];
};


const undoAction = () => {
    if (!actionHistory.length) return;

    const lastAction = actionHistory.pop();
    redoActions.push(lastAction);

    if (lastAction.type === 'create') {
        workspace.removeChild(lastAction.block);
        textElements = textElements.filter((el) => el !== lastAction.block);
    } else if (lastAction.type === 'delete') {
        workspace.appendChild(lastAction.block);
        textElements.push(lastAction.block);
    } else if (lastAction.type === 'move') {
        lastAction.block.style.left = lastAction.left;
        lastAction.block.style.top = lastAction.top;
    }
};


const redoAction = () => {
    if (!redoActions.length) return;

    const redoAction = redoActions.pop();
    actionHistory.push(redoAction);

    if (redoAction.type === 'create') {
        workspace.appendChild(redoAction.block);
        textElements.push(redoAction.block);
    } else if (redoAction.type === 'delete') {
        workspace.removeChild(redoAction.block);
        textElements = textElements.filter((el) => el !== redoAction.block);
    } else if (redoAction.type === 'move') {
        redoAction.block.style.left = redoAction.left;
        redoAction.block.style.top = redoAction.top;
    }
};


addTextBtn.addEventListener('click', createTextBlock);
undoBtn.addEventListener('click', undoAction);
redoBtn.addEventListener('click', redoAction);
fontSelector.addEventListener('change', changeFontStyle);
sizeSelector.addEventListener('input', changeFontSize);
