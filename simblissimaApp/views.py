from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.contrib import messages
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Produto, Cliente, Pedido, ItemPedido, StatusPedido
from decimal import Decimal

def home(request):
    context = {'user': request.user}
    return render(request, 'simblissimaApp/home.html', context)

def register(request):
    if request.method == 'POST':
        # Get form data
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        cpf = request.POST['cpf']
        email = request.POST['email']
        password = request.POST['password']
        endereco = request.POST['endereco']
        telefone = request.POST['telefone']

        try:
            # Check if CPF already exists
            if User.objects.filter(username=cpf).exists():
                raise ValidationError('Já existe uma conta com este CPF.')

            with transaction.atomic():
                # Create User instance
                user = User.objects.create_user(
                    username=cpf,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )

                # Create Cliente instance
                Cliente.objects.create(
                    user=user,
                    cpf=cpf,
                    endereco=endereco,
                    telefone=telefone
                )

                messages.success(request, 'Conta criada com sucesso!')
                return redirect('login')
        except ValidationError as e:
            messages.error(request, str(e))
        except Exception as e:
            messages.error(request, f'Erro ao criar conta: {str(e)}')

    return render(request, 'simblissimaApp/register.html')

@login_required
def novo_pedido(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                cliente = request.user.cliente
                pedido = Pedido.objects.create(
                    cliente=cliente,
                    status='PENDENTE'
                )
                
                # Process items from form
                itens_descricao = request.POST.getlist('descricao[]')
                itens_preco = request.POST.getlist('preco[]')
                
                valor_total = Decimal('0.00')
                for desc, preco in zip(itens_descricao, itens_preco):
                    if desc and preco:
                        preco_decimal = Decimal(preco)
                        ItemPedido.objects.create(
                            pedido=pedido,
                            descricao=desc,
                            preco=preco_decimal
                        )
                        valor_total += preco_decimal
                
                pedido.valor_total = valor_total
                pedido.save()
                
                StatusPedido.objects.create(
                    pedido=pedido,
                    status='PENDENTE',
                    comentario='Pedido criado'
                )
                
                messages.success(request, 'Pedido criado com sucesso!')
                return redirect('detalhe_pedido', pedido_id=pedido.id)
        except Exception as e:
            messages.error(request, f'Erro ao criar pedido: {str(e)}')
    
    return render(request, 'simblissimaApp/novo_pedido.html')

@login_required
def detalhe_pedido(request, pedido_id):
    pedido = get_object_or_404(Pedido, id=pedido_id)
    if not request.user.is_staff and pedido.cliente.user != request.user:
        messages.error(request, 'Você não tem permissão para ver este pedido.')
        return redirect('home')
    
    return render(request, 'simblissimaApp/detalhe_pedido.html', {'pedido': pedido})

@user_passes_test(lambda u: u.is_staff)
def admin_pedidos(request):
    pedidos = Pedido.objects.all().order_by('-data_criacao')
    return render(request, 'simblissimaApp/admin_pedidos.html', {'pedidos': pedidos})

@user_passes_test(lambda u: u.is_staff)
def atualizar_pedido(request, pedido_id):
    pedido = get_object_or_404(Pedido, id=pedido_id)
    if request.method == 'POST':
        novo_status = request.POST.get('status')
        valor_final = request.POST.get('valor_final')
        comentario = request.POST.get('comentario')
        
        if novo_status:
            pedido.status = novo_status
            if valor_final:
                pedido.valor_final = Decimal(valor_final)
            pedido.save()
            
            StatusPedido.objects.create(
                pedido=pedido,
                status=novo_status,
                comentario=comentario
            )
            
            messages.success(request, 'Pedido atualizado com sucesso!')
        
    return redirect('admin_pedidos')

@login_required
def confirmar_valor(request, pedido_id):
    pedido = get_object_or_404(Pedido, id=pedido_id)
    if pedido.cliente.user != request.user:
        messages.error(request, 'Você não tem permissão para confirmar este pedido.')
        return redirect('home')
    
    if request.method == 'POST':
        acao = request.POST.get('acao')
        if acao == 'confirmar':
            pedido.status = 'CONFIRMADO'
            pedido.save()
            StatusPedido.objects.create(
                pedido=pedido,
                status='CONFIRMADO',
                comentario='Valor final confirmado pelo cliente'
            )
            messages.success(request, 'Pedido confirmado com sucesso!')
        elif acao == 'rejeitar':
            pedido.status = 'CANCELADO'
            pedido.save()
            StatusPedido.objects.create(
                pedido=pedido,
                status='CANCELADO',
                comentario='Valor final rejeitado pelo cliente'
            )
            messages.info(request, 'Pedido cancelado.')
            
    return redirect('detalhe_pedido', pedido_id=pedido.id)

@login_required
def meus_pedidos(request):
    if request.user.is_staff:
        return redirect('admin_pedidos')
    
    pedidos = Pedido.objects.filter(cliente__user=request.user).order_by('-data_criacao')
    return render(request, 'simblissimaApp/meus_pedidos.html', {'pedidos': pedidos})

def custom_logout(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('home')

@user_passes_test(lambda u: u.is_staff)
def excluir_cliente(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente_id')
        if not cliente_id:
            messages.error(request, 'ID do cliente não fornecido.')
            return redirect('admin_pedidos')
            
        try:
            with transaction.atomic():
                # Pegar o cliente pelo ID
                cliente = get_object_or_404(Cliente, id=cliente_id)
                user = cliente.user
                
                # Excluir o cliente (isso também excluirá seus pedidos devido ao CASCADE)
                cliente.delete()
                
                # Excluir o usuário
                user.delete()
                
                messages.success(request, f'A conta do cliente {user.get_full_name()} foi excluída com sucesso.')
                return redirect('admin_pedidos')
                
        except Exception as e:
            messages.error(request, f'Erro ao excluir conta: {str(e)}')
            return redirect('home')
            
    return redirect('home')
