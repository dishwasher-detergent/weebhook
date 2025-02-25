# Weebhook - webhook monitor

A real-time webhook monitoring and testing tool that helps developers debug, test, and validate incoming webhook requests. Get instant visibility into HTTP requests sent to your endpoints with detailed information about headers, payload, and timing.

## Features

- 🔄 Real-time webhook monitoring
- 📝 Detailed request logging (headers, body, method)
- 🔒 Secure endpoint generation
- 📊 Request history and persistence
- 🔍 Search and filter capabilities
- 🎯 Team collaboration support
- ⚡ Zero configuration required

## How It Works

1. Create a unique endpoint for your project
2. Configure your service to send webhooks to the generated URL
3. Monitor incoming requests in real-time through the dashboard
4. Inspect request details including headers, payload, and timing
5. Share access with team members for collaborative debugging

Perfect for developers working with:

- Payment integrations
- GitHub webhooks
- CI/CD pipelines
- API integrations
- IoT devices
- Third-party services

## Built using

- Next
- Tailwind
- Appwrite

## Using Appwrite Cloud

You will need to setup an Appwrite Cloud account. [Sign up here.](https://cloud.appwrite.io/register)

Once everything above is done, you can run these commands below.

1. appwrite login
2. appwrite deploy collection
   - use **space** to select all collections
3. appwrite deploy function
   - use **space** to select all functions
   - Update env variables based on the example.env files in each function directory.

## Self Hosting

You will need to setup your own [Appwrite](appwrite.io) instance, at this time Appwrite cloud does not support relationships so you will need to self host Appwrite version 1.3.7+ yourself. You can easily self host your own instance of Appwrite using Digital Ocean. [Find that here](https://marketplace.digitalocean.com/apps/appwrite)

Once everything above is done, you can run these commands below.

1. appwrite login
2. appwrite deploy collection
   - use **space** to select all collections
3. appwrite deploy function
   - use **space** to select all functions

## Congrats, you're done!
