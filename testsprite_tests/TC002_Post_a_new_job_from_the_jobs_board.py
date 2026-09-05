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
        
        # -> Navigate to the Login page (/login) and load the sign-in form.
        await page.goto("http://localhost:3000/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Return to Home' link to go back to the site's home page and look for navigation to Login or Jobs.
        # Return to Home link
        elem = page.get_by_role('link', name='Return to Home', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Sign In' button to open the login form.
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
        
        # -> Click the 'Jobs' link in the Opportunities sidebar to open the Jobs page.
        # Jobs button
        elem = page.get_by_role('button', name='Jobs', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Post Job' button to open the job posting dialog.
        # Post Job button
        elem = page.get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the job form text fields: enter 'Lighting Technician' into Job Title, 'Frame House Studios' into Company Name, 'Los Angeles' into Location, and enter the job description.
        # e.g. Senior Director text field
        elem = page.get_by_label('Job Title', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Lighting Technician")
        
        # -> Fill the job form text fields: enter 'Lighting Technician' into Job Title, 'Frame House Studios' into Company Name, 'Los Angeles' into Location, and enter the job description.
        # e.g. Netflix Studios text field
        elem = page.get_by_label('Company Name', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Frame House Studios")
        
        # -> Fill the job form text fields: enter 'Lighting Technician' into Job Title, 'Frame House Studios' into Company Name, 'Los Angeles' into Location, and enter the job description.
        # e.g. Mumbai, Maharashtra text field
        elem = page.get_by_label('Location', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Los Angeles")
        
        # -> Fill the job form text fields: enter 'Lighting Technician' into Job Title, 'Frame House Studios' into Company Name, 'Los Angeles' into Location, and enter the job description.
        # Describe the role, responsibilities, and... text area
        elem = page.get_by_label('Job Description', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Support the production team on set and during post-production.")
        
        # -> Open the 'Job Type' dropdown by clicking the 'Select type' combobox so its options appear.
        # Select type button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div/button')
        await elem.click(timeout=10000)
        
        # -> Select 'Full-time' from the Job Type dropdown in the 'Post a New Job' dialog.
        # Full-time option
        elem = page.get_by_role('option', name='Full-time', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Select level' (Experience Level) dropdown in the 'Post a New Job' dialog.
        # Select level button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Select 'Mid Level' from the Experience Level dropdown in the 'Post a New Job' dialog.
        # Mid Level option
        elem = page.get_by_role('option', name='Mid Level', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Category' dropdown in the Post a New Job dialog so the industry options appear (e.g., 'Entertainment').
        # Select category button
        elem = page.locator('xpath=/html/body/div[3]/form/div[3]/div[3]/button')
        await elem.click(timeout=10000)
        
        # -> Select the 'Lighting Technician' option from the open Category dropdown in the 'Post a New Job' dialog.
        # Lighting Technician option
        elem = page.get_by_role('option', name='Lighting Technician', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Post Job' button to submit the job posting.
        # Post Job button
        elem = page.get_by_text('Cancel', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Post Job', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The newly created job 'Lighting Technician' is visible in the Jobs listing.
        # Assert-outcome: passed
        # Assert: Jobs list contains a job titled 'Lighting Technician'.
        await expect(page.locator("xpath=/html/body/div[1]/div[2]/div[2]/main/div/div[2]/div[2]/div[2]/div[1]/div[1]/div/div[1]/h3").nth(0)).to_have_text("Lighting Technician", timeout=15000), "Jobs list contains a job titled 'Lighting Technician'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    