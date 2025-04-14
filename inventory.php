<?php 
    require_once 'databaseConnection.php'; // Include the database connection file
    

    $conn = DatabaseConnection::getInstance()->getConnection();
    // Set the header to tell the browser it's a plain text response
    header('Content-Type: text/plain');

    // Read the incoming POST data (URL-encoded)
    $action = isset($_POST['action']) ? $_POST['action'] : null;

    $response = '';

    if (!$action) {
        $response = 'Action not specified';
        echo $response;
        exit();
    }

    if ($action === 'add') {
        // Add customer to the database
        $firstname = $_POST['firstname'];
        $lastname = $_POST['lastname'];
        $phone = $_POST['phone'];
        $email = $_POST['email'];
        $address = $_POST['address'];

        $stmt = $conn->prepare("INSERT INTO customers (`First Name`, `Last Name`, `Phone No.`, `Email`, `Address`) VALUES (:firstname, :lastname, :phone, :email, :address)");

        $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
        $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);

        if ($stmt->execute()) {
            $response = 'Customer added successfully';
        } else {
            $response = 'Failed to add customer';
        }

        $stmt = $conn->prepare('SELECT FROM inventory ');



    }elseif($action === 'add_p'){
            // Capture input data from the form submission
            $itemName = $_POST['itemName'];
            $itemCategory = $_POST['category'];
            $unitPrice = $_POST['price'];
            $quantity = $_POST['quantity'];
            

            $stmt = $conn->prepare("SELECT `Total In Stock` FROM inventory WHERE `Name of Item` = :itemName");
            $stmt->bindParam(":itemName", $itemName, PDO::PARAM_STR);
            $stmt->execute();

            $inventory = $stmt->fetch(PDO::FETCH_ASSOC);

            if($inventory){
                $newStock = $inventory["Total In Stock"]+ $quantity;
                
                $stmt = $conn->prepare("UPDATE inventory SET `Total In Stock` = :newStock WHERE `Name of Item` = :itemName");
                // Bind the parameters to the prepared statement
                $stmt->bindParam(':newStock', $newStock, PDO::PARAM_INT);
                $stmt->bindParam(':itemName', $itemName, PDO::PARAM_STR);
                
                
        
                if ($stmt->execute()) {
                    $response = 'Product stock updated successfully';
                } else {
                    $response = 'Failed to update product stock';
                }

            } else{
                 $stmt = $conn->prepare("INSERT INTO inventory ( `Name of Item`, `Item Category`, `Unit Price`, `Total In Stock`)
                            VALUES (:itemName, :category, :price, :quantity)");
            // Bind the parameters to the prepared statement
                $stmt->bindParam(':itemName', $itemName, PDO::PARAM_STR);
                $stmt->bindParam(':category', $itemCategory, PDO::PARAM_STR);
                $stmt->bindParam(':price', $unitPrice, PDO::PARAM_INT); 
                $stmt->bindParam(':quantity',  $quantity, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    $response = 'Product added successfully in inventory';
                       
                } else {
                    $response = 'Failed to add or update product in inventory';
                }
    }
    } elseif ($action === 'delete_c') {
        // Delete customer
        $userID = $_POST['user_id'];
        $lastname = $_POST['lastname'];

        $stmt = $conn->prepare("DELETE FROM customers WHERE `User ID` = :user_id AND `Last Name` = :lastname");

        $stmt->bindParam(':user_id', $userID, PDO::PARAM_INT);
        $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);

        if ($stmt->execute()) {
            $response = 'Customer deleted successfully';
        } else {
            $response = 'Failed to delete customer';
        }
    } elseif ($action === 'view_customer') {
        // Fetch inventory from the database
        $stmt = $conn->query("SELECT `First Name`, `Last Name`, `User ID`, `Phone No.`, `Email`, `Address` FROM customers");
    
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Start building the HTML table
        echo "<table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>User ID</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>";
    
        // Loop through each item and display in table rows
        foreach ($customers as $customer) {
            echo "<tr>
                    <td>{$customer['First Name']}</td>
                    <td>{$customer['Last Name']}</td>
                    <td>{$customer['User ID']}</td>
                    <td>{$customer['Phone No.']}</td>
                    <td>{$customer['Email']}</td>
                    <td>{$customer['Address']}</td>
                  </tr>";
        }
    
        // Close the table tags
        echo "</tbody></table>";
    


}elseif ($action === 'record_sale') {
        // Record a sale
        $customerFirstName = $_POST['customerFirstName'];
        $customerLastName = $_POST['customerLastName'];
        $productName = $_POST['productName'];
        $orderDate = $_POST['orderDate'];
        $cost = $_POST['cost'];
        $quantity = $_POST['quantity'];
        
        $totalCost = $cost * $quantity;

        // Adjust the query based on your database structure
        $stmt = $conn->prepare("INSERT INTO orders (`First Name`, `Last Name`, `Name of Item`,`Order Date`, `Quantity`, `Total Amount`) VALUES (:customerFirstName, :customerLastName, :productName, :orderDate, :quantity, :totalCost)");
        
        $stmt->bindParam(':customerFirstName', $customerFirstName, PDO::PARAM_STR);
        $stmt->bindParam(':customerLastName', $customerLastName, PDO::PARAM_STR);
        $stmt->bindParam(':productName', $productName, PDO::PARAM_STR);
        $stmt->bindParam(':orderDate', $orderDate, PDO::PARAM_STR);
        $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
        $stmt->bindParam(':totalCost', $totalCost, PDO::PARAM_INT);

        
        if ($stmt->execute()) {
            $orderNo = $conn->lastInsertId();
            

            //Want to make sale the same time 
            //Taking the Order No., First Name, Last Name, Name of Item, ... for the email
            /*$stmt = $conn->prepare("SELECT `First Name`,`Last Name`,`Name of Item`, `Quantity`, `Order Date`, `Total Amount` FROM orders WHERE `Order No.`= :orderNo");
            $stmt->bindParam(":orderNo", $orderNo, PDO::PARAM_INT);

            $orders=$stmt->fetch(PDO::FETCH_ASSOC);
            $fname = $orders["First Name"];
            $lname = $orders["Last Name"];
            $itemName = $orders["Name of Item"];
            $quantity = $orders["Quantity"];
            $order_date = $orders["Order Date"];
            $totalAmount = $orders["Total Amount"];*/
            
            
            //Update the inventory table
            //update the In Stock and Total Sold
            $stmt = $conn->prepare("SELECT `Total In Stock`, `Total Sold` FROM inventory WHERE `Name of Item` = :productName");
            $stmt->bindParam(":productName", $productName, PDO::PARAM_STR);
            $stmt->execute();
            $inventory = $stmt->fetch(PDO::FETCH_ASSOC);
            $totalInStock = $inventory["Total In Stock"];
            $totalSold = $inventory["Total Sold"];

            if($quantity <= $totalInStock) {
                $newTotalStock = $totalInStock - $quantity;
                $newTotalSold = $totalSold + $quantity;

                $stmt = $conn->prepare("UPDATE inventory SET `Total In Stock` = :newTotalStock, `Total Sold` = :newTotalSold 
                                        WHERE `Name of Item` = :productName");

                $stmt->bindParam(':newTotalStock', $newTotalStock, PDO::PARAM_INT);
                $stmt->bindParam(':newTotalSold', $newTotalSold, PDO::PARAM_INT);
                $stmt->bindParam(':productName', $productName, PDO::PARAM_STR);
                $stmt->execute();
            }

        
            $response = 'Sale recorded successfully';
        } else {
            $response = 'Failed to record sale';
        }

    } elseif ($action === 'view_inventory') {
        // Fetch inventory from the database
        $stmt = $conn->query("SELECT `Item ID`, `Name of Item`, `Item Category`, `Unit Price`, `Total In Stock`, `Total Sold` FROM inventory");
    
        $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Start building the HTML table
        echo "<table>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Name of Item</th>
                        <th>Item Category</th>
                        <th>Unit Price</th>
                        <th>Total In Stock</th>
                        <th>Total Sold</th>
                    </tr>
                </thead>
                <tbody>";
    
        // Loop through each item and display in table rows
        foreach ($inventory as $item) {
            echo "<tr>
                    <td>{$item['Item ID']}</td>
                    <td>{$item['Name of Item']}</td>
                    <td>{$item['Item Category']}</td>
                    <td>{$item['Unit Price']}</td>
                    <td>{$item['Total In Stock']}</td>
                    <td>{$item['Total Sold']}</td>
                  </tr>";
        }
    
        // Close the table tags
        echo "</tbody></table>";
    

    }elseif($action === 'delete_p'){

        $itemID = $_POST['itemID']; 
        $item = $_POST['item'];

        $stmt = $conn->prepare("DELETE FROM inventory WHERE `Item ID` = :itemID AND `Name of Item` = :item");

        $stmt->bindParam(':itemID', $itemID, PDO::PARAM_INT );
        $stmt->bindParam(':item', $item, PDO::PARAM_STR);

        if ($stmt->execute()) {
            $response = 'Product deleted successfully';
        } else {
            $response = 'Failed to delete product';
        }
    }elseif ($action === 'view_order') {
            // Fetch inventory from the database
            $stmt = $conn->query("SELECT `Order No.`, `First Name`, `Last Name`, `Name of Item`, `Order Date`, `Quantity`, `Total Amount` FROM orders");
        
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            // Start building the HTML table
            echo "<table>
                    <thead>
                        <tr>
                            <th>Order No.</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Name of Item</th>
                            <th>Order Date</th>
                            <th>Quantity</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>";
        
            // Loop through each item and display in table rows
            foreach ($orders as $order) {
                echo "<tr>
                        <td>{$order['Order No.']}</td>
                        <td>{$order['First Name']}</td>
                        <td>{$order['Last Name']}</td>
                        <td>{$order['Name of Item']}</td>
                        <td>{$order['Order Date']}</td>
                        <td>{$order['Quantity']}</td>
                        <td>{$order['Total Amount']}</td>
                      </tr>";
            }
        
            // Close the table tags
            echo "</tbody></table>";
        
    

    }else {
        // Invalid action
        $response = 'Invalid action specified';
    }

    // Send the response (plain text)
    echo $response;
?>

