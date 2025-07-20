declare global {
  type Author = {
    fullname: string
    slug: {
      current: string
    }
    mainImage?: {
      alt?: string
    }
    bio: string
  };
}

export {};
