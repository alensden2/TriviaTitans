import boto3

def lambda_handler(event, context):
    sns_topic_name = event['sns_topic_name']
    email = event['email']
    print(event)
    
    # Create an SNS client
    sns_client = boto3.client('sns', region_name='us-east-1')
    
    try:
        # Get the SNS topic ARN from the topic name
        topic_arn = get_topic_arn(sns_topic_name, sns_client)
        
        # Subscribe the email to the SNS topic
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=email
        )
        
        return {
            'statusCode': 200,
            'body': f'Email ({email}) subscribed to the SNS topic ({sns_topic_name}) successfully.'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error subscribing email to SNS topic: {str(e)}'
        }

def get_topic_arn(topic_name, sns_client):
    response = sns_client.list_topics()
    topics = response['Topics']
    for topic in topics:
        if topic_name in topic['TopicArn']:
            return topic['TopicArn']
    raise ValueError(f'SNS topic ({topic_name}) not found.')
