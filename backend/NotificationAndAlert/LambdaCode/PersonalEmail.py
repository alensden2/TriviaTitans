import boto3
import json

def lambda_handler(event, context):
    email = event['email']
    team_name = event['team_name']
    
    # Create a message
    email_message = "Hello! You are invited to join the team: " + team_name

    # Define the message attributes
    message_attributes = {
        'email': {
            'DataType': 'String',
            'StringValue': email
        }
    }
    print(message_attributes)

    # Create an SNS client
    sns_client = boto3.client('sns', region_name='us-east-1')  

    try:
        response = sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:435562168341:User',
            Message=email_message,
            Subject='Invitation to join team - ' + team_name,
            MessageAttributes=message_attributes
        )
        print('Message published:', response)
        return {
            'statusCode': 200,
            'body': json.dumps('Message published successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error publishing message: {str(e)}')
        }
