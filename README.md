# HOUSE603 website

Source and CI/CD pipeline for **https://house603.com** (a static-first HTML, CSS, and JavaScript site with embedded fonts and brand assets).

The live domain is hosted on **Hostinger**. This repository is the single source of truth for the codebase, and a GitHub Actions workflow deploys every push on `main` directly to Hostinger over FTPS.

## Structure

```text
index.html                    Home
about.html                    About
services.html                 Services (Digital Transformation, Project Management, Security & vCISO)
contact.html                  Contact (Web3Forms + WhatsApp)
articles/index.html           Articles landing page + Infrastructure Cost Estimator
privacy/index.html            Privacy Policy (AdSense, GDPR/CCPA, affiliate disclosures)
technuggets/<slug>/index.html Individual long-form engineering and security articles
brand-logos/                  Client and partner logos
styles.css                    Core site styles + embedded fonts and client logos
article.css                   Long-form article, estimator, and partner-card styles
article-page.js               Shared interactive behaviour and consent-gated AdSense loader
logo.png, favicon.*, apple-touch-icon.png, og-image.png
robots.txt, sitemap.xml, llms.txt, ads.txt
google2fe4e4181c40c847.html   Google Search Console verification
.htaccess                     Security headers, caching, and 301 redirects (Hostinger/LiteSpeed)
.github/workflows/deploy.yml  CI/CD: automated FTPS deploy to Hostinger
```

## CI/CD setup: Hostinger FTP deploy secrets

The workflow in `.github/workflows/deploy.yml` uses three encrypted GitHub repository secrets:

1. In Hostinger hPanel, go to **Files -> FTP Accounts** and note the **FTP host**, **username**, and **password**.
2. In this repository, go to **Settings -> Secrets and variables -> Actions -> New repository secret** and add:
   - `FTP_SERVER` (for example `145.223.89.90` or `ftp.house603.com`)
   - `FTP_USERNAME`
   - `FTP_PASSWORD`

Every push to `main` triggers the **Deploy to Hostinger** workflow automatically. You can also run it manually from **Actions -> Deploy to Hostinger -> Run workflow**.
