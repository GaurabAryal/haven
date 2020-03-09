# Generated by Django 2.2.10 on 2020-03-09 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('havenapp', '0014_auto_20200305_0707'),
    ]

    operations = [
        migrations.RenameField(
            model_name='group',
            old_name='providers',
            new_name='mentors',
        ),
        migrations.AddField(
            model_name='group',
            name='is_dm',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='group',
            name='professionals',
            field=models.IntegerField(default=0),
        ),
    ]