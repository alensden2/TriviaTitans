import boto3
import json

def search_scores(team_name):
    
    dynamodb_client = boto3.client('dynamodb')
    # table = dynamodb.Table('TT-TeamsScore')
    
    response = dynamodb_client.scan(
        TableName='TT-TeamsScore',
        FilterExpression='TeamName = :team_name',
        ExpressionAttributeValues={':team_name': {'S': team_name}}
    )
    
    items = response.get('Items', [])
    
    if  len(items) > 0:
        # print(items)
        team_score = int(items[0]['TeamScore']['S'])
        return f"The scores for {team_name} are: {team_score}"
    else:
        return f"Scores for {team_name} not found."

def lambda_handler(event, context):
    print(event)
    
   # Determine the intent from the Lex bot's response
    intent_name = event['interpretations'][0]['intent']['name']

    print(intent_name)
    print(intent_name == 'SignUpIntent')
    # Implement the logic based on the intent
    if intent_name == 'SignUpIntent':
        response_message = "To sign up, please visit our website and complete the registration form."
    
    elif intent_name == 'LoginPageIntent':
        response_message = "To login, please visit our website."

    elif intent_name == 'GamePlayIntent':
        response_message = "To play a game, go to the Games section on our website and choose a game to play."

    elif intent_name == 'GetScores':
        team_name = event['interpretations'][0]['intent']['slots']['TeamName']['value']['originalValue']
        response_message = search_scores(team_name)

    else:
        response_message = "I'm sorry, I didn't understand that. Can you please try again?"

    # Return the response to the Lex bot
    return {
        "sessionState": {
            "dialogAction": {
                "type": "Close",
            },
            "intent": {
                "name": intent_name,
                "state": "Fulfilled"
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": response_message
            }
        ]
    }