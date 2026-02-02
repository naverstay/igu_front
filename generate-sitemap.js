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
  const sitemap = new SitemapStream({hostname: HOST});

  sitemap.write({url: "/", priority: 1.0});

  const artikels = await fetchCollection("artikels");

  artikels?.forEach(a => {
    sitemap.write({
      url: `/artikel/${a.slug}`,
      changefreq: "weekly",
      priority: 0.8
    });
  });

  const nav = await fetchCollection("navigation-items");

  nav?.forEach(n => {
    sitemap.write({
      url: `/${n.url}`,
      changefreq: "weekly",
      priority: 0.7
    });
  });

  sitemap.end();

  const xml = await streamToPromise(sitemap);
  fs.writeFileSync("./public/sitemap.xml", xml.toString());

  console.log("Sitemap generated.");
}

run();
