import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DiscussionsSearchQueryDto {
  @IsString()
  @IsNotEmpty()
  readonly query: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value) as any[];
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  readonly cursor?: any[];
}
