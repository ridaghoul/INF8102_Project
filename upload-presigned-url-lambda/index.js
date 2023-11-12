const AWS = require("aws-sdk");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  const { fileName, fileType } = JSON.parse(event.body);

  const s3Params = {
    Bucket: "inf8102-final-project-2023-11-07",
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };

  try {
    const presignedUrl = s3.getSignedUrl("putObject", s3Params);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ presignedUrl }),
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
