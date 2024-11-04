// main.js
document.addEventListener('DOMContentLoaded', () => {
    renderBills(bills);
    initializeSearch();
    initializeModal();
});

function renderBills(billsToRender) {
    const billsGrid = document.getElementById('billsGrid');
    billsGrid.innerHTML = '';

    billsToRender.forEach(bill => {
        const card = document.createElement('div');
        card.className = 'bill-card';
        card.innerHTML = `
            <h2>${bill.title}</h2>
            <p>${bill.summary}</p>
            <p class="date">Published: ${formatDate(bill.datePublished)}</p>
        `;
        
        card.addEventListener('click', () => showBillModal(bill));
        billsGrid.appendChild(card);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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

function showBillModal(bill) {
    const modal = document.getElementById('billModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h1>${bill.title}</h1>
        <div class="bill-content">
            ${bill.content.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
}