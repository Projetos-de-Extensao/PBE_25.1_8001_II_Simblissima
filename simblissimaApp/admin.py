from django.contrib import admin
from .models import Produto, Cliente, Pedido, ItemPedido, StatusPedido

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 1

class StatusPedidoInline(admin.TabularInline):
    model = StatusPedido
    extra = 0
    readonly_fields = ['data']

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'status', 'valor_total', 'valor_final', 'data_criacao']
    list_filter = ['status', 'data_criacao']
    search_fields = ['cliente__user__first_name', 'cliente__user__last_name', 'cliente__cpf']
    inlines = [ItemPedidoInline, StatusPedidoInline]

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['user', 'cpf', 'telefone']
    search_fields = ['user__first_name', 'user__last_name', 'cpf']

admin.site.register(Produto)
admin.site.register(StatusPedido)
