import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the login page by navigating to the '/login' route to access the sign-in form.
        await page.goto("http://localhost:3000/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the login page at http://127.0.0.1:3000/login and verify the sign-in form appears.
        # Open URL in new tab
        page = await context.new_page()
        await page.goto("http://127.0.0.1:3000/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Return to Home' link to navigate back to the application's home page and look for a login or jobs link.
        # Return to Home link
        elem = page.get_by_role('link', name='Return to Home', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Sign In' button to open the login form.
        # Sign In button
        elem = page.get_by_role('button', name='Sign In', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill 'writer@gmail.com' into the Email field and 'Writer@123' into the Password field, then click the 'Sign In' button.
        # Enter your email email field
        elem = page.get_by_label('Email', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("writer@gmail.com")
        
        # -> Fill 'writer@gmail.com' into the Email field and 'Writer@123' into the Password field, then click the 'Sign In' button.
        # Enter your password password field
        elem = page.get_by_placeholder('Enter your password', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Writer@123")
        
        # -> Fill 'writer@gmail.com' into the Email field and 'Writer@123' into the Password field, then click the 'Sign In' button.
        # Sign In button
        elem = page.get_by_role('button', name='Sign In', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Jobs' button in the left sidebar to open the jobs board.
        # Jobs button
        elem = page.get_by_role('button', name='Jobs', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Post Job' dialog by clicking the 'Post Job' button.
        # Post Job button
        elem = page.get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the Job Title with 'Production Coordinator', Company Name with 'Northlight Films', and Location with 'New York'.
        # e.g. Senior Director text field
        elem = page.get_by_label('Job Title', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Production Coordinator")
        
        # -> Fill the Job Title with 'Production Coordinator', Company Name with 'Northlight Films', and Location with 'New York'.
        # e.g. Netflix Studios text field
        elem = page.get_by_label('Company Name', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Northlight Films")
        
        # -> Fill the Job Title with 'Production Coordinator', Company Name with 'Northlight Films', and Location with 'New York'.
        # e.g. Mumbai, Maharashtra text field
        elem = page.get_by_label('Location', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("New York")
        
        # -> Open the 'Job Type' dropdown labeled 'Select type' so options become visible.
        # Select type button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div/button')
        await elem.click(timeout=10000)
        
        # -> Select the 'Full-time' option from the Job Type dropdown.
        # Full-time option
        elem = page.get_by_role('option', name='Full-time', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Select level' Experience Level dropdown so its options become visible.
        # Select level button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Select 'Mid Level' from the Experience Level dropdown.
        # Mid Level option
        elem = page.get_by_role('option', name='Mid Level', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Category' dropdown labeled 'Select category' so industry options become visible.
        # Select category button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div[3]/button')
        await elem.click(timeout=10000)
        
        # -> Select 'Production Manager' from the Category dropdown.
        # Production Manager option
        elem = page.get_by_role('option', name='Production Manager', exact=True)
        await elem.click(timeout=10000)
        
        # -> Select 'Production Manager' from the Category dropdown.
        # Describe the role, responsibilities, and... text area
        elem = page.get_by_label('Job Description', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Coordinate schedules, call sheets, and crew communication.")
        
        # -> Select 'Production Manager' from the Category dropdown.
        # Post Job button
        elem = page.get_by_text('Cancel', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Created job 'Production Coordinator' is visible in the Jobs list.
        # Assert-outcome: passed
        # Assert: Job title equals 'Production Coordinator' on the jobs list.
        await expect(page.locator("xpath=/html/body/div[1]/div[2]/div[2]/main/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/h3").nth(0)).to_have_text("Production Coordinator", timeout=15000), "Job title equals 'Production Coordinator' on the jobs list."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    