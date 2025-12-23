// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { url, method = 'POST', data, headers } = event;

  try {
    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        // Pass specific headers if needed, but avoid passing host/referer that might block
        'Authorization': headers.Authorization,
        'HTTP-Referer': headers['HTTP-Referer'], // OpenRouter requires this
        'X-Title': headers['X-Title']           // OpenRouter requires this
      }
    });
    return response.data;
  } catch (error) {
    console.error("Proxy Error:", error.message);
    if(error.response) {
        console.error("Proxy Response Data:", error.response.data);
    }
    return {
      error: true,
      message: error.message,
      data: error.response ? error.response.data : null
    }
  }
}
