terraform {
  required_providers {

    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.60.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.3.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region = "us-east-1"
}
variable "lambda_role_arn" {
  description = "ARN du rôle IAM pour la fonction Lambda"
  type        = string
  default     = "arn:aws:iam::313226341769:role/LabRole"  # Remplacez cela par votre ARN de rôle
}
