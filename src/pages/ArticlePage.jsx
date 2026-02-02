import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {Helmet} from "react-helmet-async";
import {useEffect, useRef, useState} from "react";
import Loader from "../components/Loader";
import {api} from "../api";

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
        );

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
              content={(import.meta.env.DEV ? import.meta.env.VITE_API_URL : '') + (article?.metaImage?.url || "")}/>

        <meta property="og:description"
              content={article?.metaDescription || DEFAULT_DESCRIPTION}/>
        <meta property="og:title" content={article?.metaTitle || article?.title || DEFAULT_TITLE}/>
        <meta property="og:image"
              content={(import.meta.env.DEV ? import.meta.env.VITE_API_URL : '') + (article?.metaImage?.url || "")}/>

        <link rel="canonical" href={import.meta.env.VITE_API_URL + (slug === 'home' ? '' : `/${slug}`)}/>
      </Helmet>

      <div className="article">
        <Loader loading={loading}/>

        {!loading && article?.id && (<>
          {article?.useTextHTML ?
            <div dangerouslySetInnerHTML={{__html: article.textHTML}}/> :

            article?.content ?
              <BlocksRenderer content={article?.content} blocks={{
                link: ({children, url, target}) => (
                  <a href={url} target={target || "_self"}
                     rel={target === "_blank" ? "noopener noreferrer" : undefined}>
                    {children}
                  </a>
                )
              }}/> :

              <h1>{article?.title ?? ""}</h1>
          }
        </>)}
      </div>
    </>
  );
}
