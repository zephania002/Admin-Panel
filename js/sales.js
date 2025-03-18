document.addEventListener('DOMContentLoaded', function() {
    const salesReportContainer = document.querySelector('.sales-report-container');
    const reportOverview = document.querySelector('.report-overview');
    const totalRevenueValue = document.getElementById('total-revenue-value');
    const totalOrdersValue = document.getElementById('total-orders-value');
    const averageOrderValue = document.getElementById('average-order-value');
    const newCustomersValue = document.getElementById('new-customers-value');
    const recentSalesList = document.getElementById('recent-sales-list');
    const topProductsList = document.getElementById('top-products-list');
    const filterSalesButton = document.getElementById('filter-sales');
    const refreshSalesButton = document.getElementById('refresh-sales');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const salesChartCanvas = document.getElementById('sales-chart');
    const loadMoreSalesButton = document.querySelector('.load-more-sales');
    let salesChart;
    let recentSalesOffset = 0;
    const recentSalesLimit = 5; // Adjust as needed

    // --- Function to trigger section animations ---
    function animateElements() {
        if (reportOverview) {
            reportOverview.classList.add('active');
        }
        const animatedElements = document.querySelectorAll('.animated-element');
        animatedElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // --- Function to fetch and update overview data ---
    function updateOverviewData(startDate = null, endDate = null) {
        const apiUrl = `/api/admin/sales/overview${startDate ? `?startDate=${startDate}` : ''}${endDate ? `${startDate ? '&' : '?'}endDate=${endDate}` : ''}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                totalRevenueValue.textContent = data.totalRevenue ? parseFloat(data.totalRevenue).toFixed(2) : '0.00';
                totalOrdersValue.textContent = data.totalOrders || '0';
                averageOrderValue.textContent = data.averageOrderValue ? parseFloat(data.averageOrderValue).toFixed(2) : '0.00';
                newCustomersValue.textContent = data.newCustomers || '0';
                // Update trends based on data if available
            })
            .catch(error => console.error('Error fetching overview data:', error));
    }

    // --- Function to fetch and update recent sales ---
    function updateRecentSales(startDate = null, endDate = null, offset = 0, limit = recentSalesLimit) {
        const apiUrl = `/api/admin/sales/recent?offset=${offset}&limit=${limit}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (offset === 0) {
                    recentSalesList.innerHTML = '';
                }
                if (data && data.length > 0) {
                    data.forEach(sale => {
                        const row = recentSalesList.insertRow();
                        row.insertCell().textContent = sale.orderId || 'N/A';
                        row.insertCell().textContent = sale.customerName || 'Guest';
                        row.insertCell().textContent = sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A';
                        row.insertCell().textContent = sale.amount ? `$${parseFloat(sale.amount).toFixed(2)}` : '$0.00';
                        row.insertCell().textContent = sale.status || 'Pending';
                    });
                    if (data.length < limit) {
                        loadMoreSalesButton.style.display = 'none';
                    } else {
                        loadMoreSalesButton.style.display = 'block';
                    }
                } else if (offset === 0) {
                    recentSalesList.innerHTML = '<tr><td colspan="5" class="text-center">No sales data for the selected period.</td></tr>';
                    loadMoreSalesButton.style.display = 'none';
                } else {
                    loadMoreSalesButton.style.display = 'none'; // No more sales to load
                }
            })
            .catch(error => console.error('Error fetching recent sales:', error));
    }

    // --- Function to fetch and update top performing products ---
    function updateTopProducts(startDate = null, endDate = null) {
        const apiUrl = `/api/admin/sales/top-products${startDate ? `?startDate=${startDate}` : ''}${endDate ? `${startDate ? '&' : '?'}endDate=${endDate}` : ''}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                topProductsList.innerHTML = '';
                if (data && data.length > 0) {
                    data.forEach(product => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${product.name || 'Unknown'} - $${product.totalRevenue ? parseFloat(product.totalRevenue).toFixed(2) : '0.00'} (${product.quantitySold || 0} sold)`;
                        topProductsList.appendChild(listItem);
                    });
                } else {
                    topProductsList.innerHTML = '<li>No product performance data for the selected period.</li>';
                }
            })
            .catch(error => console.error('Error fetching top products:', error));
    }

    // --- Function to fetch and render sales chart ---
    function renderSalesChart(startDate = null, endDate = null) {
        const apiUrl = `/api/admin/sales/chart-data${startDate ? `?startDate=${startDate}` : ''}${endDate ? `${startDate ? '&' : '?'}endDate=${endDate}` : ''}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (salesChart) {
                    salesChart.destroy();
                }
                salesChart = new Chart(salesChartCanvas, {
                    type: 'line',
                    data: {
                        labels: data.labels || [],
                        datasets: [{
                            label: 'Sales ($)',
                            data: data.values || [],
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#007bff',
                            fill: false,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching chart data:', error));
    }

    // --- Event Listeners ---
    if (filterSalesButton) {
        filterSalesButton.addEventListener('click', function() {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            recentSalesOffset = 0; // Reset offset on new filter
            updateOverviewData(startDate, endDate);
            updateRecentSales(startDate, endDate);
            updateTopProducts(startDate, endDate);
            renderSalesChart(startDate, endDate);
        });
    }

    if (refreshSalesButton) {
        refreshSalesButton.addEventListener('click', function() {
            startDateInput.value = '';
            endDateInput.value = '';
            recentSalesOffset = 0; // Reset offset on refresh
            updateOverviewData();
            updateRecentSales();
            updateTopProducts();
            renderSalesChart();
        });
    }

    if (loadMoreSalesButton) {
        loadMoreSalesButton.addEventListener('click', function() {
            recentSalesOffset += recentSalesLimit;
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            updateRecentSales(startDate, endDate, recentSalesOffset);
        });
    }

    // --- Initial Data Load and Animations ---
    updateOverviewData();
    updateRecentSales();
    updateTopProducts();
    renderSalesChart();
    animateElements();
});