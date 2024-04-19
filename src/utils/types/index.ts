export type TPublicResponse<T = unknown> = {
  message: string;
  data?: T;
};
