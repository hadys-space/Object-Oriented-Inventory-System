<?php
require_once 'databaseConnection.php'; // Include the database connection file
// Database connection details
$host = 'localhost';
$username = 'root'; 
$password = '';   
$dbname = 'inventory database';

// Create the connection to the database
$conn = DatabaseConnection::getInstance()->getConnection();

// Check connection to the database


// Query to fetch data from the database
$sql = "SELECT `Name of Item`, `Total In Stock`, `Total Sold` FROM `inventory`";
$stmt = $conn->query($sql);


// Variables to hold database data
$labels = [];
$soldData = [];
$stockData = [];

if ($stmt) {
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row){
        $labels[] = $row['Name of Item'];
        $soldData[] = (int)$row['Total Sold']; // Cast to ensure numeric data
        $stockData[] = (int)$row['Total In Stock']; // Cast to ensure numeric data
    }
} else {
    die("Query failed.");
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> 
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">

    <title>Chart</title>
</head>

<body id="reportspage">
<a href="dashboard.html" id="sidebarLink" class="sidebar-link" title="Back">
            <img src="img/R-removebg-preview.png" class="icon" alt=""><span class="Sp">Back</span>
        </a>

  <div class="report-Container">
     
     <!-- this represents the container for the bar chart-->
     <div class="chart-container">
      <h3>Sales Report</h3>
        <div class="chart">
          <span>Stock Trends</span>
            <canvas id="myChart"></canvas>
        </div>
     </div>
    
     <div> 
       <p class="idf"></p>
     </div>
     
     
     <div class="charts-container">
     
        <div class="chart2">
          <span>Total income Per item</span>
            <canvas id="myChart2"></canvas>
        </div>
        
        <div class="chart2">
          <span>Revenue Breakdown</span>
            <canvas id="myChart3"></canvas>
        </div>
     </div>
  </div>

  <script>
    // Passing PHP data to JavaScript
    const labels = <?php echo json_encode($labels); ?>;
    const soldData = <?php echo json_encode($soldData); ?>;
    const stockData = <?php echo json_encode($stockData); ?>;

    console.log("Labels: ", labels); // Debugging
    console.log("Sold Data: ", soldData);
    console.log("Stock Data: ", stockData);

    // Bar Chart
    const ctx = document.getElementById('myChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Items in Stock',
                    data: stockData,
                    backgroundColor: ['red', 'green', 'blue', 'yellow', 'purple', 'orange'],
                    borderColor: 'black',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Line Chart
    const ctx2 = document.getElementById('myChart2');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Sold',
                    data: soldData,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)', // Optional for better visuals
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Pie Chart
    const ctx3 = document.getElementById('myChart3');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock Breakdown',
                    data: stockData,
                }]
            },
            options: {
                responsive: true
            }
        });
    }
</script>
