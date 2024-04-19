import { TPublicResponse } from "@/utils";
import { Todos } from "@prisma/client";

export type TGetTodosResponse = TPublicResponse<Todos[]>;
export type TGetTodoReponseById = TPublicResponse<Todos | null>;

export type TPostTodoRequest = Pick<Todos, "title">;
