terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.60.0"
    }
  }
  /*
  backend "s3" {
    bucket  = "inf8102-final-project-2023-fall"
    key     = "sec100.tfstate"
    region  = "us-east-1"
    encrypt = true
  }*/
}