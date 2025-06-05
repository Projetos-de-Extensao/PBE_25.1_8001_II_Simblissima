---
id: entrevista
title: Entrevista
---

## Introdução
<p align = "justify">
A técnica da entrevista trata-se de uma conversa guiada por um roteiro de perguntas ou tópicos, na qual visa questionar o stakeholders sobre o sistema atual e esclarecer as suas necessidades sobre o sistema que será desenvolvido. A entrevista permite investigação em profundidade sobre um problema, dessa forma coletar uma grande quantidade de informações para o sistema.
</p>

## Metodologia
<p align = "justify">
Para esta entrevista optamos por seguir um modelo de entrevista aberta, onde terá uma série de perguntas de apoio pré-definidas com finalidade do stakeholders expor informações importantes para o sistema. As questões são formuladas e filtradas, de acordo com o interesse da equipe com o propósito de orientar o entrevistador durante a entrevista. O entrevistador e entrevistado tem liberdade para abordar qualquer assunto relacionado ao sistema durante a entrevista.
</p>

### Roteiro

- Você já enfrentou dificuldades para receber produtos na Ilha Primeira?
- Como funcionava o processo de pedidos antes do sistema?
- Você já usou alguma aplicação de delivery ou e-commerce?
- Teve algum problema específico com entregas para a ilha?
- O que você acha de uma aplicação que facilite pedidos para a ilha?
- Para você qual seria o sistema ideal de gerenciamento de pedidos?
- Você gostaria de poder se cadastrar e acompanhar seus pedidos?
- Você gostaria que as informações dos pedidos fossem transparentes?


## Entrevistas 

### Versão 1.0

**NOTA:** As entrevistas apresentadas a seguir são fictícias e foram elaboradas para fins acadêmicos, baseadas nos requisitos e funcionalidades implementadas no sistema Simblissima.

### **Entrevista 1 - Morador da Ilha Primeira**

<br>

|Nome | Papel |
-----|------|
|Guilherme | Entrevistador|
|Maria Santos| Entrevistada - Moradora da Ilha Primeira|

<br>
<br>

|Data|Horário de inicio|Horário de fim |Descrição
----|-----|-----|---------|
|15/03/2025 | 14:30| 15:15 | Entrevista realizada via videoconferência.|

<br>
<br>
 
|Nome do participante|Diálogo durante a entrevista|
|----|-------------|
|Guilherme:|Você já enfrentou dificuldades para receber produtos na Ilha Primeira?|
|Maria:|Sim, constantemente. É muito difícil conseguir produtos do continente aqui na ilha. Às vezes demora semanas para chegar algo simples.|
|Guilherme:|Como funcionava o processo de pedidos antes?|
|Maria:|Era tudo muito desorganizado. Eu tinha que ligar para várias pessoas, fazer listas no papel, e nunca sabia quando ia chegar ou quanto ia custar no final.|
|Guilherme:|Você já usou alguma aplicação de delivery ou e-commerce?|
|Maria:|Uso iFood e Mercado Livre, mas aqui na ilha não funciona. Seria ótimo ter algo parecido para nossos pedidos.|
|Guilherme:|Teve algum problema específico com entregas?|
|Maria:|Muitos! Já recebi produtos errados, valores diferentes do combinado, e às vezes nem sabia se meu pedido estava sendo providenciado.|
|Guilherme:|O que você acha de uma aplicação que facilite pedidos para a ilha?|
|Maria:|Seria revolucionário! Poder fazer pedidos organizados, saber o status, o valor... seria perfeito.|
|Guilherme:|Para você qual seria o sistema ideal?|
|Maria:|Um sistema onde eu pudesse fazer meus pedidos, ver o preço, acompanhar se está sendo providenciado, e ter segurança de que vai chegar.|
|Guilherme:|Você gostaria de poder se cadastrar e acompanhar seus pedidos?|
|Maria:|Com certeza! Poder ter um histórico dos meus pedidos seria muito útil.|
|Guilherme:|Você gostaria que as informações fossem transparentes?|
|Maria:|Sim, principalmente os valores. Quero saber quanto vou pagar antes de confirmar.|

<br>

### **Entrevista 2 - Potencial Gerente do Sistema**

<br>

