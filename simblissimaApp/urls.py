from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import api_login, perfil_cliente

router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet)
router.register(r'pedidos', views.PedidoViewSet)
router.register(r'itens-pedido', views.ItemPedidoViewSet)
router.register(r'status-pedido', views.StatusPedidoViewSet)

urlpatterns = [
    path('', views.spa_view, name='home'),
    path('api/register/', views.register_user, name='register'),
    path('api/current-user/', views.current_user, name='current-user'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/login/', api_login, name='api_login'),
    path('api/perfil/', perfil_cliente, name='perfil_cliente'),
]