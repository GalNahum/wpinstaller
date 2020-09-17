'use strict';

const path = require('path');
const puppeteer = require('puppeteer');
const url = require('url');
const merge = require('deepmerge');
const finder = require('find-package-json');
const urljoin = require('url-join');
const deploy = require('./deploy');
const Client = require('./Client');
const { download_file, extract_zip } = require('./utils');

const cwd = process.cwd();
const package_json_finder = finder();

/**
 * TODO:
 * a. enable for empty site name (e.g goto http://localhost:8080)
 * b. handle puppeteer WP db already installed
 */

async function installer( answers, options = {} ) {

    const defaults = {
        headless: true,
        wp_zip_url: 'https://wordpress.org/latest.zip'
    };

    options = Object.assign(defaults, options);

    if( 'wpinstaller' in package_json_finder ) {
        options = Object.assign(options, package_json_finder['wpinstaller']);
    }

    options['root_path'] = options['root_path'] || cwd;

    const { root_path, headless, wp_zip_url } = options;

    const {
        dbname,
        uname,
        pwd,
        port,
        weblog_title,
        user_name,
        admin_password,
        admin_email
    } = answers;

    const { base }  = path.parse( wp_zip_url );
    const file_path = path.join( root_path, base );

    console.info('Download...');
    await download_file( wp_zip_url, file_path );

    console.info('Extract zip');
    await extract_zip( file_path, root_path );

    console.info('Deploy files');
    await deploy( root_path );

    console.info('Starting installation...');

    const site = {};
    site.name = path.parse( root_path ).name;
    site.url = url.resolve(`http://localhost${ ( port.trim() ? `:${port}` : '' ) }`, site.name);
    site.admin_url = urljoin(site.url, 'wp-admin');

    const browser = await puppeteer.launch( {
        headless,
        slowMo: 10,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService',
        ]
    });

    const page = await browser.newPage();

    const client = new Client( page );
    client.click_default_button = async () => await client.click( '.button.button-large', true );

    await page.goto( site.url ,  {
        waitUntil: 'networkidle2',
        timeout: 3000000
    });

    await client.submit_form();

    await client.click( '.button[href="setup-config.php?step=1"]', true );

    await client.wait_for_submit();

    await client.typing( { dbname, uname, pwd } );

    await client.submit_form();

    await client.click_default_button();

    await client.wait_for_submit();

    await client.click('label[for="blog_public"]');

    await client.typing( { weblog_title, user_name, admin_password, admin_email } );

    await client.checked('[name="pw_weak"]');

    await client.submit_form();

    await client.click_default_button();

    await client.wait_for_submit();

    await browser.close();

    return {
        ...site,
        message: `Wordpress install successfully at ${site.url}`,
    };
}

module.exports = installer;