import {Navigate, useLocation, useParams} from "react-router-dom";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {useEffect, useRef, useState} from "react";
import Loader from "../components/Loader";
import {api} from "../api";

export default function ArticlePage({slug: forcedSlug}) {
  const params = useParams();
  const slug = forcedSlug || params.slug;

  const [article, setArticle] = useState(null);
  const [goto404, setGoto404] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const prevSlug = useRef(null);

  useEffect(() => {
    setGoto404(false);
  }, [location.pathname]);

  useEffect(() => {
    if (prevSlug.current === slug) {
      return;
    }

    prevSlug.current = slug;

    setLoading(true);
    setGoto404(false);
    setArticle(null);

    async function loadArticle() {
      try {
        const res = await api.get(
          `/artikels?filters[slug][$eq]=${slug}&populate=*`
        );

        if (res.data?.data?.length) {
          setArticle(res.data.data[0]);
        } else {
          setGoto404(true);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500)
      }
    }

    loadArticle();
  }, [slug]);

  console.log('article', article);

  if (goto404) {
    return <Navigate to="/404" replace/>;
  }

  return (
    <div className="article">
      <Loader loading={loading}/>

      {!loading && article?.id && (<>
        <h1>{article?.title ?? ""}</h1>
        <BlocksRenderer content={article?.content}/>
      </>)}
    </div>
  );
}
