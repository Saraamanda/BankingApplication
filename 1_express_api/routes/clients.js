const express = require('express');
const router = express.Router();
const Client = require('../../2_database/models/client');

//Endpoint for all accounts
router.get('/', async (req, res) => {
     try{
           const clients = await Client.find()
           res.json(clients)
     }catch(err){
        res.send('Error ' + err)
     }
});

//Endpoint for adding account
router.post('/', async(req,res) => {
    if(!req.body.firstname){
        return res.json("Please specify firstname");
    }

    if(!req.body.lastname){
        return res.json("Please specify lastname");
    }

    if(!req.body.streetAddress){
        return res.json("Please specify streetAddress");
    }

    if(!req.body.city){
        return res.json("Please specify city");
    }

    const client = new Client({
        _id: req.body._id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        streetAddress: req.body.streetAddress,
        city: req.body.city
    })


    try{
        const result =  await client.save()
        console.log("result is: " + result);
        res.json(result)
    }catch(err){
        res.send('Error')
    }
})

// Implement a new endpoint, that will be able to return a specific account by id.

router.get( '/:id', async (req, res) =>{
    try{
           const client = await Client.findById(req.params.id)
           res.json(client)
    }catch(err){
        res.send('Error ' + err)
    }
})

//Endpoint for updating account
router.put('/:id', async(req,res) => {

    const client = await Client.findById(req.params.id)
    if(req.body.firstname && req.body.firstname != null)
        client.firstname = req.body.firstname

    if(req.body.lastname && req.body.lastname != null)
        client.lastname = req.body.lastname

    if(req.body.streetAddress && req.body.streetAddress != null)
        client.streetAddress = req.body.streetAddress

    if(req.body.city && req.body.city != null)
        client.city = req.body.city

    try{
        const result =  await client.save()
        console.log("result is: " + result);
        res.json(result)
    }catch(err){
        res.send('Error')
    }

})

router.delete( '/:id', async (req, res) =>{
    try{
            let resultDoc = null;
           Client.findOneAndDelete({_id: req.params.id }, function (err, docs) {
               if (err){
                   console.log(err)
               }
               else{
                   console.log("Deleted Client : ", docs);
                   resultDoc = docs;
               }
           });
           res.json(resultDoc)
    }catch(err){
        res.send('Error ' + err)
    }
})

module.exports = router;