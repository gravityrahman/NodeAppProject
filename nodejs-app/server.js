require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Home route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rahman DevOps Demo App</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
          text-align: center;
          max-width: 600px;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        .info {
          background: rgba(255, 255, 255, 0.2);
          padding: 1.5rem;
          border-radius: 10px;
          margin: 1rem 0;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
        }
        .endpoints {
          text-align: left;
          margin-top: 2rem;
        }
        .endpoint {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.8rem;
          margin: 0.5rem 0;
          border-radius: 5px;
          font-family: monospace;
        }
        .success {
          color: #4ade80;
          font-size: 1.5rem;
          margin: 1rem 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 DevOps Demo App</h1>
        <p class="success">✅ Application Running Successfully!</p>
        <p>Deployed with Jenkins CI/CD Pipeline</p>
        
        <div class="info">
          <div class="info-item">
            <span class="label">Environment:</span>
            <span>${process.env.NODE_ENV || 'development'}</span>
          </div>
          <div class="info-item">
            <span class="label">Node Version:</span>
            <span>${process.version}</span>
          </div>
          <div class="info-item">
            <span class="label">Port:</span>
            <span>${PORT}</span>
          </div>
          <div class="info-item">
            <span class="label">Hostname:</span>
            <span>${require('os').hostname()}</span>
          </div>
        </div>

        <div class="endpoints">
          <h3>Available Endpoints:</h3>
          <div class="endpoint">GET / - Home page</div>
          <div class="endpoint">GET /health - Health check</div>
          <div class="endpoint">GET /api/info - Application info</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    app: 'DevOps Demo Application',
    version: '1.0.0',
    description: 'Node.js app deployed via Jenkins CI/CD',
    endpoints: [
      { method: 'GET', path: '/', description: 'Home page' },
      { method: 'GET', path: '/health', description: 'Health check' },
      { method: 'GET', path: '/api/info', description: 'Application info' }
    ],
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      hostname: require('os').hostname(),
      uptime: process.uptime()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`,
    availableRoutes: ['/', '/health', '/api/info']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🚀 DevOps Demo App Server Started      ║
╠═══════════════════════════════════════════╣
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(27)}║
║   Port: ${PORT.toString().padEnd(33)}║
║   Node Version: ${process.version.padEnd(25)}║
╚═══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
