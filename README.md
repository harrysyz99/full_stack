# AI-Oriented Trading Platform

A full-stack web application that serves as a discussion board/forum for trading enthusiasts with AI-powered features including sentiment analysis, stock recommendations, and portfolio insights.

**Team Members:** Peiwen Li, Shiyang Zhang, Sizhuang He, Yangtian Zhang

## 🚀 Features

### MVP Version (Nov 7, 2025)
- ✅ Three-tier architecture (MongoDB, Express/Node.js, React)
- ✅ User authentication (sign-up/login with JWT)
- ✅ Discussion board with post creation
- ✅ Database persistence

### Alpha Version (Nov 19, 2025)
- ✅ Full CRUD operations for posts (create, edit, delete)
- ✅ User profiles with portfolio management
- ✅ Portfolio display and tracking
- ✅ AI sentiment analysis on posts
- ✅ Responsive UI with modern styling

### Beta Version (Nov 28, 2025)
- ✅ News API integration (NewsAPI)
- ✅ AI stock recommendation system
- ✅ Enhanced portfolio analytics with charts
- ✅ Admin/moderation tools (pin, lock, delete posts)
- ✅ Improved UI/UX

### Final Version (Dec 10, 2025)
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Error handling and validation
- ✅ Performance optimizations

## 📋 Prerequisites

- Node.js (v14+ recommended)
- MongoDB (v4.4+ recommended)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone and Setup

\`\`\`bash
cd /Users/harry/Desktop/fullstack
\`\`\`

### 2. Install Backend Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Install Frontend Dependencies

\`\`\`bash
cd frontend
npm install
cd ..
\`\`\`

### 4. Configure Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and configure the following:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-trading-platform

# JWT Secret (change this!)
JWT_SECRET=your_secure_random_secret_key

# Optional: AI Services
OPENAI_API_KEY=your_openai_api_key_here

# Optional: News API
NEWS_API_KEY=your_news_api_key_here

# Optional: Stock Data
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
\`\`\`

### 5. Start MongoDB

Make sure MongoDB is running:

\`\`\`bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or run manually
mongod --dbpath /path/to/your/data
\`\`\`

### 6. Run the Application

#### Option A: Run Backend and Frontend Separately

Terminal 1 - Backend:
\`\`\`bash
npm run server
\`\`\`

Terminal 2 - Frontend:
\`\`\`bash
npm run client
\`\`\`

#### Option B: Run Both Concurrently (Recommended for Development)

\`\`\`bash
npm run dev
\`\`\`

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## 📁 Project Structure

\`\`\`
fullstack/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Portfolio.js
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── portfolios.js
│   │   ├── ai.js
│   │   ├── news.js
│   │   └── admin.js
│   ├── services/        # Business logic
│   │   ├── aiService.js
│   │   └── portfolioService.js
│   ├── middleware/      # Auth & validation
│   │   └── auth.js
│   └── server.js        # Express app entry
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       │   └── Header.js
│       ├── contexts/    # React context (Auth)
│       │   └── AuthContext.js
│       ├── pages/       # Page components
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Posts.js
│       │   ├── PostDetail.js
│       │   ├── CreatePost.js
│       │   ├── Profile.js
│       │   ├── Portfolio.js
│       │   ├── News.js
│       │   └── AdminDashboard.js
│       ├── services/    # API client
│       │   └── api.js
│       ├── App.js       # Main app component
│       └── App.css      # Global styles
├── .env                 # Environment variables
├── .env.example         # Example env file
├── .gitignore
├── package.json
└── README.md
\`\`\`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/portfolio` - Get user's public portfolio

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Portfolio
- `GET /api/portfolios/me` - Get user's portfolio
- `PUT /api/portfolios/me` - Update portfolio
- `POST /api/portfolios/me/holdings` - Add holding
- `DELETE /api/portfolios/me/holdings/:symbol` - Remove holding
- `POST /api/portfolios/me/analyze` - Analyze portfolio with AI

### AI Services
- `POST /api/ai/sentiment` - Analyze text sentiment
- `POST /api/ai/recommendations` - Get stock recommendations
- `GET /api/ai/market-sentiment` - Get market sentiment

### News
- `GET /api/news` - Get financial news
- `GET /api/news/stock/:symbol` - Get news for specific stock

