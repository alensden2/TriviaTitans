import json
import uuid
import boto3

def lambda_handler(event, context):
    # Retrieveing JSON data, received from POST API
    data = json.loads(event['body'])

    attributes = data['attributes']
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table("TT-Questions")

    try:
        for key, value in attributes.items():
            response = table.update_item(
                Key={
                    'QuestionID': data['id']
                },
                UpdateExpression=f'SET {key} = :val1',
                ExpressionAttributeValues={
                    ':val1': value
                }
            )
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Question updated in Database!')
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
