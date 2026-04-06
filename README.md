# 🧟 Resident Evil Analytical Insight

A data-driven analytical project inspired by the **Resident Evil universe**, focused on extracting meaningful insights using **data science, network analysis, and visualization techniques**.

This project explores patterns, relationships, and structures within the dataset to uncover hidden insights using modern analytical methods.

---

## 📌 Project Overview

The goal of this project is to:

* Analyze structured/unstructured data from the Resident Evil domain
* Apply **graph-based analysis** and **community detection**
* Perform **centrality analysis** to identify key entities
* Visualize insights for better understanding

This project blends **entertainment data + analytical thinking**, making it both engaging and technically insightful.

---

## 🚀 Features

* 📊 Data preprocessing and cleaning
* 🔗 Graph/network creation
* 🧠 Community detection using Louvain algorithm
* 📈 Centrality measures (degree, betweenness, etc.)
* 📉 Insightful visualizations
* 🧪 Exploratory data analysis (EDA)

---

## 🛠️ Tech Stack

* **Python 3.11+**
* **Pandas** – data manipulation
* **NetworkX** – graph analysis
* **Matplotlib / Seaborn** – visualization
* **python-louvain** – community detection
* **NumPy** – numerical operations

---

## 📂 Project Structure

```
Resident-evil-analytical-insight/
│
├── data/                # Dataset files
├── notebooks/           # Jupyter notebooks
├── src/                 # Core scripts
├── outputs/             # Graphs & results
├── requirements.txt     # Dependencies
└── README.md            # Project documentation
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/PraneetGogoi/Resident-evil-analytical-insight.git
cd Resident-evil-analytical-insight
```

### 2. Create virtual environment (recommended)

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Usage

Run the main notebook or script:

```bash
jupyter notebook
```

or

```bash
python main.py
```

---

## 🧠 Key Concepts Used

* Graph Theory
* Community Detection (Louvain Algorithm)
* Centrality Analysis
* Data Visualization
* Exploratory Data Analysis

---

## 📊 Sample Insights (Add your outputs here)

* Identification of key characters/entities based on centrality
* Detection of clusters/communities within the network
* Relationship patterns between entities

*(You can add screenshots or graphs here for better impact)*

---

## ⚠️ Common Issue & Fix

If you encounter:

```
AttributeError: module 'community' has no attribute 'best_partition'
```

### Fix:

```bash
pip uninstall community
pip install python-louvain
```

Then use:

```python
import community.community_louvain as community_louvain
```

---

## 🌱 Future Improvements

* Add interactive dashboards (Streamlit / Dash)
* Integrate real-time data
* Improve model-based predictions
* Expand dataset for deeper insights

---

## 🤝 Contributing

Contributions are welcome.

* Fork the repository
* Create a new branch
* Submit a pull request

---

## 📜 License

This project is for educational and research purposes.

---

## 👨‍💻 Author

**Praneet Gogoi**
B.Tech CSE | AI & Data Science Enthusiast

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share your feedback.

[1]: https://github.com/rubenandrebarreiro/resident-evil-sample-data-analytics?utm_source=chatgpt.com "rubenandrebarreiro/resident-evil-sample-data-analytics"
