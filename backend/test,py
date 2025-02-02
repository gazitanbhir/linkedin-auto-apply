from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from browser_use import Agent, Browser, BrowserConfig
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
import fitz  # PyMuPDF for extracting text from PDFs
from pathlib import Path
import shutil
from bs4 import BeautifulSoup
import json
import re

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Missing GOOGLE_API_KEY in .env file")

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GOOGLE_API_KEY)

# Configure browser
browser = Browser(config=BrowserConfig(
    chrome_instance_path='/usr/bin/google-chrome',
    headless=False,  # Run Chrome in visible mode for debugging
    ))

# Directory to store PDFs
PDF_STORAGE_PATH = Path("uploaded_pdfs")
PDF_STORAGE_PATH.mkdir(parents=True, exist_ok=True)

# Function to extract text from PDF
def extract_pdf_text(pdf_path: Path) -> str:
    try:
        with fitz.open(pdf_path) as doc:
            return "\n".join(page.get_text("text") for page in doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text: {e}")


def extract_jobs_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    job_list = []
    
    job_cards = soup.find_all('li', class_='occludable-update')

    for card in job_cards:
        title_element = card.find('a', class_='job-card-container__link')
        company_element = card.find('span', class_='hONPXKBbczLdZIKDSkYjjntBZfTrPzxiQn')

        if title_element and company_element:
             title = title_element.text.strip()
             company = company_element.text.strip()
             link = "https://www.linkedin.com"+title_element['href']
             job_list.append({"title": title, "company": company, "link": link})
    return job_list


@app.post("/find-matching-jobs")
async def find_matching_jobs(pdf_file: UploadFile = File(...)):
    try:
        # Save and extract profile text from PDF
        pdf_path = PDF_STORAGE_PATH / pdf_file.filename
        with open(pdf_path, "wb") as f:
            shutil.copyfileobj(pdf_file.file, f)
        profile_text = extract_pdf_text(pdf_path)
        
        # Search for matching jobs
        search_task = f"""
            Find best-matched jobs on LinkedIn based on this profile: {profile_text}. 
            Scroll down the page multiple times to ensure all job listings are loaded.
            Wait for the job listing elements to appear, then extract job titles, company names, and job links.
            Return the extracted jobs as a structured JSON list.
        """
            
        search_agent = Agent(task=search_task, llm=llm, browser=browser)
        job_results = await search_agent.run()
        
        # Extract job details from the html response
        # Check if job_results is AgentHistoryList
        if hasattr(job_results, "__class__") and job_results.__class__.__name__ == "AgentHistoryList":
            # Get the last action's output (which will be the HTML string)
            last_action = job_results[-1]
            html_content = last_action.get("text","")
        else:
            raise ValueError(f"Expected AgentHistoryList, got: {type(job_results)}")

        job_list = extract_jobs_from_html(html_content)
        
        return {"message": "Job search completed", "matching_jobs": job_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)