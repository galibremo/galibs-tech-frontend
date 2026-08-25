export const productKeys = {
  all: ["products"] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
  specs: (id: string) => [...productKeys.all, "specs", id] as const,
};
