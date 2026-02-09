import { useEffect, useState, type FC } from "react";
import ReactDOM from "react-dom";
import Spinner from "../Spinner";

interface CarouselImageProps {
  preview: string;
  images: string[];
  initialIndex?: number;
}

const CarouselImage: FC<CarouselImageProps> = ({
  preview,
  images = [],
  initialIndex = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  if (!images.length) {
    return <div className="w-48 h-48 bg-[#C4C4C4] rounded-[8px] flex-none" />;
  }

  const open = () => {
    setCurrent(initialIndex);
    setIsLoading(true);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!current) return;
    setIsLoading(true);
  }, [current]);

  return (
    <>
      <div className="relative cursor-pointer w-48 h-48 bg-[#C4C4C4] rounded-[8px] flex-none">
        {isPreviewLoading && (
          <Spinner
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size="small"
          />
        )}
        <img
          src={preview}
          alt="Фото"
          loading="lazy"
          className="w-full h-full object-cover"
          onClick={open}
          onLoad={() => {
            setIsPreviewLoading(false);
          }}
          onError={(e) => {
            setIsPreviewLoading(false);
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      {!isOpen
        ? null
        : ReactDOM.createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
              onClick={close}
            >
              <div
                className="relative max-w-1/2 mob:max-w-[90vw] max-h-[90vh] w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="cursor-pointer absolute z-10 top-10 right-10 text-white hover:text-gray-200 active:scale-95 transition"
                  onClick={close}
                >
                  ✕
                </button>

                <div className="relative h-[80vh] w-full flex items-center justify-center bg-black/40 rounded-xl overflow-hidden">
                  {isLoading && (
                    <Spinner
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      size="small"
                    />
                  )}
                  <img
                    loading="lazy"
                    onLoad={() => {
                      setIsLoading(false);
                    }}
                    onError={() => {
                      setIsLoading(false);
                    }}
                    key={images[current]}
                    src={images[current]}
                    alt={`image-${current}`}
                    className="max-h-[80vh] max-w-full object-contain select-none"
                    draggable={false}
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-10 h-10 flex items-center justify-center hover:bg-black/70 active:scale-95 transition"
                        onClick={prev}
                      >
                        ‹
                      </button>
                      <button
                        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-10 h-10 flex items-center justify-center hover:bg-black/70 active:scale-95 transition"
                        onClick={next}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-3 flex items-center gap-2 text-white text-sm">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition ${
                          i === current ? "bg-white" : "bg-white/40"
                        }`}
                        onClick={() => setCurrent(i)}
                      />
                    ))}
                    <span className="ml-2">
                      {current + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )}
    </>
  );
};

export default CarouselImage;
