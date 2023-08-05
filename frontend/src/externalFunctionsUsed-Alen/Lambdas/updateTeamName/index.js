// Initialize Firebase Admin SDK
var admin = require("firebase-admin");
var serviceAccount = require("./serverlessproject-9d011-firebase-adminsdk-y2oul-6ad25735e7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverlessproject-9d011-default-rtdb.firebaseio.com"
});

// Firestore reference
const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const object = JSON.stringify(event);
    const parsedData = JSON.parse(object);
    const uid = parsedData.uid;
    const newTeamName = parsedData.newTeamName;

    console.log(`uid is this ${uid}, input team name is ${newTeamName}`);

    // Find the document ID based on the UID
    const querySnapshot = await db.collection('UserDetails').where('uid', '==', uid).get();
    if (querySnapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User with the specified UID not found' }),
      };
    }

    // There should be only one document matching the UID, so we extract it
    const doc = querySnapshot.docs[0];

    // Update the teamName in Firestore
    await doc.ref.update({
      teamName: newTeamName
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'TeamName updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating teamName:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating teamName' }),
    };
  }
};
