function deleteFormula(cellObject) {

    cellObject.formula = "";

    for (let i = 0; i < cellObject.parents.length; i++) {
        let parentName = cellObject.parents[i];
        let parentCellObject = getCellObjectFromName(parentName);
        let updatedChildrens = parentCellObject.childrens.filter(function(childName) {
            if (childName == cellObject.name) {
                return false;
            }
            return true;
        });
        parentCellObject.childrens = updatedChildrens;
    }
    cellObject.parents = [];
}

function solveFormula(formula, selfCellObject) {
    let formulaComps = formula.split(" ");
    for (let i = 0; i < formulaComps.length; i++) {
        let fComp = formulaComps[i];
        if ((fComp[0] >= "A" && fComp[0] <= "Z") || (fComp[0] >= "a" && fComp <= "z")) {

            let parentCellObject = getCellObjectFromName(fComp);
            let value = parentCellObject.value;

            if (selfCellObject) {
                parentCellObject.childrens.push(selfCellObject.name);
                selfCellObject.parents.push(parentCellObject.name);
            }

            formula = formula.replace(fComp, value);
        }
    }
    let calculatedValue = eval(formula);
    return calculatedValue;
}

function getCellObjectFromElement(element) {
    let rowId = element.getAttribute("rowid");
    let colId = element.getAttribute("colid");
    return db[rowId][colId];
}

function getCellObjectFromName(name) {
    let colId = name.charCodeAt(0) - 65;
    let rowId = Number(name.substring(1)) - 1;
    return db[rowId][colId];
}

function updateChildrens(childrens) {
    for (let i = 0; i < childrens.length; i++) {
        let child = childrens[i];
        let childCellObject = getCellObjectFromName(child);
        let updatedValueOfChild = solveFormula(childCellObject.formula);
        childCellObject.value = updatedValueOfChild;
        let colId = child.charCodeAt(0) - 65;
        let rowId = Number(child.substring(1)) - 1;
        document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`).textContent = updatedValueOfChild;
        updateChildrens(childCellObject.childrens);
    }
}

function removeACFromLSC(lastSelectedCell) {
    if (lastSelectedCell) {
        lastSelectedCell.classList.remove("active-cell");
        rowId = lastSelectedCell.getAttribute("rowid");
        colId = lastSelectedCell.getAttribute("colid");
        document.querySelector(`div[trid="${colId}"]`).classList.remove("cell-selected");
        document.querySelector(`div[lcid="${rowId}"]`).classList.remove("cell-selected");
        lastSelectedCell = undefined;
        address.value = "";
    }
}

function addACToLSC(e, sid) {
    if (e) {
        rowId = e.target.getAttribute("rowid");
        colId = e.target.getAttribute("colid");
        e.target.classList.add("active-cell");

        let cellObject = getCellObjectFromElement(e.target);
        setAFMO(cellObject);

    } else if (sid) {
        rowId = activeCellArr[sid].ACrowId;
        colId = activeCellArr[sid].ACcolId;
        if (rowId && colId) {
            lastSelectedCell = document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`);
            lastSelectedCell.classList.add("active-cell");

            let cellObject = getCellObjectFromElement(lastSelectedCell);
            setAFMO(cellObject);
        } else {
            lastSelectedCell = undefined;
        }
    }
    if (rowId && colId) {
        document.querySelector(`div[trid="${colId}"]`).classList.add("cell-selected");
        document.querySelector(`div[lcid="${rowId}"]`).classList.add("cell-selected");
    }
}

function handleVisitedCells(cellObject) {
    rowId = lastSelectedCell.getAttribute("rowid");
    colId = lastSelectedCell.getAttribute("colid");
    if (!cellObject.visited) {
        visitedCells.push({ rowId, colId });
        cellObject.visited = true;
    }
}

function setAFMO(cellObject) {
    address.value = cellObject.name;
    formulaInput.value = cellObject.formula;

    let allActiveMenus = document.querySelectorAll(".active-menu");
    if (allActiveMenus) {
        for (let i = 0; i < allActiveMenus.length; i++) {
            allActiveMenus[i].classList.remove("active-menu");
        }
    }

    let { bold, underline, italic } = cellObject.fontStyles;
    bold && document.querySelector(".bold").classList.add("active-menu");
    underline && document.querySelector(".underline").classList.add("active-menu");
    italic && document.querySelector(".italic").classList.add("active-menu");

    let textAlign = cellObject.textAlign;
    document.querySelector("." + textAlign).classList.add("active-menu");


    fontFamilyTag.value = cellObject.fontFamily;
    fontSizeTag.value = cellObject.fontSize;
    
    let fontColor = cellObject.fontColor;
    fontColorInput.value = fontColor;

    let backgroundColor = cellObject.backgroundColor;
    backgroundColorInput.value = backgroundColor;
}