# Regras de Negócio - TaskApp

## 1. Usuários e Autenticação

### Registro e Verificação
- **Unicidade**: O sistema não permite o cadastro de dois usuários com o mesmo e-mail.
- **Verificação Obrigatória**: Após o cadastro, o usuário recebe um e-mail contendo um link de ativação gerado com um token criptográfico (`verificationToken`). O acesso (login) ao sistema só é liberado após o usuário acessar este link, alterando o status `isEmailVerified` para `true`.
- **Senha Segura**: A senha é encriptada usando `bcrypt` antes de ser salva no banco de dados.

### Login
- **Credenciais**: O acesso requer o e-mail e a senha corretos.
- **Bloqueio de Não Verificados**: Se o usuário fornecer a senha correta mas não tiver verificado o e-mail, o login será bloqueado com código `403 Forbidden`.
- **Sessão**: O login bem-sucedido retorna um JSON Web Token (JWT) que deve ser enviado no cabeçalho (Authorization: Bearer) das próximas requisições.

### Recuperação de Senha
- **Solicitação**: Ao esquecer a senha, o usuário fornece seu e-mail. Se existir no banco, ele recebe um e-mail de recuperação.
- **Expiração**: O token de redefinição de senha (`resetPasswordToken`) expira em exatas 1 hora (`resetPasswordExpires`).
- **Segurança Oculta**: Para evitar vazamento de dados de clientes na API, a rota de recuperação sempre retorna a mesma mensagem genérica de "Se o e-mail estiver registrado...", quer o usuário exista ou não.

---

## 2. Gerenciamento de Tarefas (Tasks)

### Propriedade e Isolamento
- **Posse**: Toda tarefa criada é obrigatoriamente vinculada ao usuário autenticado que a criou (`userId`).
- **Privacidade e Proteção**: Um usuário só pode visualizar, editar ou deletar as tarefas que pertencem a ele. Qualquer tentativa de manipular a tarefa de outro usuário resulta em um erro de autorização `403 Unauthorized` ou `404 Not Found`.

### Estrutura da Tarefa
- **Obrigatoriedades**: Cada tarefa requer, no mínimo, um Título.
- **Campos Opcionais**: Descrição e Data de Vencimento (`dueDate`).
- **Prioridade (Priority)**:
  - **LOW** (Baixa) - Valor padrão na criação.
  - **MEDIUM** (Média)
  - **HIGH** (Alta)
- **Status da Tarefa**:
  - **PENDING** (Pendente) - Valor padrão na criação.
  - **IN_PROGRESS** (Em progresso)
  - **COMPLETED** (Concluída)
