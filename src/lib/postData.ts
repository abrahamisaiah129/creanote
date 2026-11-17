import type { PostData } from "@/components/PostRow";

type RawPost = Record<string, unknown>;

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

const asId = (value: unknown): string | undefined => {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "toString" in value) {
    const id = String(value);
    return id !== "[object Object]" ? id : undefined;
  }
  return undefined;
};

export function normalizePostData(input: RawPost): PostData {
  const author =
    typeof input.author === "object" && input.author !== null
      ? input.author
      : undefined;
  const authorRecord = author as
    | { name?: unknown; role?: unknown; avatar?: unknown; avatarUrl?: unknown }
    | undefined;
  const subtitle = asString(input.sub) || asString(input.excerpt) || "";
  const subtitleParts = subtitle.split("|").map((part) => part.trim());
  const authorName =
    asString(input.authorName) ||
    asString(input.author as unknown) ||
    asString(authorRecord?.name) ||
    subtitleParts[0] ||
    "Creanote Creator";
  const authorRole =
    asString(input.authorRole) ||
    asString(input.role) ||
    asString(authorRecord?.role) ||
    subtitleParts[2] ||
    subtitleParts[1] ||
    "Creator";

  return {
    ...(input as Partial<PostData>),
    id: asId(input.id) || asId(input._id),
    slug: asString(input.slug),
    postURL: asString(input.postURL) || asString(input.postUrl),
    date:
      asString(input.date) ||
      asString(input.createdAt) ||
      new Date().toISOString(),
    headline:
      asString(input.headline) ||
      asString(input.title) ||
      "Untitled story",
    sub: subtitle,
    title: asString(input.title),
    excerpt: asString(input.excerpt) || subtitle,
    content:
      asString(input.content) ||
      asString(input.body) ||
      asString(input.bodyText),
    thumbUrl: asString(input.thumbUrl) || asString(input.imageUrl),
    coverImage:
      asString(input.coverImage) ||
      asString(input.thumbUrl) ||
      asString(input.imageUrl),
    author: authorName,
    authorName,
    authorRole,
    authorAvatar:
      asString(input.authorAvatar) ||
      asString(input.avatarUrl) ||
      asString(authorRecord?.avatar) ||
      asString(authorRecord?.avatarUrl),
    category: asString(input.category),
    tags: asStringArray(input.tags),
    readTime: asString(input.readTime) || asString(input.readingTime),
    readingTime: asString(input.readingTime) || asString(input.readTime),
    gallery: asStringArray(input.gallery),
  };
}
