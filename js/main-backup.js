// main.js - Contains the main application logic
import bills from './bills.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderBills(bills);
    initializeSearch();
    initializeModal();
});

// Render all bills to the grid
function renderBills(billsToRender) {
    const billsGrid = document.getElementById('billsGrid');
    billsGrid.innerHTML = '';

    billsToRender.forEach(bill => {
        const billCard = createBillCard(bill);
        billsGrid.appendChild(billCard);
    });
}

// Create a card element for a bill
function createBillCard(bill) {
    const card = document.createElement('div');
    card.className = 'bill-card';
    card.innerHTML = `
        <h2>${bill.title}</h2>
        <p>${bill.summary}</p>
        <p class="date">Published: ${formatDate(bill.datePublished)}</p>
    `;
    
    card.addEventListener('click', () => showBillModal(bill));
    return card;
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchBills');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredBills = bills.filter(bill => 
            bill.title.toLowerCase().includes(searchTerm) ||
            bill.summary.toLowerCase().includes(searchTerm)
        );
        renderBills(filteredBills);
    });
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('billModal');
    const closeButton = document.querySelector('.close-button');

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Show bill content in modal
function showBillModal(bill) {
    const modal = document.getElementById('billModal');
    const modalContent = document.getElementById('modalContent');
    
    // Convert markdown content to HTML (you'll need a markdown parser library)
    modalContent.innerHTML = `
        <h1>${bill.title}</h1>
        <div class="bill-content">
            ${bill.content}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Helper function to format dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}