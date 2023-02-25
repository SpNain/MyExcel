let topLeftCell = document.querySelector(".top-left-cell");
let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let address = document.querySelector("#address");
let formulaInput = document.querySelector("#formula");
let allCells = document.querySelectorAll(".cell");
let lastSelectedCell;

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

        //childrens update
        updateChildrens(cellObject.childrens); // value to formula edge case : matlab ki kisi cell me pahle to manually value daal rkhi thi lekin ab usme value formula ka use karke daali hai to uspe dependent cell bhi update ho jaaye : handled
    }
});

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
            let cellObject = getCellObjectFromElement(e.target);
            
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
        });

        allCells[i].addEventListener("blur", function(e) {
            lastSelectedCell = e.target;
            // logic to save this value in db
            let cellValueFromUI = e.target.textContent; // jo hum cell me type karte hai wo mil jaayegi
            if (cellValueFromUI) {  // agr foucsed div me kuch type kiye bina kisi aur div pe move krte hai to ye sb lines of code nhi chlenge // in simple words agr cellValueFromUI null aayi to kaam nhi hoga
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

                // handle visited Cells
                // kyunki iss time hum blur event lga rhe hai to issi time hum kya karte hai ki jo div/cell pe event lag rha hai yani lastSelectedCell jo hai 
                // hum uski rowId aur colId nikal lenge aur uske visitedCells ke array me dono id ko ek object me daal ke push kar denge aur us cell ki visited key ko true mark kar denge
                // taki switching ke time sirf visited cells ko change kra ja ske saari cells ko change karne ki bjaye
                let rowId = lastSelectedCell.getAttribute("rowid");
                let colId = lastSelectedCell.getAttribute("colid");
                if (!cellObject.visited) {
                    visitedCells.push({ rowId, colId });
                    // console.log(visitedCells);
                    // console.log(sheetsDB[0].visitedCells);
                    cellObject.visited = true;
                }
            }
        });
    }
}
attachClickAndBlurEventOnCell(); // jo bhi nyi sheets add hogi unke liye to humne alag se is fxn ko call lga rkhi hai lekin 1st sheet ke liye to yaha se call lgegi

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
        let fComp = formulaComps[i];       // let say fComp = A1 then fComp[0] = A
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
    let calculatedValue = eval(formula);  // eval us formule ko solve krke ans de dega
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