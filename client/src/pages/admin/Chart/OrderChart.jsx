import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Chart from 'chart.js/auto';

function OrderChart() {
    const [listOrder, setListOrder] = useState([]);
    const chartRef = useRef(null);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const thaiMonthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${apiUrl}/order/listOrder`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setListOrder(res.data.orders);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchOrder();
    }, []);

    useEffect(() => {
        const calculateDailyOrderCount = () => {
            const orderCounts = {};

            if (Array.isArray(listOrder)) {
                listOrder.forEach(order => {
                    const date = new Date(order.orderDate);
                    const monthIndex = date.getMonth();
                    const thaiMonth = thaiMonthNames[monthIndex];
                    const dayOfMonth = date.getDate();
                    const key = `${thaiMonth} ${dayOfMonth}`; // รวมชื่อเดือนและวันเข้าด้วยกันเป็น key
                    orderCounts[key] = (orderCounts[key] || 0) + 1;
                });
            }

            return orderCounts;
        };

        const renderChart = (orderCounts) => {
            const ctx = document.getElementById('orderChart').getContext('2d');
            if (window.orderChart instanceof Chart) {
                window.orderChart.destroy();
            }

            window.orderChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(orderCounts),
                    datasets: [{
                        label: 'จำนวนคำสั่งซื้อรายวัน',
                        data: Object.values(orderCounts),
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                          ],
                          borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                          ],
                          borderWidth: 1,
                        }]
                },
                options: {
                responsive: true,
                maintainAspectRatio: false,
                
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'จำนวนออเดอร์'
                            }
                        },
                       
                    }
                }
            });
        };

        const orderCounts = calculateDailyOrderCount();
        renderChart(orderCounts);
    }, [listOrder]);

    return (
        <div >
            <canvas id="orderChart"></canvas>
        </div>
    );
}

export default OrderChart;
