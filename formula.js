for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = cellandprop(address);
            let enteredData = activeCell.innerText;

            if (enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            // If data modifies remove P-C relation, formula empty, update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {


        // If change in formula, break old P-C relation, evaluate new formula, add new P-C relation
        let address = addressBar.value;
        let [cell, cellProp] = cellandprop(address);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraph(inputFormula, address);
        // Check formula is cyclic or not, then only evaluate
        // True -> cycle, False -> Not cyclic
        // console.log(graphMtrx);
        let cycleResponse = isGraphCylic(graphMtrx);
        if (cycleResponse) {
            // alert("Your formula is cyclic");
            let response = confirm("Your formula is cyclic. Do you want to trace your path?");
            while (response === true) {
                // Keep on tracking color until user is sartisfied
                await isGraphCylic(graphMtrx, cycleResponse); // I want to complete full  iteration of color tracking, so I will attach wait here also
                response = confirm("Your formula is cyclic. Do you want to trace your path?");
            }

            removeChildGraph(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        // To update UI and cellProp in DB
        cellUIandProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);

        updateChildrenCells(address);
    }
})

function addChildToGraph(formula, childAddress) {    //function to add child to graph
    let [crid, ccid] = RidCid(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = RidCid(encodedFormula[i]);
            graphMtrx[prid][pcid].push([crid, ccid]);  //rid-i , cid-j
        }
    }
}

function removeChildGraph(formula, childAddress) {    //remove child from graph component
    let [crid, ccid] = RidCid(childAddress);
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = RidCid(encodedFormula[i]);
            graphMtrx[prid][pcid].pop();
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = cellandprop(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = cellandprop(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        cellUIandProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = cellandprop(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = cellandprop(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

function cellUIandProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = cellandprop(address);

    //UI update
    cell.innerText = evaluatedValue;
    // DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = cellandprop(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

