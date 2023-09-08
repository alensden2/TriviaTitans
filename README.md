# Multi-Cloud Serverless Online Trivia Game

Welcome to the Multi-Cloud Serverless Online Trivia Game project! This exciting project combines advanced features, user customization, and data-driven optimizations to deliver an engaging and competitive online trivia gaming experience.

### Features Developed by Me

#### User Authentication

- Users can sign up and log in using their social media accounts (Facebook & Google) or email addresses.
- Password recovery and reset functionality is supported, enhancing user convenience and security.
- Implemented second-factor authentication using DynamoDB to store predefined questions and answers, validated through AWS Lambda functions.
- Technologies used: GCP Firebase Authentication, DynamoDB, AWS Lambda.

#### Team Management with AI Integration

- The system utilizes AI (OPENAI API) to generate unique and engaging team names during team creation.
- Users can invite others to join their teams, with invitations sent efficiently using Pub/Sub.
- Support for accepting or declining team invitations, with acknowledgments sent using Pub/Sub.
- Team statistics, including games played, win/loss ratio, and total points earned, are available.
- Team administrators have the ability to manage team members, including promoting members to admin status, removing members, or leaving the team.
- Technologies used: AWS DynamoDB, Lambda Functions, SQS, SNS, and integration with ChatGPT from OpenAI for AI-generated team names.

## Serverless Architecture

- The project employs a serverless architecture, utilizing a total of 15 Lambda functions for various tasks and processes.
- Infrastructure as Code (IAC) has been implemented for the Continuous Integration/Continuous Deployment (CI/CD) pipeline.
- The CI/CD pipeline automates deployment on Google Cloud Run, creating Docker images from the latest commit data, pushing them to the Google Artifact Registry, and running them on Google Cloud Run.
- Both the front-end and back-end components are deployed using this automated pipeline, ensuring efficiency and reliability in development and deployment.

## Getting Started

To get started with the Multi-Cloud Serverless Online Trivia Game project, follow these steps:

1. **Clone the Repository:** Clone this repository to your local development environment.

2. **Setup Environment:** Set up your development environment and configure cloud services (GCP and AWS) as required.

3. **Installation:** Install any project dependencies by following the instructions in the project's `README` files located in the `frontend` and `backend` directories.

4. **Deployment:** Deploy the project by following the CI/CD pipeline instructions for both the front end and back end components.

5. **Configuration:** Customize the game settings, such as trivia questions, categories, and AI integration, as needed.

6. **Testing:** Test the application thoroughly to ensure all features are functioning correctly.

7. **Documentation:** Document your specific deployment and customization processes for future reference.


## Acknowledgments

I would thank all my teammates.
