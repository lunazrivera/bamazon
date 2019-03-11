require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
     host: "localhost",
     port: 3306,
     user: "root",
     password: process.env.DB_PASS,
     database: "bamazon" 
})

var maketable = function()  {
     connection.query("SELECT * FROM products", function(err,res) {
          if (err) throw err;
          console.log("Item_ID\tProduct_Name\tDepartment_Name\tPrice\tStock_Quantity");
          console.log("-------------------------------------------------------------");
          for (var i = 0; i < res.length; i++) {
               console.log(res[i].item_id+"\t"+res[i].productname+"\t"+res[i].departmentname+"\t"+res[i].price+"\t"+res[i].stock_quantity);
          }
          console.log("--------------------------------------------------------------");
          askManager(res);
     })
     
}

var askManager = function(passedTable) {
     inquirer.prompt([{
          type: "list",
          name: "action",
          message: "What would you like to do?",
          choices: ["Add a new item", "Fill stock quantity"]
     }]).then(function(answer) {
          if(answer.action == "Add a new item" ) {
               addItem();
          } else if (answer.action == "Fill stock quantity") {
               addStock(passedTable);
          }
     })
}

var addItem = function() {
     inquirer.prompt([{
          type: "input",
          name: "productname",
          message: "What is the name of the product?"
     },{
          type: "input",
          name: "departmentname",
          message: "In what department would you allocate this product?"
     },{
          type: "input",
          name: "price",
          message: "What would be the price of this product?",
          validate: function (value) {
               if (isNaN(value) === false) {
                    return true
               } else {
                    console.log("Not a valid price.");
                    return false;
               }
          }
     },{
          type: "input",
          name: "stockquantity",
          message: "How many of the products are for sale?",
          validate: function (value) {
               if (isNaN(value) === false) {
                    return true
               } else {
                    console.log("Not a valid number.");
                    return false;
               }
          }
     }]).then(function(answer) {
          connection.query("INSERT INTO products SET ?", {
               productname: answer.productname,
               departmentname: answer.departmentname,
               price: answer.price,
               stock_quantity: answer.stockquantity
          }, function(err, res) {
               if (err) throw err;
               console.log(answer.productname + "Product added to Bamazon!");
               maketable();
          })
     })
}


function addStock(passedTable) {
     
     inquirer.prompt([{
          type: "input",
          name: "productname",
          message: "What product would you like to update?"
     },{
          type: "input",
          name: "added",
          message: "How many products will you be adding?",
          validate: function (value) {
               if (isNaN(value) === false) {
                    return true
               } else {
                    console.log("Not a valid price.");
                    return false;
               }
          }
     }]).then(function(answer) {
          for(var i = 0; i < passedTable.length; i++) {
               if (passedTable[i].productname == answer.productname) {
                    connection.query("UPDATE products SET stock_quantity=stock_quantity+"+answer.added +" WHERE item_id="+passedTable[i].item_id+";",function(err, passedTable) {
                         if (err) throw err;
                         if(passedTable.affectedRows === 0) {
                              console.log("That product dosen't exist at this moment. Try another product.");
                              maketable();
                              } else {
                              console.log("Product quantity succesfully added.");
                              maketable();
                              };

                    });
                    // connection.query("UPDATE products SET ? Where ?", 
                    // { stock_quantity: parseInt(stock_quantity)+answer.added }, 
                    // { item_id: passedTable[i].item_id }, function(err, passedTable) {
                    //      if (err) throw err;
                    //      if(passedTable.affectedRows === 0) {
                    //           console.log("That product dosen't exist at this moment. Try another product.");
                    //           maketable();
                    //           } else {
                    //           console.log("Product quantity succesfully added.");
                    //           maketable();
                    //           };
                    // });
                    // connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[stock_quantity+answer.added, passedTable[i].item_id], function(err, passedTable) {
                    //      if(err)throw err;
                    //      if(passedTable.affectedRows === 0) {
                    //           console.log("That product dosen't exist at this moment. Try another product.");
                    //           maketable();
                    //      } else {
                    //           console.log("Product quantity succesfully added.");
                    //           maketable();
                    //      }
                    // });
               } 
          }
     })

}

maketable();