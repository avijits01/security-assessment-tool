const dns = require('dns');
const fs = require('fs');
const path = require('path');

const domain = 'irobot.com'; // Replace with the target domain

// Replace with the path to your wordlist file
const wordlistPath = path.join(__dirname, 'subdomains.txt');

// Read the subdomain wordlist file
fs.readFile(wordlistPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading wordlist file:', err);
    return;
  }

  const subdomains = data.split('\n').filter(Boolean); // Split the file into lines and remove empty lines

  console.log(`Starting subdomain brute force for ${domain}...`);

  subdomains.forEach(sub => {
    const subdomain = `${sub.trim()}.${domain}`;
    dns.resolve(subdomain, (err, addresses) => {
      if (!err && addresses) {
        console.log(`Found subdomain: ${subdomain} -> ${addresses.join(', ')}`);
      }
    });
  });
});
