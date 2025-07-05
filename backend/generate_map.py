import pandas as pd
import folium

# Load pollution data
df = pd.read_csv("Yamuna_final_data.csv")

# Clean up column names (remove extra spaces if any)
df.columns = df.columns.str.strip()

# Create Folium map centered on Delhi
m = folium.Map(location=[28.61, 77.23], zoom_start=12)

# Loop through each station and add marker
for _, row in df.iterrows():
    try:
        # Parse and clean numeric values
        lat = float(row['Latitude'])
        lon = float(row['Longitude'])
        ph = float(row['pH'])
        turbidity = float(row['Turbidity_(NTU)'])
        ammonia = float(row['Ammonia_(mg/L)'])
        phosphate = float(row['Phosphate_(mg/L)'])

        # Color logic with strict ordering: red > yellow > green
        if turbidity > 10 or ammonia > 3 or phosphate > 3:
            color = "red"
        elif (
            ph < 6.5 or ph > 8.5 or 
            turbidity > 5 or 
            ammonia > 1 or 
            phosphate > 1
        ):
            color = "yellow"
        else:
            color = "green"

        folium.CircleMarker(
            location=[lat, lon],
            radius=8,
            popup=(
                f"<b>{row['Location']}</b><br>"
                f"pH: {ph}<br>"
                f"Turbidity: {turbidity}<br>"
                f"Ammonia: {ammonia}<br>"
                f"Phosphate: {phosphate}<br>"
            ),
            color=color,
            fill=True,
            fill_color=color,
            fill_opacity=0.8
        ).add_to(m)

    except Exception as e:
        print(f"Skipping row due to error: {e}")

# Save the map
m.save("map.html")
