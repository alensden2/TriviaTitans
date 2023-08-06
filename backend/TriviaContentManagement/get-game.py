import json
import boto3

def lambda_handler(event, context):
    id = json.loads(event['body'])['id']
    # id = event['body']['id']
    
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table("TT-Games")
    try:
        response = table.get_item(
            Key={
                'GameID': id
            }
        )
        # print(response)
        # 'Item' will contain the retrieved object or None if the item is not found
        item = response.get('Item')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(item)
        }
    # TODO implement
    except:
        # print("except")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Something went wrong!')
        }