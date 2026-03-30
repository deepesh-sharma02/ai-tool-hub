# Deployment Guide - AI Seva Platform

## Overview

This guide covers deploying both frontend and backend to production.

## Backend Deployment Options

### Option 1: Railway.app (Recommended - Easy & Free)

1. **Create account at railway.app**

2. **Create requirements.txt** (already done)

3. **Create runtime.txt**:
```
python-3.9.16
```

4. **Create Procfile**:
```
web: gunicorn app:app
```

5. **Install gunicorn**:
```bash
pip install gunicorn
# Add to requirements.txt
```

6. **Deploy**:
- Connect GitHub repo
- Railway auto-detects Python
- Add environment variables in dashboard
- Deploy!

**Environment Variables to Set:**
```
SECRET_KEY=your-secret-production-key
JWT_SECRET_KEY=your-jwt-production-key
FLASK_ENV=production
```

### Option 2: Heroku

Similar to Railway:

1. **Create Procfile**:
```
web: gunicorn app:app
```

2. **Create runtime.txt**:
```
python-3.9.16
```

3. **Add buildpacks**:
```bash
heroku buildpacks:add --index 1 heroku/python
heroku buildpacks:add --index 2 https://github.com/heroku/heroku-buildpack-apt
```

4. **Create Aptfile** (for Tesseract):
```
tesseract-ocr
tesseract-ocr-hin
tesseract-ocr-guj
```

5. **Deploy**:
```bash
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Create app from GitHub
2. Select Python
3. Set build command: `pip install -r requirements.txt`
4. Set run command: `gunicorn -w 4 -b 0.0.0.0:8080 app:app`

### Option 4: AWS EC2 (Advanced)

**Setup Ubuntu Server:**

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Python
sudo apt install python3-pip python3-venv -y

# Install Tesseract
sudo apt install tesseract-ocr tesseract-ocr-hin tesseract-ocr-guj -y

# Install LibreOffice (for document conversion)
sudo apt install libreoffice -y

# Clone your repo
git clone https://github.com/yourusername/ai-seva-backend.git
cd ai-seva-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/aiseva.service
```

