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
    // Fetch all documents from the UserDetails collection
    const querySnapshot = await db.collection('UserDetails').get();

    if (querySnapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify([]), // Return an empty array if no documents found
      };
    }

    // Extract and map email IDs from the querySnapshot
    const emailIds = querySnapshot.docs.map((doc) => doc.data().email);

    return {
      statusCode: 200,
      body: JSON.stringify(emailIds),
    };
  } catch (error) {
    console.error('Error fetching email IDs:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching email IDs' }),
    };
  }
};
