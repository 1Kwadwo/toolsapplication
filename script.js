// Data Storage (Session-based)
let tools = JSON.parse(localStorage.getItem('tools')) || [];
let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];
let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

// Current editing item
let currentEditItem = null;
let currentEditType = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    updateDashboard();
    renderAllTables();
    
    // Prevent form submission from causing page refresh
    const modalForm = document.getElementById('modalForm');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleFormSubmit(e);
            return false;
        });
    }
});

// Navigation Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update dashboard if showing dashboard
    if (sectionName === 'dashboard') {
        updateDashboard();
    }
}

// Modal Functions
function openModal(type, item = null) {
    currentEditType = type;
    currentEditItem = item;
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalFields = document.getElementById('modalFields');
    
    // Set modal title
    modalTitle.textContent = item ? `Edit ${getTypeName(type)}` : `Add ${getTypeName(type)}`;
    
    // Generate form fields based on type
    modalFields.innerHTML = generateFormFields(type, item);
    
    // Show modal
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    currentEditItem = null;
    currentEditType = null;
}

function getTypeName(type) {
    const names = {
        'tool': 'Tool',
        'supplier': 'Supplier',
        'customer': 'Customer',
        'sale': 'Sale',
        'rental': 'Rental'
    };
    return names[type] || 'Item';
}

function generateFormFields(type, item) {
    const fields = {
        tool: [
            { name: 'name', label: 'Tool Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Power Tools', 'Hand Tools', 'Garden Tools', 'Safety Equipment'], required: true },
            { name: 'stock', label: 'Current Stock', type: 'number', required: true },
            { name: 'minStock', label: 'Minimum Stock', type: 'number', required: true },
            { name: 'price', label: 'Price', type: 'number', step: '0.01', required: true }
        ],
        supplier: [
            { name: 'name', label: 'Supplier Name', type: 'text', required: true },
            { name: 'contact', label: 'Contact Person', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true }
        ],
        customer: [
            { name: 'name', label: 'Customer Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            { name: 'address', label: 'Address', type: 'textarea', required: true }
        ],
        sale: [
            { name: 'date', label: 'Sale Date', type: 'date', required: true },
            { name: 'customer', label: 'Customer', type: 'select', options: customers.map(c => c.name), required: true },
            { name: 'items', label: 'Items (comma separated)', type: 'text', required: true },
            { name: 'total', label: 'Total Amount', type: 'number', step: '0.01', required: true }
        ],
        rental: [
            { name: 'customer', label: 'Customer', type: 'select', options: customers.map(c => c.name), required: true },
            { name: 'tool', label: 'Tool', type: 'select', options: tools.map(t => t.name), required: true },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Returned', 'Overdue'], required: true }
        ]
    };
    
    let html = '';
    fields[type].forEach(field => {
        const value = item ? item[field.name] : '';
        html += `
            <div class="form-group">
                <label for="${field.name}">${field.label}</label>
                ${generateInput(field, value)}
            </div>
        `;
    });
    
    return html;
}

function generateInput(field, value) {
    if (field.type === 'select') {
        let options = '';
        field.options.forEach(option => {
            const selected = value === option ? 'selected' : '';
            options += `<option value="${option}" ${selected}>${option}</option>`;
        });
        return `<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>${options}</select>`;
    } else if (field.type === 'textarea') {
        return `<textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>${value}</textarea>`;
    } else {
        return `<input type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" ${field.step ? `step="${field.step}"` : ''} ${field.required ? 'required' : ''}>`;
    }
}

// Form Handling
function handleFormSubmit(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const form = document.getElementById('modalForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    if (currentEditItem) {
        // Update existing item
        updateItem(currentEditType, currentEditItem.id, data);
    } else {
        // Add new item
        addItem(currentEditType, data);
    }
    
    closeModal();
    updateDashboard();
    renderAllTables();
    
    return false;
}

// CRUD Operations
function addItem(type, data) {
    const newItem = {
        id: Date.now(),
        ...data
    };
    
    switch (type) {
        case 'tool':
            tools.push(newItem);
            localStorage.setItem('tools', JSON.stringify(tools));
            break;
        case 'supplier':
            suppliers.push(newItem);
            localStorage.setItem('suppliers', JSON.stringify(suppliers));
            break;
        case 'customer':
            customers.push(newItem);
            localStorage.setItem('customers', JSON.stringify(customers));
            break;
        case 'sale':
            sales.push(newItem);
            localStorage.setItem('sales', JSON.stringify(sales));
            break;
        case 'rental':
            rentals.push(newItem);
            localStorage.setItem('rentals', JSON.stringify(rentals));
            break;
    }
}

