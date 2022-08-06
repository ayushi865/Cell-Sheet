let activeSheetColor  ="#ced6e0";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();

    // DB
    createSheetDB();
    createGraphComponentMatrix();
    activeSheet(sheet);
    removeSheet(sheet);
    sheet.click();
})

function removeSheet(sheet) {   //function to handle sheet removal
    sheet.addEventListener("mousedown", (e) => {
        // Right click
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if (response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        allSheets.splice(sheetIdx, 1);
        colGraph.splice(sheetIdx, 1);
        // UI
        sheetUIRemove(sheet)

        // By default DB to sheet 1 (active)
        sheetDB = allSheets[0];
        graphMtrx = colGraph[0];
        handleSheetProperties();
    })
}

function sheetUIRemove(sheet) {   //function to handle sheet UI removal
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx) {
    sheetDB = allSheets[sheetIdx];
    graphMtrx = colGraph[sheetIdx];
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function activeSheet(sheet) {   //function to handle sheet activelneess
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
        console.log(sheetDB);
    })
}

function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000",  // Just for indication purpose,
                value: "",
                formula: "",
                children: [],
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    allSheets.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphMtrx = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Why array -> More than 1 child relation(dependency)
            row.push([]);
        }
        graphMtrx.push(row);
    }
    colGraph.push(graphMtrx);
}