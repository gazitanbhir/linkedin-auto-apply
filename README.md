# LinkedIn Auto Apply Bot

This project uses an AI agent to automatically search and apply for jobs on LinkedIn based on a provided resume (PDF).  It leverages FastAPI for the backend API, Langchain for agent management, and Playwright (via `browser_use`) for browser automation.  The AI agent uses Gemini to understand the resume and formulate search queries.

## Project Description

Finding and applying for jobs can be a time-consuming process. This project aims to automate this process by:

1.  **Analyzing your resume:** Extracts text from your uploaded PDF resume to understand your skills and experience.
2.  **Searching LinkedIn:** Uses an AI agent to search for relevant jobs on LinkedIn based on your resume content.  It scrolls down to load more jobs and extracts job titles, companies, and links.
3.  **(Future Development) Auto-Applying:**  *(This feature is planned but not yet implemented)*  The agent will be able to automatically apply for suitable jobs based on your preferences.

## Features

*   Resume parsing (PDF)
*   AI-powered job search on LinkedIn
*   Job details extraction (title, company, link)
*   CORS enabled for frontend integration
*   (Planned) Auto-application feature

## Tech Stack

*   Python
*   FastAPI
*   Langchain
*   Playwright (via `browser_use`)
*   PyMuPDF (fitz)
*   Beautiful Soup
*   Gemini (LLM)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/YOUR_USERNAME/linkedin-auto-apply.git](https://www.google.com/search?q=https://github.com/YOUR_USERNAME/linkedin-auto-apply.git)  # Replace with your repository URL
    cd linkedin-auto-apply
    ```

2.  **Create a virtual environment (recommended):**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Create a `.env` file:**

    ```
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY  # Replace with your actual key
    ```

5.  **Install Chrome (or Chromium):** The project uses Chrome for browser automation. Ensure you have it installed and the path is correctly configured in `browser_use.py`.

## Usage

1.  **Run the FastAPI server:**

    ```bash
    uvicorn main:app --reload
    ```

2.  **Frontend Integration:** You will need a frontend application to interact with the API.  The API endpoint for job search is `/find-matching-jobs`.  It accepts a PDF file upload.

## API Endpoint

*   **POST /find-matching-jobs:** Upload a PDF resume to this endpoint to initiate the job search.  Returns a JSON response containing a list of matching jobs.

## Example Response

```json
{
  "message": "Job search completed",
  "matching_jobs": [
    {
      "title": "Software Engineer",
      "company": "Google",
      "link": "[https://www.linkedin.com/jobs/view/](https://www.google.com/search?q=https://www.linkedin.com/jobs/view/)..."
    },
    {
      "title": "Data Scientist",
      "company": "Microsoft",
      "link": "[https://www.linkedin.com/jobs/view/](https://www.google.com/search?q=https://www.linkedin.com/jobs/view/)..."
    },
    // ... more jobs
  ]
}
