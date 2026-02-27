CI-first deployment and dev process

- Owner preference: CI-driven builds and deployments, with Actions building the site and publishing to GitHub Pages. This supports test-driven and behavior-driven workflows (run tests, linters, headless browser checks before deployment).
- Plan: use the GH Actions workflow in .github/workflows/gh-pages.yml to build (npm ci && npm run build) and publish dist/ to gh-pages via peaceiris/actions-gh-pages.

Story capture:
- While inspecting the project, ensure the narrative present in story.txt and story.docx is preserved and referenced in the docs. The game is story-first: treat story.txt as the canonical narrative source for chapter text and asset mapping.
