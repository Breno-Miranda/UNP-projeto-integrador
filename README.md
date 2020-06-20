# UNP-projeto-integrador
Criação de um web app para delivery e drive-thru

Uma plataforma que gerencie seus pedidos de entregar para seus consumidores finais com uso de tecnologia web. Será desenvolvida com as seguinte linguagem: HTML5, css e javascript. As etapas serão desenvolvida para ajudar as empresas em período e pós pandêmica. Sabemos que hoje, durante o ano de 2019 a 2020, estamos no surto de covid-19 no mundo, principalmente no país (Brasil), tendo em vista melhorar a situação com uma ferramenta que terá como objetivo principal o conforto das pessoas em suas residência e melhor flexibilização. Em seguida as empresas precisam se reerguer economicamente, se mantendo para que não ocasione o fechamento de portas. 
	Como já mencionado acima as linguagem que serão utilizadas, tem ferramentas que ajudará a alavancar o projeto, elas são:  Firebase e Vuejs. Ambas são Frameworks que tem grandes vantagens e potenciais que torna o processo mais rápido e robusto. 

## Descrição

1 - Firebase (Google)

O firebase é uma plataforma de desenvolvimento de aplicativos para dispositivos móveis e web, que foi adquirida pela google em 2014. Com ela podemos criar rapidamente sem precisar gerenciar infraestrutura.

A ferramenta utiliza a linguagem de programação javascript, inclusive os módulos a própria ferramenta já nos possibilita a utilizar outro tipos de padrão de paradigmas. O firebase funciona como BackEnd (parte de trás) Termo do inglês e responsável pela camada interna do nosso software. A seguir o passo a passo para efetuar as configurações da ferramenta. O Primeiro passo é criar uma conta google para ter acesso a seus serviços. Segundo passo é entrar nesta URL Console Firebase. Irá aparecer um painel de gerenciamento de projetos, caso não tenha projetos, irá criar um. click no botão “Adicionar Projeto”, seguida aparecerá a seguinte tela. Veja na figura abaixo:

Agora, após todas confirmações do primeiro e segundo passo, vamos para o último passo que e escolher uma conta de vínculo ao Google Analytics. Veja abaixo:

Pronto! Feito, o projeto irá aparecer no console inicial de projetos. Veja a figura a seguir:.


Abra o projeto criado, podem ver e configurar alguns serviços, tais quais: Host, autenticação, banco de dados e storage (armazenamento de arquivos). É preciso passar por todos serviços citado acima, para configurar as ações, regras e controle de acesso.
No menu lateral esquerdo, podem ver os menus com os serviços, clicando, podem ativá los e configura as regras de segurança.

##  - Autenticação de usuário

ao clicar no menu “Authentication” vai redirecionar para o painel de autenticação. Informe o modo que a aplicação vai se autenticar. Vá até a aba “Sign-in method”, temos que escolher qual o método que deve utilizar. Neste projeto o método será “E-mail/senha”, como assim ? Os usuário vão se logar na plataforma com email e senha. Mas existem outros modo de autenticação, tais quais: Facebook, própria conta googles, pelo smartphone, github e etcs.  

Após a escolha do modo de autenticação, podemos seguir para um outro serviço para configurar também as regras de segurança.

## 2 - Banco de dados (Firestore)

O banco de dados firestore, também produto Google, pertencente ao produto firebase, trata-se de um banco noSQL, o que significa ? Não relacional, sua orientação a objetos, exemplos de banco, Mongodb, Redis, HBase e etcs.

Ainda no menu lateral esquerda, vá até o link “Database”, clicando nele, vamos se deparar com as opções de banco de dados,  existem dois, o firestore cloud, e o'que vamos utilizar é o real-time.

Após selecionado banco “Cloud Firestore”, será para página de gestão do banco, logo acima terá uma aba “Regras”, clicarmos  para ir até ela. Aparecerá a edições de regra de acesso a banco de dados. Vamos criar nossa rota. Veja a imagem a seguir. 

como mostra acima, informa todas as tabelas estão permitidas a leitura de qualquer usuário, mais a escrita e a modificações estão a cargo do usuário autenticado. Ex: “if request.auth != null;” , então quando o objeto “auth” for diferente de null que dizer que usuário está autenticado e poderá efetuar ações sobre a tabela. Após finalizar a criação da regra, tem que publicar as alterações, clicando no botão “Publicar”.
A configuração de rota de acesso do usuário para o banco de dados, não será diferente para o módulo de “Storage”, mas o que é esse módulo ? no próximo item abaixo será explicado com mais detalhes.

## 3 - Storage (Firebase)

O storage é uma ferramenta de carregar conteúdo gerados pelo usuário, como vídeos, fotos e arquivos (documentos). Veja a figura abaixo. 

Seguindo a mesma regra do banco de dados. No menu principal, no  link chamado “Storage”, clique e serão redirecionados para página storage. Pronto! Logo acima terá uma aba com a seguinte nomenclatura “Rules”, clique irá aparecer a edição de regras de acesso igualmente foi com a  banco de dados.  veja a figura abaixo:

