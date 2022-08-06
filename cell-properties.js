// Storage
let allSheets = [];  //Contains all SheetDB
let sheetDB = [];

{
    let addSheet = document.querySelector(".sheet-add-icon");
    addSheet.click();
}

// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < cols; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#000000",  // Just for indication purpose,
//             value: "",
//             formula: "",
//             children: [],
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }


// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeCell = "#d1d8e0";
let inactiveCell = "#ecf0f1";

// Application of two-way binding
// Attach property listeners
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    // Modification
    cellProp.bold = !cellProp.bold; // Data change
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI change (1)
    bold.style.backgroundColor = cellProp.bold ? activeCell : inactiveCell; // UI change (2)
})
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    // Modification
    cellProp.italic = !cellProp.italic; // Data change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI change (1)
    italic.style.backgroundColor = cellProp.italic ? activeCell : inactiveCell; // UI change (2)
})
underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    // Modification
    cellProp.underline = !cellProp.underline; // Data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI change (1)
    underline.style.backgroundColor = cellProp.underline ? activeCell : inactiveCell; // UI change (2)
})
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    cellProp.fontSize = fontSize.value; // Data change
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})
fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    cellProp.fontFamily = fontFamily.value; // Data change
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})
fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    cellProp.fontColor = fontColor.value; // Data change
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})
BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = cellandprop(address);

    cellProp.BGcolor = BGcolor.value; // Data change
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = cellandprop(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; // Data change
        cell.style.textAlign = cellProp.alignment; // UI change (1)

        switch(alignValue) { // UI change (2)
            case "left":
                leftAlign.style.backgroundColor = activeCell;
                centerAlign.style.backgroundColor = inactiveCell;
                rightAlign.style.backgroundColor = inactiveCell;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveCell;
                centerAlign.style.backgroundColor = activeCell;
                rightAlign.style.backgroundColor = inactiveCell;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveCell;
                centerAlign.style.backgroundColor = inactiveCell;
                rightAlign.style.backgroundColor = activeCell;
                break;
        }

    })
})



let allCells = document.querySelectorAll(".cell");
for (let i = 0;i < allCells.length;i++) {
    changeCellProp(allCells[i]);
}

function changeCellProp(cell) {  //adding the listener to attach cell properties
    // Work
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = RidCid(address);
        let cellProp = sheetDB[rid][cid];

        // Apply cell Properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;
                

        // Apply properties UI Props container
        bold.style.backgroundColor = cellProp.bold ? activeCell : inactiveCell;
        italic.style.backgroundColor = cellProp.italic ? activeCell : inactiveCell;
        underline.style.backgroundColor = cellProp.underline ? activeCell : inactiveCell;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        switch(cellProp.alignment) { // UI change (2)
            case "left":
                leftAlign.style.backgroundColor = activeCell;
                centerAlign.style.backgroundColor = inactiveCell;
                rightAlign.style.backgroundColor = inactiveCell;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveCell;
                centerAlign.style.backgroundColor = activeCell;
                rightAlign.style.backgroundColor = inactiveCell;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveCell;
                centerAlign.style.backgroundColor = inactiveCell;
                rightAlign.style.backgroundColor = activeCell;
                break;
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}

function cellandprop(address) { //finding the cell and cell properties from the address
    let [rid, cid] = RidCid(address);
    // Access cell & storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function RidCid(address) {  //deconding the row and coloumn id from address
    // address -> "A1"
    let rid = Number(address.slice(1) - 1); // "1" -> 0
    let cid = Number(address.charCodeAt(0)) - 65; // "A" -> 65
    return [rid, cid];
}