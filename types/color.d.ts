declare global {
  type Color = {
    hex: string
    alpha: number
    hsl: {
      h: number
      s: number
      l: number
      a: number
    }
    hsv: {
      h: number
      s: number
      v: number
      a: number
    }
    rgb: {
      r: number
      g: number
      b: number
      a: number
    }
  };
}

export {};
