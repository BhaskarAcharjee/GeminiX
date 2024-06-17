const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;
const baseUrl = 'https://article-extractor-and-summarizer.p.rapidapi.com/';

export const fetchSummary = async (articleUrl) => {
  const encodedUrl = encodeURIComponent(articleUrl);
  const response = await fetch(`${baseUrl}summarize?url=${encodedUrl}&length=3`, {
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch summary');
  }

  const data = await response.json();
  return data.summary;
};

