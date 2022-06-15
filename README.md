# Task management system

Task management system built with next.js, semantic ui and prisma

## Getting Started

### Set the version of Node with Node Version Manager

```bash
nvm use
```

### Install project

```bash
npm install
# or
yarn install
```

### Start Docker container

```bash
docker-compose up -d
```

### Run Prisma migrations

```bash
npx prisma migrate dev
```

### Run the project

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Useful information

### Seed data into database

```bash
npx prisma db seed
```

### View database entries

```bash
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) in your browser

### Troubleshooting

If you have other docker containers setup on your machine you may encouter "no space left on device" errors. The file space allocation of docker can be increase in Docker Desktop > Preferences > Resources.
