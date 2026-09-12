# Visionary Finance

PROMPT MESTRE — SAAS DE GESTÃO FINANCEIRA PESSOAL

1. OBJETIVO DO PROJETO

Construir um SaaS completo de gestão financeira pessoal e familiar.

O produto deve permitir que o usuário registre receitas, gastos e investimentos, acompanhe sua situação financeira em tempo real, crie metas e utilize projeções para entender como suas decisões atuais podem impactar seu futuro financeiro.

O sistema deve ser construído como um produto SaaS real, não como uma landing page ou protótipo estático.

A aplicação deve possuir:

Frontend moderno e responsivo

Backend funcional

Banco de dados PostgreSQL via Supabase

Autenticação via Supabase Auth

Row Level Security (RLS)

Área individual do cliente

Estrutura preparada para perfil familiar

Área administrativa separada

Controle de planos/assinaturas preparado para futura integração de pagamento

Cálculos financeiros funcionando no sistema

Dados persistidos no banco

Gráficos alimentados por dados reais

Validações de formulário

Estados de loading, vazio e erro

Responsividade completa para desktop, tablet e celular

O projeto deverá ser compatível com deploy na Vercel.

2. CONCEITO DO PRODUTO

Posicionamento:

"Não basta saber para onde seu dinheiro foi. Saiba onde ele pode chegar."

O sistema não deve ser apenas um controle de despesas.

A proposta é conectar:

RECEITAS → GASTOS → SALDO → INVESTIMENTOS → METAS → PROJEÇÕES → FUTURO FINANCEIRO

Todas essas áreas devem compartilhar os mesmos dados.

Exemplo:

Se o usuário cadastrar:

Receita: R$ 5.000

Mercado: R$ 600

Aluguel: R$ 1.500

Transporte: R$ 400

Lazer: R$ 300

Investimento: R$ 800

O Dashboard deve automaticamente calcular:

Receita total: R$ 5.000

Gastos: R$ 2.800

Investimentos: R$ 800

Saldo disponível: R$ 1.400

Taxa de investimento: 16%

Maior categoria de gasto: Moradia

Percentual de Moradia sobre os gastos: 53,57%

Nenhum desses valores deve ser digitado manualmente.

3. STACK TECNOLÓGICA

Utilizar:

Frontend:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui quando apropriado

Backend:

Supabase

Banco:

PostgreSQL

Autenticação:

Supabase Auth

Deploy:

Vercel

Gráficos:

Recharts ou biblioteca equivalente compatível com React

Ícones:

Lucide Icons

Não criar backend fake.

Não utilizar dados mockados depois que o banco estiver configurado.

O sistema deve utilizar dados reais do Supabase.

4. ARQUITETURA

Organizar o projeto de forma modular e escalável.

Separar claramente:

páginas

componentes

layouts

hooks

serviços

funções de cálculo

acesso ao Supabase

tipos TypeScript

validações

utilitários

regras de negócio

Evitar colocar toda a lógica em um único arquivo.

Criar funções reutilizáveis para cálculos financeiros.

Exemplo:

calculateTotalIncome()
calculateTotalExpenses()
calculateAvailableBalance()
calculateInvestmentRate()
calculateCategoryPercentage()
calculateGoalProgress()
calculateRequiredMonthlyContribution()
calculateCompoundInterest()
calculateProjectedPatrimony()

5. IDENTIDADE VISUAL

Criar uma interface premium, moderna, limpa e profissional.

O produto deve transmitir:

confiança

organização

clareza

segurança

inteligência financeira

simplicidade

Evitar aparência excessivamente bancária.

Evitar excesso de cards, sombras e gradientes.

Utilizar bastante espaço em branco.

Priorizar hierarquia visual.

A interface deve ser agradável para pessoas que não possuem conhecimento avançado de finanças.

Textos devem ser simples e claros.

Evitar termos técnicos desnecessários.

6. ESTRUTURA PRINCIPAL DO SISTEMA

Criar o seguinte menu:

Principal

Dashboard

Receitas

Gastos

Análises

Investimentos

Simulador

Metas

Previsões

Suporte

Como funciona

Configurações

Minha conta

Categorias

Formas de pagamento

Tipos de investimento

Preferências

Assinatura

