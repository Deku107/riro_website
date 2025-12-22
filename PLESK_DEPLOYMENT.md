# Plesk Deployment Guide for Riro Talehouse Website

This guide provides step-by-step instructions for deploying the Riro Talehouse website on Plesk hosting.

## Prerequisites

- Plesk control panel access
- SSH access to server
- Docker installed (for Docker deployment)
- Node.js 18+ installed (for non-Docker deployment)
- Domain name configured in Plesk

---

## Option 1: Docker Deployment (Recommended)

### Step 1: Upload Files to Server

1. Connect to your server via SSH
2. Navigate to your domain directory:
   ```bash
   cd /var/www/vhosts/yourdomain.com
   ```
3. Upload the project files using FTP or SCP:
   ```bash
   # Using SCP
   scp -r /path/to/riro_website/* user@yourserver.com:/var/www/vhosts/yourdomain.com/
   ```

### Step 2: Configure Docker in Plesk

1. Log in to Plesk control panel
2. Go to **Tools & Settings** → **Docker**
3. Ensure Docker is installed and running
4. Create a new Docker container:
   - Click **Add Container**
   - Choose **Docker Compose** option
   - Upload your `docker-compose.yml` file

### Step 3: Deploy with Docker Compose

1. In Plesk, navigate to your domain
2. Go to **Docker** tab
3. Upload and configure `docker-compose.yml`
4. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=3001`
   - Add Cloudinary credentials
5. Click **Run** to start containers

### Step 4: Configure Domain

1. In Plesk, go to **Domains** → **yourdomain.com**
2. Go to **Apache & Nginx Settings**
3. Enable **Proxy mode** (Nginx proxy)
4. Add proxy rules:
   ```
   Location: /api/
   Proxy: http://localhost:3001
   ```
5. Set document root to frontend build directory

---

## Option 2: Non-Docker Deployment

### Step 1: Backend Deployment

1. SSH into your server
2. Navigate to your domain directory:
   ```bash
   cd /var/www/vhosts/yourdomain.com
   mkdir backend
   cd backend
   ```
3. Upload backend files
4. Install dependencies:
   ```bash
   npm install --production
   ```
5. Create production environment file:
   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```
6. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```
7. Start backend with PM2:
   ```bash
   pm2 start cloudapi.js --name "riro-backend"
   pm2 save
   pm2 startup
   ```

### Step 2: Frontend Deployment

1. Build frontend locally or on server:
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```
2. Upload build files to web root:
   ```bash
   cp -r dist/* /var/www/vhosts/yourdomain.com/httpdocs/
   ```
3. Configure Plesk document root:
   - In Plesk: **Domains** → **yourdomain.com**
   - **Hosting Settings** → **Document Root**
   - Set to `/httpdocs`

### Step 3: Configure Nginx Proxy

1. In Plesk: **Domains** → **yourdomain.com**
2. **Apache & Nginx Settings**
3. Enable **Proxy mode**
4. Add additional Nginx directives:
   ```nginx
   location /api/ {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
   }
   
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

---

## Option 3: Plesk Node.js Extension

### Step 1: Install Node.js Extension

1. In Plesk: **Extensions** → **Extension Catalog**
2. Search and install **Node.js** extension
3. Configure Node.js version (18+)

### Step 2: Deploy Backend

1. Go to **Domains** → **yourdomain.com**
2. Click **Node.js** button
3. Configure:
   - Document Root: `/backend`
   - Application URL: `http://localhost:3001`
   - Application Startup File: `cloudapi.js`
4. Set environment variables
5. Click **Apply** → **Run Node.js App**

### Step 3: Deploy Frontend

1. Build frontend and upload to `/httpdocs`
2. Configure Nginx proxy as in Option 2

---

## SSL/TLS Configuration

1. In Plesk: **Domains** → **yourdomain.com**
2. **SSL/TLS Certificates**
3. Install Let's Encrypt certificate:
   - Click **Install**
   - Choose **Let's Encrypt**
   - Configure and install
4. Enable **HTTPS redirect**

---

## Database Considerations

Currently using JSON files for data storage. For production:

### Option A: Keep JSON Files
- Ensure proper file permissions
- Set up backup scripts
- Manual data management

### Option B: Add Database (Recommended)
1. Install PostgreSQL/MySQL in Plesk
2. Update backend to use database
3. Migrate existing JSON data

---

## Monitoring and Maintenance

### Docker Deployment
```bash
# Check container status
docker ps
docker logs riro-backend
docker logs riro-frontend

# Restart containers
docker-compose restart
```

### PM2 Deployment
```bash
# Check status
pm2 status
pm2 logs

# Restart
pm2 restart riro-backend
```

### Backup Scripts
Create cron jobs for regular backups:
```bash
# Backup JSON data
0 2 * * * cp /var/www/vhosts/yourdomain.com/backend/*.json /backup/

# Backup database (if using)
0 3 * * * pg_dump dbname > /backup/dbname.sql
```

---

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Backend not running
   - Check PM2/Docker status
   - Verify port 3001 is accessible

2. **404 on API endpoints**: Nginx proxy misconfigured
   - Check Nginx configuration
   - Verify proxy rules

3. **CORS errors**: Frontend can't access backend
   - Update CORS settings in backend
   - Verify domain in CORS origin

4. **File upload issues**: Permissions problem
   - Check uploads directory permissions
   - Verify Cloudinary configuration

### Debug Commands

```bash
# Check logs
tail -f /var/log/nginx/error.log
pm2 logs
docker logs riro-backend

# Test API
curl http://localhost:3001/api/health
curl http://yourdomain.com/api/health
```

---

## Performance Optimization

1. Enable Nginx caching
2. Configure CDN for static assets
3. Optimize images
4. Enable Gzip compression
5. Use Redis for session storage (if needed)

---

## Security Considerations

1. Update all dependencies regularly
2. Use strong passwords for database
3. Enable firewall rules
4. Regular security scans
5. Keep Cloudinary keys secure
6. Use HTTPS only

---

## Deployment Checklist

- [ ] Backend installed and running
- [ ] Frontend built and uploaded
- [ ] Nginx proxy configured
- [ ] SSL certificate installed
- [ ] API endpoints accessible
- [ ] File uploads working
- [ ] Admin panel functional
- [ ] Database backup configured
- [ ] Monitoring set up
- [ ] Security measures implemented
