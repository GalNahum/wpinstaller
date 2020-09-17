'use strict';
const puppeteer = require('puppeteer');

;( async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            //'--netifs-to-ignore=INTERFACE_TO_IGNORE',
            //'--proxy-server=199.16.131.208',
            '--proxy-server=171.97.131.180:8080',
            '--no-sandbox',
            '--enable-speech-dispatcher'
        ],
        // ignoreDefaultArgs: ['--mute-audio'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.whatismyip.com/', {waitUntil: 'load'});
})();