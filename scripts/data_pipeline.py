import pandas as pd
import numpy as np
import networkx as nx
import json
import os
from collections import Counter
from itertools import combinations
import community.community_louvain as community_louvain
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.cluster import KMeans
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

# 3. Compute Centrality & Communities
pagerank = nx.pagerank(G, weight='weight')
degree = dict(G.degree(weight='weight'))
partition = community_louvain.best_partition(G, weight='weight')

# 4. Feature Engineering for ML
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

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

probs = rf.predict_proba(X)
preds = rf.predict(X)
feature_names = ["Scene Count", "Game Count", "PageRank", "Degree"]

kmeans = KMeans(n_clusters=5, random_state=42)
kmeans_clusters = kmeans.fit_predict(X)

# 5. Build nodes.json and edges.json
nodes_output = []
for idx, cid in enumerate(char_ids):
    pred_idx = preds[idx]
    pred_role = le.inverse_transform([pred_idx])[0]
    confidence = probs[idx][pred_idx]
    
    fi = sorted(zip(feature_names, rf.feature_importances_), key=lambda x: x[1], reverse=True)
    explanation = f"Driven by {fi[0][0].lower()} and {fi[1][0].lower()}"
    
    nodes_output.append({
        "id": cid,
        "pageRank": float(pagerank.get(cid, 0)),
        "degree": int(degree.get(cid, 0)),
        "communityId": int(partition.get(cid, 0)),
        "kmeansCluster": int(kmeans_clusters[idx]),
        "predictedRole": pred_role,
        "predictedConfidence": float(confidence),
        "predictionFeatures": explanation
    })

edges_output = []
for u, v, data in G.edges(data=True):
    edges_output.append({
        "sourceId": u,
        "targetId": v,
        "weight": int(data['weight'])
    })

with open(os.path.join(base_dir, 'nodes.json'), 'w') as f:
    json.dump(nodes_output, f, indent=2)

with open(os.path.join(base_dir, 'edges.json'), 'w') as f:
    json.dump(edges_output, f, indent=2)

print("✅ Data pipeline completed. Exported nodes.json and edges.json")
