import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { TestimonialCard } from "./AuthTestimonialCard";
import type { CSSProperties } from "react";

export const TestimonialsSlider = () => {
  const style = {
    "--swiper-pagination-color": "#fff",
    "--swiper-pagination-bullet-inactive-color": "#ffffff68",
    "--swiper-pagination-bullet-inactive-opacity": "1",
    "--swiper-pagination-bullet-size": "8px",
    "--swiper-pagination-bullet-horizontal-gap": "6px",
  } as CSSProperties;

  return (
    <Swiper
      autoplay={{ delay: 2000 }}
      style={style}
      spaceBetween={50}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="w-[90%] !pb-12"
      pagination={{ clickable: true }}
      modules={[Pagination, Autoplay]}
    >
      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>
      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>
      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>
      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>
    </Swiper>
  );
};
