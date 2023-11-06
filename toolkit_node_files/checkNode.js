const axios = require('axios');
const fs = require('fs').promises;

// Function to fetch advisories from GitHub GraphQL API
async function getGitHubAdvisories(packageName, token) {
  const query = `
    query ($packageName: String!) {
      securityVulnerabilities(first: 100, ecosystem: NPM, package: $packageName) {
        edges {
          node {
            package {
              name
            }
            advisory {
              summary
              severity
              identifiers {
                type
                value
              }
              references {
                url
              }
            }
            vulnerableVersionRange
          }
        }
      }
    }
  `;

  const variables = { packageName };

  try {
    const response = await axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        'Authorization': `bearer ${token}`,
      },
      data: {
        query,
        variables,
      },
    });

    return response.data.data.securityVulnerabilities.edges;
  } catch (error) {
    console.error(`Error fetching data for package ${packageName}:`, error.message);
    return [];
  }
}

// Main function to check vulnerabilities in package.json
async function checkVulnerabilitiesPackageJson(packageJsonPath, githubToken) {
  try {
    const packageJsonData = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonData);
    const dependencies = packageJson.dependencies;

    let vulnerabilityReports = [];

    for (const [name, version] of Object.entries(dependencies)) {
      console.log(`Checking vulnerabilities for ${name}`);
      const advisories = await getGitHubAdvisories(name, githubToken);
      advisories.forEach(edge => {
        const node = edge.node;
        vulnerabilityReports.push({
          package: name,
          version: version,
          vulnerability: {
            summary: node.advisory.summary,
            severity: node.advisory.severity,
            identifiers: node.advisory.identifiers,
            references: node.advisory.references.map(ref => ref.url),
            vulnerableVersionRange: node.vulnerableVersionRange,
          },
        });
      });
    }

    // Save the report to a file
    await fs.writeFile('vulnerabilities.json', JSON.stringify(vulnerabilityReports, null, 2));
    console.log('Vulnerability report saved to vulnerabilities.json');
  } catch (error) {
    console.error('An error occurred while checking for vulnerabilities:', error);
  }
}

// Usage of the function
const packageJsonPath = 'package.json'; // Replace with the actual path to your package.json file
const githubToken = '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'; // Replace with your valid GitHub token

checkVulnerabilitiesPackageJson(packageJsonPath, githubToken);
