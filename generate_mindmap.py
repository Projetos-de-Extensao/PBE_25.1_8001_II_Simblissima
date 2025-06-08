from plantuml import PlantUML
import os

# Read the PlantUML content
with open('docs/iniciacao/mm.wsd', 'r') as f:
    plantuml_content = f.read()

# Create the output directory if it doesn't exist
os.makedirs('docs/assets/Mapas_mentais', exist_ok=True)

# Write the PlantUML content to a temporary file
with open('docs/assets/Mapas_mentais/mm.puml', 'w') as f:
    f.write(plantuml_content)

# Run PlantUML to generate the PNG file
os.system('plantuml -tpng docs/assets/Mapas_mentais/mm.puml')
