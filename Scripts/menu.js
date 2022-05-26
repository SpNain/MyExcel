/*=============Menu Options 1 Logic =================*/

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");

//menu-option-1 ke saare div maangwaye aur ek ek karke unpe click event lga diya
bold.addEventListener("click", function() {
    handleMenuOptionsOne("bold");
});
italic.addEventListener("click", function() {
    handleMenuOptionsOne("italic");
});
underline.addEventListener("click", function() {
    handleMenuOptionsOne("underline");
});

// handleMenuOptionsOne : 1. give toogling effect of - is particular property selected or not? - if property is selected, will have lightgray background - if not then background will be cleared.
//                        2. give toogling effect of property - if property lagi hui hai and clicked again property will be removed. if property is nhi lagi hui and clicked property lag jaayegi.

// *change - bold/italic/underline me se jo jo property kisi particular div pe lgi hui thi usko htana ya lgana

function handleMenuOptionsOne(buttonClicked) { // jo button event attach ke time pe pass kiya hoga wahi aayega
    if (lastSelectedCell) {
        let cellObject = getCellObjectFromElement(lastSelectedCell); // db me *change karne ke liye
        if (buttonClicked == "bold") {
            if (bold.classList.contains("active-menu")) {
                // already bold is active
                bold.classList.remove("active-menu");
                lastSelectedCell.style.fontWeight = "normal"; // ui me *change karne ke liye
            } else {
                // bold is not active
                bold.classList.add("active-menu");
                lastSelectedCell.style.fontWeight = "bold"; // ui me *change karne ke liye
            }
            cellObject.fontStyles.bold = !cellObject.fontStyles.bold; // db me *change karne ke liye
        } else if (buttonClicked == "italic") {
            if (italic.classList.contains("active-menu")) {
                // already italic is active
                italic.classList.remove("active-menu");
                lastSelectedCell.style.fontStyle = "normal";
            } else {
                // italic is not active
                italic.classList.add("active-menu");
                lastSelectedCell.style.fontStyle = "italic";
            }
            cellObject.fontStyles.italic = !cellObject.fontStyles.italic;
        } else {
            if (underline.classList.contains("active-menu")) {
                // already underline is active
                underline.classList.remove("active-menu");
                lastSelectedCell.style.textDecoration = "none";
            } else {
                // underline is not active
                underline.classList.add("active-menu");
                lastSelectedCell.style.textDecoration = "underline";
            }
            cellObject.fontStyles.underline = !cellObject.fontStyles.underline;
        }
        handleVisitedCells(cellObject);
    }
}

/*=============Menu Options 2 Logic =================*/

let left = document.querySelector(".left");
let center = document.querySelector(".center");
let right = document.querySelector(".right");

//menu-option-2 ke saare div maangwaye aur ek ek karke unpe click event lga diya
left.addEventListener("click", function() {
    handleTextAlign("left");
});
center.addEventListener("click", function() {
    handleTextAlign("center");
});
right.addEventListener("click", function() {
    handleTextAlign("right");
});

// handleTextAlign : 1. give toggling effect - kisi alignment pe click hota hai to usko lightgray kar dega aur dusre se hta de
//                   2. text-alignment set karta hai jo choose kiya hai uske hisab se 

function handleTextAlign(alignment) {
    if (lastSelectedCell) {
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        if (alignment == cellObject.textAlign) { // e.g. : left selected tha usi pe click kar diya to kuch nhi hoga
        return;
    }
    // remove prev active menu from text align
    document.querySelector(".menu-options-2 .active-menu").classList.remove("active-menu");
    // niche wali line ko script.js me text-align ke code me joki hai click event ke fxn ke andar usme explain kiya hua hai
    document.querySelector("." + alignment).classList.add("active-menu");
    // Db me text align set krna hoga
    cellObject.textAlign = alignment;
    
    // UI pe alignmnet change hogi
        lastSelectedCell.style.textAlign = alignment;
        handleVisitedCells(cellObject);
    }
    
}

/*=============Menu Options 3 Logic =================*/


let fontFamilyTag = document.querySelector("select[name='fonttype']");
let fontSizeTag = document.querySelector("select[name='fontsize']");

// whenever there is a change in font family tag (select tag) this event is fired and function executed
// aur agr koi lastSelectedCell aaya hoga to us lastSelectedCell ka font family set hojega aur uske cellObject me bhi wahi font family set hojega
fontFamilyTag.addEventListener("change", e => {
    
    if (lastSelectedCell) {
        // console.log(e.currentTarget.value);
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.fontFamily = e.currentTarget.value;  
        cellObject.fontFamily = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }
});

// same uper wale ka explaination bas font family ki jagah font size set hoga
fontSizeTag.addEventListener("change", e => {
    
    if (lastSelectedCell) { 
        // console.log(e.currentTarget.value);
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.fontSize = e.currentTarget.value+"px";  
        cellObject.fontSize = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }
});


/*=============Menu Options 4 Logic =================*/

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

// same font family wale ka logic bas font family ki jagah font-color set hoga
function setFontColor(e) {
   
    if (lastSelectedCell) {
        
        // console.log("setFontColor called");
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

// same font family wale ka logic bas font family ki jagah background-color set hoga
function setBackgroundColor(e) {
   
    if (lastSelectedCell) {
    
        // console.log("setBackgroundColor called");
        let cellObject = getCellObjectFromElement(lastSelectedCell);
        lastSelectedCell.style.backgroundColor = e.currentTarget.value;
        cellObject.backgroundColor = e.currentTarget.value;
        handleVisitedCells(cellObject);
    }

}