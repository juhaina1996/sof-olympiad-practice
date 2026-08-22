export function toClassSlug(grade: number): string {
  return `class-${grade}`;
}

export function parseClassSlug(slug: string): number | null {
  const match = /^class-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
}
