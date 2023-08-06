import json
import uuid
import boto3

def lambda_handler(event, context):
    print(event)
    # Retrieveing JSON data, received from POST API
    data = json.loads(event['body'])
    
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')
    
    
    table = dynamodb.Table("TT-Questions")

    try:
        response = table.delete_item(
            Key={
                'QuestionID': data['id']
            }
        )
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Question deleted from Database!')
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
