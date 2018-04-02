"""
Module that describes the NewsPost entity which using for describing all
news that was occurred in the library.
Also describe the language field in NewsPostTranslation
for the multilanguage support.
"""

from django.db import models
from utils.language import LANGUAGE_CHOICES

class NewsPost(models.Model):
    """NewsPost entity description"""

    avatar = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)


class NewsPostTranslation(models.Model):
    """NewsPostTranslation entity description"""

    post = models.ForeignKey(NewsPost, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    language = models.IntegerField(default=0, choices=LANGUAGE_CHOICES)
    description = models.CharField(max_length=2048)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('post', 'language'),)