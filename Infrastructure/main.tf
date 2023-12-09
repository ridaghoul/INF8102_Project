
#Creating S3
resource "aws_s3_bucket" "main_bucket" {
  bucket = "inf8102-final-project-2023-11-09"

  tags = {
    Name        = "final-project"
    Environment = "prod"
  }
}

resource "aws_s3_bucket_public_access_block" "main_bucket" {
  bucket                  = aws_s3_bucket.main_bucket.bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

}

resource "aws_s3_bucket_server_side_encryption_configuration" "main_bucket" {
  bucket = aws_s3_bucket.main_bucket.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "main_bucket" {
  bucket = aws_s3_bucket.main_bucket.bucket
  versioning_configuration {
    status = "Enabled"
  }
}


resource "aws_cloudfront_origin_access_control" "site_access" {
  name                              = "cf_final_project"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"

}


resource "aws_cloudfront_distribution" "site_access" {
  depends_on = [aws_s3_bucket.main_bucket, aws_cloudfront_origin_access_control.site_access]
  enabled    = true

  default_root_object = "index.html"
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.main_bucket.id
    viewer_protocol_policy = "https-only"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  origin {
    domain_name              = aws_s3_bucket.main_bucket.bucket_domain_name
    origin_id                = aws_s3_bucket.main_bucket.id
    origin_access_control_id = aws_cloudfront_origin_access_control.site_access.id
  }
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA"]
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
resource "aws_s3_bucket_policy" "main_bucket" {
  depends_on = [data.aws_iam_policy_document.main_bucket]
  bucket     = aws_s3_bucket.main_bucket.id
  policy     = data.aws_iam_policy_document.main_bucket.json
}

data "aws_iam_policy_document" "main_bucket" {
  depends_on = [aws_cloudfront_distribution.site_access, aws_s3_bucket.main_bucket]

  statement {
    sid    = "s3_cloudfront_static_website"
    effect = "Allow"
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = ["cloudfront.amazonaws.com"]
      type        = "Service"
    }
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.main_bucket.bucket}/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site_access.arn]

    }
  }
}
resource "aws_cloudfront_monitoring_subscription" "site_access" {
  distribution_id = aws_cloudfront_distribution.site_access.id

  monitoring_subscription {
    realtime_metrics_subscription_config {
      realtime_metrics_subscription_status = "Enabled"
    }
  }
}

