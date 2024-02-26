import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from "axios";

const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม",
  "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน",
  "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const formatThaiDate = (dateString) => {
  const date = new Date(dateString);
  const thaiMonth = thaiMonths[date.getMonth()];
  const thaiYear = date.getFullYear() + 543; 
  return `${thaiMonth} ${thaiYear}`;
};

function SalesChart() {
  const [payments, setPayments] = useState([]);
  const chartRef = useRef(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiUrl}/payment/payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch (err) {
        console.log(err.message);
      } 
    };

    fetchPayments();
  }, []); 

  useEffect(() => {
    const calculateMonthlySales = (payments) => {
      const monthlySales = Array.from({ length: 12 }).fill(0); 
  
      payments.forEach(payment => {
        const paymentDate = new Date(payment.payment_date);
        const month = paymentDate.getMonth();
        monthlySales[month] += payment.total_amount;
      });
  
      return monthlySales;
    };
    const renderChart = (ctx, labels, data) => {
        if (chartRef.current && chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }
      
        chartRef.current.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'ยอดขายรายเดือน',
              data: data,
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
              fill: false
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
      };

    if (payments.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      const labels = thaiMonths;
      const monthlySales = calculateMonthlySales(payments);
      renderChart(ctx, labels, monthlySales);
    }
  }, [payments]);

  return (
    <div className="max-h-[400px] p-4">
      <h2>ยอดขายรายเดือน</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default SalesChart;
