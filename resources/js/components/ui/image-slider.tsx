import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

interface ImageSliderProps {
    images: {
        src: string;
        alt: string;
        link?: string;
    }[];
    autoSlideInterval?: number;
    height?: string;
    width?: string;
    effect?: 'slide' | 'fade';
}

export function ImageSlider({ 
    images, 
    autoSlideInterval = 5000, 
    width = '100%',
    effect = 'slide'
}: ImageSliderProps) {
    useEffect(() => {
        // Force Swiper to update when images change
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            // Access the Swiper instance using a properly typed approach
            const swiperInstance = (swiperContainer as Element & { swiper?: { update: () => void } }).swiper;
            if (swiperInstance) {
                swiperInstance.update();
            }
        }
    }, [images]);

    if (!images.length) return null;

    return (
        <div className="w-full rounded-lg overflow-hidden" style={{ width }}>
            <Swiper
                modules={[Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: autoSlideInterval,
                    disableOnInteraction: false,
                }}
                effect={effect}
                loop={true}
                className="rounded-lg"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        {image.link ? (
                            <a href={image.link} className="block w-full">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full object-contain"
                                />
                            </a>
                        ) : (
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full object-contain"
                            />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}