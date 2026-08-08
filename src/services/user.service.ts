import { cacheTag } from "next/cache";
import { Endpoints } from "@/constants/Endpoints";
import type { User } from "@/types";
import { ssrApi } from "./server";

export async function getUserById(id: string): Promise<User | null> {
  "use cache";
  cacheTag("library");
  try {
    const user = await ssrApi.get<User>(Endpoints.users.detail(id));
    if (!user || user.id == null) return null;
    return { ...user, id: String(user.id) };
  } catch {
    return null;
  }
}
