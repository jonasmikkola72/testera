import Image from 'next/image';

interface SearchImageProps {
  width?: number; // Allows you to optionally set a width
  height?: number; // Allows you to optionally set a height
}

// Default values for width and height are provided, but you can pass custom values as props
const SearchImage: React.FC<SearchImageProps> = ({
  width = 300, // Default width
  height = 200, // Default height
}) => {
  return (
    <div>
      <Image
        src="/img/search.png" // Path to your image
        alt="Search" // Alt text for the image
        width={width} // Width from props or default
        height={height} // Height from props or default
        objectFit="contain" // Keeps the aspect ratio of the image
      />
    </div>
  );
};

export default SearchImage;
