resource "aws_lambda_function" "generatePresignedURL" {
  function_name = "generatePresignedURL"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_generatePresignedURL.key

  runtime = "nodejs18.x"
  handler = "index.handler"

  source_code_hash = data.archive_file.lambda_generatePresignedURL.output_base64sha256

  # Utiliser le rôle défini par la variable
  role = var.lambda_role_arn
}




resource "aws_cloudwatch_log_group" "generatePresignedURL" {
  name = "/aws/lambda/${aws_lambda_function.generatePresignedURL.function_name}"

  retention_in_days = 14
}

data "archive_file" "lambda_generatePresignedURL" {
  type = "zip"

  source_dir  = "../${path.module}/generatePresignedURL"
  output_path = "../${path.module}/generatePresignedURL.zip"
}

resource "aws_s3_object" "lambda_generatePresignedURL" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "generatePresignedURL.zip"
  source = data.archive_file.lambda_generatePresignedURL.output_path

  etag = filemd5(data.archive_file.lambda_generatePresignedURL.output_path)
}

