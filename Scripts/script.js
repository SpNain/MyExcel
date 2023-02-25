let topLeftCell = document.querySelector(".top-left-cell");
let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let address = document.querySelector("#address");
let formulaInput = document.querySelector("#formula");
let allCells = document.querySelectorAll(".cell");
let lastSelectedCell;
let lastSheetIdx = 0;


// iska kaam hai -> ki jab bhi left right scroll kre abcd wala row saath me chle aur jab bhi up and down kre to counting wala div saath me chle
cellsContainer.addEventListener("scroll", function(e) {
    let topOffset = e.target.scrollTop; // ye humne nikal liya ki hum uper se kitna scroll kiye hai
    let leftOffset = e.target.scrollLeft; // ye humne nikal liya ki hum left se kitna scroll kiye hai

    topRow.style.top = topOffset + "px"; // abcd wali row set kardi
    topLeftCell.style.top = topOffset + "px"; // uper gray div top se set kar diya
    topLeftCell.style.left = leftOffset + "px"; // uper gray div left se set kar diya. Kyonki wo dono ke time pe rehta hai
    leftCol.style.left = leftOffset + "px"; // counting wala div set kar diya
});

// jab bhi formula me hum kuch bhi type krke kahi aur click krenge to formularInput out of focus chla jaayega jisse ye event occur hoga
formulaInput.addEventListener("blur", function(e) { // jab bhi element out of focus jaayega ye event occur hoga
    fiIC(e);
});

formulaInput.addEventListener("keydown", function(e) { // jab bhi element pe key down hoga aur key 'enter' hui to fiIC() chalega
    if (e.key == "Enter") {
        fiIC(e);
    }
});

// fiICF = formula input inside code
function fiIC(e) {
    let formula = e.target.value;
    if (formula) {
        let cellObject = getCellObjectFromElement(lastSelectedCell); // last selected cell aata hai attachClickAndBlurEventOnCell() se

        //cellObject me jo formula pda h wo formula hai jo pahle se cell pe lga hua tha // aur formula jo hai wo turant nya aaya hai means ki humne formula change kiya hai.
        if (cellObject.formula != formula) { // formula to formula edge case : matlab ki kisi cell me humne pahle kisi formule se value daal rkhi thi fir baad me humne us formule ko change kar diya // to bas humne cellObject me se formula htana hai baki kaam apna nye formule ke hisab se hoga
            deleteFormula(cellObject);
        }

        let calculatedValue = solveFormula(formula, cellObject); // yaha pe kisi bhi cell ke liye first time formula solve ho rha hai to uska khud ka cellobject bhi bhej rhe hai taki usko as a child add kiya jaa ske
        // UI Update
        lastSelectedCell.textContent = calculatedValue;
        // DB Update
        cellObject.value = calculatedValue;
        cellObject.formula = formula;

        handleVisitedCells(cellObject);

        //childrens update
        updateChildrens(cellObject.childrens); // value to formula edge case : matlab ki kisi cell me pahle to manually value daal rkhi thi lekin ab usme value formula ka use karke daali hai to uspe dependent cell bhi update ho jaaye : handled
    }
}

let rowId;
let colId;

/*
jab bhi hum nyi sheet bnate hai to uske liye initcells() re-run krte hai 
to ab kyunki cells nyi aayi hai to unpe koi event nhi hota to jo bhi code event attach krte hai (jo event sheet add krne pe ht jaate hai) unko ek fxn me wrap kr diya
ab is fxn ko hum pahle to automatically call lga dete hai jisse default sheet pe event attach ho jaaye aur add sheet krne ke time pe bhi run kr dete hai jisse har nyi sheet pe event attach ho jaate hai
attachClickAndBlurEventOnCell : 1.click event lagana taki jab bhi kisi cell pe click ho to 
                                                                                           >> us cell ka naam address me dhikhe aur ek cell se associated formula formulaInput me dhikhe
                                                                                           >> us cell pe lge menu options ki active dhike(lightgray background ho jaaye) (bas dhike na ki apply ho kyunki apply hone ka logic to menu.js me hai)
                                2.blur event lagana jisse formula aur manually se cell me value daali jaa ske 
*/

function attachClickAndBlurEventOnCell() {
    for (let i = 0; i < allCells.length; i++) {

        allCells[i].addEventListener("click", function(e) {

            //remove active class 
            removeACFromLSC(lastSelectedCell);
            // add active class
            addACToLSC(e, null);

        });


        allCells[i].addEventListener("blur", function (e) {
            // console.log(e);
            lastSelectedCell = e.target;
            // logic to save this value in db
            let cellValueFromUI = e.target.textContent; // jo hum cell me type karte hai wo mil jaayegi
            if (cellValueFromUI) { // agr foucsed div me kuch type kiye bina kisi aur div pe move krte hai to ye sb lines of code nhi chlenge // in simple words agr cellValueFromUI null aayi to kaam nhi hoga
                let cellObject = getCellObjectFromElement(e.target);

                // check if the given cell has a formula on it
                // agr to cell pe pahle se formula hai aur jo value pahle se hai wo value uske cellObject ki value se match nhi hoti matlab formula to edge case occur hua hai
                if (cellObject.formula && cellValueFromUI != cellObject.value) { // formula to value edge case : matlab ki koi cell pahle kisi formulae pe dependent tha aur ab usme humne manually value dedi hai to wo ab further aage kisi formula pe depend nhi karta // to apne aapko apne parents me se as a child htana aur apne childrens ki value ko update karna : handled
                    deleteFormula(cellObject);
                    formulaInput.value = "";
                }

                // cellObject ki value update !!
                cellObject.value = cellValueFromUI;

                // update childrens of the current updated cell
                updateChildrens(cellObject.childrens); // value to value edge case : matlab ki kisi cell ki value manually change krne pe uspe dependent cell ki bhi value change ho jaaye : handled

                handleVisitedCells(cellObject);
            }
        });
    }
}
attachClickAndBlurEventOnCell(); // jo bhi nyi sheets add hogi unke liye to humne alag se is fxn ko call lga rkhi hai lekin 1st sheet ke liye to yaha se call lgegi