|Nome | Papel |
-----|------|
|Julia| Entrevistadora|
|Carlos Oliveira| Entrevistado - Empreendedor local|

<br>
<br>

|Data|Horário de inicio|Horário de fim |Descrição
----|-----|-----|---------|
|18/03/2025 | 10:00| 10:45 | Entrevista realizada presencialmente.|

<br>
<br>
 
|Nome do participante|Diálogo durante a entrevista|
|----|-------------|
|Julia:|Como você vê a possibilidade de gerenciar um sistema de pedidos para a ilha?|
|Carlos:|É uma grande oportunidade de negócio. Poderia organizar melhor todo o processo e atender mais pessoas.|
|Julia:|Quais informações você gostaria de ter sobre os pedidos?|
|Carlos:|Preciso saber quantos pedidos tenho, valores totais, status de cada um, e poder controlar todo o processo.|
|Julia:|Como você definiria preços e gerenciaria entregas?|
|Carlos:|Gostaria de poder calcular o valor final incluindo frete e taxas, e acompanhar cada etapa da entrega.|
|Julia:|Que tipo de relatório seria útil?|
|Carlos:|Estatísticas de vendas, tempo médio de entrega, pedidos pendentes... informações para tomar decisões.|
|Julia:|Como você comunicaria mudanças nos pedidos aos clientes?|
|Carlos:|Um sistema que permita atualizar status e os clientes vejam em tempo real seria ideal.|

<br>
 
### Requisitos elicitados
 
|ID|Descrição|
|----|-------------|
|REQ01|O sistema deve permitir cadastro de usuários com CPF, nome, email, telefone e endereço|
|REQ02|O sistema deve permitir login usando CPF como nome de usuário|
|REQ03|O sistema deve permitir criação de pedidos com múltiplos itens|
|REQ04|O sistema deve permitir definir descrição e preço para cada item do pedido|
|REQ05|O sistema deve permitir adicionar observações aos pedidos|
|REQ06|O sistema deve permitir visualizar status dos pedidos em tempo real|
|REQ07|O sistema deve permitir ao gerente definir valor final incluindo frete e taxas|
|REQ08|O sistema deve permitir ao gerente atualizar status dos pedidos|
|REQ09|O sistema deve fornecer dashboard com estatísticas para o gerente|
|REQ10|O sistema deve permitir ao cliente confirmar ou recusar valores finais|
|REQ11|O sistema deve manter histórico completo de status dos pedidos|
|REQ12|O sistema deve permitir filtragem e ordenação de pedidos|
|REQ13|O sistema deve ter interface responsiva e intuitiva|
|REQ14|O sistema deve garantir transparência nos valores e prazos|
|REQ15|O sistema deve permitir gerenciamento de perfil do usuário|


## Conclusão
<p align = "justify">
Através da aplicação da técnica de entrevista, foi possível elicitar requisitos importantes para o projeto Simblissima. As entrevistas fictícias apresentadas demonstram a necessidade real de um sistema de gerenciamento de pedidos para facilitar a logística entre o continente e a Ilha Primeira. Os stakeholders entrevistados destacaram problemas como falta de organização, transparência nos valores e acompanhamento de status, que foram diretamente endereçados no desenvolvimento do sistema. A técnica permitiu identificar tanto requisitos funcionais quanto não funcionais, contribuindo significativamente para a definição do escopo e funcionalidades do projeto.
</p>
 
## Referências

> SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson, 2018.

> PRESSMAN, Roger S. Engenharia de Software: Uma Abordagem Profissional. 8. ed. Porto Alegre: AMGH, 2016.

> VAZQUEZ, Carlos Eduardo; SIMÕES, Guilherme Siqueira. Engenharia de Requisitos: Software Orientado ao Negócio. 1. ed. São Paulo: Brasport, 2016.

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| 15/03/2025 | 1.0 | Criação do documento | Bernardo Lobo |
| 18/03/2025 | 2.0 | Adição das entrevistas fictícias 1 e 2 | Guilherme Dias e Julia Curto | 
| 20/03/2025 | 2.1 | Adição dos requisitos elicitados e conclusão | Michel de Melo |
| 04/06/2025 | 3.0 | Atualização completa com entrevistas fictícias detalhadas para o projeto Simblissima | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |
