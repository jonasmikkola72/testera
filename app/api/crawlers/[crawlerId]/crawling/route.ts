
import { NextApiRequest, NextApiResponse } from "next";
import GPTCrawlerCore from "/Users/zi/nextjs-typescript-starter/gpt-crawler/src/core"; // Adjust the import path as necessary
import { Config, configSchema } from "/Users/zi/nextjs-typescript-starter/gpt-crawler/src/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const config: Config = req.body;
        try {
            const crawler = new GPTCrawlerCore(config);
            await crawler.crawl();
            const outputFilePath = await crawler.write();
            res.status(200).json({ message: 'Crawling completed successfully', outputFilePath });
        } catch (error) {
            console.error('Crawling error:', error);
            res.status(500).json({ message: 'Error occurred during crawling', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}