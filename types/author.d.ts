declare global {
  type Author = {
    fullname: string
    bio: string
    slug: {
      current: string
    }
    mainImage?: {
      alt?: string
    }
  };
}

export {};
