from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class Cliente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cpf = models.CharField(max_length=11, unique=True)
    endereco = models.TextField()
    telefone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Pedido(models.Model):
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('AGUARDANDO_PAGAMENTO', 'Aguardando Pagamento'),
        ('CONFIRMADO', 'Confirmado'),
        ('EM_TRANSITO', 'Em Trânsito'),
        ('ENTREGUE', 'Entregue'),
        ('CANCELADO', 'Cancelado'),
    ]

    METODO_PAGAMENTO_CHOICES = [
        ('PIX', 'Pix'),
        ('CARTAO', 'Cartão'),
        ('BOLETO', 'Boleto'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_final = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    metodo_pagamento = models.CharField(max_length=10, choices=METODO_PAGAMENTO_CHOICES, null=True, blank=True)
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    
    def __str__(self):
        return f"Item de {self.pedido} - {self.descricao[:30]}"

class StatusPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='historico_status', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Pedido.STATUS_CHOICES)
    data = models.DateTimeField(auto_now_add=True)
    comentario = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Status de {self.pedido} - {self.status}"
