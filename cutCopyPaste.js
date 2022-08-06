let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i =0;i < rows;i++) {
    for (let j = 0;j < cols;j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        selCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let indexes = [];  //range storage for selected cells
function selCells(cell) {   //function to handle selected cells
    cell.addEventListener("click", (e) => {
        // Select cells range work
        if (!ctrlKey) return;
        if (indexes.length >= 2) {
            orgCellUI();
            indexes = [];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        indexes.push([rid, cid]);
        console.log(indexes);
    })
}

function orgCellUI() {   // default original selected cells UI
    for (let i = 0;i < indexes.length;i++) {
        let cell = document.querySelector(`.cell[rid="${indexes[i][0]}"][cid="${indexes[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}

let copyData = [];


cutBtn.addEventListener("click", (e) => {
    if (indexes.length < 2) return;

    let [strow, stcol, endrow, endcol] = [ indexes[0][0], indexes[0][1], indexes[1][0], indexes[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        for (let j = stcol;j <= endcol;j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            // DB
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";

            // UI
            cell.click();
        }
    }

    orgCellUI();
})

copyBtn.addEventListener("click", (e) => {
    if (indexes.length < 2) return;
    copyData = [];

    let [strow, stcol, endrow, endcol] = [ indexes[0][0], indexes[0][1], indexes[1][0], indexes[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        let copyRow = [];
        for (let j = stcol;j <= endcol;j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }

    orgCellUI();
})

pasteBtn.addEventListener("click" ,(e) => {
    // Past cells data work
    if (indexes.length < 2) return;

    let rowDiff = Math.abs(indexes[0][0] - indexes[1][0]);
    let colDiff = Math.abs(indexes[0][1] - indexes[1][1]);

    // Target
    let address = addressBar.value;
    let [stRow, stCol] = RidCid(address);
    
    for (let i = stRow,r = 0;i <= stRow+rowDiff;i++,r++) {    // r -> refers copydata row c -> refers copydata col
        for (let j = stCol,c = 0;j <= stCol+colDiff;j++,c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            console.log(cell);
            if (!cell) continue;

            // DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            // UI
            cell.click();
        }
    }
})