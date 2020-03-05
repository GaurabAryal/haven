# Generated by Django 2.2.10 on 2020-03-04 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('havenapp', '0008_removed_location_from_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='profile',
            name='profile_picture',
            field=models.ImageField(null=True, upload_to='profiles'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='status',
            field=models.IntegerField(choices=[(1, 'Normal user'), (2, 'Searching for group'), (3, 'Matched with new group'), (4, 'User is banned')], default=2),
        ),
    ]
