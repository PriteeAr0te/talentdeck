export function slugifyUserName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
}
  