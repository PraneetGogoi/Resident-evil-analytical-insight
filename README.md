<img width="1710" height="1036" alt="Screenshot 2026-04-06 at 11 21 04 PM" src="https://github.com/user-attachments/assets/1c6743d2-4baf-472b-a47c-51a82f74a2b9" />

# 🧟 Resident Evil Analytical Insight

A data-driven web application inspired by the **Resident Evil universe**. This project takes raw lore data and transforms it into an interactive, immersive investigation corkboard. By leveraging **data science, network analysis, and D3 visualizations**, we can extract meaningful insights into character connections, factions, and storylines across the game series.

---

## 📌 Project Overview

This project blends **survival horror lore + analytical thinking**. We process a large dataset of Resident Evil scenes, character interactions, and game appearances to:
* 🕸️ Render an interactive **Investigation Corkboard** using D3.js force simulations.
* 📈 Rank character importance using **PageRank algorithms** (identifying major players like Leon and Chris).
* 📊 Visualize game timelines, role distributions, and Machine Learning feature importances.
* 🗄️ Provide a rich, immersive dashboard using modern web aesthetics (Cinzel fonts, torch/grime palettes).

---

## 🚀 Key Features

* **Interactive Case Board:** A drag-and-drop network graph mapping out character interactions, weighted by shared scenes.
* **Algorithmic Sizing:** Character polaroids scale dynamically based on their calculated PageRank centrality.
* **Data Dashboards:** Visualized analytics breaking down character classifications (Heroes, Villains, BOWs), game timelines, and survival metrics.
* **Full-Stack Architecture:** Backed by a PostgreSQL database holding complex character relationships, synced to a Node.js backend.
* **Immersive UI:** A highly stylized frontend leveraging Glassmorphism, CSS micro-animations, and Shadcn UI.

---

<img width="1710" height="1031" alt="Screenshot 2026-04-06 at 11 21 29 PM" src="https://github.com/user-attachments/assets/87111b1b-a175-4c06-aac1-7ed3b8ad8fff" />

## 🛠️ Tech Stack

**Frontend:**
* **React 18** (Vite)
* **TypeScript**
* **Tailwind CSS** + **Shadcn UI**
* **D3.js** (Force-directed graphs & network analysis)
* **Recharts** (Data visualization)

**Backend & Data:**
* **Node.js** + **Express**
* **Prisma ORM**
* **PostgreSQL**
* **Python** (Pandas/Scikit-Learn for initial data generation & ML pipelines)

---

## 📂 Project Structure

```text
Resident-evil-analytical-insight/
├── src/                 # React Frontend (Pages, Components, D3 logic)
├── server/              # Node.js Express Backend API
├── prisma/              # Database schema and seed scripts
├── public/              # Static assets and exported JSON data
├── dist/                # Production build output
└── scripts/             # Python data processing scripts
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/PraneetGogoi/Resident-evil-analytical-insight.git
cd Resident-evil-analytical-insight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Ensure you have a PostgreSQL instance running. Create a `.env` file in the root directory and add your connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/re_analytics?schema=public"
```

Initialize the database schema and seed the initial data:

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# Seed the database with characters and connections
npm run seed
```

### 4. Run the Application

Start both the Vite frontend and the Express backend concurrently:

```bash
npm run dev
```
- Frontend will be available at `http://localhost:8080` (or the next available port).
- Backend API will run on `http://localhost:3001`.

---

## 🧠 Data Science & Analytics

The data powering this application was processed using Python data science libraries.
* **Community Detection (Louvain):** Grouping characters into interconnected communities.
* **Centrality Analysis:** Calculating node degree and betweenness to identify key entities.
* **Machine Learning:** Analyzing feature importance to determine what traits affect a character's "status" (Alive/Deceased).

The raw analysis notebooks and CSV files are available in the root repository. To run the Python scripts, you can set up a virtual environment and `pip install -r requirements.txt`.

---

## 🤝 Contributing

Contributions are welcome!
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Submit a pull request

---

## 📜 License

This project is for educational and research purposes. Resident Evil and its characters are property of Capcom.

---

## 👨‍💻 Author

**Praneet Gogoi**  
B.Tech CSE | AI & Data Science Enthusiast

## ⭐ If you like this project

Give it a ⭐ on GitHub and share your feedback!
