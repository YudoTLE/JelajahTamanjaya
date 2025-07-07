declare global {
  type PostType = {
    _id: string
    title: string
    slug: {
      current: string
    }
    mainImage: Image
    categories: Category[]
    publishedAt: string
    body: BlockContent
  };
}

export {};
