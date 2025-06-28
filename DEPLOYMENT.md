# 🚀 Deployment Guide

## Prerequisites

- Node.js 16+ installed
- Git installed
- Access to the Spring Boot backend

## Environment Setup

1. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```bash
   # Edit .env file
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_APP_NAME=BankApp
   VITE_APP_VERSION=1.0.0
   ```

## Development Deployment

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Access application**
   ```
   http://localhost:3000
   ```

## Production Deployment

### Build for Production

1. **Create production build**

   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

### Deploy to Static Hosting

#### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

#### Vercel

1. Import project from GitHub
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard

#### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

### Deploy to VPS/Server

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Copy dist folder to server**

   ```bash
   scp -r dist/ user@server:/var/www/bankapp/
   ```

3. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/bankapp;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Docker Deployment

1. **Create Dockerfile**

   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run**
   ```bash
   docker build -t bankapp-frontend .
   docker run -p 80:80 bankapp-frontend
   ```

## Environment Variables

| Variable            | Description         | Default                 |
| ------------------- | ------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API URL     | `http://localhost:8080` |
| `VITE_APP_NAME`     | Application name    | `BankApp`               |
| `VITE_APP_VERSION`  | Application version | `1.0.0`                 |

## Security Considerations

- Always use HTTPS in production
- Configure CORS properly on backend
- Set secure headers in web server
- Use environment variables for sensitive data
- Enable CSP (Content Security Policy)

## Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor performance (Google Analytics, Hotjar)
- Set up uptime monitoring
- Configure logging for debugging

## Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Check `VITE_API_BASE_URL` in .env
   - Verify backend is running
   - Check CORS configuration

2. **Build Fails**

   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Routing Issues**
   - Configure server for SPA routing
   - Check Vue Router configuration
   - Verify base URL settings

### Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images and assets
- Enable browser caching
