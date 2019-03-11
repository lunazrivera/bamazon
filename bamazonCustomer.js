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

connection.connect(function(err) {
     if (err) throw err;
     // console.log("connection succesful!");
     makeTable();
});

var makeTable = function() {
     connection.query("SELECT * FROM products", function(err,res) {
          for(var i = 0; i < res.length; i++) {
               console.log(res[i].item_id + " || " + res[i].productname + " || " +
                         res[i].departmentname + " || " + res[i].price + " || " +
                         res[i].stock_quantity + "\n");
          }
          askUser(res);
     })
}


var askUser = function (res) {
     inquirer.prompt([{
          name: "action",
          type: "input",
          message: "What would you like to purchase? [Enter 'e' to exit]"  
     }]).then(function(answer) {
          var itemMatch = false;
          if(answer.action.toUpperCase() === "E") {
               process.exit();
          }
          for(var i = 0; i <res.length; i++) {
               if(res[i].productname === answer.action) {
                    itemMatch =  true;
                    var product = answer.action;
                    var id = i;
                    inquirer.prompt({
                         type: "input",
                         name:"quantity",
                         message: "How many would you like to buy?",
                         validate: function(value){
                              if(isNaN(value)==false) {
                                   return true;
                              } else {
                                   return false;
                              }
                         }
                    }).then(function(answer){
                         if((res[id].stock_quantity-answer.quantity)>0){
                              connection.query("UPDATE products SET stock_quantity = ? WHERE productname = ?",
                                   [res[id].stock_quantity-answer.quantity,
                                   product], function(err,res2){
                                        console.log("product Bought!");
                                        makeTable();
                                   })
                         }  else {
                              console.log("Sorry we are out of stock on that one!");
                              askUser(res);
                         }
                    })
               }
          }
          if (i===res.length && itemMatch==false) {
               console.log("We dont have that item in our system!")
               askUser(res);
          }
     })
}
