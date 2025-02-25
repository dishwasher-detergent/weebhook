# Weebhook

Weebhook is an application that allows you to generate custom URLs that can be used as webhook endpoints (e.g., save-took-with.weebhook.com). The application captures and displays the payloads received from various webhooks, enabling you to inspect and analyze them with ease.

### Features

- Custom URL generation for setting as webhook endpoints.
- Payload Viewer to inspect and store payloads from webhook requests.

### Tech Stack

- Next.js: React framework for building server-rendered and static web applications.
- Tailwind CSS: Utility-first CSS framework for styling.
- Appwrite: Backend-as-a-service for managing authentication, databases, and more.

## Getting Started

### Prerequisites

- Node.js (version 20.x or later)
- Appwrite instance (You can use the Appwrite cloud or set up locally)

### Installation

Clone the repository:

```bash
git clone https://github.com/dishwasher-detergent/weebhook.git
cd weebhook
```

### Install dependencies:

```bash
npm install
```

### Set up Appwrite:
(Must have the Appwrite CLI installed, https://www.npmjs.com/package/appwrite-cli)

1. `appwrite login`
2. `appwrite push (Select settings, and collections)`

### Set up environment variables:

Create an .env file based on the .env.sample.

### Run the development server:

```bash
npm run dev
```

The application should now be running at http://localhost:3000.

### Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
