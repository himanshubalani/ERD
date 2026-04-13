# ER Diagram Presentations

An website built to showcase Database Entity-Relationship (ER) diagrams and their accompanying documentation for my course work.
Built for the Web Dev Cohort 2026 Database Assignments.

## 🛠️ Tech Stack

- **UI & Styling**: HTML5, Tailwind CSS (via CDN) + Official Typography Plugin
- **Icons**: Lucide Icons
- **SVG Engine**: `svg-pan-zoom` library
- **Markdown**: `markdown-it` (ESM) + Highlight.js

## 📂 Folder Structure

```text
/ERD
│── index.html          # Main application HTML
│── data.json           # Configuration file linking SVGs and Markdown
│── css/
│   └── style.css       # Custom styles and CSS variables
│── js/
│   └── app.js          # Core application logic
│── docs/               # Markdown documentation files
│   ├── thrift.md
│   └── fitness.md
|   └── ...
└── images/             # Exported SVG diagrams
    ├── thrift.svg
    └── fitness.svg
    └──...
