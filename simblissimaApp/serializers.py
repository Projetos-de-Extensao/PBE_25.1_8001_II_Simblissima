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
        fields = ('id', 'descricao', 'preco', 'pedido')
        read_only_fields = ('id',)
        extra_kwargs = {
            'pedido': {'required': False}
        }

class StatusPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusPedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, required=False)
    historico_status = StatusPedidoSerializer(many=True, read_only=True)
    cliente = ClienteSerializer(read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ('valor_total', 'data_criacao', 'data_atualizacao')

    def create(self, validated_data):
        # Pega o cliente do contexto se não estiver em validated_data
        cliente = None
        request = self.context.get('request')
        
        if 'cliente' in validated_data:
            cliente = validated_data.pop('cliente')
        elif request and hasattr(request.user, 'cliente'):
            cliente = request.user.cliente
        
        if not cliente:
            raise serializers.ValidationError({"detail": "Cliente não encontrado. Faça login e tente novamente."})
            
        # Remove os itens para criar o pedido separadamente
        itens_data = validated_data.pop('itens', [])
        
        # Cria o pedido com o cliente e outros dados
        pedido = Pedido.objects.create(cliente=cliente, **validated_data)
        
        # Cria os itens associados ao pedido
        valor_total = 0
        for item_data in itens_data:
            # Remove o campo pedido se existir para evitar conflito
            if 'pedido' in item_data:
                item_data.pop('pedido')
            item = ItemPedido.objects.create(pedido=pedido, **item_data)
            valor_total += float(item.preco)
            
        # Atualiza o valor total
        pedido.valor_total = valor_total
        pedido.save()
        
        return pedido

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return rep
