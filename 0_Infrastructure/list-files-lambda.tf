resource "aws_lambda_function" "list-files-lambda" {
  function_name = "list-files-lambda"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_list-files-lambda.key

  runtime = "nodejs18.x"
  handler = "index.handler"

  source_code_hash = data.archive_file.lambda_list-files-lambda.output_base64sha256

  # Utilisez le rôle existant au lieu de créer un nouveau rôle
  role = var.lambda_role_arn
}



resource "aws_cloudwatch_log_group" "list-files-lambda" {
  name = "/aws/lambda/${aws_lambda_function.list-files-lambda.function_name}"

  retention_in_days = 14
}

data "archive_file" "lambda_list-files-lambda" {
  type = "zip"

  source_dir  = "../${path.module}/list-files-lambda"
  output_path = "../${path.module}/list-files-lambda.zip"
}

resource "aws_s3_object" "lambda_list-files-lambda" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "list-files-lambda.zip"
  source = data.archive_file.lambda_list-files-lambda.output_path

  etag = filemd5(data.archive_file.lambda_list-files-lambda.output_path)
}

