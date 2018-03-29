




var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazondb"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("Welcome to bamazon!")
    console.log("-------------------")
    inventory();
})




function inventory(){
    connection.query("SELECT * FROM products", function (err, results){
        if (err) throw err;

        var stock = "";
        for (var i = 0; i < results.length; i++) {
            stock = "";
            stock += "Item ID: " + results[i].item_id + "\n";
            stock += "Product: " + results[i].product_name + "\n";
            stock += "Price: $" + results[i].price + "\n";
            console.log(stock);
          }
    })
    procure();
};

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they 
//    * would like to buy.

function procure(){
    connection.query("SELECT * FROM products", function (err, results){
        if (err) throw err;
    inquirer.prompt([
        {
            name:"id",
            type:"input",
            message:"Whats the ID of the product you would like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name:"quantity",
            type:"input",
            message:"How many units of this product do you want to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ])
    .then(function(answer){
        var chosenID;
        console.log(answer);
        for (var i = 0; i < results.length; i++){
            if (results[i].item_id === parseInt(answer.id)){
                chosenID = results[i];
                // console.log(chosenID);
                // console.log(results[i].item_id);
                
            }
        }
        console.log(chosenID);
        if (chosenID.stock_quantity > parseInt(answer.quantity)){
            var newStock = chosenID.stock_quantity - answer.quantity
            console.log("New Stock Amount: " + newStock);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newStock
                    },
                    {
                        item_id: chosenID.item_id
                    }
                ],
                function(err){
                    if (err) throw err;
                    console.log("Item Successfully Ordered!"); 
                    console.log("Total Cost of Order Will Be: $" + (answer.quantity * chosenID.price));
                    console.log("-------------------");
                    inventory();
                }
            );
        }
        else{
            console.log("I'm sorry we don't have that much in stock!");
            console.log("-------------------");
            inventory();
        }
    });
});
}
    // 7. Once the customer has placed the order, your application should 
    // check if your store has enough of the product to meet the customer's request.
    
    //    * If not, the app should log a phrase like `Insufficient quantity!`,
    //    *  and then prevent the order from going through.
    
    // 8. However, if your store _does_ have enough of the product, you should 
    // fulfill the customer's order.
    //   * This means updating the SQL database to reflect the remaining quantity.
    // * Once the update goes through, show the customer the total cost of their purchase.