### Admin (Requires admin/moderator role)
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/posts/:id/pin` - Pin/unpin post
- `PUT /api/admin/posts/:id/lock` - Lock/unlock post
- `DELETE /api/admin/posts/:id` - Delete post (admin)
- `PUT /api/admin/users/:id/role` - Update user role

## 🤖 AI Features

### 1. Sentiment Analysis
- Automatically analyzes post content sentiment
- Uses `sentiment` npm package
- Labels: positive, negative, neutral
- Score ranges from -infinity to +infinity

### 2. Stock Recommendations
- Portfolio diversification analysis
- Risk-based recommendations
- Sector allocation suggestions
- Customizable based on risk tolerance and market attitude

### 3. Portfolio Analytics
- Diversification scoring (0-100)
- Risk level assessment (low/medium/high)
- Sector allocation visualization
- Top performers and underperformers identification

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes and API endpoints
- Input validation and sanitization
- XSS and injection protection
- Role-based access control (user, moderator, admin)

## 🎨 UI Features

- Modern, responsive design
- Mobile-friendly layout
- Gradient color schemes
- Interactive charts (Recharts)
- Real-time updates
- Loading states and error handling

## 📊 Database Schema

### User
- username, email, password (hashed)
- role (user/admin/moderator)
- bio, avatar, marketAttitude
- createdAt, lastActive

### Post
- author (ref: User)
- title, content, category
- tags, stocks
- sentiment (score, label, analyzed)
- likes[], comments[]
- views, isPinned, isLocked
- isDeleted, deletedAt, deletedBy

### Portfolio
- user (ref: User)
- name, description, isPublic
- holdings[] (symbol, name, quantity, avgCost, currentPrice)
- totalValue, totalCost, totalReturn
- analytics (diversificationScore, riskLevel, recommendations)

## 🧪 Testing

### Manual Testing

1. **User Registration & Login**
   - Navigate to http://localhost:3000/register
   - Create account with username, email, password
   - Login with credentials

2. **Create Post**
   - Click "+ New Post" button
   - Fill in title, content, category
   - Add stock symbols (optional)
   - Submit and view sentiment analysis

3. **Portfolio Management**
   - Navigate to Portfolio page
   - Add stock holdings with quantity and cost
   - Click "Analyze with AI" for insights
   - View sector allocation chart

4. **Admin Functions** (admin user only)
   - Navigate to Admin Dashboard
   - View platform statistics
   - Pin/lock/delete posts
   - Manage user roles

## 🚧 Known Limitations

- AI recommendations are currently mock data (can be enhanced with OpenAI API)
- Stock price updates require Alpha Vantage API key
- News API has rate limits (500 requests/day free tier)
- Sentiment analysis is basic (can be improved with ML models)

## 🔮 Future Enhancements

- Real-time chat/messaging
- Advanced charting and technical analysis
- Social features (follow users, trending posts)
- Email notifications
- Mobile app (React Native)
- Integration with more data providers
- Advanced AI models (GPT-4, custom ML models)
- Paper trading simulation
- Webhook integrations

## 📝 API Key Setup

### News API (Optional but recommended)
1. Visit https://newsapi.org
2. Sign up for free account
3. Copy API key to `.env` file

### Alpha Vantage (Optional)
1. Visit https://www.alphavantage.co
2. Get free API key
3. Add to `.env` file

### OpenAI API (Optional - for enhanced AI)
1. Visit https://platform.openai.com
2. Create API key
3. Add to `.env` file

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port: `lsof -ti:5000 | xargs kill`

### Frontend Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### API Not Responding
- Check backend server logs
- Verify CORS settings
- Ensure API_URL in frontend/.env matches backend

## 👥 Team Contributions

- **Peiwen Li** - Backend Architecture & AI Services
- **Shiyang Zhang** - Frontend Development & UI/UX
- **Sizhuang He** - Database Design & API Development
- **Yangtian Zhang** - Integration & Testing

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Express.js and React.js communities
- MongoDB for database solutions
- NewsAPI for financial news data
- Alpha Vantage for stock market data
- OpenAI for AI capabilities

---

**Last Updated:** December 2025

For questions or issues, please contact the development team.
\`\`\`

# full_stack
