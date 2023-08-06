import json
import boto3
import uuid

def lambda_handler(event, context):
    data = json.loads(event['body'])
    
    dynamodb = boto3.resource('dynamodb')
    
    table_name = dynamodb.Table('TT-Games')
    
    data['GameID'] = str(uuid.uuid4())
    
    question_table = dynamodb.Table('TT-Questions')
    
    response = question_table.scan()
    
    questions = {}
    for item in response['Items']:
        if item['Category'] == data['Category'] and item['DifficultyLevel'] == data['DifficultyLevel']:
            questions[item["QuestionID"]] = {
                "Question": item["Question"],
                "Option1": item["Option1"],
                "Option2": item["Option2"],
                "Option3": item["Option3"],
                "Answer": item["Answer"]
            }
    
    data["Questions"] = questions
    
    try:
        table_name.put_item(Item=data)
        
        # Create a new SNS topic for the team
        team_name = data['TeamName']  # Assuming the team name is provided in the data
        sns_client = boto3.client('sns', region_name='us-east-1')
        sns_response = sns_client.create_topic(Name=f'TeamTopic-{team_name}')
        sns_topic_arn = sns_response['TopicArn']
        
        # Publish to the team's SNS topic with message attributes
        email_message = "Check out your portal, you got some Invitation"
      
        message_attributes = {
            'email': {
                'DataType': 'String',
                'StringValue': 'all'
            }
        }
        
        sns_client.publish(
            TopicArn="arn:aws:sns:us-east-1:435562168341:User",
            Message=email_message,
            Subject='New Game Available',
            MessageAttributes=message_attributes
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Game added to Database and SNS topic published!')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Something went wrong: {}'.format(str(e)))
        }
