# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-04-29 12:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('announcement', '0003_add_end_at_field_and_set_default_value'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnnouncementGoogleMyBusinessLocationPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('service_post_name', models.CharField(max_length=92)),
                ('last_sync_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('announcement_translation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='announcement.AnnouncementTranslation')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]