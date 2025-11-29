import { Client } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return res.status(500).json({ 
      error: 'Misconfigured server environment. Missing Notion secrets.' 
    });
  }

  const notion = new Client({ auth: notionToken });

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const data: Record<string, string> = {};

    response.results.forEach((page: any) => {
      // Assumes a Notion DB with columns: "Key" (Title) and "Value" (Rich Text)
      const keyProperty = page.properties.Key;
      const valueProperty = page.properties.Value;

      if (keyProperty && valueProperty) {
        const key = keyProperty.title?.[0]?.plain_text;
        // Join all text fragments to form the full value
        const value = valueProperty.rich_text?.map((t: any) => t.plain_text).join('');
        
        if (key && value) {
          data[key] = value;
        }
      }
    });

    // Set Cache-Control to cache response for 60 seconds to avoid hitting Notion rate limits
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Notion API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Notion', details: error.message });
  }
}