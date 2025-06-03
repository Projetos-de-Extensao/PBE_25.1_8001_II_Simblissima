---
id: diagrama_de_classes
title: Diagrama de Classes
---


## Introdução

<p align = "justify">
O diagrama de classes UML é um diagrama que mostra a estrutura do sistema Simblissima desenhada no nível de classes e interfaces. Ele ilustra as funcionalidades, dependências e relacionamentos de cada elemento, fornecendo uma representação visual da arquitetura do banco de dados e da lógica de negócio do aplicativo de gerenciamento de pedidos.
</p>

## Metodologia

<p align = "justify">
Para a criação da primeira versão do diagrama de classes, a equipe utilizou o programa **[Nome da Ferramenta utilizada, ex: draw.io, Lucidchart]**. Além disso, foi utilizado Discord e WhatsApp para videoconferência e Visual Studio Code / Live Share para elaboração da documentação.
</p>


## Diagrama de Classes

### Versão 1.0

![![Diagrama de Classes - Simblissima](../assets/PlantUML/UMLDiagramaDeClasses_Simblissima.png)](../assets/PlantUML/UMLDiagramaDeClasses_Simblissima.png)

#### Rastreabilidade de Requisitos

| ID do Caso de Uso| Classe(s) Impactada(s)|
|---|---|
|CU01 (Realizar Cadastro)| Cliente, User|
|CU02 (Realizar Login)| User|
|CU03 (Criar Pedido)| Pedido, ItemPedido|
|CU04 (Visualizar Pedidos)| Pedido, ItemPedido, StatusPedido|
|CU05 (Ver Detalhes do Pedido)| Pedido, ItemPedido, StatusPedido|
|CU06 (Confirmar Valor Final)| Pedido, StatusPedido|
|CU07 (Recusar Valor Final)| Pedido, StatusPedido|
|CU08 (Atualizar Perfil)| Cliente, User|
|CU09 (Gerenciar Pedidos)| Pedido, ItemPedido, StatusPedido, Cliente, User|
|CU10 (Atualizar Status do Pedido)| Pedido, StatusPedido|
|CU11 (Definir Valor Final do Pedido)| Pedido|
|CU12 (Visualizar Dashboard)| Pedido, StatusPedido, Cliente, User|

## Conclusão

<p align = "justify">
Através do diagrama de classes, foi possível representar a estrutura interna do sistema Simblissima a nível de classes, alinhando-se diretamente com os modelos de dados definidos em `models.py`. Este diagrama auxilia na modelagem da arquitetura geral e do banco de dados, clarificando as relações entre `User`, `Cliente`, `Pedido`, `ItemPedido` e `StatusPedido`. Ao longo do desenvolvimento da disciplina, continuaremos a adaptar e evoluir o diagrama e sua documentação para refletir o estado atual do projeto.
</p>

## Referências

> UML Class and Object Diagrams Overview. Disponível em https://www.uml-diagrams.org/class-diagrams-overview.html. Acesso em 21/09/2020

> UML Class Diagram Tutorial. Disponível em https://www.lucidchart.com/pages/uml-class-diagram. Acesso em 02/06/2025 https://www.reddit.com/r/NoStupidQuestions/comments/hgkc5g/whats_a_gender_neutral_alternative_to_dear/?tl=pt-br

> UML Class Relationship Diagrams. Disponível em https://www.cs.odu.edu/~zeil/cs330/latest/Public/classDiagrams/index.html#other-class-diagram-elements. Acesso em 19/10/2020

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| 06/05/25 | 1.0 | Criação do documento | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |
| 02/06/25 | 1.1 | Atualização do diagrama de classes e rastreabilidade de requisitos para refletir os modelos do projeto Simblissima | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |