const express = require('express');
const router = express.Router();
const Account = require('../../2_database/models/account');

//Endpoint for all accounts
router.get('/', async (req, res) => {
     try{
           const accounts = await Account.find()
           res.json(accounts)
     }catch(err){
        res.send('Error ' + err)
     }
});

//Endpoint for adding account
router.post('/', async(req,res) => {
    console.log(req.body.client_id)

    if(!req.body.client_id){
        return res.json("Please specify client_id");
    }

    const account = new Account({
        _id: req.body._id,
        client_id: req.body.client_id,
        balance: req.body.balance
    })

    try{
        const result =  await account.save()
        console.log("result is: " + result);
        res.json(result)
    }catch(err){
        res.send('Error')
    }
})

//Endpoint for updating account
router.put('/:id', async(req,res) => {

    const account = await Account.findById(req.params.id)
    if(req.body.balance && req.body.balance != null)
        account.balance = req.body.balance

    if(req.body.alias && req.body.alias != null)
            account.alias = req.body.alias
    try{
        const result =  await account.save()
        console.log("result is: " + result);
        res.json(result)
    }catch(err){
        res.send('Error')
    }

})

//Endpoint for transfer account
router.put('/transfer/:id', async(req,res) => {

     if(!req.body.fromAccount){
        return res.json("Please specify fromAccount id");
    }

    if(!req.body.toAccount){
        return res.json("Please specify toAccount id");
    }

    if(!req.body.amount){
        return res.json("Please specify amount");
    }

    try{
        const fromAccount = await Account.findById(req.body.fromAccount)
        const toAccount = await Account.findById(req.body.toAccount)

        //Check if both accounts exist or not
        if(fromAccount == null)
            return res.json("fromAccount does not exist")

        if(toAccount == null)
            return res.json("toAccount does not exist")

        //Do the math
        fromAccount.balance = fromAccount.balance - req.body.amount
        toAccount.balance = toAccount.balance +  req.body.amount

        const result =  await fromAccount.save()
        const result1 =  await toAccount.save()
        console.log("result is: " + result);
        res.json(result)
    }catch(err){
        res.send('Error')
    }

})

// Implement a new endpoint, that will be able to return a specific account by id.

router.get( '/:id', async (req, res) =>{
    try{
           const account = await Account.findById(req.params.id)
           res.json(account)
    }catch(err){
        res.send('Error ' + err)
    }
})

router.get( '/:id/balance', async (req, res) =>{
    try{
           const account = await Account.findById(req.params.id)
           if(account !=  null)
                res.json({'balance' : account.balance})
           else
                res.json("Account does not exist")
    }catch(err){
        res.send('Error ' + err)
    }
})

router.delete( '/:id', async (req, res) =>{
    try{
            let resultDoc = null;
           Account.findOneAndDelete({_id: req.params.id }, function (err, docs) {
               if (err){
                   console.log(err)
               }
               else{
                   console.log("Deleted Account : ", docs);
                   resultDoc = docs;
               }
           });
           res.json(resultDoc)
    }catch(err){
        res.send('Error ' + err)
    }
})

module.exports = router;