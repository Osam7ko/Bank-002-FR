# 🏦 BankApp - Modern Banking Frontend

A modern, secure, and user-friendly banking application frontend built with Vue 3 and integrated with Spring Boot backend.

## 🚀 Features

### Current Features

- ✅ **Secure Authentication** - JWT-based login and registration
- ✅ **Money Transfers** - Send money to beneficiaries with real-time verification
- ✅ **Beneficiary Management** - Add, view, and manage transfer recipients
- ✅ **Account Operations** - Credit and debit operations with security locks
- ✅ **Balance Tracking** - Real-time balance enquiry and monitoring
- ✅ **Transaction History** - View recent transactions and generate statements
- ✅ **Account Security** - All operations locked to authenticated user's account
- ✅ **Responsive Design** - Mobile-first design with modern UI/UX

### 🚀 Coming Soon

- 🔜 **Bank Card Management** - Create and manage Visa, Mastercard, and Mada cards
- 🔜 **Sub-Account Creation** - Create multiple accounts for different purposes
- 🔜 **Mobile Banking App** - Native iOS and Android applications

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Pinia (optional)
- **Build Tool**: Vite
- **Authentication**: JWT tokens with localStorage

## 📁 Project Structure

```
FR-vue/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   └── home/            # Dashboard components
│   ├── pages/               # Application pages
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Dashboard.vue
│   │   ├── Transfer.vue
│   │   ├── Credit.vue
│   │   ├── Debit.vue
│   │   ├── Statement.vue
│   │   ├── Beneficiaries.vue
│   │   └── UserInfo.vue
│   ├── composables/         # Vue composables for logic separation
│   │   ├── useAuth.js
│   │   ├── useTransfer.js
│   │   ├── useBalance.js
│   │   └── useTransactions.js
│   ├── services/
│   │   └── api.js           # Axios instance with JWT interceptor
│   ├── router/
│   │   └── index.js         # Route definitions with guards
│   └── assets/
│       └── css/
│           └── main.css     # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spring Boot backend running on `http://localhost:8080`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FR-vue
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

## 🔐 Authentication

The application uses JWT-based authentication:

- Tokens are stored in localStorage
- Automatic token attachment to API requests
- Auto-logout on token expiry
- Protected routes with authentication guards

## 🏦 Banking Features

### Account Security

- All account operations are locked to the authenticated user's account
- Visual indicators show locked fields
- Prevents unauthorized account access

### Money Transfers

- Real-time beneficiary verification
- Secure transfer with amount validation
- Transaction confirmation and success feedback

### Transaction Management

- Recent transactions display
- Bank statement generation
- Transaction history with filtering

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional banking interface
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Visual feedback for all operations
- **Error Handling**: Comprehensive error messages
- **Success Feedback**: Clear confirmation for completed actions

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8080";
```

### Styling

Customize colors and themes in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors
      }
    }
  }
}
```

## 📱 API Integration

The frontend integrates with the following backend endpoints:

### User Operations

- `POST /api/user` - Create account
- `POST /api/user/login` - User login
- `POST /api/user/balanceEnquiry` - Check balance
- `POST /api/user/nameEnquiry` - Verify account name
- `POST /api/user/credit` - Credit account
- `POST /api/user/debit` - Debit account
- `POST /api/user/transfer` - Transfer money

### Beneficiary Management

- `GET /api/beneficiaries` - Get all beneficiaries
- `POST /api/beneficiaries` - Add beneficiary
- `DELETE /api/beneficiaries/{id}` - Remove beneficiary

### Transaction History

- `GET /bankStatement` - Generate statement
- `GET /bankStatement/recent` - Get recent transactions

## 🛡️ Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Protected routes
- Account operation restrictions
- Input validation and sanitization

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- Vue 3 Composition API
- ES6+ JavaScript
- Tailwind CSS for styling
- Modular component architecture

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using Vue 3, Spring Boot, and modern web technologies**
