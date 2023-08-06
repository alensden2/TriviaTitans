import boto3

def lambda_handler(event, context):
    # Get the email from the input event
    email = event['email']
    
    # Create a DynamoDB resource and get the User table
    dynamodb = boto3.resource('dynamodb')
    user_table = dynamodb.Table('User')
    
    try:
        # Query the User table to get the team affiliation and scores of the provided email
        response = user_table.get_item(
            Key={'email': email},
            ProjectionExpression='team_afiliation, score'
        )
        
        item = response.get('Item')
        
        if not item:
            return {
                'statusCode': 404,
                'body': f'User with email {email} not found in the User table.'
            }
        
        team_afiliation = item.get('team_afiliation')
        user_score = item.get('score')
        
        # Query the User table to get scores of all team members
        response = user_table.scan(
            FilterExpression='team_afiliation = :team_afiliation',
            ExpressionAttributeValues={':team_afiliation': team_afiliation},
            ProjectionExpression='score'
        )
        
        team_member_scores = [item.get('score') for item in response['Items']]
        
        # Calculate the average score of all team members
        if team_member_scores:
            total_score = sum(team_member_scores)
            average_score = total_score / len(team_member_scores)
        else:
            average_score = 0.0
        
        return {
            'statusCode': 200,
            'body': {
                'user_score': user_score,
                'average_score': average_score
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error retrieving scores: {str(e)}'
        }
