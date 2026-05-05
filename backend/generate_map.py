import pandas as pd
import folium
from folium.plugins import HeatMap
import numpy as np

# Load data
df = pd.read_csv("Yamuna_final_data.csv")
df.columns = df.columns.str.strip()

# Use Quality_Label directly from CSV
def get_color(label):
    label = str(label).strip().lower()
    if label == 'red' or label == 'critical':
        return 'red'
    elif label == 'yellow' or label == 'moderate':
        return 'orange'
    elif label == 'green' or label == 'good':
        return 'green'
    else:
        # Fallback: recalculate
        return 'orange'

# Average by location for cleaner markers
df_avg = df.groupby('Location').agg({
    'Latitude': 'first',
    'Longitude': 'first',
    'pH': 'mean',
    'COD_(mg/l)': 'mean',
    'BOD_(mg/l)': 'mean',
    'DO_(mg/l)': 'mean',
    'Phosphate_(mg/L)': 'mean',
    'Turbidity_(NTU)': 'mean',
    'Ammonia_(mg/L)': 'mean',
    'Quality_Label': lambda x: x.mode()[0]  # most common label
}).reset_index()

# Yamuna river approximate path (key coordinates)
yamuna_path = [
    [30.35, 77.77],  # Yamunotri area
    [29.97, 77.55],  # Dakpathar
    [29.60, 77.30],  # Tajewala
    [29.38, 77.08],  # Panipat
    [28.98, 77.06],  # Sonipat
    [28.72, 77.29],  # Wazirabad / Palla
    [28.66, 77.26],  # Nizamuddin
    [28.63, 77.28],  # Okhla
    [28.10, 77.60],  # Mathura direction
    [27.47, 77.67],  # Mathura
    [26.45, 80.35],  # Allahabad (Prayagraj)
]

# Create map centered on Delhi stretch
m = folium.Map(
    location=[28.65, 77.28],
    zoom_start=11,
    tiles=None
)

# Add dark tile layer
folium.TileLayer(
    tiles='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attr='CartoDB',
    name='Dark Map',
    max_zoom=19,
).add_to(m)

# Also add satellite option
folium.TileLayer(
    tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr='Esri',
    name='Satellite',
).add_to(m)

# Draw Yamuna river path
folium.PolyLine(
    locations=yamuna_path,
    color='#00aaff',
    weight=3,
    opacity=0.5,
    tooltip='Yamuna River',
    dash_array='8 4',
).add_to(m)

# Add heatmap layer
heat_data = []
for _, row in df_avg.iterrows():
    try:
        lat = float(row['Latitude'])
        lon = float(row['Longitude'])
        bod = float(row['BOD_(mg/l)'])
        heat_data.append([lat, lon, min(bod / 50, 1.0)])
    except:
        pass

HeatMap(
    heat_data,
    name='Pollution Heatmap',
    min_opacity=0.3,
    max_zoom=18,
    radius=35,
    blur=25,
    gradient={0.2: 'blue', 0.45: 'lime', 0.7: 'orange', 1.0: 'red'}
).add_to(m)

# Add markers for each location
for _, row in df_avg.iterrows():
    try:
        lat = float(row['Latitude'])
        lon = float(row['Longitude'])
        color = get_color(row['Quality_Label'])
        label = str(row['Quality_Label']).strip()

        # Status emoji
        if color == 'green':
            status_emoji = '🟢'
            status_text = 'GOOD'
            status_color = '#22c55e'
        elif color == 'orange':
            status_emoji = '🟡'
            status_text = 'MODERATE'
            status_color = '#f59e0b'
        else:
            status_emoji = '🔴'
            status_text = 'CRITICAL'
            status_color = '#ef4444'

        popup_html = f"""
        <div style="
            font-family: 'Segoe UI', sans-serif;
            min-width: 220px;
            background: #0a1628;
            color: #e0f0ff;
            border-radius: 10px;
            overflow: hidden;
        ">
            <div style="
                background: {status_color};
                padding: 10px 14px;
                font-weight: 700;
                font-size: 13px;
                color: white;
            ">
                {status_emoji} {row['Location'][:40]}
            </div>
            <div style="padding: 12px 14px;">
                <div style="
                    display: inline-block;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid {status_color};
                    color: {status_color};
                    padding: 2px 10px;
                    border-radius: 100px;
                    font-size: 11px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                ">{status_text}</div>
                <table style="width:100%; font-size:12px; border-collapse:collapse;">
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                        <td style="padding:4px 0; color:rgba(160,200,255,0.7)">pH</td>
                        <td style="padding:4px 0; text-align:right; font-weight:600">{row['pH']:.2f}</td>
                    </tr>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                        <td style="padding:4px 0; color:rgba(160,200,255,0.7)">BOD</td>
                        <td style="padding:4px 0; text-align:right; font-weight:600">{row['BOD_(mg/l)']:.2f} mg/L</td>
                    </tr>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                        <td style="padding:4px 0; color:rgba(160,200,255,0.7)">DO</td>
                        <td style="padding:4px 0; text-align:right; font-weight:600">{row['DO_(mg/l)']:.2f} mg/L</td>
                    </tr>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                        <td style="padding:4px 0; color:rgba(160,200,255,0.7)">Turbidity</td>
                        <td style="padding:4px 0; text-align:right; font-weight:600">{row['Turbidity_(NTU)']:.2f} NTU</td>
                    </tr>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                        <td style="padding:4px 0; color:rgba(160,200,255,0.7)">Ammonia</td>
                        <td style="padding:4px 0; text-align:right; font-weight:600">{row['Ammonia_(mg/L)']:.2f} mg/L</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0; color:rgba(160,200,255,0.7)">Phosphate</td>
                        <td style="padding:4px 0; text-align:right; font-weight:600">{row['Phosphate_(mg/L)']:.2f} mg/L</td>
                    </tr>
                </table>
            </div>
        </div>
        """

        folium.CircleMarker(
            location=[lat, lon],
            radius=10,
            popup=folium.Popup(popup_html, max_width=260),
            tooltip=f"{row['Location'][:30]} — {status_text}",
            color='white',
            weight=1.5,
            fill=True,
            fill_color=status_color,
            fill_opacity=0.85,
        ).add_to(m)

    except Exception as e:
        print(f"Skipping {row.get('Location', '?')} due to: {e}")

# Legend
legend_html = """
<div style="
    position: fixed;
    bottom: 30px;
    left: 30px;
    z-index: 1000;
    background: rgba(10, 22, 40, 0.92);
    border: 1px solid rgba(0,120,255,0.25);
    border-radius: 12px;
    padding: 14px 18px;
    font-family: 'Segoe UI', sans-serif;
    color: #e0f0ff;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
">
    <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:rgba(140,190,255,0.7); margin-bottom:10px; text-transform:uppercase;">
        Water Quality
    </div>
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:7px; font-size:13px;">
        <div style="width:12px;height:12px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;"></div>
        Good — Safe for use
    </div>
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:7px; font-size:13px;">
        <div style="width:12px;height:12px;border-radius:50%;background:#f59e0b;box-shadow:0 0 6px #f59e0b;"></div>
        Moderate — Caution advised
    </div>
    <div style="display:flex; align-items:center; gap:8px; font-size:13px;">
        <div style="width:12px;height:12px;border-radius:50%;background:#ef4444;box-shadow:0 0 6px #ef4444;"></div>
        Critical — Severely polluted
    </div>
</div>
"""
m.get_root().html.add_child(folium.Element(legend_html))

# Layer control
folium.LayerControl().add_to(m)

# Save
m.save("map.html")
print("✅ Map generated successfully with Green/Yellow/Red markers!")