---
id: documento_de_visao
title: Documento de Visão
---
## Introdução

<p align = "justify">
O propósito deste documento é fornecer uma visão geral sobre o projeto Simblissima, que será realizado na disciplina Arquitetura e Desenho de Software 2020/1, na Universidade de Brasília. Descreverá de maneira resumida as principais funcionalidades, usabilidades, o problema que será abordado e os objetivos da equipe, com foco na solução de logística de entregas para a Ilha Primeira.
</p>

## Descrição do Problema 

<p align = "justify">
Atualmente, os moradores da Ilha Primeira enfrentam desafios significativos para adquirir produtos e mercadorias disponíveis no continente. A dependência exclusiva de meios de transporte marítimo civis para acesso aos bens essenciais cria gargalos logísticos, dificultando a organização e o rastreamento das entregas. Isso resulta em inconveniência, falta de transparência sobre o status dos pedidos e, por vezes, a impossibilidade de acesso a uma variedade maior de produtos.
</p>

### Problema

Dificuldade em gerenciar e organizar a logística de entregas de produtos do continente para a Ilha Primeira, resultando em falta de transparência e eficiência para moradores e prestadores de serviço.

### Impactados

Usuários (moradores da Ilha Primeira) que desejam receber produtos do continente, e a equipe de logística/gerentes responsáveis pelas entregas.

### Consequência

A criação de novos pedidos é ineficiente, há pouca visibilidade sobre o status das entregas, dificultando o planejamento tanto para clientes quanto para a equipe de gestão, e limitando o acesso a bens e mercadorias.

### Solução

Utilizar a aplicação Simblissima, uma API REST com interface web, visando resolver o problema de logística ao permitir o gerenciamento completo de pedidos, desde a criação e acompanhamento pelo cliente até a atualização de status e valores pelo gerente.

## Objetivos

<p align = "justify">
O objetivo da equipe de desenvolvimento é fornecer uma solução eficiente e transparente para o gerenciamento de pedidos e entregas entre o continente e a Ilha Primeira. Isso inclui:
<ul>
    <li>Permitir o registro e login de clientes.</li>
    <li>Facilitar a criação de pedidos com múltiplos itens e observações.</li>
    <li>Fornecer um sistema de rastreamento de status de pedidos em tempo real para clientes.</li>
    <li>Disponibilizar um dashboard de gerenciamento para a equipe de logística (gerentes) com funcionalidades de atualização de status, definição de valor final e visualização de estatísticas.</li>
    <li>Garantir a segurança e a integridade dos dados dos usuários e pedidos.</li>
</ul>
</p>

## Descrição do Usuário 

<p align = "justify">
Os usuários do sistema serão divididos em dois principais grupos:
<ul>
    <li>**Clientes (Moradores da Ilha Primeira):** Pessoas que necessitam solicitar e receber produtos do continente. Eles interagem com o sistema para criar pedidos, acompanhar o status, confirmar valores e gerenciar seus perfis.</li>
    <li>**Gerentes (Equipe de Logística/Administração):** Responsáveis por gerenciar o fluxo de pedidos. Eles utilizam o sistema para visualizar todos os pedidos, atualizar seus status, definir valores finais de entrega e comunicar-se com os clientes sobre o andamento dos pedidos.</li>
</ul>
</p>

## Recursos do produto

### Conta (Cliente e Gerente)

<p align = "justify">
O sistema permitirá que novos clientes realizem seu cadastro fornecendo informações pessoais (CPF, nome, sobrenome, e-mail, telefone e endereço). O CPF será utilizado como nome de usuário. Clientes e gerentes poderão realizar login e logout. Os clientes poderão visualizar e editar seus dados de perfil (nome, sobrenome, e-mail, telefone, endereço e senha).
</p>

### Gerenciamento de Pedidos (Cliente)

<p align = "justify">
O cliente poderá criar novos pedidos, adicionando múltiplos itens (com descrição e preço) e observações. O sistema calculará o valor total dos produtos. Após a criação, o cliente poderá acompanhar o status do pedido em tempo real e visualizar o histórico de status. Quando o gerente definir um valor final, o cliente poderá confirmá-lo ou recusá-lo, com a possibilidade de adicionar um motivo para a recusa.
</p>

### Dashboard e Gestão de Pedidos (Gerente)

<p align = "justify">
Gerentes terão acesso a um dashboard para visualizar todos os pedidos, incluindo estatísticas (total de pedidos, valor total arrecadado, tempo médio de entrega e pedidos pendentes). Eles poderão filtrar pedidos por status e ordenar por diferentes critérios. Gerentes poderão atualizar o status de qualquer pedido, definir um valor final de entrega e adicionar comentários no histórico de status, notificando o cliente sobre as alterações.
</p>

## Restrições

<p align = "justify">
A aplicação é uma API REST com uma interface Single Page Application (SPA) para clientes e gerentes, focada exclusivamente no gerenciamento de pedidos e entregas entre o continente e a Ilha Primeira. Ela não será responsável pela realização da entrega física em si, que dependerá da infraestrutura de transporte marítimo existente e dos pontos de ancoragem. Não há um sistema de catálogo de produtos, sendo os itens do pedido descritos manualmente. A comunicação externa (SMS, e-mail direto) para notificações está fora do escopo inicial, sendo as notificações gerenciadas pela própria interface do sistema.
</p>


## Versionamento
| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| DD/MM/YYYY | 1.0 | Criação do documento | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo | 
| 03/06/2025 | 1.1 | Atualização completa do documento para refletir o projeto Simblissima | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |