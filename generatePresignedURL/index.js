const AWS = require("aws-sdk");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  const { fileName, fileType } = JSON.parse(event.body);

  const s3Params = {
    Bucket: "inf8102-final-project-2023-11-07", // Replace with your bucket name
    Key: fileName,
    Expires: 5000,
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
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: `Could not generate presigned URL: ${error.message}`,
      }),
    };
  }
};
