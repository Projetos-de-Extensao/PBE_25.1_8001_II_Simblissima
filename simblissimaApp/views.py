from django.shortcuts import render
from .models import Produto

def home(request):
    produtos = Produto.objects.all()
    return render(request, 'simblissimaApp/home.html', {'produtos': produtos})
# Create your views here.
