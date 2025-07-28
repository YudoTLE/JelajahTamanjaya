declare global {
  type EventMode = 'offline' | 'online';

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
    mode: EventMode
    location: string
    beginAt: string
    endAt: string
    innerShadowColor: Color
    body: BlockContent
  };
}

export {};
