import { PortableText as BasePortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => (
      <div className="my-6 not-prose">
        <Image
          src={urlFor(value).width(800).height(400).url()}
          alt={value.alt || 'Event image'}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg"
        />
        {value.caption && (
          <p className="text-sm text-gray-400 mt-2 text-center italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
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
