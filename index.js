const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create a simple endpoint for scraping
app.get('/scrape', async (req, res) => {
	const url = req.query.url;

	if (!url) {
		return res.status(400).json({ error: 'URL parameter is required' });
	}

	let browser;
	try {
		browser = await puppeteer.launch({
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--single-process',
			],
			headless: 'new'
		});

		const page = await browser.newPage();

		await page.goto(url, {
			waitUntil: 'networkidle0',
			timeout: 30000
		});

		const content = await page.content();

		res.json({ content });
	} catch (error) {
		console.error('Scraping error:', error);
		res.status(500).json({ error: error.message });
	} finally {
		if (browser) {
			await browser.close();
		}
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});