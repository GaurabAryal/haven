import boto3
from botocore.client import Config
from django.conf import settings

class DOSpacesClient():
    def __init__(self):
        self.session = boto3.session.Session()
        self.client = self.session.client('s3',
                        region_name=settings.AWS_S3_REGION_NAME,
                        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
