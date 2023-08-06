import json
import decimal
import boto3

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        return super(DecimalEncoder, self).default(obj)
        
def lambda_handler(event, context):
    try:
        # Initialize DynamoDB client
        dynamodb = boto3.resource('dynamodb')

        # Replace 'YourDynamoDBTableName' with the actual name of your DynamoDB table
        table = dynamodb.Table('TriviaGames')

        # Execute the DynamoDB query
        response = table.scan()

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', # Replace with your frontend domain for production
                'Content-Type': 'application/json',
            },
            'body': json.dumps(response['Items'], cls=DecimalEncoder)
        }
    except Exception as e:
        print('Error fetching data from DynamoDB:', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Something went wrong.'})
        }
