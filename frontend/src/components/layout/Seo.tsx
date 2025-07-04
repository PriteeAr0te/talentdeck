import Head from "next/head";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function Seo({
  title = "TalentDeck – Discover & Showcase Real Talent",
  description = "Build stunning profiles. Explore real creators. Discover top talent without logins.",
  image = "/og-image.png",
  url = "https://talentdeck-next.netlify.app",
}: SeoProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content="talentdeck, portfolio, react developer, designers, job-ready profiles, developers in India" />
      <meta name="author" content="Pritee Arote" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@yourtwitter" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