**Service file content:**
```ini
[Unit]
Description=AI Seva Flask Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ai-seva-backend
Environment="PATH=/home/ubuntu/ai-seva-backend/venv/bin"
ExecStart=/home/ubuntu/ai-seva-backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

**Start service:**
```bash
sudo systemctl start aiseva
sudo systemctl enable aiseva
sudo systemctl status aiseva
```

**Setup Nginx:**
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/aiseva
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/aiseva /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect GitHub repo to Vercel**

2. **Configure build settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add environment variable**:
```
VITE_API_URL=https://your-backend-url.com/api
```

4. **Deploy** - Automatic on push

### Option 2: Netlify

1. **Connect GitHub**

2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment variables**:
```
VITE_API_URL=https://your-backend-url.com/api
```

4. **Create netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**:
```json
{
  "homepage": "https://yourusername.github.io/ai-seva",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Deploy**:
```bash
npm run deploy
```

## Database Migration (Production)

### PostgreSQL Setup

1. **Create PostgreSQL database** (on Railway, Heroku, or AWS RDS)

2. **Update backend dependencies**:
```bash
pip install psycopg2-binary Flask-SQLAlchemy
```

3. **Update app.py**:
```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create tables
with app.app_context():
    db.create_all()
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-super-secret-key-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key-min-32-chars
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: External APIs
OPENAI_API_KEY=sk-...
STABILITY_API_KEY=sk-...
```

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Domain Setup

### Backend Subdomain
1. Add A record: `api.yourdomain.com` → Your server IP
2. Or CNAME: `api.yourdomain.com` → `your-app.railway.app`

### Frontend Domain
1. Add A record: `yourdomain.com` → Vercel IP
2. Add CNAME: `www` → Vercel alias

## SSL/HTTPS

### Backend (if on VPS)
```bash
sudo certbot --nginx -d api.yourdomain.com
```

### Frontend
- Vercel/Netlify: Automatic SSL ✅
- Custom domain: Added through platform

## Monitoring & Logging

### Backend Logging

**Add to app.py**:
```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('aiseva.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('AI Seva startup')
```

### Error Tracking

**Sentry Integration**:
```bash
pip install sentry-sdk[flask]
```

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

## Performance Optimization

### Backend

1. **Add Redis caching**:
```bash
pip install redis Flask-Caching
```

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': os.getenv('REDIS_URL')})

@app.route('/api/ai/translate')
@cache.cached(timeout=300)
def translate():
    # ...
```

2. **Enable gzip compression**:
```bash
pip install Flask-Compress
```

```python
from flask_compress import Compress
Compress(app)
```

3. **Add rate limiting**:
```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379"
)
```

### Frontend

1. **Code splitting** (already handled by Vite)

2. **Image optimization**:
   - Use WebP format
   - Lazy load images
   - Use CDN

3. **CDN for static assets**:
   - Cloudflare
   - AWS CloudFront

## Backup Strategy

### Database Backups

**PostgreSQL (automated)**:
```bash
# Daily backup cron job
0 2 * * * pg_dump -U postgres aiseva > /backups/aiseva_$(date +\%Y\%m\%d).sql
```

### File Uploads

- Use S3 or similar object storage
- Enable versioning
- Set lifecycle policies

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] File upload size limits
- [ ] File type validation
- [ ] SQL injection protection (using SQLAlchemy)
- [ ] XSS protection
- [ ] CSRF tokens (if using forms)
- [ ] Secure password hashing (bcrypt)
- [ ] JWT token expiration
- [ ] Environment variables for secrets
- [ ] Regular dependency updates
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't log passwords/tokens

## Cost Estimation

### Free Tier (Development/MVP)
- Frontend: Vercel/Netlify (Free)
- Backend: Railway (Free tier)
- Database: Railway PostgreSQL (Free tier)
- SSL: Let's Encrypt (Free)
- **Total: $0/month**

### Production (Small Scale)
- Frontend: Vercel Pro ($20/month)
- Backend: Railway ($10-20/month)
- Database: Railway PostgreSQL ($10/month)
- Object Storage: AWS S3 (~$1-5/month)
- **Total: ~$40-60/month**

### Production (Medium Scale)
- Frontend: Vercel Pro + CDN ($50/month)
- Backend: AWS EC2 t3.medium ($30/month)
- Database: AWS RDS ($30/month)
- Redis Cache: AWS ElastiCache ($15/month)
- Object Storage: AWS S3 ($10/month)
- Monitoring: Sentry ($26/month)
- **Total: ~$160/month**

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Secrets rotated
- [ ] Dependencies updated
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Backup strategy in place

### Deployment
- [ ] Backend deployed
- [ ] Database migrated
- [ ] Frontend deployed
- [ ] DNS configured
- [ ] SSL certificates active
- [ ] Monitoring enabled
- [ ] Error tracking enabled

### Post-Deployment
- [ ] Health check endpoint working
- [ ] All tools tested
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email notifications working (if enabled)
- [ ] Analytics tracking
- [ ] Performance monitoring

## Rollback Plan

If deployment fails:

1. **Backend rollback**:
```bash
git revert HEAD
git push heroku main
```

2. **Frontend rollback**:
   - Vercel: Use deployment history to rollback
   - Netlify: Rollback from deployments tab

3. **Database rollback**:
```bash
# Restore from backup
psql -U postgres aiseva < /backups/aiseva_backup.sql
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Your deployment script
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Support & Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check uptime
- Review usage metrics

**Weekly:**
- Review security alerts
- Update dependencies
- Check backup status

**Monthly:**
- Security audit
- Performance review
- Cost analysis
- User feedback review

## Troubleshooting Production Issues

### Backend not responding
```bash
# Check logs
heroku logs --tail
# or
sudo journalctl -u aiseva -f

# Check if process is running
ps aux | grep gunicorn

# Restart service
sudo systemctl restart aiseva
```

### Database connection issues
```bash
# Test connection
psql $DATABASE_URL

# Check connections
SELECT count(*) FROM pg_stat_activity;
```

### High memory usage
```bash
# Check memory
free -h

# Check process memory
ps aux --sort=-%mem | head

# Restart with more workers
gunicorn -w 2 app:app  # Reduce workers
```

## Success Metrics

Track these metrics:

- **Uptime**: Target 99.9%
- **Response Time**: < 500ms average
- **Error Rate**: < 1%
- **Daily Active Users**
- **Tool Usage Statistics**
- **Conversion Rate** (signups)

## Next Steps After Deployment

1. ✅ Monitor for 24 hours
2. ✅ Gather user feedback
3. ✅ Fix any critical bugs
4. ✅ Optimize performance
5. ✅ Add analytics
6. ✅ Market your platform
7. ✅ Iterate based on data

---

**Congratulations! Your AI Seva platform is now live! 🎉**

Remember:
- Start small (free tier)
- Monitor closely
- Scale as needed
- Keep users happy
- Iterate continuously
