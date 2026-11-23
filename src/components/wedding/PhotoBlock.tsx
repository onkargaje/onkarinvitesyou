import { Reveal } from "./Reveal";
import { LikeButton } from "./LikeButton";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export const PhotoBlock = ({
  title,
  photoId,
  image,
  aspect = "aspect-[4/5]",
}: {
  title: string;
  photoId: string;
  image?: string;
  aspect?: string;
}) => (
  <section className="px-6 py-12 md:py-20">
    <div className="container mx-auto max-w-3xl">
      <Reveal>
        <div className="polaroid glow-rose mx-auto max-w-2xl">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className={`w-full rounded-sm object-cover object-[center_20%] ${aspect}`}
            />
          ) : (
            <PhotoPlaceholder aspect={aspect} />
          )}
          <div className="absolute right-4 top-4 z-20">
            <LikeButton kind="photo" itemId={photoId} variant="overlay" />
          </div>
        </div>
        <div className="mt-10 text-center">
          <h3 className="font-serif text-3xl text-foreground md:text-4xl">{title}</h3>
        </div>
      </Reveal>
    </div>
  </section>
);