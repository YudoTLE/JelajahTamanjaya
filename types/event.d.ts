declare global {
  type EventType = {
    _id: string
    title: string
    description: string
    slug: {
      current: string
    }
    mainImage: Image
    categories: Category[]
    publishedAt: string
    beginAt: string
    endAt: string
    body: BlockContent
  };
}

export {};
