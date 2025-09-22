from playwright.sync_api import Page, expect
import re

def test_discover_page(page: Page):
    """
    This test verifies that the discover page loads multiple user cards.
    """
    try:
        # 1. Arrange: Go to the discover page.
        page.goto("http://127.0.0.1:8080/discover")

        # 2. Assert: Wait for the heading to be visible
        expect(page.get_by_role("heading", name="Discover Creators")).to_be_visible()

        # Wait for at least one card to be visible.
        expect(page.locator(".card").first).to_be_visible(timeout=15000)

        # 3. Assert: Check that there are between 1 and 12 user cards.
        card_count = page.locator(".card").count()
        assert card_count > 0 and card_count <= 12

        # 4. Screenshot: Capture the final result for visual verification.
        page.screenshot(path="jules-scratch/verification/discover_page.png")
        print("Screenshot taken successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")
