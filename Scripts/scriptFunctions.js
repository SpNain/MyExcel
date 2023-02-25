// delete formula : iska kaam hai cellobject me se formula ko htana , cell object ke parents pe jaake khud ko unka as a child remove karna , aur khud ke parents ka array khali karna
function deleteFormula(cellObject) {

    cellObject.formula = "";

    // cell object ke parents pe jaake khud ko unka as a child remove karne ka code
    for (let i = 0; i < cellObject.parents.length; i++) {
        let parentName = cellObject.parents[i];
        // A1
        let parentCellObject = getCellObjectFromName(parentName);
        // filter fxn : parent ke cell object me jaake ek ek karke unke children ko nikalega aur unko funtion me childName ke naam se pass krega aur jiska naam cellobject se match ho gya unko chhodke baki saare children ko as a array updatedChildren me daal dega
        let updatedChildrens = parentCellObject.childrens.filter(function(childName) {
            if (childName == cellObject.name) {
                return false;
            }
            return true;
        });
        parentCellObject.childrens = updatedChildrens; // baad me usi updatedChildrens ko hum parentCellObject ke childrens me daal denge
    }
    // khud ke cell object me parent ko khaali kr diya
    cellObject.parents = [];
}

// solveFormula : ek formula aayega jisko solve krke return krega aur agr pahli baar solve ho rha hoga to selfCellobject bhi aayega childrens ko push krne ke liye
function solveFormula(formula, selfCellObject) {
    // tip : implement infix evalutaion
    // ( A1 + A2 ) => ( 10 + 20 );
    let formulaComps = formula.split(" ");
    // ["(" , "A1" , "+" , "A2" , ")"];
    // find valid component
    for (let i = 0; i < formulaComps.length; i++) {
        let fComp = formulaComps[i]; // let say fComp = A1 then fComp[0] = A
        if ((fComp[0] >= "A" && fComp[0] <= "Z") || (fComp[0] >= "a" && fComp <= "z")) {

            // fComp = A1 // parent h ye B1 ke liye
            // ab maan lo hum kaam kar rhe hai B1 pe jisme (A1+A2+C3) ko solve karke text aayega 
            // to selfCellObject hoga B1 ka object aur parentCellObject hoga A1,A2 and C3 ke objects
            let parentCellObject = getCellObjectFromName(fComp); // to hum ek ek karke parent ke object mangwate hai. ek ek karke isiliye kyonki ye for loop ke andar hai
            let value = parentCellObject.value;

            // ye niche wai condition isiliye lagayi hai taki jab hum childrens ko update kare to iske andar wala code na chale kyunki updateChildren me bhi solveFormula() fxn use kiya hai humne 
            // aur update ke time pe hum dobara se chilrens ko push nhi krna chahte. Ye kaam sirf tab hoga jab solveFormula ko humne updateChildren se call nhi lgwayi ho aur hume chidren add krne ho
            if (selfCellObject) {
                //add yourself as a child of parentCellObject
                parentCellObject.childrens.push(selfCellObject.name);
                // update your parents
                selfCellObject.parents.push(parentCellObject.name);
            }

            formula = formula.replace(fComp, value); // replace the fcomp with the value
        }
    }
    // ( 10 + 20 ) => infix evaluation // is line ke baad infix wali chij aati hai to wo lga do eval() fxn ko htake
    let calculatedValue = eval(formula); // eval us formule ko solve krke ans de dega
    return calculatedValue;
}

// is fxn me ek element aayega aur us element ke basis pe ye db me se object nikal ke dega 
function getCellObjectFromElement(element) {
    let rowId = element.getAttribute("rowid");
    let colId = element.getAttribute("colid");
    return db[rowId][colId];
}

// is fxn me ek naam aayega aur us naam ke basis pe ye db me se object nikal ke dega 
function getCellObjectFromName(name) {
    // A100
    let colId = name.charCodeAt(0) - 65;
    let rowId = Number(name.substring(1)) - 1;
    return db[rowId][colId];
}

