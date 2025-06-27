declare global {
  type Block = {
    _type: 'block'
    style?: string
    markDefs?: {
      _key: string
      _type: string
      [key: string]: unknown
    }[]
    children: {
      _key: string
      _type: 'span'
      text: string
      marks?: string[]
    }[]
    [key: string]: unknown
  };

  type BlockImage = {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  };

  type BlockContent = (Block | BlockImage)[];
}

export {};
