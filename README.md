# visionevtripplanner
**# Cognivolt - EV Bike Trip Planner 🚴⚡

A stunning 3D web application for planning eco-friendly EV bike journeys across India with real-time charging station visualization and environmental impact tracking.

## 🌟 Features

- **Dynamic Preloader**: Cognivolt logo animates from center to top-left corner
- **Time-based Greetings**: Good Morning/Afternoon/Evening based on user's local time
- **3D Bike Showcase**: Interactive 3D models of popular EV bikes with animations
- **Smart Route Planning**: Calculate optimal routes between Indian cities
- **Charging Hub Visualization**: 3D visualization of charging stations along your route
- **Environmental Tracking**: Monitor CO₂ savings and fuel cost comparisons
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Low Color Palette**: Elegant dark theme with cyan, neon green, and red accents

## 📁 Project Structure

```
ev-bike-planner/
├── index.html                 # Main HTML file
├── css/
│   ├── reset.css             # CSS reset and base styles
│   ├── variables.css         # CSS variables and theme tokens
│   ├── main.css              # Main component styles
│   ├── animations.css        # Keyframe animations
│   └── responsive.css        # Mobile and responsive styles
├── js/
│   ├── constants.js          # Constants and configuration data
│   ├── preloader.js          # Preloader animation logic
│   ├── greeting.js           # Time-based greeting system
│   ├── navigation.js         # Navigation and menu functionality
│   ├── hero-animation.js     # 3D hero section animation
│   ├── bikes-section.js      # Bike cards with 3D models
│   ├── route-planner.js      # Route planning engine
│   ├── charging-hub.js       # Charging hub 3D visualization
│   ├── 3d-models.js          # 3D model utilities
│   ├── api-handler.js        # API calls and data fetching
│   └── main.js               # Main app initialization
└── README.md                 # This file
```

## 🚀 Quick Start

### Option 1: Using Live Server (VS Code)

1. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install by Ritwick Dey

2. **Run the Project**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Browser will open automatically at `http://localhost:5500`

### Option 2: Using Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Option 3: Using Node.js HTTP Server

```bash
# Install http-server globally (if not installed)
npm install -g http-server

# Run server
http-server

# Open: http://localhost:8080
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (optional, for development tools)
- Modern browser with WebGL support (Chrome, Firefox, Edge)
- Git (for version control)

### Step 1: Clone or Download Project

```bash
git clone <repository-url>
cd ev-bike-planner
```

### Step 2: Verify File Structure

Ensure all files are in the correct folders as shown in the structure above.

### Step 3: Start Development Server

Use one of the quick start methods above.

### Step 4: Test the Application

- Open the website in your browser
- Wait for the Cognivolt logo animation (preloader)
- Check time-based greeting in top-right
- Try planning a route between cities
- View 3D bike models and charging hubs

## 📱 Features Overview

### 1. Preloader Animation
- Logo starts in center and moves to top-left corner
- Bolt icon pulses with electric effect
- Smooth fade-out transition
- Takes ~2 seconds

### 2. Time-based Greeting
- Updates based on user's local time
- Good Morning (5 AM - 12 PM) - Cyan
- Good Afternoon (12 PM - 5 PM) - Orange
- Good Evening (5 PM - 9 PM) - Red/Orange
- Good Night (9 PM - 5 AM) - Purple/Blue
- Real-time clock display

### 3. Hero Section
- Animated 3D particle background
- Smooth entrance animations
- Call-to-action button with glow effect
- Responsive layout

### 4. Bike Showcase
- 4 popular EV bikes from India market
- Individual 3D models for each bike
- Price and specifications
- Scroll-triggered animations

### 5. Route Planner
- Autocomplete city suggestions (18+ major Indian cities)
- Distance calculation using Haversine formula
- Charging stops estimation
- Trip duration calculation
- Carbon savings tracking
- Visual route map with markers

### 6. Charging Hub
- 3D visualization of charging stations
- Interactive 3D scene (rotate, zoom)
- Real-time station information
- Pulsing energy indicators
- DC and AC charger types

### 7. About Section
- Mission statement
- Key features highlight
- Environmental commitment

## 🎨 Design & Theme

### Color Palette
- **Primary Dark**: `#0a0e27` - Deep space blue
- **Secondary Dark**: `#141829`, `#1a1f3a` - Dark neutrals
- **Accent Cyan**: `#00d4ff` - Electric blue (primary accent)
- **Accent Green**: `#00ff88` - Neon green
- **Accent Red**: `#ff4444` - Energy red

### Typography
- **Display Font**: Playfair Display (elegant headlines)
- **Body Font**: Inter (clean, modern)
- **Mono Font**: Space Mono (technical data)

### Animations
- Smooth easing functions (cubic-bezier)
- Staggered element reveals
- Glow effects on interactive elements
- Parallax scrolling effects
- 3D rotation animations

