import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_SEO = {
  title: 'Huân Portfolio - Full Stack Developer & Modern Web Specialist',
  description: 'Portfolio của Huân - Full Stack Developer chuyên về React, Node.js, và modern web development. Khám phá các dự án sáng tạo với React và TypeScript.',
  image: 'https://huan-portfolio.vercel.app/og-image.jpg',
  url: 'https://huan-portfolio.vercel.app/',
  type: 'website' as const
};

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  image = DEFAULT_SEO.image,
  url = DEFAULT_SEO.url,
  type = DEFAULT_SEO.type,
  publishedTime,
  modifiedTime
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://huan-portfolio.vercel.app/#person',
        name: 'Huân',
        jobTitle: 'Full Stack Developer',
        description: 'Full Stack Developer chuyên về React, Node.js, và 3D web experiences',
        url: 'https://huan-portfolio.vercel.app/',
        image: {
          '@type': 'ImageObject',
          url: image,
          width: 1200,
          height: 630
        },
        sameAs: [
          'https://github.com/huan-dev',
          'https://linkedin.com/in/huan-dev',
          'https://twitter.com/huan_dev'
        ],
        knowsAbout: [
          'React',
          'Node.js',
          'TypeScript',
          'Modern Web Development',
      'Responsive Design',
          'Full Stack Development',
      'Web Development',
          'Frontend Development',
          'Backend Development'
        ],
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'University of Technology'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://huan-portfolio.vercel.app/#website',
        url: 'https://huan-portfolio.vercel.app/',
        name: 'Huân Portfolio',
        description: description,
        publisher: {
          '@id': 'https://huan-portfolio.vercel.app/#person'
        },
        inLanguage: 'vi-VN',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://huan-portfolio.vercel.app/?s={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url: url,
        name: title,
        description: description,
        isPartOf: {
          '@id': 'https://huan-portfolio.vercel.app/#website'
        },
        about: {
          '@id': 'https://huan-portfolio.vercel.app/#person'
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: image,
          width: 1200,
          height: 630
        },
        datePublished: publishedTime || '2024-01-01T00:00:00+00:00',
        dateModified: modifiedTime || new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://huan-portfolio.vercel.app/'
            }
          ]
        }
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

export default SEO;