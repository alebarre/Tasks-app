import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Todos os usuários (e suas tarefas atreladas) foram apagados com sucesso.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
