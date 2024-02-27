let addSheetBtn = document.querySelector(".add-sheet");
let sheetsList = document.querySelector(".sheets-list");
let defaultSheet = document.querySelector(".sheet");
let sheetId = 0;
let activeCellArr = [];
addSheetBtn.addEventListener("click", function() {
    addSheet();
});

defaultSheet.addEventListener("click", function() {
    switchSheet(defaultSheet);
});

function addSheet() {
    document.querySelector(".active-sheet").classList.remove("active-sheet");
    sheetId++;
    let sheetDiv = document.createElement("div");
    sheetDiv.classList.add("sheet");
    sheetDiv.classList.add("active-sheet");
    sheetDiv.setAttribute("sid", sheetId);
    sheetDiv.innerHTML = `Sheet ${sheetId + 1}`;
    sheetsList.append(sheetDiv);

    sheetDiv.addEventListener("click", function() {
        switchSheet(sheetDiv);
    });

    cleanUI();
    initDB();

    pushToACArr(lastSelectedCell, lastSheetIdx);
    lastSheetIdx = sheetId;

    removeACFromLSC(lastSelectedCell);
    lastSelectedCell = undefined;
}

function switchSheet(currentSheet) {
    if (currentSheet.classList.contains("active-sheet")) {
        return;
    }
    document.querySelector(".active-sheet").classList.remove("active-sheet");
    currentSheet.classList.add("active-sheet");

    cleanUI();

    let sid = currentSheet.getAttribute("sid");
    db = sheetsDB[sid].db;
    visitedCells = sheetsDB[sid].visitedCells;

    for (let i = 0; i < visitedCells.length; i++) {

        let { rowId, colId } = visitedCells[i];
        let idx = Number(rowId) * 26 + Number(colId);
        allCells[idx].textContent = db[rowId][colId].value;

        let cellObject = db[rowId][colId];
        let { bold, underline, italic } = cellObject.fontStyles;
        if (bold) {
            allCells[idx].style.fontWeight = "bold";
        }
        if (underline) {
            allCells[idx].style.textDecoration = "underline";
        }
        if (italic) {
            allCells[idx].style.fontStyle = "italic";
        }

        let textAlign = cellObject.textAlign;
        allCells[idx].style.textAlign = textAlign;

        let fontColor = cellObject.fontColor;
        allCells[idx].style.color = fontColor;

        let backgroundColor = cellObject.backgroundColor;
        allCells[idx].style.backgroundColor = backgroundColor;

        allCells[idx].style.fontFamily = cellObject.fontFamily;
        allCells[idx].style.fontSize = cellObject.fontSize+"px";
    }

    pushToACArr(lastSelectedCell, lastSheetIdx);
    lastSheetIdx = sid;

    removeACFromLSC(lastSelectedCell);
    addACToLSC(null, sid);
}

function attachEventListeners() {
    topLeftCell = document.querySelector(".top-left-cell");
    topRow = document.querySelector(".top-row");
    leftCol = document.querySelector(".left-col");
    allCells = document.querySelectorAll(".cell");
    attachClickAndBlurEventOnCell();
}

function cleanUI() {

    let allActiveMenus = document.querySelectorAll(".active-menu");
    if (allActiveMenus) {
        for (let i = 0; i < allActiveMenus.length; i++) {
            allActiveMenus[i].classList.remove("active-menu");
        }
    }

    fontColorInput.value = '#000000';
    backgroundColorInput.value = "#FFFFFF";

    fontFamilyTag.value = "Calibri";
    fontSizeTag.value = "11";

    for (let i = 0; i < visitedCells.length; i++) {
        let { rowId, colId } = visitedCells[i];
        let idx = Number(rowId) * 26 + Number(colId);
        allCells[idx].innerHTML = "";
        allCells[idx].style = "";
    }
}

function pushToACArr(lastSelectedCell, idx) {
    if (lastSelectedCell) {
        let ACrowId = lastSelectedCell.getAttribute("rowid");
        let ACcolId = lastSelectedCell.getAttribute("colid");
        if (idx <= activeCellArr.length - 1) {
            activeCellArr.splice(idx, 1, { ACrowId: ACrowId, ACcolId: ACcolId });
        } else {
            activeCellArr.push({ ACrowId: ACrowId, ACcolId: ACcolId });
        }
    } else {
        if (idx <= activeCellArr.length - 1) {
            activeCellArr.splice(idx, 1, {});
        } else {
            activeCellArr.push({});
        }
    }
}