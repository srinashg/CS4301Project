from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "address"
        ]


class ViewUsers(APIView):
    # retrieve access token to make authorized api calls
    def get(self, request, format=None):
        data = request.GET
        user = User.objects.get(email=data['email'])

        if not check_password(data['password'], user.password):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # generate access token
        refresh_token = RefreshToken.for_user(user)
        user = UsersSerializer(user).data
        user['access_token'] = str(refresh_token.access_token)

        return Response(user)

    def post(self, request, format=None):
        data = request.data

        User.objects.create(
            password=make_password(data['password']),
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )

        return Response(status=status.HTTP_201_CREATED)


class Transaction(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        email = request.GET['email']

        if str(email) == str(request.user):
            return Response({
                'message': 'you cannot be the recipient'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(email=email)

            return Response({
                'recipient_address': int(recipient.address),
                'recipient_email': recipient.email
            })

        except User.DoesNotExist:
            return Response({
                'messsage': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
