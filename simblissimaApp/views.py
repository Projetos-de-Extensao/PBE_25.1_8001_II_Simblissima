from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
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
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login

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
        queryset = Pedido.objects.all() if self.request.user.is_staff else Pedido.objects.filter(cliente__user=self.request.user)
        
        # Aplicar filtro por status se fornecido
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-data_criacao')  # Ordenar por data de criação mais recente por padrão

    def create(self, request, *args, **kwargs):
        # Log dos dados recebidos para debug
        print(f"DEBUG - POST /pedidos/ - Dados recebidos: {request.data}")
        print(f"DEBUG - Usuário: {request.user}, Autenticado: {request.user.is_authenticated}")
        if hasattr(request.user, 'cliente'):
            print(f"DEBUG - Cliente encontrado: {request.user.cliente.id} - {request.user.cliente}")
        else:
            print("DEBUG - Usuário não tem cliente associado")
            
        # Verificar se o usuário tem um cliente associado
        if not hasattr(request.user, 'cliente'):
            return Response(
                {"detail": "Usuário não tem um cliente associado. Faça login novamente."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            print(f"DEBUG - Dados validados: {serializer.validated_data}")
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"DEBUG - Erro ao criar pedido: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        with transaction.atomic():
            pedido = serializer.save(cliente=self.request.user.cliente)
            print(f"DEBUG - Pedido criado com ID: {pedido.id}")
            # Criar um status inicial para o pedido
            status_pedido = StatusPedido.objects.create(
                pedido=pedido,
                status='PENDENTE',
                comentario='Pedido criado'
            )
            print(f"DEBUG - Status pedido criado com ID: {status_pedido.id}")
            # Se chegarmos aqui, tudo foi criado com sucesso
            print(f"DEBUG - Pedido e status criados com sucesso")
            
    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        pedido = self.get_object()
        serializer = ItemPedidoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(pedido=pedido)
            # Recalcula o valor total do pedido
            total = sum(item.preco for item in pedido.itens.all())
            pedido.valor_total = total
            pedido.save()
            # Retorna o pedido atualizado, incluindo o novo total
            return Response(PedidoSerializer(pedido).data, status=status.HTTP_201_CREATED)
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
@permission_classes([permissions.AllowAny])
def register_user(request):
    print("Iniciando registro de usuário...")
    print(f"Dados recebidos: {request.data}")
    try:
        with transaction.atomic():
            # Validar os dados
            required_fields = ['cpf', 'email', 'password', 'first_name', 'last_name', 'telefone', 'endereco']
            validation_errors = []

            # Verifica campos obrigatórios
            for field in required_fields:
                if not request.data.get(field):
                    validation_errors.append(f'O campo {field} é obrigatório.')
                    print(f"Campo {field} faltando")

            # Validações específicas
            cpf = request.data.get('cpf', '')
            if not cpf.isdigit() or len(cpf) != 11:
                validation_errors.append('CPF deve conter exatamente 11 dígitos numéricos.')
                print("CPF inválido")

            if User.objects.filter(username=cpf).exists():
                validation_errors.append('CPF já cadastrado.')
                print("CPF já existe como username")

            if Cliente.objects.filter(cpf=cpf).exists():
                validation_errors.append('CPF já cadastrado.')
                print("CPF já existe como cliente")

            email = request.data.get('email', '')
            if User.objects.filter(email=email).exists():
                validation_errors.append('Este email já está em uso.')
                print("Email já existe")

            # Verifica se há erros de validação
            if validation_errors:
                print(f"Erros de validação encontrados: {validation_errors}")
                return Response({'message': '\n'.join(validation_errors)}, status=status.HTTP_400_BAD_REQUEST)

            # Criar usuário
            try:
                print("Tentando criar usuário...")
                user = User.objects.create_user(
                    username=cpf,
                    email=request.data['email'],
                    password=request.data['password'],
                    first_name=request.data['first_name'],
                    last_name=request.data['last_name']
                )
                print(f"Usuário criado com ID: {user.id}")

                # Criar cliente
                print("Tentando criar cliente...")
                cliente = Cliente.objects.create(
                    user=user,
                    cpf=cpf,
                    telefone=request.data['telefone'],
                    endereco=request.data['endereco']
                )
                print(f"Cliente criado com ID: {cliente.id}")
                
                return Response({
                    'message': 'Usuário registrado com sucesso!',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Erro ao criar usuário ou cliente: {str(e)}")
                # Se algo der errado na criação do usuário ou cliente, desfaz a transação
                if 'user' in locals() and user:
                    user.delete()
                raise ValidationError(f'Erro ao criar usuário ou cliente: {str(e)}')
                
    except ValidationError as e:
        print(f"Erro de validação: {str(e)}")
        return Response({
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Erro geral: {str(e)}")
        return Response({
            'message': f'Erro ao registrar usuário: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def current_user(request):
    if request.user.is_authenticated:
        print(f"Current user: {request.user.username}, is_staff: {request.user.is_staff}")  # Debug log
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Login realizado com sucesso!',
            'user': serializer.data
        })
    return Response({'error': 'Credenciais inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def perfil_cliente(request):
    try:
        cliente = Cliente.objects.get(user=request.user)
    except Cliente.DoesNotExist:
        return Response({'detail': 'Cliente não encontrado.'}, status=404)

    if request.method == 'GET':
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)
    elif request.method == 'PUT':
        user_data = {}
        if 'first_name' in request.data:
            user_data['first_name'] = request.data.pop('first_name')
        if 'last_name' in request.data:
            user_data['last_name'] = request.data.pop('last_name')
        if 'email' in request.data:
            user_data['email'] = request.data.pop('email')
        if 'password' in request.data and request.data['password']:
            user_data['password'] = request.data.pop('password')

        # Atualiza o usuário primeiro
        if user_data:
            user = cliente.user
            if 'password' in user_data:
                user.set_password(user_data.pop('password'))
            for key, value in user_data.items():
                setattr(user, key, value)
            user.save()

        # Atualiza os dados do cliente
        serializer = ClienteSerializer(cliente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ClienteSerializer(cliente).data)
        return Response(serializer.errors, status=400)
