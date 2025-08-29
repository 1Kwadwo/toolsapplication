# Tool Management System

A fully static, client-side web application for managing tools, suppliers, customers, sales, and rentals. Built with HTML, CSS, and JavaScript, this application provides a complete CRUD (Create, Read, Update, Delete) interface without requiring any backend server or database.

## Features

### 🏠 Dashboard

- **KPI Cards**: Real-time overview of total tools, low stock alerts, today's sales, and overdue rentals
- **Low Stock Alerts**: Automatic detection and display of items that need restocking
- **Overdue Rentals**: Track and manage overdue rental items

### 🛠️ Tools Management

- Add, edit, and delete tools
- Track stock levels and minimum stock thresholds
- Categorize tools (Power Tools, Hand Tools, Garden Tools, Safety Equipment)
- Set pricing information

### 👥 Customer Management

- Store customer contact information
- Manage customer addresses and phone numbers
- Link customers to sales and rentals

### 🏪 Supplier Management

- Track supplier contact information
- Manage supplier relationships
- Store contact person details

### 💰 Sales Management

- Record sales transactions
- Link sales to customers
- Track total sales amounts
- Generate sales reports

### 📅 Rental Management

- Create and manage rental agreements
- Track rental start and due dates
- Monitor rental status (Active, Returned, Overdue)
- Link rentals to customers and tools

### 📊 Reports

- **Sales Reports**: Detailed sales analytics and summaries
- **Inventory Reports**: Current stock levels and alerts
- **Rental Reports**: Rental history and overdue items
- Export reports as downloadable text files

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Client-side functionality and data management
- **Local Storage**: Session-based data persistence
- **Font Awesome**: Icons and visual elements

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required

### Installation

1. Clone or download the repository
2. Open `index.html` in your web browser
3. The application will load with sample data

### Usage

#### Navigation

- Use the navigation bar to switch between different sections
- The dashboard provides an overview of all key metrics
- Each section has its own dedicated management interface

#### Adding Items

1. Click the "Add [Item Type]" button in any section
2. Fill out the required form fields
3. Click "Save" to add the item

#### Editing Items

1. Click the "Edit" button next to any item in the tables
2. Modify the information in the form
3. Click "Save" to update the item

#### Deleting Items

1. Click the "Delete" button next to any item
2. Confirm the deletion in the popup dialog

#### Generating Reports

1. Navigate to the Reports section
2. Click "Generate" on any report type
3. The report will download as a text file

## Data Persistence

- All data is stored in the browser's local storage
- Data persists between browser sessions
- No data is sent to external servers
- Clearing browser data will reset the application

## Sample Data

The application comes pre-loaded with sample data including:

- 6 different tools with various stock levels
- 2 sample suppliers
- 2 sample customers
- Sample sales and rental records

## Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Deployment

This application can be deployed on any static hosting service:

### GitHub Pages

1. Push the code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the main branch as source

### Netlify

1. Drag and drop the project folder to Netlify
2. The site will be automatically deployed

### Vercel

1. Import the project to Vercel
2. Deploy with default settings

## File Structure

```
tool-management-system/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Features in Detail

### Dashboard Analytics

- **Total Tools**: Count of all tools in inventory
- **Low Stock Alerts**: Number of tools below minimum stock levels
- **Today's Sales**: Total sales amount for the current day
- **Overdue Rentals**: Number of active rentals past their due date

### Smart Alerts

- Automatic detection of low stock items
- Real-time overdue rental tracking
- Visual indicators for urgent items

### Data Validation

- Form validation for required fields
- Data type checking for numbers and dates
- Confirmation dialogs for destructive actions

### User Experience

- Clean, modern interface design
- Intuitive navigation
- Responsive layout for all devices
- Smooth animations and transitions

## Contributing

This is a static application, but you can:

1. Fork the repository
2. Make improvements to the code
3. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:

1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Clear browser cache if experiencing issues
4. Verify that JavaScript is enabled

---

**Note**: This is a client-side only application. All data is stored locally in your browser and will be lost if you clear your browser data or use a different browser.
