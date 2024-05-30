/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//firebase emulators:start --only functions


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: true}));

//permissions
var serviceAccount = require("./permissions.json");
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://react-crud-2b469..firebaseio.com"
});
const db = admin.firestore();


//test function
app.get('/hello-world', (req, res) => {
    return res.status(200).send('hello world!');

});

//Create - API
app.post('/api/create', (req, res) => {
    (async () =>{
        try{
            await db.collection('Users').doc('/' + req.body.id + '/').create({item: req.body.item});
            return res.status(200).send();
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);
