declare global {
  type Image = {
    asset: {
      _id: string
      url: string
    }
    alt?: string
    caption?: string
    src?: string
  };
}

export {};
