# Tecnologias e Build do Projeto

## 1. Stack Tecnológico

### Backend
- **Node.js & Express**: Plataforma e framework web escolhidos para construir a API REST, devido à sua velocidade de I/O não-bloqueante e simplicidade de roteamento.
- **Prisma ORM**: Mapeamento Objeto-Relacional moderno focado em tipagem segura. Gerencia a criação do banco (schema) e migrações.
- **PostgreSQL**: Banco de dados relacional robusto para salvar usuários e tarefas.
- **JWT & Bcryptjs**: Bibliotecas utilizadas para geração de token de sessão e criptografia (hashing) de senhas.
- **Nodemailer**: Biblioteca usada para o envio de e-mails transacionais (como recuperação de senhas).

### Frontend
- **React & Vite**: O Vite foi utilizado no lugar do Create React App ou Next.js para um build de Single Page Application (SPA) extremamente rápido com Hot Module Replacement (HMR).
- **Tailwind CSS**: Estilização baseada em classes utilitárias. O projeto foi configurado para suportar Dark Mode facilmente.
- **React Query**: Ferramenta utilizada para buscar (fetch), fazer cache, sincronizar e atualizar dados do servidor na interface React de forma eficiente.

### Infraestrutura & Dev Tools
- **Docker e Docker Compose**: Usados para orquestrar todos os containers da aplicação localmente, removendo a necessidade de instalar Postgres, Node e outras dependências no SO local do desenvolvedor.
- **Mailhog**: Um servidor SMTP falso que intercepta e-mails durante o desenvolvimento.

---

## 2. Como Fazer o Build e Executar o Projeto

A aplicação está contêinerizada. Não é necessário ter Node ou Postgres instalados nativamente, apenas o Docker.

### Processo de Build Completo
Na raiz do projeto (onde se encontra o arquivo `docker-compose.yml`), abra o terminal e execute:

```bash
docker compose up --build
```
*(Observação: Se estiver no Linux e receber erro de permissão no socket do Docker, rode usando `sudo docker compose up --build`)*

**O que o comando faz por baixo dos panos:**
1. **DB**: Baixa e sobe a imagem do `postgres:15-alpine`, cria um volume (`pgdata`) para que seus dados não sejam perdidos ao reiniciar, e expõe a porta `5432`.
2. **Mailhog**: Inicia a ferramenta para captura de e-mails e expõe a porta `8025` para acessar a interface web de leitura.
3. **Backend**: 
   - Acessa o diretório `./backend` e executa seu `Dockerfile`.
   - Instala as dependências (`npm install`).
   - Sobe o servidor injetando a string de conexão com o Postgres e variáveis JWT pelo `docker-compose.yml`.
   - Roda na porta `3001` local.
4. **Frontend**:
   - Acessa o diretório `./frontend` e executa seu `Dockerfile`.
   - Instala as dependências de interface.
   - Executa o Vite e expõe a porta local `5173`.

### Acessando os Serviços
- **Frontend (UI)**: [http://localhost:5173](http://localhost:5173)
- **Painel de E-mails (Mailhog)**: [http://localhost:8025](http://localhost:8025)
- **Backend (API)**: [http://localhost:3001](http://localhost:3001)
- **Banco de Dados**: Pode ser conectado usando um cliente SQL através de `localhost:5432` com as credenciais definidas no docker-compose.
