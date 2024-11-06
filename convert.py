from PIL import Image
import os

def convert_folder_to_webp(folder_path):
    # Parcourt chaque fichier du dossier
    for filename in os.listdir(folder_path):
        # Vérifie si le fichier est une image JPG ou PNG
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            # Chemin complet de l'image
            image_path = os.path.join(folder_path, filename)
            
            # Ouvre l'image
            img = Image.open(image_path)
            
            # Détermine le nouveau nom de fichier en remplaçant l'extension par .webp
            base = os.path.splitext(image_path)[0]
            webp_path = f"{base}.webp"
            
            # Convertit et sauvegarde en WebP
            img.save(webp_path, "WEBP")
            print(f"Image convertie : {webp_path}")

# Exemple d'utilisation
convert_folder_to_webp(r"C:\Users\ismys\Desktop\ValorantLineupNuxtBun\public\images\Map Interactive")
