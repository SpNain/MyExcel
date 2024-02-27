let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");

bold.addEventListener("click", function() {
    handleMenuOptionsOne("bold");
});
italic.addEventListener("click", function() {
    handleMenuOptionsOne("italic");
});
underline.addEventListener("click", function() {
    handleMenuOptionsOne("underline");
});


function handleMenuOptionsOne(buttonClicked) {
    if (lastSelectedCell) {
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        if (buttonClicked == "bold") {
            if (bold.classList.contains("active-menu")) {
                bold.classList.remove("active-menu");
                lastSelectedCell.style.fontWeight = "normal";
            } else {
                bold.classList.add("active-menu");
                lastSelectedCell.style.fontWeight = "bold";
            }
            cellObject.fontStyles.bold = !cellObject.fontStyles.bold;
        } else if (buttonClicked == "italic") {
            if (italic.classList.contains("active-menu")) {
                italic.classList.remove("active-menu");
                lastSelectedCell.style.fontStyle = "normal";
            } else {
                italic.classList.add("active-menu");
                lastSelectedCell.style.fontStyle = "italic";
            }
            cellObject.fontStyles.italic = !cellObject.fontStyles.italic;
        } else {
            if (underline.classList.contains("active-menu")) {
                underline.classList.remove("active-menu");
                lastSelectedCell.style.textDecoration = "none";
            } else {
                underline.classList.add("active-menu");
                lastSelectedCell.style.textDecoration = "underline";
            }
            cellObject.fontStyles.underline = !cellObject.fontStyles.underline;
        }
        handleVisitedCells(cellObject);
    }
}

let left = document.querySelector(".left");
let center = document.querySelector(".center");
let right = document.querySelector(".right");

left.addEventListener("click", function() {
    handleTextAlign("left");
});
center.addEventListener("click", function() {
    handleTextAlign("center");
});
right.addEventListener("click", function() {
    handleTextAlign("right");
});


function handleTextAlign(alignment) {
    if (lastSelectedCell) {
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        if (alignment == cellObject.textAlign) {
        return;
    }
    document.querySelector(".menu-options-2 .active-menu").classList.remove("active-menu");
    document.querySelector("." + alignment).classList.add("active-menu");
    cellObject.textAlign = alignment;
    
        lastSelectedCell.style.textAlign = alignment;
        handleVisitedCells(cellObject);
    }  
}

let fontFamilyTag = document.querySelector("select[name='fonttype']");
let fontSizeTag = document.querySelector("select[name='fontsize']");

fontFamilyTag.addEventListener("change", e => {
    
    if (lastSelectedCell) {
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.fontFamily = e.currentTarget.value;  
        cellObject.fontFamily = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }
});

fontSizeTag.addEventListener("change", e => {
    
    if (lastSelectedCell) { 
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.fontSize = e.currentTarget.value+"px";  
        cellObject.fontSize = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }
});

let menuOptions4Is = document.querySelectorAll(".menu-options-4 i");
let fontColorBtn = menuOptions4Is[0];
let backgroundColorBtn = menuOptions4Is[1];

let menuOptions4Inputs = document.querySelectorAll(".menu-options-4 input");
let fontColorInput = menuOptions4Inputs[0];
let backgroundColorInput = menuOptions4Inputs[1];

fontColorBtn.addEventListener("click", function(e) {
    fontColorInput.click();
});

fontColorInput.addEventListener("change", function(e) {
    setFontColor(e);
});

function setFontColor(e) {
   
    if (lastSelectedCell) {
        
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.color = e.currentTarget.value;
        cellObject.fontColor = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }
}

backgroundColorBtn.addEventListener("click", function(e) {
    backgroundColorInput.click();
});

backgroundColorInput.addEventListener("change", e => {
    setBackgroundColor(e);
});

function setBackgroundColor(e) {
   
    if (lastSelectedCell) {
    
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.backgroundColor = e.currentTarget.value;
        cellObject.backgroundColor = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }
}