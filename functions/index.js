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
app.use(cors({ origin: true }));

//permissions
var serviceAccount = require("./permissions.json");
const { QuerySnapshot } = require('firebase-admin/firestore');
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
  (async () => {
    try {
      const {name, mail, city, status} = req.body;
      await db.collection('Users').doc().set({
        City: city,
        MailId: mail,
        Name: name,
        isActive: status
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//API: http://127.0.0.1:5001/react-crud-2b469/us-central1/app/api/create
//Sample body
//   {
//     "City": "chennai",
//     "Mail Id": "raj2@gmail.com",
//     "Name": "Rahul",
//     "isActive": true
// }

//Read - API
app.get('/api/read', (req, res) => {
  (async () => {
    try {
      let query = db.collection('Users');
      let response = [];
      await query.get().then(QuerySnapshot => {
        let docs = QuerySnapshot.docs;
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().Name,
            city: doc.data().City,
            mailId: doc.data().MailId,
            isActive: doc.data().isActive
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//API: http://127.0.0.1:5001/react-crud-2b469/us-central1/app/api/read


//Update - API
app.put('/api/update/:item_id', (req, res) => {
  (async () => {
    try {
      const document = db.collection('Users').doc(req.params.item_id);
      await document.update({
        City: req.body.City,
        MailId: req.body["Mail Id"],
        Name: req.body.Name,
        isActive: req.body.isActive
      });
      return res.status(200).send();
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//API: http://127.0.0.1:5001/react-crud-2b469/us-central1/app/api/update/:item_id
//should pass id in parameter
//Sample body
// {
//   "City": "new chennai",
//    "Mail Id": "newraj2@gmail.com",
//    "Name": "new Rahul",
//    "isActive": false
// }

//Delete - API
app.delete('/api/delete/:item_id', (req, res) => {
  (async () => {
    try {
      const document = db.collection('Users').doc(req.params.item_id);
      await document.delete();
      return res.status(200).send();
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//API: http://127.0.0.1:5001/react-crud-2b469/us-central1/app/api/delete/:item_id
//should pass id param

//Get User - API
app.get('/api/getUser/:item_id', (req, res) => {
  (async () => {
    try {
      let query = db.collection('Users').doc(req.params.item_id);
      let response = [];
      await query.get().then(value => {
        const userDetail ={
          id: value.id,
          name: value.data().Name,
          city: value.data().City,
          mail: value.data().MailId,
          isActive: value.data().isActive
        };
        //let docs = value.data().Name;
        response.push(userDetail);
        
      });
      return res.status(200).send(response);
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//API: http://127.0.0.1:5001/react-crud-2b469/us-central1/app/api/getUser/:item_id
//Should pass id in param

exports.app = functions.https.onRequest(app);
