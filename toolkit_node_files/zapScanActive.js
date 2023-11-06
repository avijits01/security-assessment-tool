const ZapClient = require('zaproxy');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const zapOptions = {
  apiKey: 'rnca0o3m3jn4ghitmodnegnpkd',
  proxy: {
    host: '127.0.0.1',
    port: 8080,
  },
};

const zaproxy = new ZapClient(zapOptions);
const targetUrl = 'https://applyable.com.au/';

async function activeScan(url) {
  try {
    // You can add additional parameters to the scan as needed
    const { scan } = await zaproxy.ascan.scan({ url, recurse: true, inScopeOnly: false });
    console.log(`Active scan started with ID: ${scan}`);
    return scan;
  } catch (error) {
    console.error('Error starting active scan:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

async function checkActiveScanStatus(scanId) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const { status } = await zaproxy.ascan.status(scanId);
        console.log(`Active scan progress: ${status}%`);
        if (status >= 100) {
          clearInterval(intervalId);
          resolve();
        }
      } catch (error) {
        console.error('Error checking active scan status:', error);
        clearInterval(intervalId);
        reject(error);
      }
    }, 5000);
  });
}

async function getScanResults() {
  try {
    const { alerts } = await zaproxy.core.alerts({ baseurl: targetUrl, start: 0, count: 100 });
    console.log('Scan results retrieved.');
    return alerts;
  } catch (error) {
    console.error('Error retrieving scan results:', error);
    throw error;
  }
}

async function getAlertSummary(baseUrl) {
  try {
    const response = await axios.get(`http://${zapOptions.proxy.host}:${zapOptions.proxy.port}/JSON/alert/view/alertsSummary/`, {
      params: {
        baseurl: baseUrl,
      },
      headers: {
        'Accept': 'application/json',
        'X-ZAP-API-Key': zapOptions.apiKey // Assuming the API key is required
      }
    });
    console.log('Alert summary retrieved.');
    return response.data;
  } catch (error) {
    console.error('Error retrieving alert summary:', error);
    throw error;
  }
}

async function writeResultsToFile(results, summary) {
  const currentDir = path.resolve(__dirname);
  const resultsFileName = path.join(currentDir, 'alerts.json');
  const summaryFileName = path.join(currentDir, 'alertsummary.json');

  try {
    if (results) {
      console.log(`Attempting to write scan results to ${resultsFileName}`);
      await fs.promises.writeFile(resultsFileName, JSON.stringify(results, null, 2));
      console.log(`Scan results written to ${resultsFileName}`);
    } else {
      console.log('No scan results to write.');
    }

    if (summary) {
      console.log(`Attempting to write alert summary to ${summaryFileName}`);
      await fs.promises.writeFile(summaryFileName, JSON.stringify(summary, null, 2));
      console.log(`Alert summary written to ${summaryFileName}`);
    } else {
      console.log('No alert summary to write.');
    }
  } catch (error) {
    console.error('Error writing results to file:', error);
    throw error;
  }
}

async function performScan() {
  try {
    const scanId = await activeScan(targetUrl);
    await checkActiveScanStatus(scanId);
    const results = await getScanResults();
    const summary = await getAlertSummary(targetUrl);
    await writeResultsToFile(results, summary);
  } catch (error) {
    console.error('An error occurred during the scan process:', error);
  }
}

performScan();
