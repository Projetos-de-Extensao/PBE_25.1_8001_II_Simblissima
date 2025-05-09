from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='simblissimaApp/login.html'), name='login'),
    path('logout/', views.custom_logout, name='logout'),
    
    # Pedidos
    path('pedido/novo/', views.novo_pedido, name='novo_pedido'),
    path('pedido/<int:pedido_id>/', views.detalhe_pedido, name='detalhe_pedido'),
    path('pedidos/meus/', views.meus_pedidos, name='meus_pedidos'),
      # Admin
    path('gerenciar/pedidos/', views.admin_pedidos, name='admin_pedidos'),
    path('gerenciar/pedido/<int:pedido_id>/atualizar/', views.atualizar_pedido, name='atualizar_pedido'),
    
    # Cliente
    path('pedido/<int:pedido_id>/confirmar/', views.confirmar_valor, name='confirmar_valor'),
    path('excluir-conta/', views.excluir_cliente, name='excluir_cliente'),
]