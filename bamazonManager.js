var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("-------------------");
    console.log("Welcome to bamazon!");
    console.log("-------------------");
    manMenu();

})

function manMenu() {
    inquirer.prompt([
        {
            name: "manMenu",
            type: "list",
            message: "Welcome to the Manager Menu. What would you like to do boss?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        },
    ]).then(function (answer) {
        if (answer.manMenu === "View Products for Sale") {
            console.log("--------------------");
            inventory();
        }
        else if (answer.manMenu === "View Low Inventory") {
            lowInventory();
        }
        else if (answer.manMenu === "Add to Inventory") {
            addAmount();
        }
        else if (answer.manMenu === "Add New Product") {
            addItem();
        }
    })
}

function inventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        var stock = "";
        for (var i = 0; i < results.length; i++) {
            stock = "";
            stock += "Item ID: " + results[i].item_id + " || ";
            stock += "Product: " + results[i].product_name + " || ";
            stock += "Price: $" + results[i].price + " || ";
            stock += "Quantity: " + results[i].stock_quantity + " || ";
            console.log(stock);
        }
        more();
    })
};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        var stock = "";
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 5) {
                stock = "";
                stock += "Stock is running low on: " + results[i].product_name;
                console.log(stock);
            }
        }
        more();
    })
}

function addAmount() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "items",
                type: "list",
                choices: function () {
                    var choicesArr = [];
                    for (var i = 0; i < results.length; i++) {
                        choicesArr.push(results[i].product_name);
                    }
                    return choicesArr;
                },
                message: "Which item do we need more of?"
            },
            {
                name: "add",
                type: "input",
                message: "How many units should we add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            var chosen;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.items) {
                    chosen = results[i];
                    var newStock = (+chosen.stock_quantity + +answer.add)
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                product_name: chosen.product_name
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log(chosen.product_name + " has been updated");
                            more();
                        }
                    )
                }
            }
        })
    })
}

function addItem() {
    connection.query("SELECT * FROM products", function (err, results) {
        inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "What Item are you adding?",
            },
            {
                name: "department",
                type: "input",
                message: "What Department will be in charge?",
            },
            {
                name: "price",
                type: "input",
                message: "What's the pricing on this item'?",
            },
            {
                name: "quantity",
                type: "input",
                message: "How many will we stock?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log(answer.name + " has been added to our inventory!")
                    more();
                }
            );

        })
    })
}

function more() {
    inquirer.prompt([
        {
            name: "more",
            type: "list",
            message: "Still Working Boss?",
            choices: ["Yes, got to check a few more things...", "Nope, I'm done here."]
        },
    ]).then(function (answer) {
        if (answer.more === "Yes, got to check a few more things...") {
            manMenu();
        }
        else if (answer.more === "Nope, I'm done here.") {
            console.log("Have a Bamazing Day!");
            connection.end();
        }
    })
}