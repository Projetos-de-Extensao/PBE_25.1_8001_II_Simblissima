from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'produtos', views.ProdutoViewSet)
router.register(r'clientes', views.ClienteViewSet)
router.register(r'pedidos', views.PedidoViewSet)
router.register(r'itens-pedido', views.ItemPedidoViewSet)
router.register(r'status-pedido', views.StatusPedidoViewSet)

urlpatterns = [
    path('', views.spa_view, name='home'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]