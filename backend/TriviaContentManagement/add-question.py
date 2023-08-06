import json
import uuid
import boto3

def lambda_handler(event, context):
    # Retrieveing JSON data, received from POST API
    data = json.loads(event['body'])
    # data = event['body']

    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')
    
    # Generating a Unique ID
    data['QuestionID'] = str(uuid.uuid4())
    
    table = dynamodb.Table("TT-Questions")

    try:
        table.put_item(Item = data)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Question added to Database!')
        }
    except:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Something went wrong!')
        }
