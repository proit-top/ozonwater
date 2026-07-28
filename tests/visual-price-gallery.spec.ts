import { test, expect } from "@playwright/test";
import path from "node:path";

test.describe("price and photo gallery", () => {
  test("shows price above specs and photo gallery under reviews", async ({
    page,
  }) => {
    await page.goto("/");

    const price = page.locator("#product-price");
    await expect(price).toBeVisible();
    await expect(price).toContainText("700");
    await expect(price).toContainText("000");
    await expect(price).toContainText("₸");

    const specsHeading = page.getByRole("heading", {
      name: "Характеристики системы",
    });
    await expect(specsHeading).toBeVisible();

    const priceBox = await price.boundingBox();
    const specsBox = await specsHeading.boundingBox();
    expect(priceBox).toBeTruthy();
    expect(specsBox).toBeTruthy();
    expect(priceBox!.y).toBeLessThan(specsBox!.y);

    const gallery = page.locator("#gallery");
    await expect(gallery).toBeVisible();
    const imgs = gallery.locator("img");
    await expect(imgs).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await expect(imgs.nth(i)).toHaveAttribute(
        "src",
        new RegExp(`/photo/${i + 1}\\.jpeg`),
      );
    }

    const reviews = page.locator("#reviews");
    const reviewsBox = await reviews.boundingBox();
    const galleryBox = await gallery.boundingBox();
    expect(reviewsBox).toBeTruthy();
    expect(galleryBox).toBeTruthy();
    expect(galleryBox!.y).toBeGreaterThan(reviewsBox!.y);

    const outDir = path.join("tests", "screenshots");
    await page.screenshot({
      path: path.join(outDir, "home-price-gallery.png"),
      fullPage: true,
    });
  });
});
