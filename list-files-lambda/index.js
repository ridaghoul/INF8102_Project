const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const params = {
    Bucket: "inf8102-final-project-2023-11-07",
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const fileNames = data.Contents.map((file) => file.Key);

    return {
      statusCode: 200,
      body: JSON.stringify(fileNames),
      headers: {
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
        error: `Message from lambda, could not list files: ${error.message}`,
      }),
    };
  }
};
