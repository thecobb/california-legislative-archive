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
    // Create a date object and force UTC interpretation
    const date = new Date(dateString + 'T00:00:00Z');
    
    // Use UTC methods to prevent timezone conversion
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Force UTC timezone
    };
    
    return date.toLocaleDateString('en-US', options);
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

function renderMarkdown(text) {
    // Process the text in a specific order
    let html = text;

    // Handle bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle headers
    html = html.replace(/^# (.*$)/gm, '<h1 class="bill-h1">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="bill-h2">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="bill-h3">$1</h3>');

    // Handle ordered lists
    let inList = false;
    const lines = html.split('\n');
    html = lines.map((line, index) => {
        if (/^\d+\.\s/.test(line)) {
            if (!inList) {
                inList = true;
                return '<ol class="bill-list">\n<li>' + line.replace(/^\d+\.\s/, '') + '</li>';
            }
            return '<li>' + line.replace(/^\d+\.\s/, '') + '</li>';
        } else if (inList) {
            inList = false;
            return '</ol>\n' + line;
        }
        return line;
    }).join('\n');

    if (inList) {
        html += '\n</ol>';
    }

    // Handle paragraphs (skip lines that are already wrapped in HTML tags)
    html = html.split('\n').map(line => {
        line = line.trim();
        if (line && !line.startsWith('<') && !line.endsWith('>')) {
            return `<p class="bill-paragraph">${line}</p>`;
        }
        return line;
    }).join('\n');

    return html;
}

function showBillModal(bill) {
    const modal = document.getElementById('billModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = renderMarkdown(bill.content);
    modal.style.display = 'block';
}