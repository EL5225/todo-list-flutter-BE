import { prisma } from "@/libs";
import { Hono } from "hono";
import {
  TGetTodoReponseById,
  TGetTodosResponse,
  TPostTodoRequest,
} from "./types";
import { TPublicResponse, getTodoById } from "@/utils";

export const todo = new Hono();

// *********************

// GET /api/v1/todos

todo.get("/", async (c) => {
  const getTodos = await prisma.todos.findMany({
    where: {
      is_deleted: false,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (getTodos.length === 0) {
    return c.json<TGetTodosResponse>({
      message: "No todos found",
      data: [],
    });
  }

  return c.json<TGetTodosResponse>({
    message: "Todos fetched successfully",
    data: getTodos,
  });
});

todo.get("/:id", async (c) => {
  const { id } = c.req.param();

  const getTodo = await getTodoById(id);

  if (!getTodo) {
    return c.json<TGetTodoReponseById>(
      {
        message: "No todo found",
        data: null,
      },
      400
    );
  }

  return c.json<TGetTodoReponseById>({
    message: "Todo fetched successfully",
    data: getTodo,
  });
});

todo.get("/:id/complete", async (c) => {
  const { id } = c.req.param();

  const getTodo = await getTodoById(id);

  if (!getTodo) {
    return c.json<TPublicResponse>({ message: "No todo found" }, 400);
  }

  await prisma.todos.update({
    where: {
      id,
    },
    data: {
      is_done: getTodo.is_done ? false : true,
    },
  });

  return c.json<TPublicResponse>({
    message: "Todo status changed successfully",
  });
});

// *********************

// POST /api/v1/todos

todo.post("/", async (c) => {
  const body = await c.req.json<TPostTodoRequest>();

  await prisma.todos.create({
    data: {
      title: body.title,
    },
  });

  return c.json<TPublicResponse>({ message: "Todo created successfully" }, 201);
});

// *********************

// PATCH /api/v1/todos/:id

todo.patch("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<TPostTodoRequest>();

  const getTodo = await getTodoById(id);

  if (!getTodo) {
    return c.json<TGetTodoReponseById>({ message: "No todo found" }, 400);
  }

  await prisma.todos.update({
    where: {
      id,
    },
    data: {
      title: body.title,
    },
  });

  return c.json<TPublicResponse>({
    message: "Todo updated successfully",
  });
});

// *********************

// DELETE /api/v1/todos/:id

todo.delete("/:id", async (c) => {
  const { id } = c.req.param();

  const getTodo = await getTodoById(id);

  if (!getTodo) {
    return c.json<TPublicResponse>({ message: "No todo found" }, 400);
  }

  if (getTodo.is_deleted) {
    return c.json<TPublicResponse>({ message: "Todo is already deleted" }, 400);
  }

  await prisma.todos.update({
    where: {
      id,
    },
    data: {
      is_deleted: true,
    },
  });

  return c.json<TPublicResponse>({
    message: "Todo deleted successfully",
  });
});
