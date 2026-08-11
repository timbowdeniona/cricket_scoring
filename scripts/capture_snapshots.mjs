import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = process.env.SNAPSHOT_DIR || path.join(process.cwd(), 'snapshots_latest');
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`[Snapshots] Launching browser to capture ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop Viewport (1920x1080)
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    const desktopPage = await desktopContext.newPage();
    console.log(`[Snapshots] Navigating desktop to ${BASE_URL}`);
    const resDesktop = await desktopPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`[Snapshots] Desktop response status: ${resDesktop?.status()}`);
    await desktopPage.waitForTimeout(3000);
    await desktopPage.evaluate(() => document.fonts.ready);

    await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_home.png'), fullPage: true });

    // Navigate directly to tabs via ?tab= parameter
    const tabUrls = [
      { name: 'player_stats', param: 'stats' },
      { name: 'club_history', param: 'history' },
      { name: 'live_scoring', param: 'scoring' },
    ];

    for (const tab of tabUrls) {
      console.log(`[Snapshots] Navigating desktop to ${BASE_URL}?tab=${tab.param}`);
      await desktopPage.goto(`${BASE_URL}?tab=${tab.param}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await desktopPage.waitForTimeout(1500);
      await desktopPage.evaluate(() => document.fonts.ready);
      await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, `desktop_tab_${tab.name}.png`), fullPage: true });
    }

    await desktopContext.close();

    // 2. Mobile Viewport (375x812 - iPhone 13)
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    });
    const mobilePage = await mobileContext.newPage();
    console.log(`[Snapshots] Navigating mobile to ${BASE_URL}`);
    const resMobile = await mobilePage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`[Snapshots] Mobile response status: ${resMobile?.status()}`);
    await mobilePage.waitForTimeout(3000);
    await mobilePage.evaluate(() => document.fonts.ready);

    await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_home.png'), fullPage: true });

    for (const tab of tabUrls) {
      console.log(`[Snapshots] Navigating mobile to ${BASE_URL}?tab=${tab.param}`);
      await mobilePage.goto(`${BASE_URL}?tab=${tab.param}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await mobilePage.waitForTimeout(1500);
      await mobilePage.evaluate(() => document.fonts.ready);
      await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, `mobile_tab_${tab.name}.png`), fullPage: true });
    }

    await mobileContext.close();
    console.log(`[Snapshots] Successfully saved screenshots to ${OUTPUT_DIR}`);
  } catch (err) {
    console.error(`[Snapshots] Error capturing snapshots:`, err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

capture();
