const dns = require('dns').promises;
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const domain = 'irobot.com'; // Replace with the target domain
const wordlistPath = path.join(__dirname, 'subdomains.txt'); // Path to your wordlist file
const outputFile = path.join(__dirname, 'allSubdomains.txt'); // Output file

// Function to fetch subdomains from crt.sh
async function fetchSubdomainsFromCrt(domain) {
  const url = `https://crt.sh/?q=%25.${domain}&output=json`;
  try {
    const response = await axios.get(url);
    const subdomains = new Set(); // Use a Set to avoid duplicates

    // Parse the JSON response
    if (Array.isArray(response.data)) {
      response.data.forEach(entry => {
        const commonName = entry.name_value;
        const sans = commonName.split('\n');
        sans.forEach(cn => {
          if (cn.includes(domain)) {
            subdomains.add(cn);
          }
        });
      });
    }
    return subdomains;
  } catch (error) {
    console.error('Error fetching subdomains from crt.sh:', error.message);
    return new Set();
  }
}

// Function to brute force subdomains using DNS and a wordlist
async function bruteForceSubdomains(domain, wordlistPath) {
  const data = await fs.readFile(wordlistPath, 'utf8');
  const subdomains = data.split('\n').filter(Boolean);
  const foundSubdomains = new Set();

  for (const sub of subdomains) {
    const subdomain = `${sub.trim()}.${domain}`;
    try {
      const addresses = await dns.resolve(subdomain);
      if (addresses) {
        foundSubdomains.add(subdomain);
      }
    } catch (err) {
      // Ignore DNS resolution errors (which means subdomain does not exist)
    }
  }

  return foundSubdomains;
}

// Save subdomains to file
async function saveSubdomains(subdomains) {
  await fs.writeFile(outputFile, Array.from(subdomains).join('\n'));
  console.log(`All unique subdomains have been saved to ${outputFile}`);
}

// Execute both methods to fetch subdomains and save to file
async function findSubdomains(domain) {
  console.log(`Finding subdomains for: ${domain}`);
  const crtSubdomains = await fetchSubdomainsFromCrt(domain);
  const bruteSubdomains = await bruteForceSubdomains(domain, wordlistPath);

  // Combine the subdomains from both methods into a single Set
  const allSubdomains = new Set([...crtSubdomains, ...bruteSubdomains]);

  // Save the unique subdomains to a file
  await saveSubdomains(allSubdomains);
}

findSubdomains(domain);
