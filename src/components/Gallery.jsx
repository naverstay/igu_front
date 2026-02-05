import {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {api, API_URL} from "../api.js";
import Loader from "./Loader.jsx";

export default function Gallery({id, options = {}}) {
  const [items, setItems] = useState([]);
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);

      try {
        const res = await api.get(
          `/gallery-items?filters[documentId][$eq]=${id}&populate[images][populate]=*`
        );

        setGallery(res.data?.data?.[0] ?? null);
        setItems(res.data?.data?.[0]?.images ?? []);
      } catch (err) {
        console.error("Gallery load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, [id]);

  return (
    <div className="gallery-holder">
      {loading ?
        <Loader loading={loading} loaderId={2}/> :
        <>
          <div className="gallery-title">{gallery?.title ?? "title"}</div>
          <div className="gallery-text">{gallery?.description ?? "description"}</div>
          {
            items.length ? <Swiper modules={[Navigation, Pagination, Autoplay]}
                                   spaceBetween={20}
                                   slidesPerView={1}
                                   loop={true}
                                   navigation={true}
                                   pagination={{clickable: true}}
                                   autoplay={{delay: 3000}}
                                   {...options}>
                {items.map((item) => {
                  return (
                    <SwiperSlide key={item.id}>
                      <div style={{textAlign: "center"}}>
                        {item.image && (
                          <img
                            src={`${API_URL}${item.image.url}`}
                            alt={item.alternativeText}
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "8px",
                              marginBottom: "10px"
                            }}
                          />
                        )}

                        <div className="gallery-title">{item.title}</div>
                        <div className="gallery-text">{item.description}</div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper> :
              <div className="gallery-title">No Images</div>
          }
        </>
      }
    </div>
  );
}
