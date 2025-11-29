# Minimalist Personal Home / 

A minimalist personal homepage inspired by [antfu.me](https://antfu.me). It features a clean dark mode design, a dynamic "Mac-style" blog window, and a scrolling photo wall. Content is managed dynamically via Notion.


## Before you start
Clone a template from my Notion:[Clone](https://lyxyy.notion.site/homepage-template?source=copy_link)
---

## ⚙️ Notion Configuration 

To make the dynamic content work, you need to set up a Notion Database and connect it to this project.


### 1. Create a Notion Integration 
1. Go to [My Integrations](https://www.notion.so/my-integrations) and create a new integration
2. Configure integration permissions for **the Notion template** you just copied
3. Copy the **Internal Integration Secret** (starts with `secret_...`). 

### 2. Connect Database
1. Open your new Database page. 
2. Click the `...` (three dots) at the top right corner.
3. Select **Connect to** (or "Add connections") and choose the Integration you created in Step 1. 
4. Copy the **Database ID** from the URL. 
   - URL format: `https://www.notion.so/myworkspace/{DATABASE_ID}?v=...`
   - It is the 32-character string before the `?`.

---

## 🚀 Environment Variables

When deploying to Vercel or Netlify, add the following Environment Variables in the project settings:

- `NOTION_TOKEN`: Your Integration Secret (from Step 1) 
- `NOTION_DATABASE_ID`: Your Database ID (from Step 2) 

---

## 💻 Local Development 

This project uses **Vite** for fast development and building.

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory: 
   ```env
   NOTION_TOKEN=secret_your_token_here
   NOTION_DATABASE_ID=your_database_id_here
   ```
4. Start the dev server: 
   ```bash
   npm run dev
   ```
5. Build for production: 
   ```bash
   npm run build
   ```
