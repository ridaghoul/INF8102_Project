# Creating S3
resource "aws_s3_bucket" "Storage_bucket" {
  bucket = "websiteinf8102-13"

  tags = {
    Name        = "final-project"
    Environment = "prod"
  }

  force_destroy  = true

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "Storage_bucket" {
  bucket                  = aws_s3_bucket.Storage_bucket.bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "Storage_bucket" {
  bucket = aws_s3_bucket.Storage_bucket.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "Storage_bucket" {
  bucket = aws_s3_bucket.Storage_bucket.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

# Politique d'accès
resource "aws_s3_bucket_policy" "Storage_bucket_policy" {
  bucket = aws_s3_bucket.Storage_bucket.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Id      = "Policy1699546469202",
    Statement = [
      {
        Sid       = "Stmt1699546455550",
        Effect    = "Allow",
        Principal = {
          AWS = var.lambda_role_arn
        },
        Action    = ["s3:PutObject", "s3:GetObject"],
        Resource  = "arn:aws:s3:::websiteinf8102-13/*",
      },
      {
        Sid       = "StmtListBucket",
        Effect    = "Allow",
        Principal = {
          AWS = var.lambda_role_arn
        },
        Action   = "s3:ListBucket",
        Resource = "arn:aws:s3:::websiteinf8102-13",
      },
    ],
  })
}

