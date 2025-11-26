import { websiteUrl } from "~/config";
import { getTranslationForLocale } from "~/i18n/ui";
interface Props {
	locale?: string
}

const Collections : React.FC<Props>  = ({ locale = 'en' }) => {
    const ui = getTranslationForLocale(locale)
  const data = [
  {
    image: "/collection/image.webp",
    link: `${websiteUrl}/collections/rings`,
    title: ui["collection.rings"],
  },
  {
    image: "/collection/KETTINGEN.webp",
    link: `${websiteUrl}/collections/necklaces`,
    title: ui["collection.necklaces"],
  },
  {
    image: "/collection/CADEAUS.webp",
    link: `${websiteUrl}/collections/gifts`,
    title: ui["collection.gifts"],
  },
  {
    image: "/collection/ARMBANDEN.webp",
    link: `${websiteUrl}/collections/bracelets`,
    title: ui["collection.bracelets"],
  },
  {
    image: "/collection/KETTINGEN.webp",
    link: `${websiteUrl}/collections/pendants`,
    title: ui["collection.pendants"],
  },
  {
    image: "/collection/Hangers.webp",
    link: `${websiteUrl}/collections/pendants`,
    title: ui["collection.pendants"],
  },
  {
    image: "/collection/OORBELLEN.webp",
    link: `${websiteUrl}/collections/earrings`,
    title: ui["collection.earrings"],
  },
];


  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 px-4">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Image Container */}
          <a
            href={item.link}
            className="w-full overflow-hidden rounded-xl group"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </a>

          {/* Title */}
          <div className="mt-3 text-center">
            <h3 className="text-lg md:text-xl font-medium">
              <a href={item.link} target="_blank">
                {item.title}
              </a>
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Collections;
