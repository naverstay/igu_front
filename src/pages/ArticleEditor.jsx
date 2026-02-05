import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import TipTapEditor from "../components/Editor";
import Loader from "../components/Loader";
import {api, DEV_MODE} from "../api";

export default function EditorPage() {
  const navigate = useNavigate();
  const {id} = useParams();

  const [fetchArtikles, setFetchArtikles] = useState(0);
  const [articles, setArticles] = useState([]);
  const [articleId, setArticleId] = useState(id || null);
  const [loading, setLoading] = useState(true);
  const [articleStatus, setArticleStatus] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/artikels?populate=*");
        setArticles(res.data.data);

        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки статей", err);
      }
    }

    load();
  }, [fetchArtikles]);

  useEffect(() => {
    if (articleStatus) {
      setTimeout(() => {
        setArticleStatus("")
      }, 2000)
    }
  }, [articleStatus]);

  useEffect(() => {
    async function load() {
      if (articleId) {
        try {
          const res = await api.get(`/artikels?filters[documentId][$eq]=${articleId}&populate=*`);
          const data = res.data?.data?.[0];

          if (data) {
            setTitle(data?.title || "");
            setContent(data?.textHTML || "");
          } else {
            navigate("/editor", {replace: true});
          }
        } catch (err) {
          console.error("Article load error", err);
        } finally {
          setLoading(false);
        }
      }
    }

    load();
  }, [articleId]);

  const saveArticle = async () => {
    if (articleId) {
      try {
        await api.put(`/artikels/${articleId}`, {
          data: {
            title,
            textHTML: content
          }
        });

        setArticleStatus("Article saved")
      } catch (err) {
        setArticleStatus("Article save error")

        console.error("Article save error", err);
      }
    } else {
      try {
        const res = await api.post("/artikels", {
          data: {
            title,
            textHTML: content
          }
        });

        const newId = res.data.data.documentId;
        setArticleId(newId);

        navigate(`/editor/${newId}`, {replace: true});

        setLoading(false);
        setFetchArtikles(fetchArtikles + 1);
        setArticleStatus("Article created")
      } catch (err) {
        setArticleStatus("Article create error")

        console.error("Article create error", err);
      }
    }
  };

  const copyArticle = async (txt) => {
    await navigator.clipboard.writeText(txt).then(() => {
      setArticleStatus("Article's HTML is in clipboard");
    });
  };

  return <div className="container">
    <div className="article">
      <Loader loading={loading}/>
      <h1>Artikels</h1>

      <div className="article-list">
        {articles.map((article, ai) => (
          <div key={article.id} style={{padding: "10px 0", borderBottom: "1px solid #ccc", cursor: "pointer"}}
               onClick={() => {
                 setArticleId(article.documentId);
                 return navigate(`/editor/${article.documentId}`)
               }}
          >
            {ai + 1}. <strong>{article?.title}</strong> — ID: {article.documentId}
          </div>
        ))}
      </div>

      <input
        id="article-title"
        className="article-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <TipTapEditor value={content} onSave={saveArticle} onCopy={copyArticle} onChange={setContent}/>

      <div className="article-controls">
        <button className="article-button" onClick={() => copyArticle(content)}>Copy HTML</button>
        {DEV_MODE ? <button className="article-button" onClick={saveArticle}>Save</button> : null}
        <div className="article-status">
          {articleStatus}
        </div>
      </div>
    </div>
  </div>;
}
