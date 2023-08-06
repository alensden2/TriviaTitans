import firebase_admin
from firebase_admin import credentials, firestore
from flask import jsonify, request

cred = credentials.Certificate('serverlessproject-9d011-firebase-adminsdk-y2oul-823c7493f6.json')
firebase = firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

def getUserDetails(request):
    try:
        # Handle preflight CORS options
        if request.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
            return ('', 204, headers)

        # Handle POST request
        if request.method == 'POST':
            # Extract UID from the request
            data = request.get_json()
            uid = data.get('uid')

            if uid:
                user_ref = db.collection('UserDetails').where('uid', '==', uid)
                user_docs = user_ref.get()

                # Check if any document with the given UID exists
                for doc in user_docs:
                    # Get the user details as a dictionary
                    user_details = doc.to_dict()

                # Return the user details with CORS headers
                headers = {
                    'Access-Control-Allow-Origin': '*'
                }
                return (jsonify(user_details), 200, headers)
            else:
                return (jsonify({'message': 'Invalid request'}), 400, headers)

        else:
            return (jsonify({'message': 'Method not allowed'}), 405, headers)

    except Exception as e:
        # Handle errors with CORS headers
        headers = {
            'Access-Control-Allow-Origin': '*'
        }
        return (jsonify({'message': 'Error occurred', 'error': str(e)}), 500, headers)