Veja que a regra do storage se torna mais simples, pois se trata de arquivos estáticos, porque só precisamos ter o controle de acesso na escrita e modificação simples. Os métodos “allow read, write” separa a decisão de acesso à leitura sempre permitida “Allow”, para a escrita temos, uma condição de caso for diferente, quando o objeto “if request.auth!=null;” for diferente de “Null nulo, concedendo acesso a qualquer diretório e arquivo in loco. Próximo passo após finalizar a criação da regra, tem que publicar as alterações, clicando no botão “Publicar”. 

## 4 - Hosting (Hospedagem Firebase)

O hosting do termo inglês (Hospedagem), serve para alocar nosso arquivos de linguagem e estrutura do projeto, para ser visualizado no navegador via protocolo HTTP. Neste módulo não é preciso setar regra de acesso, mas podem ser feitas análise sobre uso, sobre deploy, quando o desenvolvedor faz o upload dos arquivos programados para serem armazenado e visualizar em produção ou em apenas testes, que inclusive onde será hospedado o projeto descrito. 
Está etapa, já vem pronta, quando é criado o projeto, de forma automática cria-se um domínio e subdomínio, com nome do projeto. O Google fornece para uso de teste, um plano de 1GB gratuitos. Vamos meter a mão na massa.

## 5 - Estruturando arquitetura do projeto (Firebase + VueJS + Materialize)

A estruturação dos arquivos de programação na framework firebase, no front-end será utilizando o VueJs que se trata de uma ótima ferramenta javascript, pois ela torna seu código mais limpo e fácil manutenção. 

Para chegar até a essa estrutura, foi preciso fazer a instalação do NodeJs na máquina que está sendo utilizada para desenvolver. A versão de instalação é v12.16.3, pode está baixando através do site nodejs. 

A IDE para desenvolvimento é muito importante, pois ela ajudará a impulsionar sua performance em tempo de desenvolvimento por ter o auto-completar para auxiliar na sintaxe. Recomendo uma ferramenta muito boa, chama-se Visual Code. 
Um editor de código fonte desenvolvido pela microsoft, dentro da própria ferramenta existe um terminal que vai auxiliar nos comandos shell que terão que ser aplicados para inicialização da estrutura do firebase para iniciar o desenvolvimento.

Pronto! todos aptos para inicializar a estrutura mencionada. Vamos inicio estrutura do projeto. Abra o terminal do visual code, vamos digitar o primeiro comando do firebase é npm install -g firebase-tools. Obs: comando para shell base linux, para windows terão programas exe. fornecido pelo próprio fabricante para auxiliar na instalação.

Após a instalação da ferramenta firebase, Faça o login no google. Execute este comando: firebase login.

Feito login da sua máquina local ao firebase e concede acesso aos seus projetos, vá para o próximo passo que é configurar a estrutura. Digite o seguinte comando: firebase init.


## 6 - Vue js (Framework javascript)

Vue.js é um framework JavaScript de código-aberto, focado no desenvolvimento de interfaces de usuário e aplicativos de página única.

A instalação dessa biblioteca é bastante simples, pois será via CDN (Rede de fornecimento, entrega e distribuição de conteúdo) pois precisará de carregar no cabeçalho do documento HTML. Segue O CDN

```
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```
Para estrutura de estilo da plataforma, está sendo utilizada o material design também uma ferramenta Google para estilização de página web total responsivo para mobile. A instalação via CDN, segue abaixo.

Logo abaixo está a estruturação do código padrão utilizando em todos os módulos como base. Essa estrutura e padrão da ferramenta mencionada acima, mais tudo mostra o seu potencial de organização e estruturação.

As chamadas do controle e feita na view (HTML) na página que deseja utilizá-lo para criar as ações de orientação a evento e funções do app. A  framework firebase e vue js juntas, serão feitas algum chamado “CRUD” que é nada mais a ação de criar, atualizar e deletar. Essas ações podem ser vista na figura abaixo como exemplos: 

## 7 - Materialize (Framework CSS)

O materialize também é um framework de desenvolvimento frontend (lado do usuário) e estilização de sistema e site web. Com essa ferramenta terá um grande avanço para desenvolver, pois já vem tudo prontinho, não é preciso estilizar um botão na mão para que seja obtido um resultado, tornando tudo muito fácil. 

Com essa ferramenta podemos implementar tudo sobre estilo e designer do projeto. No caso do Web, tratando-se de um site responsivo, onde só possível de forma simples com o uso da mesma.

A estrutura de instanciamento da framework e via CDN, igualmente da ferramenta mostrada anterior. Segue abaixo as tags de implementação.
```
<scriptsrc="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></script> <scriptsrc="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
```
aqui abaixo colocar está posta a estrutura de layout do web app desenvolvido. O layout segue um simples padrão de secções. Essas seções são chamadas de componentes. O layout está dividida em 4 partes. Elas são: Menu -> Banner -> Body -> Footer.

License
MIT