7. AUTENTICAÇÃO

Criar:

Cadastro

Campos:

Nome

E-mail

Senha

Confirmação de senha

Permitir cadastro via:

E-mail e senha

Google

Login

E-mail

Senha

Recuperação de senha

Login Google

Após cadastro, criar automaticamente o perfil do usuário.

Utilizar Supabase Auth.

Nunca armazenar senha diretamente em tabelas próprias.

8. ONBOARDING

Após o primeiro cadastro, apresentar um onboarding simples.

Título:

"Vamos organizar sua vida financeira."

Etapa 1:

Quanto você recebe por mês?

Etapa 2:

Quanto costuma gastar por mês?

Etapa 3:

Você já investe?

Sim

Não

Etapa 4:

Qual seu principal objetivo?

Reserva de emergência

Comprar carro

Comprar imóvel

Viagem

Aposentadoria

Construir patrimônio

Outro

Etapa 5:

Quanto gostaria de investir por mês?

Ao finalizar:

"Pronto. Seu planejamento financeiro está configurado."

Criar os dados iniciais necessários no banco.

O usuário poderá editar essas informações posteriormente.

9. DASHBOARD

Criar uma Dashboard profissional.

Mostrar seletor de período:

Este mês

Mês anterior

Últimos 3 meses

Últimos 6 meses

Este ano

Personalizado

Cards principais:

Receita

Total de receitas do período.

Gastos

Total de gastos do período.

Investimentos

Total investido no período.

Saldo disponível

Receitas - Gastos - Investimentos

Taxa de investimento

Investimentos / Receitas × 100

Patrimônio

Valor atual dos investimentos cadastrados.

Dashboard também deve mostrar:

Evolução financeira

Gráfico comparando:

Receitas

Gastos

Investimentos

por mês.

Gastos por categoria

Gráfico de pizza ou donut.

Ranking de gastos

Exemplo:

Moradia — R$ 1.500

Alimentação — R$ 600

Transporte — R$ 400

Lazer — R$ 300

Mostrar também percentual.

Metas

Mostrar as principais metas e progresso.

Insights automáticos

Criar mensagens baseadas exclusivamente nos dados reais do usuário.

Exemplos:

"Moradia representa 53,6% dos seus gastos neste mês."

"Seus gastos aumentaram 8% em relação ao mês anterior."

"Você investiu 16% da sua renda neste mês."

Nunca inventar informações.

Se não houver dados suficientes, informar:

"Ainda não temos dados suficientes para gerar esta análise."

10. RECEITAS

Criar página de receitas.

Permitir:

adicionar

editar

excluir

duplicar

filtrar

pesquisar

Campos:

descrição

categoria

valor

data

recorrente

conta

observação

Categorias iniciais:

Salário

Renda extra

Freelance

Rendimentos

Outros

Permitir categorias personalizadas.

RECEITAS RECORRENTES

Se marcada como recorrente, permitir:

mensal

semanal

anual

Criar estrutura preparada para recorrência automática.

Não duplicar registros indevidamente.

11. GASTOS

Criar página completa de gastos.

Campos:

descrição

valor

data

categoria

subcategoria

forma de pagamento

fixo/variável

pago/pendente

essencial/não essencial

conta/cartão

observação

Categorias padrão:

Moradia

Alimentação

Transporte

Saúde

Educação

Lazer

Compras

Assinaturas

Contas

Impostos

Outros

Permitir criação e edição de categorias e subcategorias.

12. ANÁLISE DE GASTOS

Criar uma área dedicada à análise.

Mostrar:

total gasto

média mensal

maior categoria

menor categoria

evolução

comparação com período anterior

gastos essenciais

gastos não essenciais

Criar:

Ranking de categorias

Exemplo:

Moradia — 53,57%

Alimentação — 21,43%

Transporte — 14,29%

Lazer — 10,71%

Comparação mensal

Permitir comparar:

Setembro × Agosto

Mostrar:

aumento

redução

percentual de variação

Exemplo:

Alimentação aumentou 12,4%.

13. INVESTIMENTOS

Criar módulo de investimentos.

Campos:

nome do ativo

tipo

instituição

valor investido

data do aporte

valor atual

rentabilidade

objetivo

prazo

observação

Tipos:

