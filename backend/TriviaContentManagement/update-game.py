import json
import uuid
import boto3

def lambda_handler(event, context):
    # Retrieveing JSON data, received from POST API
    data = json.loads(event['body'])
    # data = event['body']

    attributes = data['attributes']
    # Creating DynamoDB Resource
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table("TT-Games")

    flag = 0
    try:
        for key, value in attributes.items():
            if key == "Category" or key == "DifficultyLevel":
                flag = 1
            
            response = table.update_item(
                Key={
                    'GameID': data['GameID']
                },
                UpdateExpression=f'SET {key} = :val1',
                ExpressionAttributeValues={
                    ':val1': value
                }
            )
            
        if flag == 1:
            key = {
                'GameID': data['GameID']
            }
            response = table.get_item(Key=key)
            # print(response)
            category = response['Item']['Category']
            difficultylevel = response['Item']['DifficultyLevel']
            
            question_table = dynamodb.Table('TT-Questions')
    
            response = question_table.scan()
    
            questions = {}
            for item in response['Items']:
                if item['Category'] == category and item['DifficultyLevel'] == difficultylevel:
                    questions[item["QuestionID"]] = {
                        "Question": item["Question"],
                        "Option1": item["Option1"],
                        "Option2": item["Option2"],
                        "Option3": item["Option3"],
                        "Answer": item["Answer"]
                    }
            print(questions)
            attribute = "Questions"
            response = table.update_item(
                Key={
                    'GameID': data['GameID']
                },
                UpdateExpression=f'SET {attribute} = :val1',
                ExpressionAttributeValues={
                    ':val1': questions
                }
            )
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps('Game Details updated in Database!')
        }
    except:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps('Something went wrong!')
        }
