import pandas as pd
import numpy as np
import networkx as nx
import json
import os
from collections import Counter
from itertools import combinations
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score
import warnings
warnings.filterwarnings('ignore')

# 1. Load Data
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
chars = pd.read_csv(os.path.join(base_dir, 'characters.csv'))
interactions = pd.read_csv(os.path.join(base_dir, 'interactions.csv'))

# 2. Build Co-occurrence Network
scene_groups = interactions.groupby(['game_id', 'scene_id'])['character_id'].apply(list)
edge_counter = Counter()

for chars_in_scene in scene_groups:
    chars_in_scene = sorted(list(set(chars_in_scene)))
    for pair in combinations(chars_in_scene, 2):
        edge_counter[pair] += 1

G = nx.Graph()
for (u, v), weight in edge_counter.items():
    G.add_edge(str(u), str(v), weight=weight)

for cid in chars['id']:
    if str(cid) not in G:
        G.add_node(str(cid))

# 3. Compute Centrality Metrics
pagerank = nx.pagerank(G, weight='weight')
degree = dict(G.degree(weight='weight'))
try:
    betweenness = nx.betweenness_centrality(G, weight='weight')
except Exception:
    betweenness = {n:0 for n in G.nodes()}
try:
    eigenvector = nx.eigenvector_centrality_numpy(G, weight='weight')
except Exception:
    eigenvector = {n:0 for n in G.nodes()}

# 4. Extract Features for ML
scene_counts = interactions.groupby('character_id').size().to_dict()
game_counts = interactions.groupby('character_id')['game_id'].nunique().to_dict()

features = []
labels = []
char_ids = []

for _, row in chars.iterrows():
    cid = str(row['id'])
    role = row.get('role', row.get('classification', 'support'))
    
    sc = scene_counts.get(int(cid), 0)
    gc = game_counts.get(int(cid), 0)
    pr = pagerank.get(cid, 0)
    deg = degree.get(cid, 0)
    
    features.append([sc, gc, pr, deg])
    labels.append(role)
    char_ids.append(cid)

X = np.array(features)
le = LabelEncoder()
y = le.fit_transform(labels)

# 5. PCA and KMeans Clustering
Xs = StandardScaler().fit_transform(X)
pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(Xs)

km3 = KMeans(n_clusters=3, random_state=42, n_init='auto')
clusters = km3.fit_predict(Xs)

# 6. Model Accuracy Comparison
models = {
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'SVM': SVC(kernel='rbf', probability=True, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42)
}

model_accuracies = []
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5)
    model.fit(X, y)
    test_acc = model.score(X, y)
    model_accuracies.append({
        "name": name,
        "cv_mean": float(scores.mean()),
        "cv_std": float(scores.std()),
        "test_acc": float(test_acc)
    })

# Compile scatter data
scatter_data = []
for idx, cid in enumerate(char_ids):
    char_name = chars.loc[chars['id'] == int(cid), 'name'].iloc[0]
    char_role = labels[idx]
    
    scatter_data.append({
        "id": cid,
        "name": char_name,
        "role": char_role,
        "degree": float(degree.get(cid, 0)),
        "betweenness": float(betweenness.get(cid, 0)),
        "eigenvector": float(eigenvector.get(cid, 0)),
        "pagerank": float(pagerank.get(cid, 0)),
        "pc1": float(X_pca[idx, 0]),
        "pc2": float(X_pca[idx, 1]),
        "cluster": int(clusters[idx])
    })

centroids = pca.transform(km3.cluster_centers_)
centroid_data = [
    {"cluster": 0, "pc1": float(centroids[0,0]), "pc2": float(centroids[0,1])},
    {"cluster": 1, "pc1": float(centroids[1,0]), "pc2": float(centroids[1,1])},
    {"cluster": 2, "pc1": float(centroids[2,0]), "pc2": float(centroids[2,1])}
]

output_data = {
    "scatter_data": scatter_data,
    "model_accuracies": model_accuracies,
    "centroids": centroid_data
}

with open(os.path.join(base_dir, 'public', 'advanced_analytics.json'), 'w') as f:
    json.dump(output_data, f, indent=2)

print("✅ Extracted model analytics to public/advanced_analytics.json")
