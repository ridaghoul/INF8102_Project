provider "aws" {
  region = var.region
}
#Creating S3
resource "aws_s3_bucket" "main_bucket" {
  bucket = "inf8102-final-project-2023"

  tags = {
    Name        = "final-project"
    Environment = "prod"
  }
}
