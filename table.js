var columns = ["Team", "Defense", "Autonomous", "Climb", "Teleop"];
var data = [[["33"], [""], [""], [""], [""]],
            [["67"], [""], [""], [""], [""]],
            [["245"], [""], [""], [""], [""]],
            [["469"], [""], [""], [""], [""]],
            [["494"], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]],
            [[""], [""], [""], [""], [""]]]; //List of lists.

function repress(el) {
    el.addEventListener("keyup", function () {
        if (el.textContent != el.innerHTML) {
            el.innerHTML = el.textContent;
        }
    });
}

function updateEntry(el, table, a, b) {
    el.addEventListener("keyup", function () {
        if (b == null) {
            table[a] = el.textContent;
        } else {
            table[a][b] = el.textContent;
        }
    });
}

function deleteCol(el, at) {
    el.onclick = function () {
        columns.splice(at, 1);
        for (var i = 0; i < data.length; i++) {
            data[i].splice(at, 1);
        }
        rebuild();
    }
}

function deleteRow(el, at) {
    el.onclick = function () {
        data.splice(at, 1);
        rebuild();
    }
}


function rebuild(focus) {
    var str = [];
    //Head
    str.push("<thead>");
    str.push("<tr>");
    for (var i = 0; i < columns.length; i++) {
        str.push("<td><span>" + columns[i] + "</span>");
        if (i !== 0)
            str.push("<a>&times;</a>");
        str.push("</td>");
    }
    str.push('<td id="newcolumn">+</td>');
    str.push("</tr>");
    str.push("</thead>");

    //Body
    str.push("<tbody>");
    for (var i = 0; i < data.length; i++) {
        str.push("<tr>");
        for (var j = 0; j < data[i].length; j++) {
            str.push("<td><span>" + data[i][j] + "</span></td>");
        }
        str.push("<td><a>&times</a></td>");
        str.push("</tr>");
    }
    str.push("</tbody>");

    //Foot
    str.push("<tfoot>");
    str.push('<tr><td id="newrow" colspan="' + (columns.length + 1) + '">Add Team</td></tr>');
    str.push("</tfoot>");
    datatable.innerHTML = str.join("\n");
    //Set up editing
    var e = datatable.getElementsByTagName("span");
    for (var i = 0; i < e.length; i++) {
        e[i].contentEditable = "true";
        repress(e[i]);
    }
    //New column
    document.getElementById("newcolumn").onclick = function () {
        columns.push("");
        for (var i = 0; i < data.length; i++) {
            data[i].push("");
        }
        rebuild("col");
    }
    //Column delete
    var a = datatable.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        if (a[i].parentNode.parentNode.parentNode.tagName == "THEAD") {
            deleteCol(a[i], i + 1);
        } else {
            deleteRow(a[i], i - (columns.length - 1));
        }
    }
    //New row
    document.getElementById("newrow").onclick = function () {
        var u = [];
        while (u.length < columns.length)
            u.push("");
        data.push(u);
        rebuild();
    }
    //Column updater
    var e = datatable.tHead.getElementsByTagName("span");
    for (var i = 0; i < e.length; i++) {
        updateEntry(e[i], columns, i);
    }
    //Table updater
    var e = datatable.tBodies[0].getElementsByTagName("span");
    for (var i = 0; i < e.length; i++) {
        var row = Math.floor(i / (columns.length));
        var col = i % (columns.length);
        updateEntry(e[i], data, row, col);
    }
}