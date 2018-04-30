# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-04-30 14:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('author', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avatar', models.CharField(max_length=150)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('published_at', models.DateTimeField(null=True)),
                ('authors', models.ManyToManyField(to='author.Author')),
            ],
        ),
        migrations.CreateModel(
            name='BookTranslation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('language', models.IntegerField(choices=[(0, 'uk'), (1, 'en')], default=0)),
                ('description', models.CharField(max_length=4096)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='book.Book')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='booktranslation',
            unique_together=set([('book', 'language')]),
        ),
    ]
