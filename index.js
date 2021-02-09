const db = require("./2_database/db.js");
const server1 = require("./1_express_api/server1.js");
const server2 = require("./1_express_api/server2.js");
const loadBalancer = require("./load-balancer.js");
const accountModel = require("./2_database//models/account.js");


db.getConnection().then(async res => {
    // if a connection was successfully achieved
    // find and execute are two functions, that called in succession will first describe how to find elements, and then execute the query
    let accounts = await accountModel.find().exec();
    console.log(accounts);

//    // exit system
//    process.exit(1)
}, err => {
    console.log("ERROR");
    console.log(err);
});