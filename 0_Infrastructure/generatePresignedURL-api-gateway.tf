resource "aws_apigatewayv2_integration" "lambda_generatePresignedURL" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = aws_lambda_function.generatePresignedURL.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}


resource "aws_apigatewayv2_route" "post_generatePresignedURL" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "POST /upload-presigned-url"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_generatePresignedURL.id}"
}

resource "aws_lambda_permission" "api_gw_generatePresignedURL" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.generatePresignedURL.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "generatePresignedURL_base_url" {
  value = aws_apigatewayv2_stage.dev.invoke_url
}
