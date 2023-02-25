let cellsContainer = document.querySelector(".cells");

let sheetsDB = []; // jab bhi koi nyi sheet add hogi to iss sheetDB me ek nya object push hoga jisme us sheet ka db aur us sheet me visited cells kon konsi hai uski information hogi
let db; // points to current DB. DB koi actual database nhi hai balki bas ek array jisme humne values store krwayi hai
let visitedCells; // points to current visited cells // visitedCells ek array hai jisme jo cells visit ho chuke hai unke i aur j ki values pdi hogi in the form of object

function initCells() { // ye fxn cells create karta hai 

    // logic to create top left cell = chota sa fixed div, number ke uper wala 
    let cellsContent = '<div class="top-left-cell"></div>';

    // logic for creating a-z cells 
    cellsContent += '<div class="top-row">'; // ek row ka div banaya
    for (let j = 0; j < 26; j++) {
        cellsContent += `<div class="top-row-cell">${String.fromCharCode(65 + j)}</div>`; // uske andar chote chote 26 div bna diye
    } // String.fromCharCode() fxn -> convert a number code to char
    cellsContent += "</div>";
    
    // logic for creating left counting cells 
    cellsContent += '<div class="left-col">'; // ek bda div bnaya
    for (let j = 0; j < 100; j++) {
        cellsContent += `<div class="left-col-cell">${j + 1}</div>`; // usme chote chote 100 div bna diye
    }
    cellsContent += "</div>"; // left col div close

    // logic for creating 2600 cells 
    cellsContent += '<div class="all-cells">'; // 2600 cell iss bde se div me hogi
    for (let i = 0; i < 100; i++) { // isse 100 row create hogi
        cellsContent += '<div class="row">'; // ek row ka div banaya/ start kiya
        for (let j = 0; j < 26; j++) { // us row ke andar 26 chote chote div bnenge
            cellsContent += `<div class="cell" contenteditable="true" rowid="${i}" colid="${j}"></div>`; // chote chote div banane ka logic
        }
        cellsContent += "</div>"; // row ka div close kar diya diya
    }
    cellsContent += "</div"; // bda wala div band 

    cellsContainer.innerHTML = cellsContent;
}

// virtual database create karta hai 
// jisme 100 rows hogi aur har ek row ke andar 26 objects honge
// aur har object me andar uske corresponding div ke liye particular information hogi
function initDB() {
    let newDB = [];  // each sheet will have a unique database for itself
    for (let i = 0; i < 100; i++) {  // create 100 rows
        let row = [];
        for (let j = 0; j < 26; j++) {  // create 26 objects in each row
            // if i=1 & j=1 then cell name will be =>  B2 
            let cellName = String.fromCharCode(65 + j) + (i + 1);
            let cellObject = {
                name: cellName,
                value: "",
                formula: "",
                childrens: [],
                parents: [],
                visited: false,
                fontStyles: { bold: false, italic: false, underline: false },
                textAlign: "left"
            };
            row.push(cellObject);
        }
        newDB.push(row);
    }
    let dbObject = { db: newDB, visitedCells: [] }; // yha pe db jo hai wo key ka naam hai jisme newDB daala hai isse jo hamara db var hai wo us newDB ko point nhi krega
    sheetsDB.push(dbObject);
    db = newDB; // jb bhi sheet switch/creat hogi to usme humne initDB wala fxn chla rkha hoga to is line se sheet creation or switching ke time hmara db var me uska corresponding newDB set ho jaayega 
    visitedCells = dbObject.visitedCells; //[#1]
}

initCells();
initDB();


/*
#1. Problem : jab bhi hum visitedCells var me {rowId,colId} obj push krte hai to usse dbObject.visitedCells me kaise change aa rha hai to us
Ans : Humne dbObject me visitedCells naame se key bnai jisme ek empty aaray hai lets say iska address hai 2k.
      fir humne visitedCells me dbObject.visitedCells ko assign kr diya to isse visitedCells bhi 2k address ko point krne lg gya hoga
      to jab script.js me blur event occur hota hai means ki hum kisi div me koi value daalte hai tab hum us div ko rowId aur colId ko ek obj bnake visitedCells var me push kr dete hai
      aur kyunki dbObject.visitedCells bhi visitedCells wale address ko hi point kr rha hai to ab dbObject.visitedCells bhi update ho jaata hai

We can also do all this in this way also which is better to understand in my opnion :
copy from sushant's another batch excel app code 
    visitedCells = [];
    db = newDB;
    sheetsDB.push({db:newDB ,visitedCells:visitedCells});
*/