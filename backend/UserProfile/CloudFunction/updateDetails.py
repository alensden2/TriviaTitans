import firebase_admin
from firebase_admin import credentials, firestore
from flask import jsonify, make_response

cred = credentials.Certificate('serverlessproject-9d011-firebase-adminsdk-y2oul-823c7493f6.json')
firebase = firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

def updateDetails(request):
    if request.method == 'OPTIONS':
        # Handle preflight request for CORS
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    # Get user details from request
    request_data = request.get_json()
    uid = request_data.get('uid')
    name = request_data.get('name')
    email = request_data.get('email')
    phone = request_data.get('phone')
    profile_picture = request_data.get('profilePicture')


    try:
        # Query the 'UserDetails' collection to check if any document has the same 'uid' value
        users_ref = db.collection('UserDetails')
        query = users_ref.where('uid', '==', uid).limit(1)
        result = query.get()

        # Check if a document with the same 'uid' exists
        if len(result) == 1:
            # Update the existing user document in Firestore
            user_ref = result[0].reference
            user_ref.update({
                'name': name,
                'email': email,
                'phone': phone,
                'profilePicture': profile_picture
            })

            # Add CORS headers to the response
            response_data = jsonify({"status": True, "response": 'User details updated successfully.'})
            response = make_response(response_data)
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Methods', 'POST')

            return response, 200
        else:
            return jsonify({"status": False, 'error': 'User with the given UID not found.'}), 404

    except Exception as e:
        return jsonify({"status": False, 'error': str(e)}), 400
