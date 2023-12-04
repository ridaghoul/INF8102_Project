# INF8102_Project
Final project for INF8102.
Pour excuter le code 
1.	Clonez le référentiel du projet depuis Github sur votre machine locale. 
2.	Mettez à jour les variables d'environnement dans le fichier « ~/.aws/credentials » avec les valeurs précises pour AWS ACCESS KEY ID, AWS SECRET ACCESS KEY et AWS SESSION TOKEN.
3.	Mettez à jour le variables « lambda_role_arn »  dans le fichier variables dans les dossiers 0_Infrastructure et Infrastructure.

4.	 Accédez au répertoire 0_Infrastructure 
5.	Ensuite, initialisez Terraform avec `terraform init`, planifiez Terraform avec `terraform plan`, puis appliquez les modifications avec `terraform apply`. 
6.	Copy le lien de api gateway et coller le dans le fichier s3-drive.ts  dans le path INF8102_Project/client/src/app/services/s3-drive/s3-drive.service.ts
7.	Après accédez au répertoire Infrastructure .
8.	Ensuite, exécuter  ./upload-script.sh
