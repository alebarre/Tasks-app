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

### Prazo e Vencimento
- **Vencida**: Uma tarefa com `dueDate` no passado e status diferente de **COMPLETED** é considerada vencida. O painel exibe "Vencida há X dias" em vermelho.
- **Concluída após o prazo**: Se a tarefa foi concluída, ela nunca é marcada como vencida; o painel exibe "Venceu há X dias" sem destaque.
- **Dentro do prazo**: Exibe "Vence em X dias".

### Arquivamento
- **Arquivar concluídas**: O usuário pode arquivar em lote, mediante confirmação, todas as suas tarefas com status **COMPLETED** ainda não arquivadas (`POST /tasks/archive-completed`). Apenas tarefas concluídas são afetadas.
- **Sem tarefas concluídas**: Se não houver tarefas concluídas, a ação retorna `count: 0` e a interface informa ao usuário, sem alterar nada.
- **Listagem principal**: Tarefas arquivadas (`archived = true`) não aparecem na listagem principal (`GET /tasks`) nem nas estatísticas do painel.
- **Área de arquivadas**: A listagem `GET /tasks/archived` retorna somente as tarefas arquivadas do usuário, ordenadas pela data de arquivamento (`archivedAt`) mais recente.
- **Reativar**: Uma tarefa arquivada pode voltar ao fluxo normal (`PATCH /tasks/:id/unarchive`), mantendo seu status original. Reativar uma tarefa que não está arquivada resulta em `400 Bad Request`.
- **Excluir definitivamente**: A partir da área de arquivadas, a tarefa pode ser removida permanentemente (`DELETE /tasks/:id`), sem possibilidade de recuperação.
- **Proteção**: Os campos `archived` e `archivedAt` não podem ser alterados diretamente pelas rotas de criação/edição de tarefa; apenas pelas rotas de arquivamento e reativação.
