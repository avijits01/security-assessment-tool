# General Instructions for All Tools and Questionnaire

Before using any of the tools in this project, please follow these general steps:

1.  Clone the repository to your local machine.
2.  Navigate to the specific tool's directory from your terminal or command prompt.
3.  Run `npm install` within the tool's directory to install all the necessary dependencies for that tool.
4.  Each tool can then be executed with Node.js by running `node [filename]`, where `[filename]` is the name of the script you want to run.
5.  Also all tools has a `howToStart` file that instructs how to set up for the tool.

Ensure you have the required permissions from the owners of the web application before running any security tests.

# Part 1: Cybersecurity Questionnaire

## Questionnaire

### Overview

The Final Questionnaire transcends the traditional security checklists by providing an interactive conversational interface that adapts to the user's individual cybersecurity needs. With the aid of GPT-4, it embarks users on a journey through a series of thought-provoking questions, helping to uncover the often overlooked query - 'What cybersecurity question should I be asking?' This reflective approach ensures that users not only receive answers to their inquiries but are also guided towards asking more in-depth and pertinent questions.

### Features

- **Interactive Conversation**: Engages users in a dynamic dialogue, exploring up to 20 cybersecurity-related questions.
- **Context-Aware Follow-Ups**: Utilizes user responses to shape subsequent questions, ensuring relevance and continuity.
- **Summary Context Tagging**: Implements `$$summary$$` tags for efficient context retrieval and continuity across questions.
- **Web App Integration**: Designed with web app incorporation in mind, it uses tags like `<!single choice!>` and `<li></li>` for seamless rendering of responses.
- **Model Versatility**: While currently operating on GPT-4, the questionnaire is structured to accommodate future fine-tuned models.

### Usage

1.  Acquire an OpenAI API key by registering at the OpenAI website.
2.  Go to security-assessement/securitytool.js
3.  Insert the API key in the provided code where the `OPENAI_API_KEY` is set.
4.  Run the command-line interface (CLI) to initiate the interactive session.
5.  Engage with the CLI, which guides you through the cybersecurity assessment process.

Please note that while GPT-3.5-turbo is a more cost-effective option, GPT-4 offers enhanced accuracy for this application.

### Future Enhancements

In pursuit of greater cost-effectiveness and tailored performance, future iterations of this project will utilize a proprietary fine-tuned model. The dataset is already ready and some versions of the fine-tuned LLM is available. Hosting this model will provide a more economical and viable option for users while maintaining the nuanced and specialized nature of the questionnaire.

## Dataset

The dataset is a carefully constructed collection of cybersecurity profiles and requirements, built using Python scripting and stored in the `datasets/csv_files` directory. The `combined_datasets.csv` file is a compilation of 1000 entries that reflect diverse user data and cybersecurity needs.

This dataset is completely free to use and can be downloaded and used to fine tune cybersecurity LLMs.

#### Fine-tuning

Within the `datasets` home directory, `jsonl` files extracted from the CSV data are divided into training and validation sets. These are specifically prepared for fine-tuning GPT models to ensure the questionnaire is responsive and accurate.

#### Snapshot of the Dataset:

Below is a snapshot of the dataset, showcasing a prompt and a response from my dataset:

| prompt                                                                                                                                                                                                                       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I use Oracle Cloud as my cloud service provider, mainly for Platform as a Service (PaaS). I have a single cloud provider and cross-region replication. My primary purpose for using cloud services is IoT device management. | Using Oracle Cloud for Platform as a Service (PaaS) is a solid choice, especially with a single cloud provider. It's good that you have cross-region replication; this will help with business continuity. For IoT device management, consider tools like Terraform for IaaS management or Heroku for PaaS, and educational resources like Cloud Academy or A Cloud Guru for further learning.                                                                                   |
| My company is looking to enhance our endpoint security, particularly for remote workers. We're also interested in staying up to date with the latest security practices and tools.                                           | To enhance endpoint security for remote workers, consider endpoint protection platforms (EPP) that offer comprehensive security solutions. These can include antivirus, data encryption, intrusion detection systems, and more. You might also want to look into cybersecurity frameworks such as NIST to establish solid security policies and protocols. Staying ahead with the latest security practices and tools is crucial in the rapidly evolving field of cybersecurity. |

This dataset is utilized to create a fine-tuned model capable of guiding the user through a personalized cybersecurity assessment experience.

# Part 2: Tool Suite for Cybersecurity Scans and Assessments

## Open-Source Library Vulnerability Checker

### Description

This tool scans dependencies in Python and Node.js applications to identify any known vulnerabilities by referencing the GitHub Advisory Database.

### Installation

- Refer to `howToStart.txt` for setup instructions.

### Usage

