from django.urls import path
from .views import get_students

urlpatterns = [
    path('', get_students, name='get-students'),
]
