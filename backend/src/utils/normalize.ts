export const normalizeTagOrSkill = (input: string) =>
  input.trim().toLowerCase().replace(/\s+/g, "-");
