declare global {
  type Image = {
    asset: {
      _id: string
      url: string
    }
    caption?: string
    alt?: string
  };
}

export {};