Renda fixa

Ações

FIIs

ETFs

Fundos

Criptomoedas

Previdência

Outros

Mostrar:

patrimônio investido

valor atual

lucro/prejuízo

rentabilidade

distribuição da carteira

evolução patrimonial

Criar gráfico da composição da carteira.

No MVP, os investimentos serão cadastrados manualmente.

Não implementar integração com corretoras ou Open Finance nesta primeira versão.

Porém, estruturar o banco para permitir integração futura.

14. SIMULADOR DE INVESTIMENTOS

Criar simulador utilizando juros compostos.

Campos:

valor inicial

aporte mensal

rentabilidade anual

prazo

Converter corretamente a taxa anual para taxa mensal quando necessário.

Calcular:

total aportado

juros ganhos

valor final

Fórmula base:

FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]

Tratar corretamente o caso de taxa igual a zero.

CENÁRIOS

Criar:

Conservador

6% ao ano

Moderado

10% ao ano

Otimista

13% ao ano

Permitir alterar essas taxas nas configurações posteriormente.

Mostrar gráfico de evolução do patrimônio.

Permitir:

1 ano
5 anos
10 anos
20 anos

15. METAS

Criar módulo de metas.

Campos:

nome

descrição

valor objetivo

valor atual

aporte mensal

data desejada

categoria

prioridade

Exemplos:

Reserva de emergência

Comprar carro

Viagem

Entrada de imóvel

Aposentadoria

Meta de patrimônio

Cálculos

Mostrar:

Progresso

Valor atual / valor objetivo × 100

Valor restante

Valor objetivo - valor atual

Aporte necessário

Calcular quanto o usuário precisa investir mensalmente para atingir a meta na data desejada.

Previsão

Calcular quando atingirá a meta considerando o aporte atual.

16. PREVISÕES

Criar módulo de previsões.

Mostrar:

Saldo previsto no final do mês

Utilizar receitas recorrentes, gastos recorrentes e dados cadastrados.

Gastos previstos

Baseados no histórico do usuário.

Investimentos previstos

Baseados nos aportes recorrentes.

PROJEÇÃO PATRIMONIAL

Mostrar:

patrimônio atual

patrimônio em 1 ano

patrimônio em 5 anos

patrimônio em 10 anos

patrimônio em 20 anos

Permitir simular:

"E se eu aumentar meu aporte em R$ 500?"

Mostrar:

Cenário atual

versus

Cenário com aumento de aporte.

Deixar claro que projeções são estimativas e não garantias de rentabilidade.

17. COMO FUNCIONA

Criar uma Central de Instruções.

Página:

Como funciona?

Mostrar cards ou seções:

Dashboard

Explicar o que cada indicador significa.

Receitas

Explicar como cadastrar receitas.

Gastos

Explicar categorias e classificações.

Análises

Explicar como os percentuais são calculados.

Investimentos

Explicar patrimônio e rentabilidade.

Simulador

Explicar juros compostos.

Metas

Explicar progresso e aporte necessário.

Previsões

Explicar que são estimativas.

CRIAR TAMBÉM UMA SEÇÃO:

Entenda seus números

Explicar de forma simples:

Saldo disponível

Receitas - Gastos - Investimentos

Taxa de investimento

Investimentos / Receitas × 100

Percentual da categoria

Gasto da categoria / Total de gastos × 100

Progresso da meta

Valor atual / Valor objetivo × 100

Não utilizar linguagem excessivamente técnica.

18. CONFIGURAÇÕES

Criar:

Minha conta

nome

e-mail

avatar

senha

Categorias

CRUD completo.

Subcategorias

CRUD completo.

Formas de pagamento

Padrão:

Pix

Dinheiro

Débito

Crédito

Boleto

Transferência

Outros

Tipos de investimento

CRUD.

Parâmetros

Permitir futuramente alterar:

taxa conservadora

taxa moderada

taxa otimista

19. PERFIL FAMILIAR

Preparar arquitetura para usuários compartilharem uma estrutura financeira.

Um usuário poderá criar:

Família

E convidar outro usuário.

Permissões:

proprietário

administrador

membro

somente visualização

No MVP, a funcionalidade pode ser preparada no banco e na interface, mesmo que o compartilhamento avançado seja implementado posteriormente.

