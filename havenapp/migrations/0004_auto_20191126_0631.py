# Generated by Django 2.0.3 on 2019-11-26 06:31

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('havenapp', '0003_usermodel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2019, 11, 26, 6, 31, 25, 763509, tzinfo=utc)),
        ),
    ]
