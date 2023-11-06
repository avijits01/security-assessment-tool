const axios = require('axios');
const fs = require('fs').promises;

// Function to fetch advisories from GitHub GraphQL API
async function getGitHubAdvisories(packageName, token) {
  const query = `
    query ($packageName: String!) {
      securityVulnerabilities(first: 100, ecosystem: PIP, package: $packageName) {
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
            firstPatchedVersion {
              identifier
            }
            vulnerableVersionRange
          }
        }
      }
    }
  `;

  const variables = {
    packageName,
  };

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

// Function to check if the version is within the range
function isVulnerableVersion(version, range) {
  return range.includes(version);
}

// Main function to check vulnerabilities
async function checkVulnerabilitiesRequirementsTxt(requirementsTxtPath, githubToken) {
  try {
    const requirementsData = await fs.readFile(requirementsTxtPath, 'utf8');
    const packages = requirementsData.split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [name, version] = line.split('==');
        return { name, version };
      }); // Extract package names and versions

    const vulnerabilityReports = [];

    for (const { name, version } of packages) {
      const advisories = await getGitHubAdvisories(name, githubToken);
      for (const edge of advisories) {
        const node = edge.node;
        if (isVulnerableVersion(version, node.vulnerableVersionRange)) {
          vulnerabilityReports.push({
            package: name,
            version,
            vulnerability: {
              summary: node.advisory.summary,
              severity: node.advisory.severity,
              identifiers: node.advisory.identifiers,
              references: node.advisory.references.map(ref => ref.url),
              vulnerableVersionRange: node.vulnerableVersionRange,
            },
          });
          break; // Only take the first matching advisory
        }
      }
    }

    console.log('Vulnerability Report for requirements.txt:');
    console.log(JSON.stringify(vulnerabilityReports, null, 2));
  } catch (error) {
    console.error('An error occurred while checking for vulnerabilities:', error);
  }
}

// Usage of the function
const requirementsTxtPath = 'requirements.txt'; // Replace with the actual path to your requirements.txt file
const githubToken = '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'; // Replace with your valid GitHub token

checkVulnerabilitiesRequirementsTxt(requirementsTxtPath, githubToken);
