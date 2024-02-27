let topLeftCell = document.querySelector(".top-left-cell");
let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let address = document.querySelector("#address");
let formulaInput = document.querySelector("#formula");
let allCells = document.querySelectorAll(".cell");
let lastSelectedCell;
let lastSheetIdx = 0;

cellsContainer.addEventListener("scroll", function(e) {
    let topOffset = e.target.scrollTop;
    let leftOffset = e.target.scrollLeft;

    topRow.style.top = topOffset + "px";
    topLeftCell.style.top = topOffset + "px";
    topLeftCell.style.left = leftOffset + "px";
    leftCol.style.left = leftOffset + "px";
});

formulaInput.addEventListener("blur", function(e) {
    fiIC(e);
});

formulaInput.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        fiIC(e);
    }
});

function fiIC(e) {
    let formula = e.target.value;
    if (formula) {
        let cellObject = getCellObjectFromElement(lastSelectedCell);

        if (cellObject.formula != formula) {
            deleteFormula(cellObject);
        }

        let calculatedValue = solveFormula(formula, cellObject);
        lastSelectedCell.textContent = calculatedValue;
        cellObject.value = calculatedValue;
        cellObject.formula = formula;

        handleVisitedCells(cellObject);

        updateChildrens(cellObject.childrens);
    }
}

let rowId;
let colId;

function attachClickAndBlurEventOnCell() {
    for (let i = 0; i < allCells.length; i++) {

        allCells[i].addEventListener("click", function(e) {

            removeACFromLSC(lastSelectedCell);
            addACToLSC(e, null);
        });

        allCells[i].addEventListener("blur", function (e) {
            
            lastSelectedCell = e.target;
            
            let cellValueFromUI = e.target.textContent;
            if (cellValueFromUI) {
                let cellObject = getCellObjectFromElement(e.target);

                if (cellObject.formula && cellValueFromUI != cellObject.value) {
                    deleteFormula(cellObject);
                    formulaInput.value = "";
                }

                cellObject.value = cellValueFromUI;
                updateChildrens(cellObject.childrens);
                handleVisitedCells(cellObject);
            }
        });
    }
}
attachClickAndBlurEventOnCell();

