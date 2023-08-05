import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Initialize the SNS resource
    sns_resource = boto3.resource('sns', region_name='us-east-1')
    sns_wrapper = SnsWrapper(sns_resource)

    # Example usage: Create an SNS topic
    try:
        print(event)
        topic_name = event.get('topicName')  # Access the 'topicName' field
        print(topic_name)
        topic = sns_wrapper.create_topic(topic_name)
        print("Topic ARN:", topic.arn)
    except Exception as e:
        print("Error creating topic:", e)

    # Your lambda function logic goes here

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

class SnsWrapper:
    """Encapsulates Amazon SNS topic and subscription functions."""
    def __init__(self, sns_resource):
        """
        :param sns_resource: A Boto3 Amazon SNS resource.
        """
        self.sns_resource = sns_resource

    def create_topic(self, name):
        """
        Creates a notification topic.

        :param name: The name of the topic to create.
        :return: The newly created topic.
        """
        try:
            topic = self.sns_resource.create_topic(Name=name)
            print("Created topic %s with ARN %s." % (name, topic.arn))
        except ClientError as e:
            print("Error creating topic:", e)
            raise
        else:
            return topic
