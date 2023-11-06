import pandas as pd

# Given the constraints and to maintain quality, we will generate 25 entries with diverse scenarios and recommendations.

# Define extended roles including both managers and startup owners
roles = [
    'marketing manager in a tech startup',
    'finance manager in a mid-size corporation',
    'IT manager in a government agency',
    'startup owner in the health sector',
    'operations manager in a manufacturing firm',
    'HR manager in a consulting company',
    'startup owner in the education technology sector'
]

# Define an array of possible budgets, including unspecified budgets
budgets = ['$0-$100', '$100-$500', '$500-$1000', '$1000-$5000', 'over $5000', 'unspecified']

# Define a list of cybersecurity concerns
concerns = [
    'ensuring the protection of personal data under GDPR',
    'mitigating risks associated with remote work',
    'safeguarding intellectual property from cyber threats',
    'securing online payment systems',
    'preventing data breaches in customer information',
    'maintaining compliance with HIPAA for patient data',
    'protecting educational data and ensuring safe online learning environments'
]

# Define a list of tools with descriptions and links
tools_list = [
    ('Norton Small Business', 'a business-grade antivirus solution', 'https://us.norton.com/small-business'),
    ('Slack', 'for secure team communication', 'https://slack.com'),
    ('Asana', 'for task and project management', 'https://asana.com'),
    ('Duo Security', 'for multi-factor authentication', 'https://duo.com'),
    ('Mailchimp', 'for secure email marketing campaigns', 'https://mailchimp.com'),
    ('Wireshark', 'a network protocol analyzer for security monitoring', 'https://www.wireshark.org/'),
    ('LastPass', 'a password manager for creating and storing secure passwords', 'https://www.lastpass.com/')
]

# Define a list of educational resources with descriptions and links
educational_resources_list = [
    ('Cybersecurity for Dummies', 'an introductory guide to cybersecurity principles', 'https://www.dummies.com/book/computers-internet/cybersecurity'),
    ('Coursera Cybersecurity Specializations', 'online courses for deeper cybersecurity knowledge', 'https://www.coursera.org/specializations/cyber-security'),
    ('Khan Academy Computing', 'free courses on computing and information technology', 'https://www.khanacademy.org/computing'),
    ('ISC² Cybersecurity Resources', 'professional development in cybersecurity', 'https://www.isc2.org/Develop'),
    ('Infosec Institute Resources', 'a variety of educational content for cybersecurity professionals', 'https://www.infosecinstitute.com/'),
    ('Cybersecurity and Infrastructure Security Agency (CISA) Resources', 'for cybersecurity training and best practices', 'https://www.cisa.gov/'),
    ('Federal Trade Commission - Cybersecurity for Small Business', 'a resource for cybersecurity basics', 'https://www.ftc.gov/tips-advice/business-center/small-businesses/cybersecurity')
]

# Define a list of guidelines and best practices with explanations
guidelines_and_practices = [
    ('Establish a secure VPN for all remote work activities to ensure encrypted connections.', 
     'VPNs provide a secure tunnel for data transmission, preventing unauthorized access to sensitive company information while employees work from various locations.'),
    ('Implement regular security audits to identify and mitigate vulnerabilities.', 
     'Regular audits help in early detection of security loopholes and ensure that the security posture is updated against emerging threats.'),
    ('Conduct cybersecurity awareness training sessions for all employees.', 
     'Educating employees about cybersecurity best practices is crucial to preventing human error, which is a leading cause of data breaches.'),
    ('Ensure all data is encrypted, both at rest and in transit.', 
     'Encryption protects data from being read or tampered with by unauthorized individuals.'),
    ('Adopt a multi-factor authentication system for all sensitive accounts.', 
     'MFA adds an additional layer of security, making it more difficult for unauthorized users to gain access even if they have one set of credentials.')
]

# Generate prompts and responses for the dataset
data = {
    "prompt": [],
    "response": []
}


# Generate prompts and responses for the dataset
data = {
    "prompt": [],
    "response": []
}

# Loop to generate 25 entries
for i in range(25):
    role = roles[i % len(roles)]
    budget = budgets[i % len(budgets)]
    concern = concerns[i % len(concerns)]
    
    # Select two random tools and two educational resources for each entry
    selected_tools = tools_list[i % len(tools_list):(i + 2) % len(tools_list)]
    selected_educational_resources = educational_resources_list[i % len(educational_resources_list):(i + 2) % len(educational_resources_list)]
    selected_practices = guidelines_and_practices[i % len(guidelines_and_practices):(i + 2) % len(guidelines_and_practices)]
    
    # Generate a detailed prompt
    prompt = f"As a {role}, who {concern}, with a budget of {budget}, what cybersecurity measures should be taken?"
    
    # Generate a detailed response
    response = f"To enhance your cybersecurity posture, consider the following guidelines and best practices: "
    for practice, explanation in selected_practices:
        response += f"{practice} {explanation} "
    
    response += "Here are some tools you could use: "
    for tool_name, tool_description, tool_link in selected_tools:
        response += f"{tool_name} ({tool_description}) - {tool_link}. "
    
    response += "Additionally, consider these educational resources to further your knowledge and skills: "
    for resource_title, resource_description, resource_link in selected_educational_resources:
        response += f"{resource_title} ({resource_description}) - {resource_link}. "
    
    response += "Based on your budget and requirements, you might also explore other tools and resources that meet your specific needs."
    
    # Add the prompt and response to the dataset
    data["prompt"].append(prompt)
    data["response"].append(response)

# Convert the dataset into a DataFrame
df = pd.DataFrame(data)

# Save the DataFrame to a CSV file
csv_file_path = '/mnt/data/cybersecurity_prompts_responses.csv'
df.to_csv(csv_file_path, index=False)

csv_file_path