Nunca permitir que um usuário veja dados de outro usuário sem autorização explícita.

20. BANCO DE DADOS SUPABASE

Criar estrutura relacional.

Tabelas sugeridas:

profiles

id

user_id

name

email

avatar_url

created_at

updated_at

households

id

name

owner_id

created_at

household_members

id

household_id

user_id

role

created_at

income_categories

id

user_id

name

created_at

incomes

id

user_id

household_id

category_id

description

amount

date

recurring

recurrence_type

account

notes

created_at

updated_at

expense_categories

id

user_id

name

created_at

expense_subcategories

id

category_id

user_id

name

created_at

expenses

id

user_id

household_id

category_id

subcategory_id

description

amount

date

payment_method

expense_type

payment_status

essential

account

notes

created_at

updated_at

investment_types

id

user_id

name

created_at

investments

id

user_id

household_id

investment_type_id

name

institution

invested_amount

current_value

investment_date

objective

deadline

notes

created_at

updated_at

investment_transactions

id

investment_id

type

amount

date

notes

created_at

goals

id

user_id

household_id

name

description

target_amount

current_amount

monthly_contribution

target_date

category

priority

created_at

updated_at

user_settings

id

user_id

currency

theme

conservative_rate

moderate_rate

optimistic_rate

created_at

updated_at

subscriptions

id

user_id

plan

status

started_at

expires_at

created_at

updated_at

notifications

id

user_id

title

message

read

created_at

21. SEGURANÇA — RLS

Implementar Row Level Security em todas as tabelas que contenham dados do usuário.

Regra fundamental:

Um usuário somente pode:

visualizar seus próprios dados

inserir seus próprios dados

editar seus próprios dados

excluir seus próprios dados

Quando houver household/família, permitir acesso somente aos membros autorizados conforme role.

Nunca confiar apenas na validação do frontend.

As regras de segurança devem estar também no Supabase/PostgreSQL.

22. DASHBOARD ADMINISTRATIVO

Criar uma área administrativa separada.

Somente usuários autorizados podem acessar.

Menu:

Visão geral

Usuários

Assinaturas

Planos

Métricas

Configurações

Suporte

Dashboard administrativo:

usuários cadastrados

usuários ativos

novos usuários

usuários gratuitos

usuários premium

assinaturas ativas

cancelamentos

receita estimada

crescimento mensal

Não permitir que usuários comuns acessem essa área.

23. PLANOS

Preparar arquitetura para:

FREE

Dashboard

Receitas

Gastos

Análise básica

1 meta

Simulador

PREMIUM

Tudo do Free

Metas ilimitadas

Investimentos

Previsões

Projeções

Análises avançadas

Perfil familiar

Relatórios

Exportações

No MVP, o sistema pode controlar o plano no banco sem implementar ainda o gateway de pagamento.

A arquitetura deve permitir futura integração com:

Asaas

Stripe

Mercado Pago

Kiwify

outro gateway

Não criar pagamento falso.

24. RESPONSIVIDADE

O sistema deve funcionar perfeitamente em:

Desktop

Notebook

Tablet

Smartphone

No celular:

menu lateral deve virar menu mobile

cards devem se reorganizar

tabelas devem possuir scroll horizontal ou layout adaptado

formulários devem ocupar largura adequada

gráficos devem se adaptar ao tamanho da tela

A experiência mobile deve ser tratada como prioridade.

25. ESTADOS DA INTERFACE

Todas as páginas precisam possuir:

Loading

Mostrar skeleton ou indicador apropriado.

Estado vazio

Exemplo:

"Você ainda não cadastrou nenhuma receita."

Com botão:

Adicionar receita

Erro

Mostrar mensagem amigável.

Nunca mostrar erro técnico bruto para o usuário.

Sucesso

Utilizar toast/notificação discreta.

26. FORMATAÇÃO

Utilizar padrão brasileiro:

Moeda:

R$ 5.000,00

Percentual:

16,00%

Datas:

12/09/2026

Todos os cálculos financeiros devem utilizar precisão adequada e evitar erros comuns de ponto flutuante.

27. REGRAS IMPORTANTES

Não criar números fictícios no Dashboard quando o usuário não possuir dados.

Não inventar análises.

