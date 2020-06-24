const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser')
const admin = require('firebase-admin');
const serviceAccount = require("./demobackbonejs-3fa77-firebase-adminsdk-2x8n0-d65c3b443e.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://demobackbonejs.firebaseio.com"
});

var db = admin.firestore();
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/listperson', (req, res)=>{
    db.collection('person').get().then((data)=>{
         let result = data.docs.map((value)=>{
             let value_temp = {};
             value_temp.id = value.id;
             value_temp.firstName = value.data()['firstName'];
             value_temp.lastName = value.data()['lastName'];
             return value_temp;
         });
         console.log(result);
         res.json(result);
     })
})

app.post('/person', (req, res)=>{
    let dataReturn = {
        id:""
    }
    console.log(req.body)
    let docref = db.collection('person').add({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    .then((value)=>{
        //dataReturn.code =1;
        //dataReturn.mess = "Add success";
        dataReturn.id = value.id;
        console.log(dataReturn);
        res.json(dataReturn);
    })
})


app.delete('/person/:id', (req, res)=>{

    let dataReturn = {
        code: 0,
        mess: ""
    }
    let docref = db.collection('person').doc(req.params.id).delete().then(()=>{
        dataReturn.code = 200;
        dataReturn.mess = "Delete sucess";
        res.json(dataReturn);
    })

})

app.listen(PORT, ()=>{console.log("server listen: " + PORT)})