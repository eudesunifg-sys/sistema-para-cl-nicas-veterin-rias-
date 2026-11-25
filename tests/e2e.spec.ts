import { test, expect } from '@playwright/test';

test.describe('PetSOS Application', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/PetSOS/);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveTitle(/PetSOS/);
  });

  test('cadastro page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/cadastro');
    await expect(page).toHaveTitle(/PetSOS/);
  });

  test('animais-perdidos page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/animais-perdidos');
    await expect(page).toHaveTitle(/PetSOS/);
  });
});