import fs from 'fs';
import path from 'path';
import {SitemapStream, streamToPromise} from "sitemap";
import dotenv from "dotenv";

dotenv.config();

const API = process.env.VITE_API_URL + "/api";
const HOST = process.env.VITE_HOST_URL;
const TOKEN = process.env.VITE_STRAPI_TOKEN;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

async function fetchCollection(name) {
  const res = await fetch(`${API}/${name}?populate=*`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  const json = await res.json();

  return json.data;
}

async function run() {
  console.log("Generating sitemap...", HOST, API);

  if (!HOST.startsWith("http")) {
    console.log("Host must start with http:// or https://");
  } else {
    const sitemap = new SitemapStream({hostname: HOST});

    sitemap.write({url: "/", priority: 1.0});

    const writeSiteMap = (arr = []) => {
      arr?.forEach(a => {
        try {
          const url = a?.slug ?? a?.url ?? "";

          if (url && url !== 'home') {
            sitemap.write({
              url: `/${url}`,
              changefreq: "weekly",
              priority: 0.8
            });
          }
        } catch (err) {
          console.error("Error sitemap:", a, err);
        }
      });
    }

    const artikels = await fetchCollection("artikels");

    writeSiteMap(artikels);

    const nav = await fetchCollection("navigation-items");

    writeSiteMap(nav);

    sitemap.end();

    const xml = await streamToPromise(sitemap);

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml.toString());

    console.log("Sitemap generated.");
  }
}

run();
