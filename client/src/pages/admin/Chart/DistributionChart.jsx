import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from 'chart.js/auto';

function DistributionChart() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/products/`);
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        // Function to calculate product count by category
        const calculateProductCountByCategory = () => {
            const productCounts = {};

            // Count products for each category
            products.forEach(product => {
                const category = product.Category.name;
                productCounts[category] = (productCounts[category] || 0) + 1;
            });

            return productCounts;
        };

        // Render the chart
        const renderChart = (productCounts) => {
            const ctx = document.getElementById('distributionChart').getContext('2d');
            
            // Clear the previous chart instance if exists
            if (window.distributionChartInstance !== undefined) {
                window.distributionChartInstance.destroy();
            }

            // Render the new chart
            window.distributionChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(productCounts),
                    datasets: [{
                        label: 'Product Count by Category',
                        data: Object.values(productCounts),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'จำนวนสินค้าตามประเภท'
                        }
                    }
                }
            });
        };

        // Calculate product count by category and render chart
        const productCounts = calculateProductCountByCategory();
        renderChart(productCounts);

    }, [products]);

    return (
        <div>
            <canvas id="distributionChart"></canvas>
        </div>
    );
}

export default DistributionChart;
