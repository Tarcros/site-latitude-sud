#!/usr/bin/env node

const { chromium } = require('playwright');

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:4253';
const chromePath = process.env.QA_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const publicRoutes = [
  '/',
  '/pages/agence.html',
  '/pages/realisations.html',
  '/pages/photos.html',
  '/pages/charte-graphique.html',
  '/pages/social.html',
  '/pages/catalogue.html',
  '/pages/contact.html',
  '/pages/mentions-legales.html',
  '/pages/politique-de-confidentialite.html',
  '/pages/latitude-sud-news.html',
];
const projectRoutes = [
  '/pages/photos.html',
  '/pages/social.html',
  '/pages/catalogue.html',
];
const identityProjects = [
  { trigger: '[data-cist-project]', title: 'CIST 971', modal: '.cist-case-modal.open', dialog: '.cist-case-dialog' },
  { trigger: '[data-bonnes-epices-project]', title: 'Les Bonnes Épices', modal: '.bonnes-case-modal.open', dialog: '.bonnes-case-dialog' },
  { trigger: '[data-marina-project]', title: 'Marina Bas-du-Fort', modal: '.marina-case-modal.open', dialog: '.marina-case-dialog' },
  { trigger: '[data-smgeag-project]', title: 'SMGEAG', modal: '.smgeag-case-modal.open', dialog: '.smgeag-case-dialog' },
  { trigger: '[data-pressing-project]', title: 'Le Pressing', modal: '.pressing-case-modal.open', dialog: '.pressing-case-dialog' },
];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const run = async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const failures = [];

  const auditImages = async (page, scope, route, viewport) => {
    const brokenImages = await page.locator(`${scope} img`).evaluateAll((images) => images
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src || image.alt || 'image sans source'));
    brokenImages.forEach((source) => failures.push(`${viewport} ${route}: image cassée ${source}`));
  };

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

  page.on('requestfailed', (request) => {
    if (request.url().startsWith(baseUrl)) {
      failures.push(`${viewport.name}: requête échouée ${request.url()}`);
    }
  });
  page.on('response', (response) => {
    if (response.url().startsWith(baseUrl) && response.status() >= 400) {
      failures.push(`${viewport.name}: HTTP ${response.status()} ${response.url()}`);
    }
  });

  for (const route of publicRoutes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      window.scrollTo(0, 0);
    });
    await auditImages(page, 'body', route, viewport.name);
  }

  for (const route of projectRoutes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
    const projectCount = await page.locator('[data-project]').count();

    for (let index = 0; index < projectCount; index += 1) {
      const trigger = page.locator('[data-project]').nth(index);
      const title = await trigger.getAttribute('data-project-title') || `projet ${index + 1}`;
      await trigger.click();
      await page.locator('.ls-modal.open').waitFor({ state: 'visible' });
      await page.locator('.ls-modal-viewport').evaluate(async (viewportElement) => {
        for (let y = 0; y < viewportElement.scrollHeight; y += 700) {
          viewportElement.scrollTop = y;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        viewportElement.scrollTop = 0;
      });
      await page.waitForTimeout(150);
      await auditImages(page, '.ls-modal.open', `${route} — ${title}`, viewport.name);
      await page.locator('.ls-modal.open > .ls-modal-dialog > .ls-modal-close[data-close]').click();
      await page.locator('.ls-modal.open').waitFor({ state: 'detached' });
    }

    console.log(`${viewport.name}: ${route} — ${projectCount} pop-up(s) validée(s)`);
  }

    const identityRoute = '/pages/charte-graphique.html';
    await page.goto(`${baseUrl}${identityRoute}`, { waitUntil: 'domcontentloaded' });
    for (const project of identityProjects) {
      await page.locator(project.trigger).click();
      await page.locator(project.modal).waitFor({ state: 'visible' });
      await page.locator(`${project.modal} ${project.dialog}`).evaluate(async (dialogElement) => {
        for (let y = 0; y < dialogElement.scrollHeight; y += 700) {
          dialogElement.scrollTop = y;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        dialogElement.scrollTop = 0;
      });
      await page.waitForTimeout(150);
      await auditImages(page, project.modal, `${identityRoute} — ${project.title}`, viewport.name);
      await page.keyboard.press('Escape');
      await page.locator(project.modal).waitFor({ state: 'detached' });
    }
    console.log(`${viewport.name}: ${identityRoute} — ${identityProjects.length} pop-up(s) validée(s)`);

    await context.close();
  }

  await browser.close();

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('QA navigateur terminée sans image locale cassée ni réponse HTTP en erreur.');
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