## 🌐 API Integration

### Available Endpoints (Mock Data Currently)
- Route optimization
- Charging stations nearby
- Environmental impact calculation
- Real-time charging availability
- Weather data
- Traffic information
- Bike specifications

### Adding Real API Calls

Edit `js/api-handler.js` and replace mock data with actual API calls:

```javascript
async fetchRouteOptimization(start, end, bikeType) {
    const response = await fetch(`${this.endpoints.routeOptimization}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end, bikeType })
    });
    return response.json();
}
```

## 💾 Saving & Storage

The app uses browser's localStorage for:
- Saved routes (`cognivolt-routes`)
- User settings (`cognivolt-settings`)
- Navigation history (`cognivolt-nav-history`)
- Theme preference (`cognivolt-theme`)

Access saved routes:
```javascript
const savedRoutes = JSON.parse(localStorage.getItem('cognivolt-routes'));
```

## 📊 Environmental Calculation

**Carbon Emissions:**
- Petrol bike: 0.168 kg CO₂ per km
- EV bike: 0.05 kg CO₂ equivalent per km
- Average tree absorbs: 21 kg CO₂ per year

**Cost Comparison:**
- Petrol: ₹100 per liter
- EV charging: ₹0.15 per km equivalent

## 📈 Performance Metrics

- **Page Load Time**: Monitor in console
- **3D Rendering**: 60 FPS target
- **File Size**: ~3-5 MB (with Three.js)
- **Mobile Optimization**: Full responsive support

## 🔐 Security Considerations

- No sensitive data stored locally
- All calculations done client-side
- Mock API endpoints (replace with secure endpoints)
- No tracking without user consent
- HTTPS recommended for production

## 🚀 Deployment Guide

### GitHub Pages Deployment

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Add Remote Repository**
   ```bash
   git remote add origin https://github.com/username/ev-bike-planner.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "main" branch as source
   - Save
   - Site will be available at: `https://username.github.io/ev-bike-planner`

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts and your site is live!**

### Netlify Deployment

1. **Connect GitHub**
   - Sign up at netlify.com
   - Connect your GitHub account
   - Select your repository

2. **Configure**
   - Build command: (leave blank)
   - Publish directory: . (root)
   - Deploy!

3. **Custom Domain**
   - Go to Site settings → Domain management
   - Add your custom domain

### Self-Hosted (VPS/Server)

1. **Upload Files**
   ```bash
   scp -r ./ev-bike-planner user@server:/var/www/
   ```

2. **Configure Web Server** (Nginx example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/ev-bike-planner;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

3. **Enable HTTPS** (Let's Encrypt)
   ```bash
   certbot certonly --webroot -w /var/www/ev-bike-planner -d yourdomain.com
   ```

## 🧪 Testing

### Browser Testing
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Testing
- Use Chrome DevTools Lighthouse
- Monitor FPS with Performance tab
- Check mobile responsiveness with device emulation

### Functional Testing
- Test all navigation links
- Try different route combinations
- Verify 3D model rendering
- Test on different screen sizes

## 🐛 Troubleshooting

### 3D Models Not Rendering
- Check browser WebGL support
- Update graphics drivers
- Try different browser

### Route Not Calculating
- Verify city names are spelled correctly
- Check if cities are in MAJOR_CITIES_INDIA
- Clear browser cache

### Animations Lagging
- Reduce particle count in hero-animation.js
- Disable animations for older devices
- Check CPU/GPU usage

### Mobile Layout Issues
- Check viewport meta tag
- Test with device emulation
- Clear CSS cache

## 📚 Documentation

### Adding New Cities
Edit `js/constants.js`:
```javascript
const MAJOR_CITIES_INDIA = {
    'YourCity': { lat: 25.3456, lng: 82.1234 },
    // ... more cities
};
```

### Customizing Colors
Edit `css/variables.css`:
```css
:root {
    --accent-primary: #00d4ff;
    --accent-secondary: #ff4444;
    /* ... more variables */
}
```

### Adding New EV Bikes
Edit `js/constants.js`:
```javascript
const BIKES_DATA = {
    yourBike: {
        name: 'Your Bike Name',
        range: 150,
        maxSpeed: 80,
        // ... more properties
    }
};
```

## 👨‍💻 Development

### Code Standards
- Use camelCase for variables/functions
- Use UPPER_CASE for constants
- Add comments for complex logic
- Keep files modular and focused

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
```

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- Check documentation first
- Review existing issues
- Create new issue with details
- Contact project maintainers

## 🙏 Acknowledgments

- Three.js for 3D graphics
- Google Fonts for typography
- The EV community for inspiration
- All contributors and supporters

---

**Made with ⚡ and 🌱 by the Cognivolt Team**

Happy EV biking! 🚴‍♂️🚴‍♀️⚡
**
