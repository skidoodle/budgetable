# Budgetable

A simple, web-based app to track items you want to buy later. It lets you easily add, update, and manage your items, with the ability to toggle between "Paid" and "Unpaid" statuses.

## Features
- Add, update, and delete items in your list.
- Toggle item statuses between "Paid" and "Unpaid."
- User-friendly interface with responsive design.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [PocketBase](https://pocketbase.io/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

### Setting Environment Variables
Before running the app, set the following environment variables in a `.env.local` file:
- `NEXT_PUBLIC_POCKETBASE_URL`: The URL of your PocketBase server.
- `EMAIL`: The email address used to log in to the PocketBase instance.
- `PASSWORD`: The password used to log in to the PocketBase instance.
- `COLLECTION`: The name of the PocketBase collection to store your items.

Example:
```env
NEXT_PUBLIC_POCKETBASE_URL=https://pocketbase
EMAIL=example@example.com
PASSWORD=yourpassword
COLLECTION=pbcollection
```

### Running Locally
To run Budgetable on your local machine, follow these steps:

```bash
git clone https://github.com/skidoodle/budgetable
cd budgetable
pnpm install
pnpm dev
```
Access the app at `http://localhost:3000`.

### Deployment with Docker
#### Using Docker Run
1. Pull the Docker image from GitHub Container Registry:
   ```bash
   docker pull ghcr.io/skidoodle/budgetable:main
   ```
2. Run the Docker container with a persistent volume:
   ```bash
   docker run -d \
     -p 3000:3000 \
     --name budgetable \
     -v data:/app \
     -e NEXT_PUBLIC_POCKETBASE_URL=https://pocketbase \
     -e EMAIL=example@example.com \
     -e PASSWORD=yourpassword \
     -e COLLECTION=pbcollection \
     ghcr.io/skidoodle/budgetable:main
   ```
3. Access the app at `http://localhost:3000`.

#### Using Docker Compose
1. Create a `docker-compose.yml` file in the project root:
   ```yaml
   services:
     budgetable:
       image: ghcr.io/skidoodle/budgetable:main
       ports:
         - "3000:3000"
       volumes:
         - data:/app
       environment:
         NEXT_PUBLIC_POCKETBASE_URL: https://pocketbase
         EMAIL: example@example.com
         PASSWORD: yourpassword
         COLLECTION=pbcollection
   volumes:
     data:
   ```
2. Start the services:
   ```bash
   docker-compose up -d
   ```
3. Access the app at `http://localhost:3000`.

## License
[GPL-3.0](https://github.com/skidoodle/budgetable/blob/master/license)

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## Support
If you encounter any issues or have questions, please create an issue in the repository.