- Obtain a GitHub API token with security advisory permissions [here](https://github.com/settings/tokens).
- Use the token within the tool's script for accessing the GitHub Advisory Database.

### OWASP Coverage

- **A6:2021-Vulnerable and Outdated Components**: Identifies security risks in outdated or vulnerable components.

### Limitations

- Subject to GitHub API rate limits.
- Not exhaustive of all known vulnerabilities.
- Manual GitHub API token management required.

For detailed advisories, see the [GitHub Advisory Database](https://github.com/advisories).

## ZAP Scanning Tools

### Description

ZAP (Zed Attack Proxy) can perform both active and passive scans on your web application to identify a wide range of security vulnerabilities. Active scanning attempts to find and potentially exploit known vulnerabilities, which can validate the actual presence of the issue. Passive scanning, on the other hand, is non-intrusive and only observes the traffic that is sent to and from the web application without modifying it.

#### Active Scans

Active scanning is an aggressive technique that sends requests to the application to discover vulnerabilities like SQL injection, Cross-Site Scripting (XSS), and other OWASP Top 10 threats. Active scans can potentially cause issues like Denial of Service (DoS) if the web application does not handle the heavy load of requests well. They should only be performed on systems you have explicit permission to test, ideally in a testing environment rather than production.

#### Passive Scans

Passive scanning is a safer approach where the scanner listens to the communication between the client and the web application. It identifies issues that can be spotted without active interaction, such as insecure set cookies, disclosure of sensitive information in HTTP headers, and more.

#### Analyzing the Report

After running the scans, ZAP will generate a report that lists the identified vulnerabilities categorized by their risk level (High, Medium, Low, Informational). To analyze the report, focus on:

- High-risk vulnerabilities first, as they pose the most significant threat.
- Medium and low risks, which can often be mitigated with simple configuration changes.
- Informational items that might not be direct vulnerabilities but can inform about bad practices.

Search for "risk": "high" in `alerts.json` to quickly locate the most critical issues that need immediate attention.

#### When to Use

- **Active Scans**: Perform when you have permission, and the risk of impacting the service is acceptable. Ideal during a late stage of development or in a dedicated testing environment.
- **Passive Scans**: Use for initial assessments and frequent checks, as they are non-intrusive and do not disrupt the application's normal operation.

### Usage

- Install the ZAP tool.
- Navigate to the `settings` via the gear icon, then to the `API` tab, and insert your `apiKey` in the designated field.
- Replace `applyable.com.au` in the scripts with the domain you wish to scan.
- Execute `zapScanActive.js` for active scanning and `zapScanPassive.js` for passive scanning.
- Review the generated reports for vulnerabilities.

### OWASP Coverage

These tools assist in identifying a broad range of security issues covered by the OWASP Top 10, including but not limited to:

- **A1:2021-Injection**: SQL injection, Command injection, etc.
- **A2:2021-Broken Authentication**: Issues with authentication mechanisms.
- **A7:2021-Cross-Site Scripting (XSS)**: Both stored and reflected XSS vulnerabilities.

### Professional Consideration

While automated tools like ZAP provide valuable insights, they are not a replacement for professional security analysis. A skilled security professional can interpret results with context, perform manual testing to confirm automated findings, and provide a comprehensive security posture of the web application.

Always ensure ethical use of scanning tools with proper authorization to prevent any legal or operational complications.

## passwordBruteForce Tool

### Description

This tool performs security scans by brute-forcing login attempts with a list of known default usernames and passwords, aiding in penetration testing to validate the strength of web application credentials.

### Installation

- Refer to `howToStart.txt` for setup instructions.

### Usage

- Populate `passwords.txt` and `usernames.txt` with credentials to test.
- Configure the `passwordCheckerZap.js` script with appropriate form field identifiers and target URL.
- Run the tool using the command: `node passwordCheckerZap.js`.

### OWASP Coverage

- **A2:2017-Broken Authentication**: Detects potential for unauthorized access through default or weak credentials.
- **A7:2021-Identification and Authentication Failures**: Assesses the effectiveness of authentication controls.
-

## Subdomain Finder Tool

### Description

This tool utilizes brute force DNS techniques to discover subdomains of a given website. It leverages a list of common subdomains provided in `subdomains.txt`.

### Installation

- Ensure you have an updated list of common subdomains in `subdomains.txt`.

### Usage

- Replace `iborot.com` in the script with the domain you wish to scan for subdomains.
- After identifying subdomains, use ZAP tools for active and passive scans to assess for injection flaws.

### OWASP Coverage

- **A3:2021-Injection**: Helps in identifying potential subdomains that could be prone to injection attacks.
- **A6:2021-Security Misconfiguration**: Detects misconfigured or unintended subdomains which could be an entry point for attackers.
