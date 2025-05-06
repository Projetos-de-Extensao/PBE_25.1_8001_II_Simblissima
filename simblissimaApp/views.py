from django.shortcuts import render

def home(request):
    return render(request, 'simblissimaApp/home.html')

# Create your views here.
