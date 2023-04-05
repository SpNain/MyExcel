let addSheetBtn = document.querySelector(".add-sheet");
let sheetsList = document.querySelector(".sheets-list");
let defaultSheet = document.querySelector(".sheet");
let sheetId = 0;

addSheetBtn.addEventListener("click", function() {
    addSheet();
});

// jo bhi nyi sheet add ho rhi hai unpe to hum click ka event lga rhe hai lekin jo default first sheet hoti hai uspe koi event nhi lga hai to niche wale code se humne uspe bhi click event lga diya
defaultSheet.addEventListener("click", function() {
    switchSheet(defaultSheet);
});

// addSheet : + pe click krne pe nyi sheet add krna 
function addSheet() {
    document.querySelector(".active-sheet").classList.remove("active-sheet");  // remove active sheet
    sheetId++;
    let sheetDiv = document.createElement("div");  // create a div
    sheetDiv.classList.add("sheet");               // add 'sheet' class to the sheetDiv
    sheetDiv.classList.add("active-sheet");         // make new sheet active
    sheetDiv.setAttribute("sid", sheetId);          // attach a id to the sheet
    sheetDiv.innerHTML = `Sheet ${sheetId + 1}`;    // set html of the sheet
    sheetsList.append(sheetDiv);                    // append to the list

    sheetDiv.addEventListener("click", function() {
        switchSheet(sheetDiv);
    });

    // remove all the data from current db cells
    cleanUI();
    initDB();
    // initCells();  // jab bhi koi nyi sheet add hogi to uske liye alag se UI add hoga 
    // attachEventListeners();  // kyunki sheet nyi add hui hai to uspe koi bhi events attach nhi honge jo default sheet se attached the

    lastSelectedCell = undefined; // nyi sheet aate hi lastSelectedCell undefined set kar denge
}

// switchSheet : click pe sheets ko switch krna
function switchSheet(currentSheet) {
    // if we click on the sheet which is already active then no need to do anything and simply return
    if (currentSheet.classList.contains("active-sheet")) {
        return;
    }
    // remove active-sheet class from the previous sheet and make current sheet active
    document.querySelector(".active-sheet").classList.remove("active-sheet");
    currentSheet.classList.add("active-sheet");

    cleanUI(); // jb bhi sheet switch kro to sbse pahle uska ui pura clean krdo

    //setDB
    let sid = currentSheet.getAttribute("sid");
    db = sheetsDB[sid].db; // jab bhi sheets switch hongi to humlog us sheet ki sid ki help se sheetsDB me se us sheet ka db nikal ke db me set kar denge
    visitedCells = sheetsDB[sid].visitedCells; // aur kon konsi cells visited hai wo set kr denge  // sheetsDB[sid] => dbObject


    // setUI ??  // har ek alag sheet ke liye alag UI set krna pdta hai [#1]
    // this method isn't optimized b/c hum saare cells ko travel krke set kr rhe hai, even unko bhi jisme koi value daali hi nhi hai
    // let lastCellIndex = 0;
    // for (let i = 0; i < db.length; i++) { // db ek array hai jisme 100 rows ke array pde hai 
    //   let dbRow = db[i];                  // to ek ek karke row ka array nikala
    //   for (let j = 0; j < dbRow.length; j++) {  // ab us ek row me bhi 26 objects hai to ek ek karke object nikala
    //     allCells[lastCellIndex].textContent = dbRow[j].value; // allCells ke array me total 2600 div pde hai to hmare loop ke structure ki wajah se suru ke 26 object first 26 div se map honge and next 26 object with next 26 div and continue hoga same way me
    //     lastCellIndex++;
    //   }
    // }


    // set UI optimized
    for (let i = 0; i < visitedCells.length; i++) {

        // code to set text etc.
        let { rowId, colId } = visitedCells[i];
        let idx = Number(rowId) * 26 + Number(colId);
        allCells[idx].textContent = db[rowId][colId].value;  

        // code to set properties BIU 
        let cellObject = db[rowId][colId];
        let { bold, underline, italic } = cellObject.fontStyles;
        if (bold) {
            allCells[i].style.fontWeight = "bold";
        }
        if (underline) {
            allCells[i].style.textDecoration = "underline";
        }
        if (italic) {
            allCells[i].style.fontStyle = "italic";
        }

        // code to set text-alignment
        let textAlign = cellObject.textAlign;
        allCells[i].style.textAlign = textAlign;
    }
}

// attachEventListeners : jo nyi sheet add hui hai unpe events attach karna
// jab hum sheet ko switch/add krte hai to script.js dobara se run nhi hoti isiliye jo chije previous sheet ke liye nikal rkhi thi 
// wo chije current sheet ke liye available nhi hongi isiliye unko dobara se nikalna pdega
function attachEventListeners() {
    topLeftCell = document.querySelector(".top-left-cell");
    topRow = document.querySelector(".top-row");
    leftCol = document.querySelector(".left-col");
    allCells = document.querySelectorAll(".cell");
    attachClickAndBlurEventOnCell();
}

// cleanUI : 1. nyi sheet pe agr jaate hai to usse pahle us sheet ke liye jo cells pichli sheets ki visited thi unki clean karna 
//           2. saare visited div pe lgi hui properties ko clear karna
//           3. acitve menus ko dobara se reset kar dena yani none will be selected when a new sheet will be added
function cleanUI() {

    // code for clearing all menus for the new sheet
    let allActiveMenus = document.querySelectorAll(".active-menu");
    if (allActiveMenus) {
        for (let i = 0; i < allActiveMenus.length; i++) {
            allActiveMenus[i].classList.remove("active-menu");
        }
    }
    // code to clean visited cells and poperties applied to them
    for (let i = 0; i < visitedCells.length; i++) {
        let { rowId, colId } = visitedCells[i]; // visitedCells ke array me se ek ek karke obj nikala 
        let idx = Number(rowId) * 26 + Number(colId); // us object ki dono ids se idx bnaya jo hume us rowId aur colId ke corresponding div laakar dega // ids string hai to usko no. me convert karna pdega 
        // console.log(idx);
        allCells[idx].innerHTML = ""; // corresponding div khaali kar diya
        allCells[idx].style = ""; // so that jab bhi nyi sheet add hoto uske divs par koi style na lga ho jo prev sheet ke corresponding divs par lga hua ho
    }
}


/*
#1.
yaha pe hume cells me textcontent db ka use krke daala hai 
lekin agr hum iski bjaye visitedcells ke array me jo object aate hai 
unme rowid aur colid ke saath saath us cell ka textcontent/cellValue bhi rkhwa le
to fir aise set kr paayenge

    let { rowId, colId,cellValue } = visitedCells[i];
    let idx = Number(rowId) * 26 + Number(colId);
    allCells[idx].textContent = cellValue;  


*/