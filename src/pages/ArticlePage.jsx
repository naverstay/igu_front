import {useLocation, useNavigate, useParams} from "react-router-dom";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {Helmet} from "react-helmet-async";
import {Fragment, useEffect, useRef, useState} from "react";
import Loader from "../components/Loader";
import {api, API_URL, DEV_MODE} from "../api";
import Gallery from "../components/Gallery.jsx";

const DEFAULT_TITLE = "Inklusion für Köln: Inclusion In & Out of the Box";
const DEFAULT_KEYWORDS = "Inklusion, Kinderechte, Köln, Partizipation, Gesellschaftliche Teilhabe, Engagement, Networking, Empowerment, Menschenrechte, Kinder, Jugendliche, Behinderung, Familie, Armut, Care-Arbeit, Diskriminierung, Intersektionalität, Marginalisierung, Beratung";
const DEFAULT_DESCRIPTION = "Inclutopia steht für Inklusion in Freizeit, Kultur und gesellschaftlichem Engagement. Durch Advocacyarbeit, Networking und Empowerment geben wir Kindern, Jugendlichen mit Behinderung und Diskriminierungserfahrung und ihren Familien in Köln und NRW eine starke Stimme.";

export default function ArticlePage({slug: forcedSlug}) {
  const navigate = useNavigate();
  const params = useParams();
  const slug = forcedSlug || params.slug;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const prevSlug = useRef(null);

  useEffect(() => {
    if (prevSlug.current === slug) {
      return;
    }

    prevSlug.current = slug;

    setLoading(true);
    setArticle(null);

    async function loadArticle() {
      try {
        const res = await api.get(
          `/artikels?filters[slug][$eq]=${slug}&populate=*`
          //`/artikels?filters[slug][$eq]=${slug}&populate[content][populate][on][shared.gallery-block][populate][gallery_items]=image`
          //`/artikels?filters[slug][$eq]=${slug}&populate[content][on][shared.gallery-block][fields][0]=gallery_items&populate[content][on][shared.gallery-block][populate][gallery_items][populate]=image`
          //`/artikels?filters[slug][$eq]=${slug}&populate[content][on][shared.gallery-block][populate][gallery_items][populate]=image`
          //`/artikels?filters[slug][$eq]=${slug}&populate[content][populate][gallery_items][populate]=image`
          //`/artikels?filters[slug][$eq]=${slug}&populate[content][populate]=gallery_items`
        );

        console.log('article', res.data.data);

        if (res.data?.data?.length) {
          setArticle(res.data.data[0]);
        } else {
          navigate("/404", {replace: true});
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500)
      }
    }

    loadArticle();
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{article?.metaTitle || article?.title || DEFAULT_TITLE}</title>
        <meta name="description" content={article?.metaDescription || DEFAULT_DESCRIPTION}/>
        <meta name="keywords" content={article?.metaKeywords || DEFAULT_KEYWORDS}/>

        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content={article?.metaTitle || article?.title || DEFAULT_TITLE}/>
        <meta name="twitter:description"
              content={article?.metaDescription || DEFAULT_DESCRIPTION}/>
        <meta name="twitter:image"
              content={(DEV_MODE ? API_URL : '') + (article?.metaImage?.url || "")}/>

        <meta property="og:description"
              content={article?.metaDescription || DEFAULT_DESCRIPTION}/>
        <meta property="og:title" content={article?.metaTitle || article?.title || DEFAULT_TITLE}/>
        <meta property="og:image"
              content={(DEV_MODE ? API_URL : '') + (article?.metaImage?.url || "")}/>

        <link rel="canonical" href={API_URL + (slug === 'home' ? '' : `/${slug}`)}/>
      </Helmet>

      <div className="article">
        <Loader loading={loading}/>

        {!loading && article?.id && (<>
          {article?.content?.map((m, mi) => <Fragment key={mi}>
              {m?.__component === "shared.content-block" ?
                m?.useTextHTML ?
                  <div dangerouslySetInnerHTML={{__html: m.textHTML}}/> :

                  m?.content ?
                    <BlocksRenderer content={m?.content} blocks={{
                      link: ({children, url, target}) => (
                        <a href={url} target={target || "_self"}
                           rel={target === "_blank" ? "noopener noreferrer" : undefined}>
                          {children}
                        </a>
                      )
                    }}/> :

                    <h1>{m?.title ?? ""}</h1>
                : m?.__component === "shared.gallery-block" ?
                  <div className={"gallery-container " + (m?.fullScreen ? "" : "container")}>
                    <Gallery id={m.galleryId} options={m?.swiperOptions ?? {}}/>
                  </div> :
                  <div className="container">
                    <div>No component</div>
                  </div>
              }
            </Fragment>
          )}
        </>)}
      </div>
    </>
  );
}
