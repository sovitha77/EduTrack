from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    grade_level = models.CharField(max_length=50, default="Grade 10")
    attendance = models.IntegerField(default=0)      # e.g., 41 for 41%
    grade_score = models.IntegerField(default=0)     # e.g., 38
    risk_score = models.IntegerField(default=0)      # e.g., 89
    risk_level = models.CharField(max_length=20, default="Low") # "High", "Medium", "Low"

    class Meta:
        db_table = 'students'
        managed = True