import { TransformFnParams } from "class-transformer";

export function transformToStringArray({
  value,
}: TransformFnParams): string[] | undefined {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as any[];
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
}
