# Campus Slice CI/CD Demo

**Learning objective.** Trace how automated test results determine whether a change reaches a live website.

Campus Slice is a pizza ordering demo with a menu, customizable toppings, a cart, pickup or delivery, and the promo code `PIZZA10`. The cart lives in memory and resets when the page reloads. There is no checkout or backend.

## Run locally

Use Node.js 24 to match the workflow. No npm dependencies need to be installed.

```sh
npm test
python3 -m http.server 8000 --directory site
```

Visit <http://localhost:8000>. Add a Margherita with black olives and a plain Pepperoni. Choose delivery and apply `PIZZA10`. The total should be $21.05.

## Set up GitHub

1. Create an empty public GitHub repository. Unzip the project and enter the `pizza-ci-cd` directory. Keep the hidden `.github` directory with the project.
2. Run the commands below with your repository URL. If you already have a repository from the earlier demo, copy these files into your existing checkout and push a normal commit or PR.
3. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. If the first push ran before Pages was enabled, rerun it from **Actions**.

```sh
git init -b main
git add .
git commit -m "Add Campus Slice and CI/CD workflow"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

[GitHub Docs — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Test coverage

| File | What it checks |
| --- | --- |
| `test/pricing.test.js` | Base prices and per-topping charges |
| `test/totals.test.js` | Quantities, empty orders, delivery fees, promo codes, and rounding |
| `test/cart.test.js` | Adding and removing items, matching customizations, and how cart operations feed into pricing |

The last cart test is an integration test. It exercises the cart and pricing modules together. The automated suite runs in Node.js. Use the browser walkthrough above to check the UI.


