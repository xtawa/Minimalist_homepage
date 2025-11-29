import { Client } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    console.error("Missing Notion Environment Variables");
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
      const props = page.properties;
      
      // Try to find the Key property (Title type). 
      // User's screenshot shows the column name is "Title".
      // We check for "Title", "Key", or "Name".
      const keyProperty = props.Title || props.Key || props.Name;
      
      // Try to find the Value property (Rich Text type).
      const valueProperty = props.Value;

      if (keyProperty && valueProperty) {
        // Extract text from the Title property
        const key = keyProperty.title?.[0]?.plain_text;
        
        // Extract text from the Rich Text property
        const value = valueProperty.rich_text?.map((t: any) => t.plain_text).join('');
        
        if (key && value) {
          data[key] = value;
        }
      }
    });

    console.log("Fetched Notion Data Keys:", Object.keys(data));

    // Set Cache-Control to cache response for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Notion API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Notion', details: error.message });
  }
}