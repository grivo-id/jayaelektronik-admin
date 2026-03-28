# Docker Setup - Jaya Elektronik Admin

## Prerequisites
- Docker installed on your machine

## Build & Run

### Build the Docker Image

```bash
cd jayaelektronik-admin

# Build the image
docker build -t jayaelektronik-admin .

# Or with a specific tag
docker build -t jayaelektronik-admin:v1.0 .
```

### Run the Container

```bash
# Run the container
docker run -d \
  --name jayaelektronik-admin \
  -p 3001:80 \
  jayaelektronik-admin

# View logs
docker logs -f jayaelektronik-admin

# Stop the container
docker stop jayaelektronik-admin
docker rm jayaelektronik-admin
```

The admin will be available at: **http://localhost:3001**

## Changing the Port

To use a different port, modify the `-p` parameter:

```bash
# Use port 8080 instead of 3001
docker run -d --name jayaelektronik-admin -p 8080:80 jayaelektronik-admin
```

## Production Deployment

### Deploy to Zeabur/Railway

1. Push your code to GitHub
2. Connect your repo to Zeabur/Railway
3. Set root directory to `jayaelektronik-admin`
4. The platform will auto-detect the Dockerfile
5. Deploy!

### Deploy to VPS (Ubuntu/Debian)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone your repo
git clone <your-repo-url>
cd <repo-name>/jayaelektronik-admin

# Build and run
docker build -t jayaelektronik-admin .
docker run -d --name jayaelektronik-admin -p 80:80 jayaelektronik-admin --restart unless-stopped
```

### Deploy with Custom Domain

```bash
# Run with domain configuration
docker run -d \
  --name jayaelektronik-admin \
  -p 80:80 \
  -e SERVER_NAME=admin.jayaelektronik.com \
  jayaelektronik-admin
```

Then update `nginx.conf` and rebuild the image.

## Environment Variables

To pass environment variables to your React app:

### Option 1: Build-time variables

```dockerfile
# In Dockerfile, add before npm run build:
ARG VITE_API_BASE_URL=https://api.example.com
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```

```bash
docker build --build-arg VITE_API_BASE_URL=https://api-jayaelektronik.zeabur.app -t jayaelektronik-admin .
```

### Option 2: Runtime configuration with nginx

The `nginx.conf` already includes API proxy to `/api/`. You can modify it to point to your backend.

## Troubleshooting

### Build fails with "module not found"

```bash
# Clean build without cache
docker build --no-cache -t jayaelektronik-admin .
```

### Container starts but shows blank page

```bash
# Check the logs
docker logs jayaelektronik-admin

# Verify files were copied
docker exec -it jayaelektronik-admin ls -la /usr/share/nginx/html

# You should see index.html and assets folder
```

### Port already in use

```bash
# Find what's using the port
# On Windows:
netstat -ano | findstr :3001

# On Linux/Mac:
lsof -i :3001

# Or use a different port
docker run -d --name jayaelektronik-admin -p 3002:80 jayaelektronik-admin
```

### Container exits immediately

```bash
# Check logs for errors
docker logs jayaelektronik-admin

# Check nginx configuration
docker exec -it jayaelektronik-admin nginx -t
```

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild the image
docker build -t jayaelektronik-admin .

# Stop and remove old container
docker stop jayaelektronik-admin
docker rm jayaelektronik-admin

# Run new container
docker run -d --name jayaelektronik-admin -p 3001:80 jayaelektronik-admin
```

## Image Optimization

The Dockerfile uses multi-stage build to keep the image small:

| Stage | Base Image | Purpose | Size |
|-------|-----------|---------|------|
| **Builder** | node:20-alpine | Build React app | ~1.5GB |
| **Final** | nginx:alpine | Serve static files | ~40MB |

Only the final nginx image is deployed, keeping storage usage minimal.

## nginx Configuration

The `nginx.conf` file includes:

✅ **Client-side routing** - React Router support
✅ **Gzip compression** - Faster load times
✅ **Static asset caching** - 1-year cache for JS/CSS/images
✅ **API proxy** - Proxy `/api/*` requests to backend
✅ **Security headers** - XSS, clickjacking protection
✅ **Server tokens off** - Hide nginx version

## Common Commands

```bash
# View running containers
docker ps

# View all images
docker images

# Stop container
docker stop jayaelektronik-admin

# Start stopped container
docker start jayaelektronik-admin

# Remove container
docker rm jayaelektronik-admin

# Remove image
docker rmi jayaelektronik-admin

# Enter container shell (for debugging)
docker exec -it jayaelektronik-admin sh
```
