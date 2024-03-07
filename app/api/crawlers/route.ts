// Import statements remain the same
import { NextApiRequest, NextApiResponse } from "next";
import GPTCrawlerCore from "/Users/zi/nextjs-typescript-starter/gpt-crawler/src/core";
import { Config } from "/Users/zi/nextjs-typescript-starter/gpt-crawler/src/config";
// Inside your API route file for handling crawler configuration
// Default configuration

// Default configuration
const defaultConfig: Config = {
    url: "",
    match: "",
    maxPagesToCrawl: 5,
    outputFileName: "output1.json",
    maxTokens: 2000000,
    // Add other default values as necessary
  };
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const userConfig: Config = req.body;
      const config: Config = { ...defaultConfig, ...userConfig };
  
      try {
        const crawler = new GPTCrawlerCore(config);
        await crawler.crawl();
        const outputFilePath = await crawler.write();
        res.status(200).json({ message: 'Crawling completed successfully', outputFilePath });
      } catch (error) {
        console.error('Crawling error:', error);
        res.status(500).json({ message: 'Error occurred during crawling', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }