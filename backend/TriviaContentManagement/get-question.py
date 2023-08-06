import json
import boto3

def lambda_handler(event, context):
    id = json.loads(event['body'])['id']
    # id = event['body']['id']
    
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table("TT-Questions")
    try:
        response = table.get_item(
            Key={
                'QuestionID': id
            }
        )
        # print(response)
        # 'Item' will contain the retrieved object or None if the item is not found
        item = response.get('Item')
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps(item)
        }
    # TODO implement
    except:
        # print("except")
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps('Something went wrong!')
        }