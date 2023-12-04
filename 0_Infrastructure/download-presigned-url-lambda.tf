resource "aws_lambda_function" "download-presigned-url-lambda" {
  function_name = "download-presigned-url-lambda"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_download-presigned-url-lambda.key

  runtime = "nodejs18.x"
  handler = "index.handler"

  source_code_hash = data.archive_file.lambda_download-presigned-url-lambda.output_base64sha256

  # Utilisez le rôle existant au lieu de créer un nouveau rôle
  role = var.lambda_role_arn
}



resource "aws_cloudwatch_log_group" "download-presigned-url-lambda" {
  name = "/aws/lambda/${aws_lambda_function.download-presigned-url-lambda.function_name}"

  retention_in_days = 14
}

data "archive_file" "lambda_download-presigned-url-lambda" {
  type = "zip"

  source_dir  = "../${path.module}/download-presigned-url-lambda"
  output_path = "../${path.module}/download-presigned-url-lambda.zip"
}

resource "aws_s3_object" "lambda_download-presigned-url-lambda" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "download-presigned-url-lambda.zip"
  source = data.archive_file.lambda_download-presigned-url-lambda.output_path

  etag = filemd5(data.archive_file.lambda_download-presigned-url-lambda.output_path)
}

