import { Client } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  // Disable caching completely to ensure immediate updates from Notion
  res.setHeader('Cache-Control', 'no-store, max-age=0');

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
      const propKeys = Object.keys(props);

      // Intelligent Column Detection (Case-insensitive)
      // 1. Find the Key column (usually type 'title', names: Title, Key, Name)
      const keyColName = propKeys.find(k => /^(title|key|name)$/i.test(k));
      // 2. Find the Value column (usually type 'rich_text', names: Value, Text, Content)
      const valColName = propKeys.find(k => /^(value|text|content)$/i.test(k));

      if (!keyColName || !valColName) return;

      const keyProp = props[keyColName];
      const valProp = props[valColName];

      // Extract Key String
      let key = '';
      if (keyProp.type === 'title') {
        key = keyProp.title?.[0]?.plain_text;
      } else if (keyProp.type === 'rich_text') {
        key = keyProp.rich_text?.map((t: any) => t.plain_text).join('');
      }

      // Extract Value String (Support multiple Notion property types)
      let value = '';
      switch (valProp.type) {
        case 'rich_text':
          value = valProp.rich_text?.map((t: any) => t.plain_text).join('');
          break;
        case 'url':
          value = valProp.url || '';
          break;
        case 'email':
          value = valProp.email || '';
          break;
        case 'phone_number':
          value = valProp.phone_number || '';
          break;
        case 'number':
          value = String(valProp.number || '');
          break;
        case 'title':
             value = valProp.title?.map((t: any) => t.plain_text).join('');
             break;
      }

      if (key && value) {
        data[key] = value;
      }
    });

    console.log("Fetched Notion Data Keys:", Object.keys(data));
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Notion API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Notion', details: error.message });
  }
}