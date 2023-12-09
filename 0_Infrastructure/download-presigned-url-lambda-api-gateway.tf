resource "aws_apigatewayv2_integration" "lambda_download-presigned-url-lambda" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = aws_lambda_function.download-presigned-url-lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}


resource "aws_apigatewayv2_route" "post_download-presigned-url-lambda" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "POST /download-presigned-url"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_download-presigned-url-lambda.id}"
}

resource "aws_lambda_permission" "api_gw_download-presigned-url-lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.download-presigned-url-lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "download-presigned-url-lambda_base_url" {
  value = aws_apigatewayv2_stage.dev.invoke_url
}
