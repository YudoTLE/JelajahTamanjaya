import { PortableText as BasePortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

const portableTextComponents = {
  types: {
    image: ({ value }: { value: Image }) => {
      if (!value.asset) return null;

      const imageUrl = urlFor(value).url();
      return (
        <div className="my-6 not-prose text-sm text-muted-foreground italic">
          <Image
            src={imageUrl}
            alt={value.alt || 'image'}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto rounded-lg"
          />
          {value.caption
            && (
              <p>
                {value.caption}
              </p>
            )}
          {value.src
            && (
              <p>
                {'src: '}
                <a
                  href={value.src}
                  className="text-blue-400 hover:text-blue-500"
                >
                  {value.src}
                </a>
              </p>
            )}
        </div>
      );
    },
  },
};

export const PortableText = ({ value }: { value: BlockContent }) => {
  return (
    <BasePortableText
      value={value}
      components={portableTextComponents}
    />
  );
};
