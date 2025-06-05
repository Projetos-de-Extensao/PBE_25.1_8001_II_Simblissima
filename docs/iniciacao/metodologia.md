---
id: metodologia
title: Metodologia
---
 
 
## Introdução
 
<p align = "justify">
A metodologia pode ser definida como a sistematização de métodos e técnicas com o intuito de se alcançar um objetivo. Este documento aborda as metodologias, processos e práticas efetivamente utilizadas no desenvolvimento do projeto Simblissima, um sistema de gerenciamento de pedidos e entregas para a Ilha Primeira, construído como uma API REST com interface Single Page Application (SPA).
</p>
 
## Metodologia
 
<p align = "justify">
A equipe adotou uma abordagem híbrida que combina elementos de metodologias ágeis com práticas de desenvolvimento iterativo. O desenvolvimento foi estruturado em interações bem definidas, com foco na entrega contínua de valor e na adaptação às necessidades do projeto. As práticas utilizadas foram escolhidas com base na experiência da equipe e nos requisitos específicos do sistema Simblissima.
</p>

### Metodologias e Práticas Adotadas

#### RUP (Rational Unified Process)
<p align = "justify">
O RUP foi utilizado como base estrutural para organizar as fases do projeto, proporcionando uma abordagem disciplinada e iterativa. O projeto seguiu as fases de Iniciação, Elaboração, Construção e Transição, com documentação técnica detalhada e artefatos bem definidos.
</p>

#### Desenvolvimento Iterativo
<p align = "justify">
O projeto foi desenvolvido através de iterações sucessivas, permitindo refinamento contínuo dos requisitos e entrega incremental de funcionalidades. Cada iteração incluiu análise, design, implementação e testes das funcionalidades propostas.
</p>

#### Kanban
<p align = "justify">
Foi utilizado um sistema de gerenciamento visual das tarefas, organizando o trabalho em diferentes estágios do desenvolvimento, desde o backlog até a conclusão, facilitando o acompanhamento do progresso e a identificação de gargalos.
</p>
 
 
## Práticas de Desenvolvimento
 
### Versão 1.0
 
### Arquitetura e Design
 
#### Padrão Cliente-Servidor
<p align = "justify">
O sistema foi desenvolvido seguindo o padrão Cliente-Servidor, onde o frontend (SPA) atua como cliente enviando requisições HTTP para o backend (API Django REST Framework) que processa e retorna as respostas apropriadas.
</p>
 
#### Padrão MVT (Model-View-Template)
<p align = "justify">
Utilizando o framework Django, o backend segue o padrão MVT onde os Models representam a estrutura de dados, as Views (ViewSets) contêm a lógica de negócio e os Templates são substituídos por serializers para comunicação com o frontend.
</p>

#### Programação Orientada a Objetos (POO)
<p align = "justify">
O desenvolvimento utilizou amplamente os princípios da POO, com criação de classes modelando entidades do domínio (Cliente, Pedido, ItemPedido, StatusPedido), herança de classes base do Django e Django REST Framework, e encapsulamento da lógica de negócio em métodos específicos.
</p>

### Tecnologias e Ferramentas

#### Backend
- **Python**: Linguagem principal do desenvolvimento backend
- **Django**: Framework web para desenvolvimento rápido e eficiente
- **Django REST Framework**: Toolkit para construção da API RESTful
- **SQLite**: Banco de dados utilizado para desenvolvimento e testes

#### Frontend
- **JavaScript**: Linguagem para interatividade da SPA
- **HTML5 e CSS3**: Estrutura e estilização da interface
- **Bootstrap**: Framework CSS para design responsivo

#### Ferramentas de Desenvolvimento
- **Git/GitHub**: Controle de versão e colaboração
- **Visual Studio Code**: Ambiente de desenvolvimento integrado
- **Live Share**: Colaboração em tempo real no código
- **Discord/WhatsApp**: Comunicação da equipe

### Práticas de Qualidade

#### Validação e Segurança
<p align = "justify">
Implementação de validações rigorosas nos serializers (CPF com 11 dígitos, preços positivos, emails únicos), sistema de autenticação por sessão, controle de permissões baseado em roles (IsOwnerOrStaff), e proteção CSRF para prevenir ataques cross-site request forgery.
</p>

#### Tratamento de Erros
<p align = "justify">
Implementação de respostas de erro padronizadas com códigos HTTP apropriados, logs detalhados para debug e desenvolvimento, e mensagens informativas para melhor experiência do usuário.
</p>

#### Transações Atômicas
<p align = "justify">
Utilização de transaction.atomic() para garantir consistência de dados em operações complexas, como criação de pedidos com status inicial e atualização de valores totais.
</p>

### Organização do Trabalho

#### Quadro Kanban
<p align = "justify">
O gerenciamento de tarefas foi organizado através de um quadro Kanban com as seguintes colunas:
</p>
 
