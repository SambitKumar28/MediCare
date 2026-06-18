import { FaStar } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Booking my appointment was incredibly easy. The doctor was professional and the whole experience was smooth.",
  },
  {
    id: 2,
    name: "Priya Verma",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "I found the right specialist within minutes. Highly recommended healthcare platform.",
  },
  {
    id: 3,
    name: "Amit Kumar",
    image:
      "https://randomuser.me/api/portraits/men/22.jpg",
    review:
      "The reminders and booking system saved me a lot of time. Excellent service.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase">
            Testimonials
          </span>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            What Our Patients Say
          </h2>

          <p className="text-gray-600 mt-4">
            Thousands of patients trust our platform for their healthcare needs.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={30}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className="
                  bg-white
                  rounded-3xl
                  p-8
                  shadow-lg
                  border
                  hover:shadow-xl
                  transition
                  h-full
                "
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-16
                      h-16
                      rounded-full
                      object-cover
                    "
                  />

                  <div>
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>

                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, index) => (
                        <FaStar key={index} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  &quot;{item.review}&quot;
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Testimonials;
