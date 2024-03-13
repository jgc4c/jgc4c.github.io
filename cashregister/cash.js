// global vars used to control certain aspects of the program 
let first_print = true;
let can_print = false;
let def_table = "";

// jquery code used to assign functions to the buttons.
// also used to grab default table layout for build_table().
$(document).ready(function() {
    def_table = $("#out_table").html();

    $("#scan").click(function() {
        scan();
    });  

    $("#print").click(function() {
        print();
    });

    $("#remove").click(function() {
        remove();
    });

    $("#edit").click(function() {
        edit();
    });
});

// cashRegister object used for storing the values
let cashRegister = {
    total: 0,
    item: 0,
    list: [0],
    add: function(itemCost) {
        this.total += itemCost;
    }
};

// scan() allows the user to input the number of items and each item's cost 
function scan() {
    let amt = 0;
    let items = parseInt(prompt("How many items?"));
    if (items < 1 || Number.isNaN(items)) {
        confirm("Please type in a valid number.");
        return;
    }
    for (let i = 1; i <= items; i += 1) {
        do {
            amt = parseFloat(prompt("Enter cost for item " + i + ":"))
        } while (Number.isNaN(amt));
        
        cashRegister.list.push(amt);
    }
    cashRegister.item += items;
    can_print = true;
    build_table();
}

// build_table() constructs the output table shown on the page.
// it is called at the end of every function to insure that displayed values are up-to-date
function build_table() {
    $("#out_table").html(def_table);
    cashRegister.total = 0;
    for (let i = 1; i < cashRegister.list.length; i += 1) {
        $("#out_table").append("<tr id=\"tr_" + i + "\"> <td id=\"col_1\">" + i + "</td> <td id=\"col_2\">" + cashRegister.list[i].toFixed(2) + "</td> </tr>");
        cashRegister.total += cashRegister.list[i];
    }
}

// print() prints the total rows to the table, given that conditions are met. 
function print() {
    if (cashRegister.total === 0) {
        confirm("Please enter your items first.");
    }
    else if (!can_print) {
        confirm("No new items have been added.");
    }
    else {
        build_table();
        $("#out_table").append("<tr> <td id=\"total_col\">Total before tax</td> <td id=\"total_col\">$" + cashRegister.total.toFixed(2) + "</td> </tr>");
        $("#out_table").append("<tr style=\"font-size: 20px\"> <td id=\"total_col\"> <b>Total after tax (9.75%)</b> </td> <td id=\"total_col\"> <b>$" + (1.0975 * cashRegister.total).toFixed(2) + "</b> </td> </tr>");

        can_print = false;
    }

    window.scrollTo({
        top: 100000000,
        left: 0,
        behavior: "smooth"
    });
}

// remove() removes a specific row from the table and cashRegister object. Which item is determined by user input.
function remove() {
    if (cashRegister.item == 0) {
        confirm("There are no items to remove.");
    }
    else {
        let id = parseInt(prompt("What item would you like to remove?"));

        if (id < 0 || id > cashRegister.item || Number.isNaN(id)) {
            confirm("ID entered is not valid.")
        }
        else {
            cashRegister.total -= cashRegister.list[id];
            cashRegister.item -= 1;
            cashRegister.list.splice(id, 1);
            $("#tr_" + id).remove();
            build_table();
            can_print = true;
        }
    }
}

// edit() edits a value in the table to something new. Which item is determined by user input.
function edit() {
    if (cashRegister.item == 0) {
        confirm("There are no items to edit.");
    }
    else {
        let id = parseInt(prompt("What row would you like to edit?"));

        if (id < 0 || id > cashRegister.item || Number.isNaN(id)) {
            confirm("ID entered is not valid.")
        }
        else {
            let new_amt = parseFloat(prompt("What is the new amount?"));

            cashRegister.list[id] = new_amt;
            build_table();
            can_print = true;
        }
    }
}

// event listeners to allow number-row buttons to activate functions.
window.addEventListener("keydown", (evt) => {
    if (evt.keyCode == 49) {
        scan();
    }

    if (evt.keyCode == 50) {
        print();
    }

    if (evt.keyCode == 51) {
        remove();
    }

    if (evt.keyCode == 52) {
        edit();
    }
});