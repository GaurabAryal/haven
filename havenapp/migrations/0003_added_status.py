# Generated by Django 2.2.10 on 2020-02-29 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('havenapp', '0002_groups_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='onboarding_done',
        ),
        migrations.AddField(
            model_name='profile',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Normal user'), (2, 'Searching for group'), (3, 'Matched with new group')], default=1),
        ),
    ]
