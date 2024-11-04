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

// function showBillModal(bill) {
//     const modal = document.getElementById('billModal');
//     const modalContent = document.getElementById('modalContent');
    
//     modalContent.innerHTML = `
//         <h1>${bill.title}</h1>
//         <div class="bill-content">
//             ${bill.content.split('\n').map(line => `<p>${line}</p>`).join('')}
//         </div>
//     `;
    
//     modal.style.display = 'block';
// }

// Add this function to parse markdown headings
function parseMarkdown(text) {
    // Handle h1
    text = text.replace(/^# (.*$)/gm, '<h1 class="bill-h1">$1</h1>');
    // Handle h2
    text = text.replace(/^## (.*$)/gm, '<h2 class="bill-h2">$1</h2>');
    // Handle h3
    text = text.replace(/^### (.*$)/gm, '<h3 class="bill-h3">$1</h3>');
    // Handle lists
    text = text.replace(/^\d\. (.+)$/gm, '<li>$1</li>');
    // Wrap lists in ol
    text = text.replace(/(<li>.*<\/li>)\n(?!\<li>)/gs, '<ol>$1</ol>');
    // Handle paragraphs
    text = text.replace(/^(?!(#|<))(.*$)/gm, '<p>$2</p>');
    return text;
}

function showBillModal(bill) {
    const modal = document.getElementById('billModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = parseMarkdown(bill.content);
    modal.style.display = 'block';
}