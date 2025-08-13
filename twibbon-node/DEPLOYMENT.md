# 🚀 Deployment Guide untuk Rocky Linux dengan PM2

## 📋 Prerequisites

- Node.js 18+ terinstall
- MySQL/MariaDB terinstall dan running
- Git terinstall
- Akses root/sudo

## 🔧 Setup Awal di Server Rocky Linux

### 1. Install Node.js dan NPM

```bash
# Install Node.js 18+ dari NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PM2 Global

```bash
sudo npm install -g pm2
```

### 3. Setup Database MySQL

```bash
# Login ke MySQL
mysql -u root -p

# Buat database dan user
CREATE DATABASE twibbon_db;
CREATE USER 'twibbon_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON twibbon_db.* TO 'twibbon_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 🚀 Deployment Steps

### 1. Clone/Upload Project

```bash
# Jika menggunakan git
git clone <your-repo-url>
cd twibbon-node

# Atau upload manual via SCP/SFTP
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Setup Environment Variables

```bash
# Copy environment file dari env.production
cp env.production .env

# Edit file .env sesuai konfigurasi server
nano .env
```

### 4. Jalankan Deployment Script

```bash
# Berikan permission execute
chmod +x deploy.sh

# Jalankan deployment
./deploy.sh
```

## 📊 PM2 Management Commands

```bash
# Start service
pm2 start ecosystem.config.js --env production

# Stop service
pm2 stop twibbon-backend

# Restart service
pm2 restart twibbon-backend

# View logs
pm2 logs twibbon-backend

# View status
pm2 status

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

## 🔍 Monitoring dan Logs

### View Real-time Logs

```bash
pm2 logs twibbon-backend --lines 100
```

### View Specific Log Files

```bash
# Error logs
tail -f logs/err.log

# Output logs
tail -f logs/out.log

# Combined logs
tail -f logs/combined.log
```

## 🛠️ Troubleshooting

### Service tidak start

```bash
# Check logs
pm2 logs twibbon-backend

# Check status
pm2 status

# Restart service
pm2 restart twibbon-backend
```

### Port sudah digunakan

```bash
# Check port usage
sudo netstat -tlnp | grep :5000

# Kill process yang menggunakan port
sudo kill -9 <PID>
```

### Database connection error

```bash
# Check MySQL status
sudo systemctl status mysqld

# Restart MySQL
sudo systemctl restart mysqld
```

## 🔒 Security Considerations

1. **Change default passwords** di database
2. **Update session secret** di environment variables
3. **Setup firewall** untuk membatasi akses
4. **Use HTTPS** dengan reverse proxy (Nginx/Apache)
5. **Regular updates** untuk dependencies

## 📈 Performance Tuning

### PM2 Configuration

- `instances`: Sesuaikan dengan jumlah CPU cores
- `max_memory_restart`: Sesuaikan dengan available RAM
- `watch`: Disable di production untuk performance

### Database Optimization

- Setup proper indexes
- Optimize queries
- Regular maintenance

## 🔄 Update Deployment

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install --production

# Restart service
pm2 restart twibbon-backend
```

## 📞 Support

Jika ada masalah, check:

1. PM2 logs: `pm2 logs twibbon-backend`
2. System logs: `journalctl -u pm2-root`
3. Database logs: MySQL error log
4. Network: `netstat`, `ss`, firewall rules
