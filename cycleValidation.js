// Storage -> 2D array (Basic needed)
let colGraph = [];   // collected graph component matrix
let graphMtrx = [];   //matrix for one graph

// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         // Why array -> More than 1 child relation(dependency)
//         row.push([]);
//     }
//     graphMtrx.push(row);
// }

// True -> cyclic, False -> Not cyclic
function isGraphCylic(graphMtrx) {
    // Dependency -> visited, dfsVisited (2D array)
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
        dfsVis.push(dfsVisRow); //////////
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (vis[i][j] === false) {
                let response = dfsCycleDetect(graphMtrx, i, j, vis, dfsVis);
                // Found cycle so return immediately, no need to explore more path
                if (response == true) return [i, j];
            }
        }
    }
    
    return null;
}

// Start -> vis(TRUE) dfsVis(TRUE)
// End -> dfsVis(FALSE)
// If vis[i][j] -> already explored path, so go back no use to explore again
// Cycle detection condition -> if (vis[i][j] == true && dfsVis[i][j] == true) -> cycle
// Return -> True/False
// True -> cyclic, False -> Not cyclic
function dfsCycleDetect(graphMtrx, srcr, srcc, vis, dfsVis) {
    vis[srcr][srcc] = true;
    dfsVis[srcr][srcc] = true;

    // A1 -> [ [0, 1], [1, 0], [5, 10], .....  ]
    for (let children = 0; children < graphMtrx[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphMtrx[srcr][srcc][children];
        if (vis[nbrr][nbrc] === false) {
            let response = dfsCycleDetect(graphMtrx, nbrr, nbrc, vis, dfsVis);
            if (response === true) return true; // Found cycle so return, no need to explore more path
        }
        else if (vis[nbrr][nbrc] === true && dfsVis[nbrr][nbrc] === true) {
            // Found cycle so return , no need to explore more path
            return true;
        }
    }

    dfsVis[srcr][srcc] = false;
    return false;
}