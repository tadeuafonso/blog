import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  imageUrl?: string;
  url?: string;
  schemaMarkup?: object;
}

export const SEO = ({ title, description, name = "Qual", type = "website", imageUrl, url, schemaMarkup }: SEOProps) => {
  const siteUrl = "https://tdmvaiufwxojvnojakvy.supabase.co";
  const fullUrl = `${siteUrl}${url || ''}`;
  const fullImageUrl = imageUrl || `${siteUrl}/logo.png`;
  const fullTitle = `${title} | ${name}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Structured Data */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};