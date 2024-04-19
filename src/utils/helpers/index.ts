import { prisma } from "@/libs";

export async function getTodoById(id: string) {
  return await prisma.todos.findUnique({
    where: {
      id,
    },
  });
}
