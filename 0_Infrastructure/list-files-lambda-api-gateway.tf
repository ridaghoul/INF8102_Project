resource "aws_apigatewayv2_integration" "lambda_list-files-lambda" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = aws_lambda_function.list-files-lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_list-files-lambda" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "GET /list-files"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_list-files-lambda.id}"
}


resource "aws_lambda_permission" "api_gw_list-files-lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list-files-lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "list-files-lambda_base_url" {
  value = aws_apigatewayv2_stage.dev.invoke_url
}
