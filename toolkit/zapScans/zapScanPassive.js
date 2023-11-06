const ZapClient = require('zaproxy');
const fs = require('fs');
const path = require('path');

const zapOptions = {
 apiKey: 'rnca0o3m3jn4ghitmodnegnpkd', // PLEASE INPUT API KEY. YOU GET IT AFTER INSTALLING ZAP. GO TO SETTINGS AND LOOK FOR API KEY
 proxy: {
 host: '127.0.0.1',
 port: 8080,
 },
};

const zaproxy = new ZapClient(zapOptions);
const targetUrl = 'https://applyable.com.au/';

async function spiderScan(url) {
 try {
 const { scan } = await zaproxy.spider.scan({ url });
 console.log(`Spider scan started with ID: ${scan}`);
 return scan;
 } catch (error) {
 console.error('Error starting spider scan:', error);
 }
}

async function checkScanStatus(scanId) {
 return new Promise((resolve, reject) => {
 const intervalId = setInterval(async () => {
 try {
   const { status } = await zaproxy.spider.status(scanId);
   console.log(`Spider scan progress: ${status}%`);
   if (status >= 100) {
     clearInterval(intervalId);
     resolve();
   }
 } catch (error) {
   console.error('Error checking spider scan status:', error);
   clearInterval(intervalId);
   reject(error);
 }
 }, 5000); // Check every 5 seconds
 });
}

async function getScanResults() {
 try {
 const { alerts } = await zaproxy.core.alerts({ baseurl: targetUrl, start: 0, count: 100 });
 console.log('Scan results retrieved.');
 return alerts;
 } catch (error) {
 console.error('Error retrieving scan results:', error);
 }
}

async function getHtmlReport() {
 try {
 const report = await zaproxy.core.htmlreport();
 console.log('HTML report retrieved.');
 return report;
 } catch (error) {
 console.error('Error retrieving HTML report:', error);
 }
}

async function writeResultsToFile(results, report) {
 try {
 const currentDir = path.dirname(__filename);
 const resultsFileName = path.join(currentDir, 'alert.json');
 await fs.promises.writeFile(resultsFileName, JSON.stringify(results, null, 2));
 console.log(`Results written to ${resultsFileName}`);

 const reportFileName = path.join(currentDir, 'report.html');
 await fs.promises.writeFile(reportFileName, report);
 console.log(`HTML report written to ${reportFileName}`);
 } catch (error) {
 console.error('Error writing results to file:', error);
 }
}

async function performScan() {
 try {
 const scanId = await spiderScan(targetUrl);
 if (scanId) {
 await checkScanStatus(scanId);
 const results = await getScanResults();
 const report = await getHtmlReport();
 if (results && report) {
   await writeResultsToFile(results, report);
 }
 }
 } catch (error) {
 console.error('An error occurred during the scan process:', error);
 }
}

performScan();
