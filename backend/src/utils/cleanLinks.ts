export const cleanLinks = (links: { label?: string; url?: string; isVisible?: boolean }[]) =>
  links
    .map((link) => ({
      label: link.label?.trim() || undefined,
      url: link.url?.trim() || undefined,
      isVisible: link.isVisible !== false,
    }))
    .filter((link) => link.label || link.url);