- **Lista de Tarefas**: Contém todas as tarefas identificadas para o projeto
- **Incremento**: Contém as tarefas selecionadas para a iteração atual
- **Em andamento**: Contém as tarefas sendo desenvolvidas
- **Revisão**: Contém as tarefas que precisam ser revisadas antes da conclusão
- **Concluído**: Contém as tarefas finalizadas e validadas

#### Técnicas de Elicitação de Requisitos
<p align = "justify">
Foram utilizadas diversas técnicas para levantamento de requisitos:
</p>

- **Brainstorming**: Sessões colaborativas para geração de ideias e funcionalidades
- **5W2H**: Estruturação clara dos objetivos e escopo do projeto
- **Entrevistas**: Coleta de informações detalhadas sobre necessidades dos usuários
- **Prototipação**: Desenvolvimento de protótipos de alta fidelidade usando Figma

### Processo de Desenvolvimento

#### Fases do Projeto
<p align = "justify">
O desenvolvimento seguiu as fases do RUP adaptadas para o contexto acadêmico:
</p>

**Iniciação**: Definição do problema, escopo e objetivos através de técnicas como brainstorming, 5W2H e documento de visão. Criação dos mapas mentais e prototipação inicial.

**Elaboração**: Modelagem detalhada do sistema com diagramas de casos de uso, diagramas de classes e documento de arquitetura de software (DAS). Refinamento dos requisitos e definição da arquitetura.

**Construção**: Implementação efetiva do sistema com desenvolvimento da API REST, interface SPA, sistema de autenticação, CRUD de pedidos e dashboard administrativo.

**Transição**: Preparação para implantação, documentação de instalação e procedimentos de deploy.

#### Retrospectivas e Melhoria Contínua
<p align = "justify">
A equipe realizou reuniões de retrospectiva ao final de cada iteração, identificando pontos positivos, negativos e oportunidades de melhoria. Isso incluiu:
</p>

- Avaliação da comunicação e colaboração da equipe
- Identificação de dificuldades técnicas e soluções encontradas
- Ajustes no processo de desenvolvimento baseados no feedback
- Definição de ações para melhorar a eficiência nas próximas iterações

### Documentação

#### Padrões de Documentação
<p align = "justify">
Foi estabelecido um template padrão para todos os documentos do projeto, garantindo consistência e facilidade de manutenção. A documentação incluiu:
</p>

- Documentos de iniciação (visão, metodologia, requisitos)
- Modelagem técnica (casos de uso, classes, arquitetura)
- Documentação de construção e implementação
- Guias de transição e implantação

#### Controle de Versão da Documentação
<p align = "justify">
Todos os documentos mantiveram histórico de versões detalhado, incluindo data, versão, descrição das alterações e autores responsáveis, garantindo rastreabilidade das mudanças ao longo do projeto.
</p>
 
 
## Conclusão
 
<p align = "justify">
O projeto Simblissima utilizou uma abordagem metodológica híbrida que combinou elementos do RUP com práticas ágeis, resultando em um processo de desenvolvimento eficiente e bem estruturado. A adoção de técnicas de elicitação de requisitos, desenvolvimento iterativo, padrões arquiteturais bem definidos e práticas de qualidade contribuiu para o sucesso do projeto.

A utilização de tecnologias modernas como Django REST Framework para o backend e SPA para o frontend, combinada com práticas de segurança e validação rigorosas, resultou em um sistema robusto e funcional. O processo de documentação padronizado e o controle de versão garantiram a rastreabilidade e manutenibilidade do projeto.

As retrospectivas regulares e a comunicação efetiva da equipe através de ferramentas colaborativas foram fundamentais para o aprendizado contínuo e a adaptação do processo às necessidades específicas do projeto acadêmico.
</p>
 
## Referências
 
> [1] RATIONAL UNIFIED PROCESS (RUP). Disponível em: https://www.ibm.com/docs/en/rational-unified-process. Acesso em: 02 jun. 2025.
 
> [2] KANBAN. Disponível em: https://kanbanize.com/kanban-resources/getting-started/what-is-kanban. Acesso em: 02 jun. 2025.
 
> [3] DJANGO DOCUMENTATION. Disponível em: https://docs.djangoproject.com/. Acesso em: 02 jun. 2025.

> [4] DJANGO REST FRAMEWORK. Disponível em: https://www.django-rest-framework.org/. Acesso em: 02 jun. 2025.
 
> [5] SOMMERVILLE, I. Engenharia de Software. 9ª ed. São Paulo: Pearson Prentice Hall, 2011.
 
> [6] PRESSMAN, R. S. Engenharia de Software: Uma Abordagem Profissional. 7ª ed. Porto Alegre: AMGH, 2011.
 
 
## Autor(es)
 
| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| 24/03/2025 | 1.0 | Criação do documento | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |
| 02/06/2025 | 2.0 | Atualização completa para refletir as metodologias e práticas efetivamente utilizadas no projeto Simblissima | Bernardo Lobo, Bernardo Moreira, Guilherme Dias, Julia Curto e Michel de Melo |