Não afirmar que o usuário está economizando se os dados não comprovarem isso.

Não afirmar rentabilidade garantida.

Não tratar projeções como certeza.

Sempre diferenciar:

valor real

valor estimado

valor projetado

28. PRIVACIDADE

O sistema trabalha com informações financeiras.

Implementar arquitetura pensando em privacidade desde o início.

Não expor dados financeiros em URLs.

Não retornar dados de outros usuários.

Não utilizar dados financeiros pessoais para análises de outros usuários.

Implementar RLS corretamente.

29. LANDING PAGE

Criar uma landing page pública moderna.

Estrutura:

Hero

"Organize seu dinheiro. Planeje seu futuro."

Subtítulo:

"Tenha receitas, gastos, investimentos, metas e projeções financeiras em um único lugar."

CTA:

"Começar grátis"

Problema

"Você sabe quanto ganha. Mas sabe quanto realmente sobra?"

Mostrar situações:

dinheiro desaparece durante o mês

dificuldade para controlar gastos

investimentos sem planejamento

metas que nunca saem do papel

Solução

Mostrar o fluxo:

Receitas
↓
Gastos
↓
Saldo
↓
Investimentos
↓
Metas
↓
Projeções

Recursos

Mostrar:

Dashboard

Controle de gastos

Análise financeira

Investimentos

Simulador

Metas

Previsões

Simulador público

Permitir ao visitante testar o simulador sem cadastro.

CTA depois do resultado:

"Quer acompanhar seu progresso de verdade?"

"Crie sua conta grátis."

Preços

Mostrar planos Free e Premium.

FAQ

Criar perguntas sobre:

como funciona

segurança

investimentos

metas

cancelamento

planos

30. NAVEGAÇÃO

Rotas públicas:

/

/login

/cadastro

/recuperar-senha

/precos

/como-funciona

/simulador

/faq

Rotas autenticadas:

/app/dashboard

/app/receitas

/app/gastos

/app/analises

/app/investimentos

/app/simulador

/app/metas

/app/previsoes

/app/como-funciona

/app/configuracoes

/app/assinatura

Rotas administrativas:

/admin

/admin/usuarios

/admin/assinaturas

/admin/metricas

/admin/configuracoes

Proteger todas as rotas privadas.

31. COMPONENTES REUTILIZÁVEIS

Criar componentes como:

AppSidebar

MobileNavigation

Header

StatCard

ChartCard

EmptyState

LoadingState

ErrorState

ConfirmDialog

CurrencyInput

PercentageInput

DateInput

MoneyDisplay

GoalProgress

CategoryBadge

TransactionTable

TransactionForm

InvestmentCard

GoalCard

ProjectionChart

FinancialInsight

32. EXPERIÊNCIA DE USUÁRIO

Prioridade máxima:

Simplicidade.

O usuário deve conseguir registrar um gasto em poucos segundos.

O botão:

"+ Adicionar"

deve estar facilmente acessível.

Formulários devem possuir:

valores padrão inteligentes

categorias mais usadas

validação

feedback imediato

Evitar formulários excessivamente complexos.

33. INTELIGÊNCIA DO PRODUTO

Criar insights determinísticos baseados nos dados.

Exemplos:

Se categoria aumentou:

"Seus gastos com alimentação aumentaram 15% em relação ao mês anterior."

Se investimento aumentou:

"Você investiu R$ X neste mês."

Se meta está próxima:

"Sua meta está 82% concluída."

Se não houver dados:

"Cadastre algumas movimentações para começar a receber análises."

Não implementar IA generativa neste MVP.

A inteligência deve ser baseada em cálculos e regras transparentes.

34. AUDITORIA

Preparar estrutura para registrar ações importantes:

criação

edição

exclusão

alteração de assinatura

alteração de configurações

Isso será importante para suporte e segurança.

35. PERFORMANCE

Evitar consultas desnecessárias ao Supabase.

Utilizar:

queries eficientes

índices

paginação

filtros no banco

agregações quando possível

Não carregar todas as movimentações da conta se apenas os totais forem necessários.

36. SEO

A landing page pública deve possuir:

title

meta description

Open Graph

favicon

URLs amigáveis

headings semânticos

Não é necessário indexar as áreas privadas.

