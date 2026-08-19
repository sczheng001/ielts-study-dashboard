# IELTS Study Dashboard

A clean, responsive study dashboard for an IELTS learner targeting an overall band score of **8.0**. Track daily tasks, study time, weekly progress, estimated band scores, practice results, and notes for all four IELTS skills.

## Run the app

This project has no dependencies or build step.

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.

For the best local-development experience, you can also run a small web server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## How to use it

- Check off today's tasks and add your own task with the **+ Add task** button.
- Use **Log session** to add study minutes for any IELTS skill.
- Select **Practice & notes** under a skill card to save a result and note.
- Use the top navigation to jump to a skill.
- Your changes are saved automatically in your browser using local storage.

## Project files

- `index.html` — page structure and accessible UI
- `styles.css` — responsive layout and visual design
- `app.js` — dashboard interactions and browser storage
