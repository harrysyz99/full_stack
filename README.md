# AI-Oriented Trading Platform

A full-stack trading discussion platform with AI-powered sentiment analysis, stock recommendations, and portfolio management.

Team: Peiwen Li, Shiyang Zhang, Sizhuang He, Yangtian Zhang

## Tech Stack

Backend: Node.js, Express, MongoDB
Frontend: React
Features: JWT Auth, AI Analysis, Portfolio Tracking, News Integration

## Quick Start

1. Install dependencies
npm install
cd frontend && npm install && cd ..

2. Setup environment
cp .env.example .env

3. Start MongoDB
brew services start mongodb-community

4. Run application
npm run dev

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Core Features

- User authentication and profiles
- Discussion board with CRUD operations
- AI sentiment analysis on posts
- Portfolio management with analytics
- Stock news integration
- Admin moderation tools

## TODO

Security
- Rate limiting for API endpoints
- Input validation middleware
- CSRF protection
- Password reset functionality
- Email verification

Features
- Real-time notifications (Socket.io)
- User follow/followers system
- Post search and filtering
- Image upload (avatars, post images)
- Direct messaging
- Trending posts/topics

Performance
- Redis caching for hot data
- Database indexing optimization
- Pagination for data loading
- Image compression and CDN
- Code splitting and lazy loading