// jab bhi kabhi humlog kisi aise div ki value change karte hai jispe dursa koi div bhi dependent ho matlab us div ke koi children ho
// to hum uske childrens ko bhi update krna padega
function updateChildrens(childrens) {
    for (let i = 0; i < childrens.length; i++) { // ye as a base case bhi kaam krega kyunki agr childeren honge hi nhi to unki length 0 hogi aur ye code chalega hi nhi
        let child = childrens[i]; // ek child nikala childrens me se
        // lets say child is B1
        let childCellObject = getCellObjectFromName(child); // us child ke naam se uska object le aaye // B1 ka object aa gya
        let updatedValueOfChild = solveFormula(childCellObject.formula); // B1 ko jis formula ke hisab se solve karna hai kar liya maanlo value aa gyi 30
        //db update
        childCellObject.value = updatedValueOfChild; // B1 ke db ke object me jaake value wali key ko update kar diya
        //ui update
        let colId = child.charCodeAt(0) - 65;
        let rowId = Number(child.substring(1)) - 1;
        document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`).textContent = updatedValueOfChild; // rowId aur colId se div mangwaya aur ui pe bhi value update kardi
        //recursive call
        updateChildrens(childCellObject.childrens); // agr child ke bhi aage children honge to unko recursively call lag ke smbhal liya hai  // DFS type of code
    }
}

// removeACFromLSC : this fxn removes active class from lastSelectedCell and also removes cell-selected class from top row and left col.
function removeACFromLSC(lastSelectedCell) {
    if (lastSelectedCell) {
        lastSelectedCell.classList.remove("active-cell");
        rowId = lastSelectedCell.getAttribute("rowid");
        colId = lastSelectedCell.getAttribute("colid");
        document.querySelector(`div[trid="${colId}"]`).classList.remove("cell-selected");
        document.querySelector(`div[lcid="${rowId}"]`).classList.remove("cell-selected");
        lastSelectedCell = undefined;
        formulaInput.value = "";
        address.value = "";
    }
}

// addACToLSC : add active cell to lastSelectedCell => ye lastSelected Cell pe active cell wali class add kr deta hai depending upon ki arguments me kya kya mila hai uske hisab se
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

// handle visited Cells
// kyunki iss time hum blur event lga rhe hai to issi time hum kya karte hai ki jo div/cell pe event lag rha hai yani lastSelectedCell jo hai 
// hum uski rowId aur colId nikal lenge aur uske visitedCells ke array me dono id ko ek object me daal ke push kar denge aur us cell ki visited key ko true mark kar denge
// taki switching ke time sirf visited cells ko change kra ja ske saari cells ko change karne ki bjaye
function handleVisitedCells(cellObject) {
    rowId = lastSelectedCell.getAttribute("rowid");
    colId = lastSelectedCell.getAttribute("colid");
    if (!cellObject.visited) {
        visitedCells.push({ rowId, colId });
        // console.log(visitedCells);
        // console.log(sheetsDB[0].visitedCells);
        cellObject.visited = true;
    }
}

// setAFMO = set address formula menu-options
function setAFMO(cellObject) {
    // address and formula dhikhe uska code
    address.value = cellObject.name;
    formulaInput.value = cellObject.formula;

    /* menu options one active dhikhe uska code
    kisi particular div pe BIU me se jo jo property lgi hui hai usi ko show kre uske liye code
    matlab agr ek x-div pe bold hai aur ek y-div pe BIU teeno to jab bhi x-div pe click hoga to uspe lagi hui properties hi highlight/lightgray hogi
    kyunki humne ye click event pe lgaya hai to jab bhi kisi div pe click hoga ye code chalega
    hum kya karte hai ki us div pe applied saare active menus yani saari properties mangwa lete hai 
    aur agr koi acitve menus aate hai to saare active menus hta dete hai */
    let allActiveMenus = document.querySelectorAll(".active-menu");
    if (allActiveMenus) {
        for (let i = 0; i < allActiveMenus.length; i++) {
            allActiveMenus[i].classList.remove("active-menu");
        }
    }

    // aur fir us cell ke object ke fontStyles key se teeno properties nikalte hai 
    // aur jo properties true hoti hai usko lga dete hai
    let { bold, underline, italic } = cellObject.fontStyles;
    bold && document.querySelector(".bold").classList.add("active-menu");
    underline && document.querySelector(".underline").classList.add("active-menu");
    italic && document.querySelector(".italic").classList.add("active-menu");

    /* menu options two active dhikhe uska code
    kyunki humne ye click event pe lgaya hai to jab bhi kisi div pe click hoga ye code chalega
    cell ke object ke textAlign key se uska alignment leke aayenge 
    uske baad hmara kaam hai usi related alignment ko lightgray karna
    to hum "document.querySelector("." + textAlign)" line ki maddad se jo bhi alignment us cell pe lga hai usi class wala div le aate hai jiske andar left/centre/right ke icons pde hai
    e.g. maanlo alignment aaya left to document me se left class wala div aayega jo ki wo div hai jiske andar left alignment ka symbol pda hai
    uske baad us div pe active menu ki class lga dete hai jisse uske andar pda icon lightgray ho jata hai */
    let textAlign = cellObject.textAlign;
    document.querySelector("." + textAlign).classList.add("active-menu");


    // menu options three active dhikhe uska code
    fontFamilyTag.value = cellObject.fontFamily;
    fontSizeTag.value = cellObject.fontSize;
    
    // menu options four active dhikhe uska code
    let fontColor = cellObject.fontColor;
    fontColorInput.value = fontColor;

    let backgroundColor = cellObject.backgroundColor;
    backgroundColorInput.value = backgroundColor;
}