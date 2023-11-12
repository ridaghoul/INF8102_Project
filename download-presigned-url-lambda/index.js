const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const { fileName } = JSON.parse(event.body);
  try {
    const presignedUrl = s3.getSignedUrl("getObject", {
      Bucket: "inf8102-final-project-2023-11-07",
      Key: fileName,
      Expires: 60,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ presignedUrl }),
      headers: {
        "Content-Type": "application/application-json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: `Message from lambda, could not generate presigned url: ${error.message}`,
      }),
    };
  }
};
