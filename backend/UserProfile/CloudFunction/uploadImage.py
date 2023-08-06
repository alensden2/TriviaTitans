import firebase_admin
from firebase_admin import credentials, storage

from flask import request, jsonify, make_response
cred = credentials.Certificate('serverlessproject-9d011-firebase-adminsdk-y2oul-823c7493f6.json')
firebase_admin.initialize_app(cred, {'storageBucket': 'serverlessproject-9d011.appspot.com'})


def uploadImage(request):
    if 'image' not in request.files:
        return jsonify({"status": False, 'error': 'No image file provided.'}), 400

    image = request.files['image']

    if not image or not image.mimetype.startswith('image/'):
        return jsonify({"status": False, 'error': 'Invalid file type. Only images are allowed.'}), 400

    try:
        # Upload the image to Firebase Storage
        bucket = storage.bucket()
        image_filename = image.filename
        blob = bucket.blob('images/' + image_filename)
        blob.upload_from_string(image.read(), content_type=image.mimetype)
        blob.make_public()

        # Get the public URL of the uploaded image
        image_url = blob.public_url

        # Add CORS headers to the response
        response_data = jsonify({"status": True, "imageUrl": image_url})
        response = make_response(response_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')

        return response, 200
    except Exception as e:
        return jsonify({"status": False, 'error': str(e)}), 500
