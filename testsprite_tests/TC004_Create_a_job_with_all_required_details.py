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
        
        # -> Open the Login page by navigating to the application's /login route so the sign-in form can be displayed.
        await page.goto("http://localhost:3000/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the application's login page and verify the sign-in form is visible.
        # Open URL in new tab
        page = await context.new_page()
        await page.goto("http://localhost:3000/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Switch to the other open login tab and check whether the sign-in form or other interactive elements are visible.
        # Switch to tab 9EB7
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Click the 'Return to Home' link to navigate to the application's home page and look for the login or job-posting entry points.
        # Return to Home link
        elem = page.get_by_role('link', name='Return to Home', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Sign In' button to open the login form or sign-in page.
        # Sign In button
        elem = page.get_by_role('button', name='Sign In', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Email' field with writer@gmail.com, fill the 'Password' field with Writer@123, then click the 'Sign In' button.
        # Enter your email email field
        elem = page.get_by_label('Email', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("writer@gmail.com")
        
        # -> Fill the 'Email' field with writer@gmail.com, fill the 'Password' field with Writer@123, then click the 'Sign In' button.
        # Enter your password password field
        elem = page.get_by_placeholder('Enter your password', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Writer@123")
        
        # -> Fill the 'Email' field with writer@gmail.com, fill the 'Password' field with Writer@123, then click the 'Sign In' button.
        # Sign In button
        elem = page.get_by_role('button', name='Sign In', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Jobs' button in the left sidebar to open the Jobs page.
        # Jobs button
        elem = page.get_by_role('button', name='Jobs', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Post Job' button to open the job posting dialog.
        # Post Job button
        elem = page.get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Job Title' field with 'Camera Assistant', the 'Company Name' field with 'Silver Frame Productions', and the 'Location' field with 'Atlanta'.
        # e.g. Senior Director text field
        elem = page.get_by_label('Job Title', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Camera Assistant")
        
        # -> Fill the 'Job Title' field with 'Camera Assistant', the 'Company Name' field with 'Silver Frame Productions', and the 'Location' field with 'Atlanta'.
        # e.g. Netflix Studios text field
        elem = page.get_by_label('Company Name', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Silver Frame Productions")
        
        # -> Fill the 'Job Title' field with 'Camera Assistant', the 'Company Name' field with 'Silver Frame Productions', and the 'Location' field with 'Atlanta'.
        # e.g. Mumbai, Maharashtra text field
        elem = page.get_by_label('Location', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Atlanta")
        
        # -> Open the Job Type dropdown by clicking the 'Select type' button so its options can be selected.
        # Select type button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div/button')
        await elem.click(timeout=10000)
        
        # -> Select the 'Full-time' option from the Job Type dropdown.
        # Full-time option
        elem = page.get_by_role('option', name='Full-time', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Experience Level' dropdown
        # Select level button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Select the 'Mid Level' option from the Experience Level dropdown.
        # Mid Level option
        elem = page.get_by_role('option', name='Mid Level', exact=True)
        await elem.click(timeout=10000)
        
        # -> Choose 'Entertainment' from the Category dropdown and fill the Job Description, then submit the form by clicking the 'Post Job' button.
        # Short Films Feature Films Web Series... dropdown
        elem = page.locator("xpath=/html/body/div[3]/form/div[3]/div[3]/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Choose 'Entertainment' from the Category dropdown and fill the Job Description, then submit the form by clicking the 'Post Job' button.
        # Describe the role, responsibilities, and... text area
        elem = page.get_by_label('Job Description', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Assist with camera setup, lens changes, and equipment organization on set.")
        
        # -> Choose 'Entertainment' from the Category dropdown and fill the Job Description, then submit the form by clicking the 'Post Job' button.
        # Post Job button
        elem = page.get_by_text('Cancel', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Category' dropdown (label: Select category) so a valid industry option can be chosen (e.g., Feature Films).
        # Select category button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div[3]/button')
        await elem.click(timeout=10000)
        
        # -> Select 'Feature Films' from the Category dropdown so a valid industry is chosen.
        # Feature Films option
        elem = page.get_by_role('option', name='Feature Films', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Post Job' button to submit the job posting form
        # Post Job button
        elem = page.get_by_text('Cancel', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The newly created job titled "Camera Assistant" is visible in the Jobs list.
        # Assert-outcome: passed
        # Assert: Verify the job card title is exactly 'Camera Assistant'.
        await expect(page.locator("xpath=/html/body/div[1]/div[2]/div[2]/main/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/h3").nth(0)).to_have_text("Camera Assistant", timeout=15000), "Verify the job card title is exactly 'Camera Assistant'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    