function updateItem(type, id, data) {
    let items;
    let storageKey;
    
    switch (type) {
        case 'tool':
            items = tools;
            storageKey = 'tools';
            break;
        case 'supplier':
            items = suppliers;
            storageKey = 'suppliers';
            break;
        case 'customer':
            items = customers;
            storageKey = 'customers';
            break;
        case 'sale':
            items = sales;
            storageKey = 'sales';
            break;
        case 'rental':
            items = rentals;
            storageKey = 'rentals';
            break;
    }
    
    const index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        items[index] = { ...items[index], ...data };
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}

function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    let items;
    let storageKey;
    
    switch (type) {
        case 'tool':
            items = tools;
            storageKey = 'tools';
            break;
        case 'supplier':
            items = suppliers;
            storageKey = 'suppliers';
            break;
        case 'customer':
            items = customers;
            storageKey = 'customers';
            break;
        case 'sale':
            items = sales;
            storageKey = 'sales';
            break;
        case 'rental':
            items = rentals;
            storageKey = 'rentals';
            break;
    }
    
    const index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        items.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(items));
        updateDashboard();
        renderAllTables();
    }
}

// Table Rendering
function renderAllTables() {
    renderToolsTable();
    renderSuppliersTable();
    renderCustomersTable();
    renderSalesTable();
    renderRentalsTable();
}

