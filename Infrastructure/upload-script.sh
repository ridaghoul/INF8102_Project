#!/bin/bash


# Change le répertoire de travail vers le répertoire 'client'
cd ../client


# Run the ng build command
npm install
npm install -g @angular/cli
ng build

ng build

# Change the working directory to /home/yaya/INF8102_Project/Infrastructure/INF8102_Project/Infrastructure
cd ../Infrastructure

# Run Terraform commands
terraform init
terraform plan
terraform apply

# Obtenez le chemin complet du script en cours d'exécution
script_path="$(cd "$(dirname "$0")" && pwd)"

# Supprimez le répertoire actuel du chemin complet du script pour obtenir le répertoire parent
parent_directory="${script_path%/*}"

# Spécifiez le chemin relatif du dossier local contenant les fichiers à téléverser
relative_source_folder="client/dist/s3-drive"

# Composez le chemin complet du dossier local
source_folder="${parent_directory}/${relative_source_folder}"

# Spécifiez le nom du compartiment S3 de destination
s3_bucket="inf8102-final-project-2023-11-09"

# Utilisez la commande `aws s3 cp` pour téléverser tous les fichiers du dossier local vers S3
for file in "${source_folder}"/*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "Téléversement de $filename vers S3"
    aws s3 cp "$file" "s3://$s3_bucket/$filename"
  fi
done

# Créez un tableau JSON avec un élément "status" pour indiquer le résultat
echo '{"status": "Téléversement terminé"}'
