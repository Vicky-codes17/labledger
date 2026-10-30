# LabLedger

### Your work. Your commands. Your learning.

LabLedger is a voice-friendly practical-work documentation tool that helps students and developers turn their daily technical work into structured learning records.

Describe what you worked on using text or voice dictation. LabLedger uses Gemini AI to organize your description into tasks, commands, errors, solutions, learning outcomes, and next steps.

## Features

- **Voice-Friendly Documentation:** Use Wispr Flow to dictate your work.
- **AI-Powered Records:** Convert work descriptions into structured records using Gemini AI.
- **Task Tracking:** Organize completed tasks.
- **Command Tracking:** Keep track of commands mentioned in your description.
- **Error and Solution Tracking:** Document errors and their solutions.
- **Learning Outcomes:** Record what you learned.
- **History:** View previously saved work records.
- **Search and Filter:** Find records using search and categories.
- **Edit and Delete:** Manage saved records.
- **Export:** Download records in Markdown and JSON formats.
- **Dark Mode:** Switch between light and dark themes.

## Example

**Input:**

> I created a Git repository, committed three files, and faced a push rejection because the remote repository had changes. I pulled the latest changes and pushed successfully.

**Generated Record:**

- **Title:** Git Repository Setup
- **Category:** Git
- **Tasks:** Created a repository and committed files.
- **Error:** Push rejected because the remote had changes.
- **Solution:** Pulled remote changes before pushing again.
- **Learning:** Learned how to resolve a non-fast-forward push rejection.
- **Next Step:** Practice working with branches and remote repositories.

## How It Works

1. Describe your practical work using text or voice dictation.
2. Send the description to the LabLedger backend.
3. Gemini AI organizes the information into a structured record.
4. Review and edit the generated content.
5. Save the record for future reference.

## Tech Stack

- React
- Vite
- CSS
- Node.js
- Express.js
- Google Gemini AI
- LocalStorage
- Lucide React
- Wispr Flow
- Git and GitHub

## Voice Input

You can dictate your practical work instead of typing it manually. Wispr Flow converts your speech into text, which you can review and submit to LabLedger.

## Installation and Setup

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (includes npm)
- [Git](https://git-scm.com/)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Vicky-codes17/labledger
cd labledger
```

### 2. Install Frontend Dependencies

From the main project folder:

```bash
npm install
```

### 3. Install Backend Dependencies

Move into the server folder:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` folder:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Replace `your_gemini_api_key` with your own Gemini API key.

### 5. Run the Backend Server

From the `server` folder:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 6. Run the Frontend

Open a second terminal in the main project folder:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use LabLedger.

**Note:** Keep both the frontend and backend terminals running while using the application.

## Privacy

- Records are saved in your browser using LocalStorage.
- The Gemini API key is stored in the backend environment file.
- Never commit API keys or private environment files to GitHub.

## Future Improvements

- Cloud-based record synchronization.
- PDF export.
- GitHub integration.
- Improved learning progress tracking.
- More record templates for technical activities.

## Built For

**No Hands: The Wispr Challenge**

Built with the idea of making practical-work documentation easier, faster, and more accessible through voice-friendly workflows.

## License

This project is licensed under the MIT License.