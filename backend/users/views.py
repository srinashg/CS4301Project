from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views import View
from django.urls import path
from .views import MyApiView

class MyApiView(View):
    # ... existing methods ...

    def login(self, request, *args, **kwargs):
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            data = {
                "message": "User successfully logged in"
            }
        else:
            data = {
                "message": "Invalid username or password"
            }
        return JsonResponse(data)

    def logout(self, request, *args, **kwargs):
        logout(request)
        data = {
            "message": "User successfully logged out"
        }
        return JsonResponse(data)

urlpatterns = [
    # ... existing patterns ...
    path('api/login/', MyApiView.as_view(), name='my_api_login'),
    path('api/logout/', MyApiView.as_view(), name='my_api_logout'),
]