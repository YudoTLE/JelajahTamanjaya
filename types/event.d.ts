declare global {
  type EventType = {
    _id: string
    title: string
    description: string
    slug: {
      current: string
    }
    mainImage: Image
    author: Author
    categories: Category[]
    publishedAt: string
    beginAt: string
    endAt: string
    innerShadowColor: Color
    body: BlockContent
  };
}

export {};
