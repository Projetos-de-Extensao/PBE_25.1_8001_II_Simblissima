from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import transaction
from django.core.exceptions import ValidationError
from django.shortcuts import render
from .models import Cliente, Pedido, ItemPedido, StatusPedido
from .serializers import (
    UserSerializer, ClienteSerializer,
    PedidoSerializer, ItemPedidoSerializer, StatusPedidoSerializer
)
from decimal import Decimal

def spa_view(request):
    return render(request, 'simblissimaApp/api/base.html')

class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow staff users to perform any action
        if request.user.is_staff:
            return True
        
        # For Cliente objects
        if isinstance(obj, Cliente):
            return obj.user == request.user
        
        # For Pedido objects
        if isinstance(obj, Pedido):
            return obj.cliente.user == request.user
        
        return False


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Cliente.objects.all()
        return Cliente.objects.filter(user=self.request.user)

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pedido.objects.all()
        return Pedido.objects.filter(cliente__user=self.request.user)

    def perform_create(self, serializer):
        with transaction.atomic():
            pedido = serializer.save(cliente=self.request.user.cliente)
            StatusPedido.objects.create(
                pedido=pedido,
                status='PENDENTE',
                comentario='Pedido criado'
            )

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        pedido = self.get_object()
        serializer = ItemPedidoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(pedido=pedido)
            # Recalculate total value
            total = sum(item.preco for item in pedido.itens.all())
            pedido.valor_total = total
            pedido.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        pedido = self.get_object()
        novo_status = request.data.get('status')
        
        if novo_status not in dict(Pedido.STATUS_CHOICES):
            return Response(
                {'error': 'Status inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            pedido.status = novo_status
            pedido.save()
            
            StatusPedido.objects.create(
                pedido=pedido,
                status=novo_status,
                comentario=request.data.get('comentario', '')
            )
            
        return Response(PedidoSerializer(pedido).data)

    @action(detail=True, methods=['post'])
    def confirmar_pagamento(self, request, pk=None):
        pedido = self.get_object()
        metodo_pagamento = request.data.get('metodo_pagamento')
        
        if metodo_pagamento not in dict(Pedido.METODO_PAGAMENTO_CHOICES):
            return Response(
                {'error': 'Método de pagamento inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            pedido.metodo_pagamento = metodo_pagamento
            pedido.status = 'AGUARDANDO_PAGAMENTO'
            pedido.valor_final = pedido.valor_total
            pedido.save()
            
            StatusPedido.objects.create(
                pedido=pedido,
                status='AGUARDANDO_PAGAMENTO',
                comentario=f'Pagamento confirmado via {metodo_pagamento}'
            )
            
        return Response(PedidoSerializer(pedido).data)

class ItemPedidoViewSet(viewsets.ModelViewSet):
    queryset = ItemPedido.objects.all()
    serializer_class = ItemPedidoSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ItemPedido.objects.all()
        return ItemPedido.objects.filter(pedido__cliente__user=self.request.user)

class StatusPedidoViewSet(viewsets.ModelViewSet):
    queryset = StatusPedido.objects.all()
    serializer_class = StatusPedidoSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_queryset(self):
        if self.request.user.is_staff:
            return StatusPedido.objects.all()
        return StatusPedido.objects.filter(pedido__cliente__user=self.request.user)

@api_view(['POST'])
def register_user(request):
    try:
        with transaction.atomic():
            # Criar usuário
            user = User.objects.create_user(
                username=request.data['cpf'],
                email=request.data['email'],
                password=request.data['password'],
                first_name=request.data['first_name'],
                last_name=request.data['last_name']
            )
            
            # Criar cliente
            cliente = Cliente.objects.create(
                user=user,
                cpf=request.data['cpf'],
                telefone=request.data['telefone'],
                endereco=request.data['endereco']
            )
            
            return Response({
                'message': 'Usuário registrado com sucesso!'
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        # Se algo der errado, desfaz a transação e retorna erro
        return Response({
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    return Response(None, status=status.HTTP_401_UNAUTHORIZED)
