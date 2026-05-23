# Quick Start Guide

## Opening the Landing Page

1. **Open in Browser**
   - Locate the `index.html` file
   - Right-click and select "Open with" → Choose your browser
   - Or drag and drop into browser window

2. **Using Live Server (VS Code)**
   - Install Live Server extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"

## Features Overview

### 🍽️ Menu Section
- **Filter Buttons**: Click category buttons (All, Appetizers, Mains, Desserts, Beverages)
- **Hover Effect**: Move mouse over cards to see animations
- **Responsive**: Cards automatically adjust for mobile devices

### ⭐ Chef's Specials
- Three featured items with limited-time badges
- Hover to see image zoom and shadow effects
- "Order Now" buttons for each special

### 💬 Customer Reviews
- **Auto-Rotating Carousel**: Reviews change every 5 seconds
- **Manual Navigation**: Use arrow buttons or dots to browse
- **Stats**: View average rating and customer count

### 📋 Reservation Form
- **Date Selection**: Only future dates allowed
- **Phone Validation**: Requires valid phone number
- **Email Validation**: Requires valid email format
- **Success Message**: Displays after successful submission

### 📱 Mobile Navigation
- **Hamburger Menu**: Click on mobile/tablet devices
- **Touch-Friendly**: Buttons are larger on small screens
- **Responsive Layout**: Content reflows for readability

## Customization

### Change Restaurant Info
Open `index.html` and search for:
- Restaurant name: "Culinary Delights"
- Address: "123 Gourmet Street, New York, NY 10001"
- Phone: "(555) 123-4567"
- Email: "info@culinarydelights.com"
- Hours: "Mon-Thu: 5pm - 10pm"

### Modify Colors
Open `styles.css` and update the CSS variables at the top:
```css
:root {
    --primary-color: #d4a574;      /* Gold/Brown */
    --secondary-color: #8b4513;    /* Dark Brown */
    --dark-bg: #1a1a1a;            /* Nearly black */
    --light-bg: #f8f9fa;           /* Light gray */
}
```

### Replace Menu Items
In `index.html`, find each menu item card and update:
- Image URL: `src="https://via.placeholder.com/400x250?text=..."`
- Item name: Inside `<h5 class="card-title">`
- Description: Inside `<p class="card-text">`
- Price: Inside `<p class="price-tag">`

Example:
```html
<img src="YOUR_IMAGE_URL" alt="Dish Name">
<h5 class="card-title">Your Dish Name</h5>
<p class="card-text">Your description here</p>
<p class="price-tag">$XX.XX</p>
```

### Add Testimonials
Find the carousel in `index.html` and add new carousel items:
```html
<div class="carousel-item">
    <div class="testimonial-card">
        <div class="rating mb-3">
            <i class="fas fa-star"></i>
            <!-- Repeat for 5 stars -->
        </div>
        <p class="testimonial-text">Your review text here</p>
        <div class="testimonial-author">
            <h5 class="mb-0">Customer Name</h5>
            <small class="text-muted">City, State</small>
        </div>
    </div>
</div>
```

## Animation Guide

| Animation | Element | Effect |
|-----------|---------|--------|
| fadeIn | Hero text | Fades in smoothly |
| slideInUp | Cards | Slides up from bottom |
| scaleIn | Menu items | Scales up from small |
| pulse | Numbers | Pulsing scale effect |
| float | Badges/stars | Floating up and down |

## Mobile Optimization

The page automatically adjusts for:
- **Portrait/Landscape**: Orientation changes
- **Small screens**: 320px width (iPhone SE)
- **Tablets**: 768px width and above
- **Desktops**: 1024px width and above

## Troubleshooting

### Images not showing?
- Check internet connection (placeholder images need internet)
- Replace with local image paths
- Check browser console for errors (F12)

### Form not submitting?
- Check browser console (F12) for JavaScript errors
- Ensure all required fields are filled
- Check date is in the future

### Styling issues?
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (Ctrl+R or Cmd+R)
- Check if Bootstrap CDN is loading

### Navigation not working?
- Enable JavaScript in browser
- Check browser console for errors
- Ensure HTML file is complete

## Social Media Integration

To add working social links, replace placeholder `#` with:
- Facebook: `https://facebook.com/yourpage`
- Twitter: `https://twitter.com/yourprofile`
- Instagram: `https://instagram.com/yourprofile`
- YouTube: `https://youtube.com/c/yourchanel`

## Keyboard Shortcuts

- **Tab**: Navigate through interactive elements
- **Enter**: Activate buttons and links
- **Space**: Toggle checkboxes/switches
- **Escape**: Close dropdown menus

## Browser DevTools Tips

1. **Test Responsive Design**
   - Press F12 to open DevTools
   - Click device toggle (usually Ctrl+Shift+M)
   - Select different device sizes

2. **Inspect Elements**
   - Right-click on element → Inspect
   - View HTML structure
   - See applied CSS styles

3. **Debug JavaScript**
   - Open Console tab
   - Look for errors in red
   - Test functions

## Performance Tips

- Use local images instead of placeholder URLs
- Optimize image sizes (compress before uploading)
- Minify CSS and JavaScript for production
- Enable GZIP compression on server
- Use CDN for Bootstrap and Font Awesome

## Accessibility Features

- Semantic HTML structure
- Keyboard navigation support
- Color contrast ratios meet WCAG standards
- Image alt text for all images
- Form labels associated with inputs
- ARIA labels for interactive elements

## Next Steps

1. Replace placeholder images with real images
2. Update restaurant information
3. Add real menu items and prices
4. Connect form to backend for submissions
5. Add Google Maps integration
6. Set up email notifications
7. Deploy to web server
8. Set up analytics tracking

---

**Need Help?** Check the README.md file for more detailed information about the project structure and features.