function renderToolsTable() {
    const tbody = document.getElementById('toolsTableBody');
    tbody.innerHTML = '';
    
    tools.forEach(tool => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tool.name}</td>
            <td>${tool.category}</td>
            <td>${tool.stock}</td>
            <td>${tool.minStock}</td>
            <td>$${parseFloat(tool.price).toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('tool', ${JSON.stringify(tool).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem('tool', ${tool.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderSuppliersTable() {
    const tbody = document.getElementById('suppliersTableBody');
    tbody.innerHTML = '';
    
    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('supplier', ${JSON.stringify(supplier).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem('supplier', ${supplier.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('customer', ${JSON.stringify(customer).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem('customer', ${customer.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = '';
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.customer}</td>
            <td>${sale.items}</td>
            <td>$${parseFloat(sale.total).toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('sale', ${JSON.stringify(sale).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem('sale', ${sale.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderRentalsTable() {
    const tbody = document.getElementById('rentalsTableBody');
    tbody.innerHTML = '';
    
    rentals.forEach(rental => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rental.customer}</td>
            <td>${rental.tool}</td>
            <td>${rental.startDate}</td>
            <td>${rental.dueDate}</td>
            <td>${rental.status}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('rental', ${JSON.stringify(rental).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem('rental', ${rental.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Dashboard Functions
function updateDashboard() {
    updateKPICards();
    updateLowStockAlerts();
    updateOverdueRentals();
}

function updateKPICards() {
    // Total Tools
    document.getElementById('totalTools').textContent = tools.length;
    
    // Low Stock Alerts
    const lowStockCount = tools.filter(tool => parseInt(tool.stock) <= parseInt(tool.minStock)).length;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    
    // Today's Sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales
        .filter(sale => sale.date === today)
        .reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    document.getElementById('todaySales').textContent = `$${todaySales.toFixed(2)}`;
    
    // Overdue Rentals
    const overdueCount = rentals.filter(rental => {
        const dueDate = new Date(rental.dueDate);
        const today = new Date();
        return rental.status === 'Active' && dueDate < today;
    }).length;
    document.getElementById('overdueRentals').textContent = overdueCount;
}

function updateLowStockAlerts() {
    const container = document.getElementById('lowStockAlerts');
    const lowStockTools = tools.filter(tool => parseInt(tool.stock) <= parseInt(tool.minStock));
    
    if (lowStockTools.length === 0) {
        container.innerHTML = '<div class="no-data">No low stock alerts</div>';
        return;
    }
    
    container.innerHTML = '';
    lowStockTools.forEach(tool => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <div class="alert-info">
                <h4>${tool.name}</h4>
                <p>Stock: ${tool.stock} (Min: ${tool.minStock})</p>
            </div>
            <button class="update-btn" onclick="openModal('tool', ${JSON.stringify(tool).replace(/"/g, '&quot;')})">Update</button>
        `;
        container.appendChild(alertItem);
    });
}

function updateOverdueRentals() {
    const container = document.getElementById('overdueRentalsList');
    const overdueRentals = rentals.filter(rental => {
        const dueDate = new Date(rental.dueDate);
        const today = new Date();
        return rental.status === 'Active' && dueDate < today;
    });
    
    if (overdueRentals.length === 0) {
        container.innerHTML = '<div class="no-data">No overdue rentals</div>';
        return;
    }
    
    container.innerHTML = '';
    overdueRentals.forEach(rental => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <div class="alert-info">
                <h4>${rental.tool}</h4>
                <p>Customer: ${rental.customer} - Due: ${rental.dueDate}</p>
            </div>
            <button class="update-btn" onclick="openModal('rental', ${JSON.stringify(rental).replace(/"/g, '&quot;')})">Update</button>
        `;
        container.appendChild(alertItem);
    });
}

// Report Functions
function generateReport(type) {
    let reportData = '';
    let reportTitle = '';
    
    switch (type) {
        case 'sales':
            reportTitle = 'Sales Report';
            reportData = generateSalesReport();
            break;
        case 'inventory':
            reportTitle = 'Inventory Report';
            reportData = generateInventoryReport();
            break;
        case 'rentals':
            reportTitle = 'Rental Report';
            reportData = generateRentalReport();
            break;
    }
    
    // Create and download report
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateSalesReport() {
    let report = 'SALES REPORT\n';
    report += '='.repeat(50) + '\n\n';
    
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    report += `Total Sales: $${totalSales.toFixed(2)}\n`;
    report += `Number of Sales: ${sales.length}\n\n`;
    
    sales.forEach(sale => {
        report += `Date: ${sale.date} | Customer: ${sale.customer} | Items: ${sale.items} | Total: $${sale.total}\n`;
    });
    
    return report;
}

function generateInventoryReport() {
    let report = 'INVENTORY REPORT\n';
    report += '='.repeat(50) + '\n\n';
    
    report += `Total Tools: ${tools.length}\n\n`;
    
    tools.forEach(tool => {
        const status = parseInt(tool.stock) <= parseInt(tool.minStock) ? 'LOW STOCK' : 'OK';
        report += `${tool.name} | Category: ${tool.category} | Stock: ${tool.stock}/${tool.minStock} | Status: ${status}\n`;
    });
    
    return report;
}

function generateRentalReport() {
    let report = 'RENTAL REPORT\n';
    report += '='.repeat(50) + '\n\n';
    
    const activeRentals = rentals.filter(r => r.status === 'Active');
    const overdueRentals = rentals.filter(r => {
        const dueDate = new Date(r.dueDate);
        const today = new Date();
        return r.status === 'Active' && dueDate < today;
    });
    
    report += `Total Rentals: ${rentals.length}\n`;
    report += `Active Rentals: ${activeRentals.length}\n`;
    report += `Overdue Rentals: ${overdueRentals.length}\n\n`;
    
    rentals.forEach(rental => {
        report += `Tool: ${rental.tool} | Customer: ${rental.customer} | Status: ${rental.status} | Due: ${rental.dueDate}\n`;
    });
    
    return report;
}

// Sample Data Loading
function loadSampleData() {
    if (tools.length === 0) {
        tools = [
            { id: 1, name: 'Cordless Drill', category: 'Power Tools', stock: 15, minStock: 5, price: 89.99 },
            { id: 2, name: 'Hammer Set', category: 'Hand Tools', stock: 25, minStock: 10, price: 29.99 },
            { id: 3, name: 'Screwdriver Set', category: 'Hand Tools', stock: 30, minStock: 15, price: 19.99 },
            { id: 4, name: 'Lawn Mower', category: 'Garden Tools', stock: 5, minStock: 2, price: 299.99 },
            { id: 5, name: 'Garden Shovel', category: 'Garden Tools', stock: 19, minStock: 8, price: 24.99 },
            { id: 6, name: 'Safety Glasses', category: 'Safety Equipment', stock: 50, minStock: 20, price: 12.99 }
        ];
        localStorage.setItem('tools', JSON.stringify(tools));
    }
    
    if (suppliers.length === 0) {
        suppliers = [
            { id: 1, name: 'ToolCo Industries', contact: 'John Smith', email: 'john@toolco.com', phone: '555-0101' },
            { id: 2, name: 'Hardware Plus', contact: 'Sarah Johnson', email: 'sarah@hardwareplus.com', phone: '555-0102' }
        ];
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
    }
    
    if (customers.length === 0) {
        customers = [
            { id: 1, name: 'Mike Wilson', email: 'mike@email.com', phone: '555-0201', address: '123 Main St, City' },
            { id: 2, name: 'Lisa Brown', email: 'lisa@email.com', phone: '555-0202', address: '456 Oak Ave, Town' }
        ];
        localStorage.setItem('customers', JSON.stringify(customers));
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Prevent modal clicks from bubbling up to navigation
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
});
