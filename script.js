document.addEventListener("DOMContentLoaded", function() {

    // Function to handle the response from the server
    function handleResponse(response, responseMessage) {
        const message =document.getElementById('message');
        
        if (response.trim() === 'success') {
            message.textContent = responseMessage;
            message.style.display = "block";
            console.log('Response:', responseMessage);
            loadInventory();  // Refresh inventory after action
        } else {
            message.textContent = responseMessage + ': ' + response;
            message.style.display = "block";
        }
    }

    document.getElementById('viewInventoryButton').addEventListener('click', () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "inventory.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        const data = "action=view_inventory"; // Specify the action to fetch the inventory

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Insert the fetched inventory data into the HTML
                document.getElementById('inventoryTable').innerHTML = xhr.responseText;
                document.getElementById('closeInventoryButton').style.display = 'block';
            } else {
                console.error('Error fetching inventory:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(data); // Send the request
    });

    document.getElementById('closeInventoryButton').addEventListener('click', () => {
        // Hide the inventory table and the Close Inventory button
        document.getElementById('inventoryTable').innerHTML = ''; // Clear the inventory content
        
    });
    // Event Listener for recording a sale
    document.getElementById('recordSaleButton').addEventListener('click', () => {
        const customerFirstName = document.getElementById('firstName').value.trim();
        const customerLastName = document.getElementById('lastName').value.trim();
        const productName = document.getElementById('saleProductName').value.trim();
        const orderDate = document.getElementById('orderDate').value.trim();
        const quantity = parseInt(document.getElementById('saleQuantity').value.trim());
        const cost = parseFloat(document.getElementById('saleCost').value.trim());

        
        if (customerFirstName && customerLastName && productName && orderDate && Number.isInteger(quantity) && quantity > 0 && !isNaN(cost) && cost > 0) {
            const saleData = `action=record_sale&customerFirstName=${encodeURIComponent(customerFirstName)}&customerLastName=${encodeURIComponent(customerLastName)}&productName=${encodeURIComponent(productName)}&orderDate=${encodeURIComponent(orderDate)}&quantity=${encodeURIComponent(quantity)}&cost=${encodeURIComponent(cost)}`;

            // Create the XMLHttpRequest object directly here
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "inventory.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    handleResponse(xhr.responseText, 'Sale recorded and invoice sent!');
                    document.getElementById('firstName').value = '';
                    document.getElementById('lastName').value = '';
                    document.getElementById('saleProductName').value = '';
                    document.getElementById('orderDate').value = '';
                    document.getElementById('saleQuantity').value = '';
                    document.getElementById('saleCost').value = '';
                } else {
                    handleResponse(xhr.responseText, 'Failed to record sale');
                }
            };

            xhr.send(saleData);  
            // Send the URL-encoded form data
        
        } else {
            alert('Please fill in all fields');
        }
    });

    document.getElementById('viewOrderButton').addEventListener('click', () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "inventory.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        const data = "action=view_Order"; // Specify the action to fetch the inventory

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Insert the fetched inventory data into the HTML
                document.getElementById('orderTable').innerHTML = xhr.responseText;
                document.getElementById('closeOrderButton').style.display = 'block';
            } else {
                console.error('Error fetching inventory:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(data); // Send the request
    });

    document.getElementById('closeOrderButton').addEventListener('click', () => {
        // Hide the inventory table and the Close Inventory button
        document.getElementById('orderTable').innerHTML = ''; // Clear the inventory content
        
    });
    // Event Listener for adding a product
    document.getElementById('addProductButton').addEventListener('click', () => {
        const itemName = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value.trim();
        const price = parseFloat(document.getElementById('unitPrice').value.trim());
        const quantity = parseInt(document.getElementById('quantity').value.trim());
        
        if (itemName && category &&  Number.isInteger(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
            const productData = `action=add_p&itemName=${encodeURIComponent(itemName)}&category=${encodeURIComponent(category)}&price=${encodeURIComponent(price)}&quantity=${encodeURIComponent(quantity)}`;

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "inventory.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {  // Check if the request is complete
                    handleResponse('Response:', xhr.responseText, 'Product Added Sucessfully');
                    document.getElementById('productName').value = '';
                    document.getElementById('productCategory').value = '';
                    document.getElementById('unitPrice').value = '';
                    document.getElementById('quantity').value = '';
                      // Log the raw response    
                }
                else{
                    handleResponse('Response:', xhr.responseText, 'Failed to Add Product Sucessfully');    
                }
            };
            

            xhr.send(productData);  // Send the URL-encoded form data
        } else {
            alert('Please fill in all product fields');
        }
        
    });

    document.getElementById('deleteProductButton').addEventListener('click', () => {
        const itemID = parseInt(document.getElementById('ItemID').value.trim());
        const item = document.getElementById('deleteProductItem').value.trim();
        
        if (!isNaN(itemID) && item) {
            const deleteproductData = `action=delete_p&itemID=${encodeURIComponent(itemID)}&item=${encodeURIComponent(item)}`;

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "inventory.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    handleResponse('Response:', xhr.responseText, 'Product deleted successfully');

                    document.getElementById('ItemID').value = '';
                    document.getElementById('deleteProductItem').value = '';
                } else {
                   // console.error('Error:', xhr.status, xhr.statusText);
                    handleResponse('Response:',xhr.responseText, 'Failed to delete product');
                }
            };

            xhr.send(deleteproductData);  // Send the URL-encoded form data
        } else {
            alert('Please fill in all product fields');
        }
        
    });

    document.getElementById('viewCustomerButton').addEventListener('click', () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "inventory.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        const data = "action=view_Customer"; // Specify the action to fetch the inventory

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Insert the fetched inventory data into the HTML
                document.getElementById('customerTable').innerHTML = xhr.responseText;
                document.getElementById('closeCustomerButton').style.display = 'block';
            } else {
                console.error('Error fetching inventory:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(data); // Send the request
    });

    document.getElementById('closeCustomerButton').addEventListener('click', () => {
        // Hide the inventory table and the Close Inventory button
        document.getElementById('customerTable').innerHTML = ''; // Clear the inventory content
        
    });

    // Event Listener for adding a customer
    document.getElementById('addCustomerButton').addEventListener('click', () => {
        const firstname = document.getElementById('customerFirstName').value.trim();
        const lastname = document.getElementById('customerLastName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();

        if (firstname && lastname && phone && email && address) {
            const customerData = `action=add&firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&address=${encodeURIComponent(address)}`;

            // Create the XMLHttpRequest object directly here
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "inventory.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    handleResponse(xhr.responseText, 'Customer added successfully');

                    document.getElementById('customerFirstName').value = '';
                    document.getElementById('customerLastName').value = '';
                    document.getElementById('customerPhone').value = '';
                    document.getElementById('customerEmail').value = '';
                    document.getElementById('customerAddress').value = '';
                } else {
                    handleResponse('Response:', xhr.responseText, 'Failed to add customer');
                }
            };

            xhr.send(customerData);  // Send the URL-encoded form data
        } else {
            alert('Please fill in all customer fields');
        }
    });

    // Event Listener for deleting a customer
    document.getElementById('deleteCustomerButton').addEventListener('click', () => {
        const user_id = parseInt(document.getElementById('deleteUserId').value.trim());
        const lastname = document.getElementById('deleteLastName').value.trim();

        if (!isNaN(user_id) && lastname) {
            const deleteData = `action=delete_c&user_id=${encodeURIComponent(user_id)}&lastname=${encodeURIComponent(lastname)}`;

            // Create the XMLHttpRequest object directly here
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "inventory.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {  // Make sure request is complete
                    console.log('Response:', xhr.responseText);  // Log response to check its contents
                    
                    if (xhr.status === 200) {
                        handleResponse(xhr.responseText, 'Sale recorded and invoice sent!');
                        document.getElementById('deleteUserId').value = '';
                        document.getElementById('deleteLastName').value = '';
                        
                    } else {
                        console.error('Error:', xhr.status, xhr.statusText);
                        handleResponse(xhr.responseText, 'Failed to record sale');
                    }
                }
            };
            

            xhr.send(deleteData);  // Send the URL-encoded form data
        } else {
            alert('Please fill in all customer fields');
        }
    });

});
