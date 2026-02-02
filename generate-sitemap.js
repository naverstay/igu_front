import fs from "fs";
import {SitemapStream, streamToPromise} from "sitemap";
import dotenv from "dotenv";

dotenv.config();

const API = process.env.VITE_API_URL + "/api";
const HOST = process.env.VITE_HOST_URL;
const TOKEN = process.env.VITE_STRAPI_TOKEN;

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

          if (url) {
            sitemap.write({
              url: `/${url}`,
              changefreq: "weekly",
              priority: 0.8
            });
          }
        } catch (err) {
          console.error("Error sitemap:", a, err.message);
        }
      });
    }

    const artikels = await fetchCollection("artikels");

    console.log('artikels', artikels);

    writeSiteMap(artikels);

    const nav = await fetchCollection("navigation-items");

    console.log('nav', nav);

    writeSiteMap(nav);

    sitemap.end();

    const xml = await streamToPromise(sitemap);
    fs.writeFileSync("./public/sitemap.xml", xml.toString());

    console.log("Sitemap generated.");
  }
}

run();
