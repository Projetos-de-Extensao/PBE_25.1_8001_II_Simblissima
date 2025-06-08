---
id: brainstorm
title: Brainstorm
---

## Introdução

O brainstorm é uma técnica de elicitação de requisitos que consiste em reunir a equipe e discutir sobre diversos tópicos gerais do projeto apresentados no documento problema de negócio. No brainstorm o diálogo é incentivado e críticas são evitadas para permitir que todos colaborem com suas próprias ideias.

## Metodologia

A equipe se reuniu para debater ideias gerais sobre o projeto via encontro presencial durante a aula, começando e desenvolvendo uma ideia inicial durante a mesma. Bernardo Lobo atuou como moderador, direcionando a equipe com questões pré-elaboradas e transcrevendo as respostas para o documento.

## Resultados

### 1. Qual o objetivo principal da aplicação?

**Bernardo Lobo**: Deve ser uma plataforma onde qualquer pessoa possa acessar e fazer um pedido de um produto que será entregue do continente para a Ilha Primeira, facilitando a logística.

**Bernardo Moreira**: A plataforma deve fornecer pontos de ancoragem para recebimento da mercadoria no continente e um serviço de logística para o translocamento da mesma para outros pontos de entrega na Ilha Primeira, utilizando a infraestrutura de barcos existente.

**Guilherme Dias**: O objetivo da aplicação é facilitar o acesso a produtos disponibilizados apenas em terra para as pessoas residentes da ilha, permitindo que criem e acompanhem seus pedidos.

**Julia Curto**: O principal objetivo da aplicação é a democratização do acesso à bens e mercadorias disponíveis de forma equitária para a sociedade continental dentro da ilha, com um sistema gerenciável.

**Michel de Melo**: A plataforma deve gerenciar um sistema de logística completo para a entrega dos pedidos aos moradores da ilha, incluindo o acompanhamento de status e a gestão de valor final.

### 2. Como será o processo para cadastrar um novo cliente?

**Bernardo Lobo**: O cliente deve poder se cadastrar diretamente na plataforma fornecendo CPF, email, nome, sobrenome, telefone e endereço, sendo o CPF utilizado como nome de usuário.

**Bernardo Moreira**: Após o cadastro inicial, o sistema deve associar os dados do cliente a um usuário, permitindo o login e a personalização do perfil.

**Guilherme Dias**: O cliente, enquanto usuário da plataforma, deve poder adicionar itens no pedido, indicando a descrição e o preço de cada item.

**Julia Curto**: Com o usuário logado, ele deverá poder acessar a área de gerenciamento de pedidos, ver um histórico de pedidos e também realizar um novo pedido de entrega.

**Michel de Melo**: A plataforma deve validar os dados de cadastro e garantir que o CPF e email sejam únicos para evitar duplicações e problemas de segurança.

### 3. Como será a forma de adicionar pedidos?

**Bernardo Lobo**: O cliente, ao criar um novo pedido, insere a descrição e o preço de cada item, e pode adicionar observações gerais para a entrega. O sistema calculará o valor total dos produtos.

### 4. Outras perguntas pertinentes ao contexto

**Bernardo Moreira**: Nosso sistema funciona baseado em localidades âncora, onde estará presente um ponto de acesso para o trabalho de logística. Essa logística fará o transporte dos bens até outro ponto mais acessível ao morador da ilha, ou diretamente na residência, dependendo da infraestrutura.

**Guilherme Dias**: O gerente deve ter uma visão geral de todos os pedidos, podendo filtrar por status e atualizar o andamento, incluindo a definição de um valor final para o pedido e adição de comentários.

**Julia Curto**: O sistema deve permitir o rastreamento do status do pedido em tempo real, informando ao cliente sobre cada etapa da entrega, desde a criação até a finalização.

**Michel de Melo**: A comunicação sobre o valor final e a confirmação de pagamento devem ser claras, permitindo ao cliente aceitar ou recusar o valor proposto pelo gerente.

## Requisitos Elicitados

| ID | Descrição |
|----|-----------|
| BS01 | O sistema deve permitir o cadastro de novos clientes com CPF, e-mail, nome, sobrenome, telefone e endereço. |
| BS02 | O sistema deve permitir que clientes loguem com CPF e senha. |
| BS03 | O cliente deve poder criar um novo pedido, adicionando múltiplos itens com descrição e preço. |
| BS04 | O pedido deve ter um campo para observações gerais. |
| BS05 | O sistema deve calcular o valor total dos produtos no pedido automaticamente. |
| BS06 | O cliente deve poder visualizar o histórico de seus pedidos e seus respectivos status. |
| BS07 | O gerente (staff) deve ter acesso a um dashboard para visualizar e gerenciar todos os pedidos. |
| BS08 | O gerente deve poder atualizar o status de um pedido. |
| BS09 | O gerente deve poder definir um valor final para o pedido, que pode ser diferente do valor total. |
| BS10 | O cliente deve ser notificado sobre mudanças no status do pedido e sobre o valor final proposto. |
| BS11 | O cliente deve poder confirmar ou recusar o valor final proposto pelo gerente. |
| BS12 | O histórico de status de cada pedido deve ser registrado com data e comentário. |
| BS13 | O sistema deve permitir o gerenciamento de perfis de clientes (atualização de nome, sobrenome, e-mail, endereço, telefone e senha). |
| BS14 | O sistema deve ser acessível via navegador web, com uma interface Single Page Application (SPA). |
| BS15 | O sistema deve permitir o login e logout de usuários. |

## Conclusão

Através da aplicação da técnica de Brainstorm, foi possível elicitar um conjunto inicial de requisitos funcionais e não funcionais para o projeto Simblissima, alinhados com a proposta de facilitar a logística de entregas na Ilha Primeira.

## Histórico de Versões

| Data | Versão | Descrição | Autor(es) |
|------|---------|------------|-----------|
| 24/03/2025 | 1.0 | Criação do documento | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |
| 02/06/2025 | 1.1 | Atualização das perguntas, respostas e requisitos elicitados para refletir o projeto Simblissima | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |