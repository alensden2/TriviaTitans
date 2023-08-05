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

    // Fetch all documents from the UserDetails collection
    const querySnapshot = await db.collection('UserDetails').get();

    if (querySnapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User with the specified UID not found' }),
      };
    }

    // Find the user with the matching UID in the querySnapshot
    let userData = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        userData = data;
      }
    });

    if (!userData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User with the specified UID not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching user details' }),
    };
  }
};