37. ACESSIBILIDADE

Implementar:

contraste adequado

navegação por teclado

labels nos campos

aria-label quando necessário

estados de foco

botões com textos claros

38. PRIMEIRA EXPERIÊNCIA DO USUÁRIO

Ao entrar no Dashboard sem dados:

Mostrar:

"Comece organizando sua vida financeira."

Com três ações:

[Adicionar receita]

[Adicionar gasto]

[Criar primeira meta]

Depois que houver dados, substituir esse estado pela Dashboard normal.

39. DADOS DEMONSTRATIVOS

Durante o desenvolvimento, podem ser utilizados dados seed para visualizar os gráficos.

Porém:

deixar claramente separados dos dados reais

não inserir automaticamente dados fictícios na conta de usuários reais

permitir limpeza dos dados de demonstração

40. O QUE NÃO FAZER

Não criar apenas uma interface visual.

Não criar botões que não funcionam.

Não utilizar localStorage como banco principal.

Não usar dados mockados como solução definitiva.

Não criar cálculos apenas visuais.

Não criar autenticação falsa.

Não deixar RLS de fora.

Não criar Open Finance neste primeiro MVP.

Não criar integração com corretoras neste primeiro MVP.

Não implementar pagamentos reais nesta primeira etapa.

Não implementar IA neste primeiro MVP.

41. ORDEM DE IMPLEMENTAÇÃO

Construir nesta ordem:

FASE 1

Configuração do projeto

Supabase

Autenticação

Profiles

Layout

Navegação

Dashboard básico

FASE 2

Receitas

Categorias

Gastos

Subcategorias

Formas de pagamento

FASE 3

Dashboard completo

Análise de gastos

Gráficos

Comparação mensal

FASE 4

Metas

Simulador

Projeções

FASE 5

Investimentos

Patrimônio

Previsões

FASE 6

Central de instruções

Configurações

Perfil familiar

FASE 7

Área administrativa

Planos

Controle de assinatura

FASE 8

Responsividade

Segurança

Performance

SEO

Acessibilidade

Testes

Preparação para produção

42. CRITÉRIO DE CONCLUSÃO

O projeto somente deve ser considerado concluído quando:

usuário consegue criar conta

usuário consegue fazer login

usuário consegue cadastrar receita

usuário consegue cadastrar gasto

usuário consegue visualizar Dashboard

Dashboard calcula dados reais

categorias funcionam

análises funcionam

gráficos funcionam

metas funcionam

simulador funciona

investimentos funcionam

previsões funcionam

dados persistem no Supabase

RLS está configurado

rotas privadas estão protegidas

área administrativa está protegida

sistema funciona no celular

não existem botões principais sem ação

não existem dados fictícios aparecendo em contas reais

mensagens de erro são amigáveis

projeto está preparado para deploy na Vercel

43. IMPORTANTE SOBRE A EXECUÇÃO

Não tente construir tudo em uma única implementação se isso comprometer a qualidade.

Execute o projeto por fases, mantendo o sistema funcional a cada etapa.

Antes de criar novas funcionalidades:

verificar arquitetura existente

verificar tabelas existentes

verificar relacionamentos

evitar duplicação

preservar funcionalidades já implementadas

reutilizar componentes

manter padrão visual

Sempre priorizar:

FUNCIONALIDADE > ORGANIZAÇÃO > SEGURANÇA > PERFORMANCE > DESIGN

O resultado final deve parecer um SaaS comercial pronto para receber usuários reais, e não um projeto experimental.

44. RESULTADO ESPERADO

O produto final deve proporcionar esta experiência:

O usuário entra.

Informa quanto ganha.

Registra seus gastos.

O sistema entende sua situação financeira.

Mostra quanto sobra.

Mostra onde ele mais gasta.

Mostra quanto está investindo.

Permite criar uma meta.

Calcula quanto falta.

Calcula quanto precisa investir.

Projeta seu patrimônio.

E permite acompanhar sua evolução ao longo do tempo.

A sensação que o usuário deve ter é:

"Agora eu consigo enxergar minha vida financeira inteira em um só lugar."

Construir a aplicação seguindo rigorosamente esta especificação.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vitafinances.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/018c5911-f814-4828-a999-b170acee25c6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
