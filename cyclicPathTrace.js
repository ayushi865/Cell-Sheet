// For delay and wait
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function isGraphCylic(graphMtrx, cycleResponse) {    //is graph cyclic trace path
    let [srcr, srcc] = cycleResponse; 
    let vis = []; // Node visit trace
    let dfsVis = []; // Stack visit trace

    for (let i = 0; i < rows; i++) {
        let visRow = [];
        let dfsVisRow = [];
        for (let j = 0; j < cols; j++) {
            visRow.push(false);
            dfsVisRow.push(false);
        }
        vis.push(visRow);
        dfsVis.push(dfsVisRow);
    }

    let response = await cyclePath(graphMtrx, srcr, srcc, vis, dfsVis);
    if (response === true) return Promise.resolve(true);

    return Promise.resolve(false);
}

// Coloring cell for tracking
async function cyclePath(graphMtrx, srcr, srcc, vis, dfsVis) {  //detect cycle and trave path dfs cycle detection trace path
    vis[srcr][srcc] = true;    
    dfsVis[srcr][srcc] = true;

    let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise(); // 1sec finished

    for (let children = 0; children < graphMtrx[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphMtrx[srcr][srcc][children];
        if (vis[nbrr][nbrc] === false) {
            let response = await cyclePath(graphMtrx, nbrr, nbrc, vis, dfsVis);
            if (response === true) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();

                return Promise.resolve(true);
            }
        }
        else if (vis[nbrr][nbrc] === true && dfsVis[nbrr][nbrc] === true) {
            let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);

            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";

            cell.style.backgroundColor = "transparent";
            await colorPromise();

            return Promise.resolve(true);
        }
    }

    dfsVis[srcr][srcc] = false;
    return Promise.resolve(false);
}