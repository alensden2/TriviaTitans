import boto3

def lambda_handler(event, context):
    email = event['email']
    sns_topic_name = event['sns_topic_name']
    
    # Create an SNS client
    sns_client = boto3.client('sns', region_name='us-east-1')
    
    try:
        # Get the SNS topic ARN from the topic name
        sns_topic_arn = get_topic_arn(sns_topic_name, sns_client)
        
        # Get all subscriptions for the SNS topic
        response = sns_client.list_subscriptions_by_topic(TopicArn=sns_topic_arn)
        subscriptions = response['Subscriptions']
        
        # Find the subscription with the specified email address
        subscription_arn = None
        for subscription in subscriptions:
            if subscription['Protocol'] == 'email' and subscription['Endpoint'] == email:
                subscription_arn = subscription['SubscriptionArn']
                break
        
        if subscription_arn:
            # Unsubscribe the user
            sns_client.unsubscribe(SubscriptionArn=subscription_arn)
            return {
                'statusCode': 200,
                'body': f'User with email {email} unsubscribed successfully from the SNS topic.'
            }
        else:
            return {
                'statusCode': 404,
                'body': f'User with email {email} is not subscribed to the SNS topic.'
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error unsubscribing user from SNS topic: {str(e)}'
        }

def get_topic_arn(topic_name, sns_client):
    response = sns_client.list_topics()
    topics = response['Topics']
    for topic in topics:
        if topic_name in topic['TopicArn']:
            return topic['TopicArn']
    raise ValueError(f'SNS topic ({topic_name}) not found.')
