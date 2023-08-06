import json
import boto3
import uuid

def lambda_handler(event, context):
    data = json.loads(event['body'])
    # data = event['body']
    
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
    print(questions)
    
    data["Questions"] = questions
    
    try:
        table_name.put_item(Item = data)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Game added to Database!')
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
import json
import boto3
import uuid

def lambda_handler(event, context):
    data = json.loads(event['body'])
    # data = event['body']
    
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
    print(questions)
    
    data["Questions"] = questions
    
    try:
        table_name.put_item(Item = data)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Game added to Database!')
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
