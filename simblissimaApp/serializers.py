from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Cliente, Pedido, ItemPedido, StatusPedido

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class ClienteSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Cliente
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data.get('password', ''),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', '')
        )
        cliente = Cliente.objects.create(user=user, **validated_data)
        return cliente

class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = '__all__'

class StatusPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusPedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)
    historico_status = StatusPedidoSerializer(many=True, read_only=True)
    cliente = ClienteSerializer(read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ('valor_total', 'data_criacao', 'data_atualizacao')
