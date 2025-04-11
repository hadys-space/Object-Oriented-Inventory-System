document.addEventListener("DOMContentLoaded", function() {
    const Inventory = (function (){
        let instance;

        function createInstance() {
            const observers = {}
            
            function subscribe(event, callback) {
                if (!observers[event]) {
                    observers[event] = [];
                }
                observers[event].push(callback);
            }

            function notify(event, data) {
                if (observers[event]) {
                    observers[event].forEach(callback => callback(data));
                }
            }

            function handleResponse(response, responseMessage) {
                const message =document.getElementById('message');
                
                if (response.trim() === 'success') {
                    message.textContent = responseMessage;
                    message.style.display = "block";
                    console.log('Response:', responseMessage);
                    notify("refresh_inventory");  // Refresh inventory after action
                } else {
                    message.textContent = responseMessage + ': ' + response;
                    message.style.display = "block";
                }
            }

            function sendRequest(data, callback, errorMessage){
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "inventory.php", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            callback(xhr.responseText);
                           
                        } else {
                            handleResponse(xhr.responseText, errorMessage);
                        }
                    }
                };

                xhr.send(data);
            }

            return {
                subscribe,
                notify,
                handleResponse,
                sendRequest
            };
    }

        return {
            getInstance: function() {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();

    const inventory = Inventory.getInstance();

    inventory.subscribe("view_inventory", ()=> {
        const data = "action=view_inventory";

        inventory.sendRequest(data, (response) => {
            document.getElementById('inventoryTable').innerHTML = response;
            document.getElementById('closeInventoryButton').style.display = 'block';
        }, "Failed to load inventory");
    });

    inventory.subscribe("record_sale", () => {
        const customerFirstName = document.getElementById('firstName').value.trim();
        const customerLastName = document.getElementById('lastName').value.trim();
        const productName = document.getElementById('saleProductName').value.trim();
        const orderDate = document.getElementById('orderDate').value.trim();
        const quantity = parseInt(document.getElementById('saleQuantity').value.trim());
        const cost = parseFloat(document.getElementById('saleCost').value.trim());

        
        if (customerFirstName && customerLastName && productName && orderDate && Number.isInteger(quantity) && quantity > 0 && !isNaN(cost) && cost > 0) {
            const saleData = `action=record_sale&customerFirstName=${encodeURIComponent(customerFirstName)}&customerLastName=${encodeURIComponent(customerLastName)}&productName=${encodeURIComponent(productName)}&orderDate=${encodeURIComponent(orderDate)}&quantity=${encodeURIComponent(quantity)}&cost=${encodeURIComponent(cost)}`;

            inventory.sendRequest(saleData, (response) => {
                inventory.handleResponse(response, "Sale recorded successfully");
                ['firstName', 'lastName', 'saleProductName', 'orderDate', 'saleQuantity', 'saleCost'].forEach(id => document.getElementById(id).value = '');
            }, "Failed to record sale");
        }else{
            alert("Please fill all fields correctly.");
        }
    });

    inventory.subscribe("add_product", () => {
        const itemName = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value.trim();
        const price = parseFloat(document.getElementById('unitPrice').value.trim());
        const quantity = parseInt(document.getElementById('quantity').value.trim());
        
        if (itemName && category &&  Number.isInteger(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
            const productData = `action=add_p&itemName=${encodeURIComponent(itemName)}&category=${encodeURIComponent(category)}&price=${encodeURIComponent(price)}&quantity=${encodeURIComponent(quantity)}`;

            inventory.sendRequest(productData, (response) => {
                inventory.handleResponse(response, "Product added successfully");
                ['productName', 'productCategory', 'unitPrice', 'quantity'].forEach(id => document.getElementById(id).value = '');
            }, "Failed to add product");
        }else{
            alert("Please fill all fields correctly.");
        }
    });

    inventory.subscribe("view_order", () => {
        const data = "action=view_order";
        inventory.sendRequest(data, (response) => {
            document.getElementById('orderTable').innerHTML = response;
            document.getElementById('closeOrderButton').style.display = 'block';
        }, "Failed to load orders");
    });

    inventory.subscribe("delete_product", () => {
        const itemID = parseInt(document.getElementById('ItemID').value.trim());
        const item = document.getElementById('deleteProductItem').value.trim();
        
        if (!isNaN(itemID) && item) {
            const deleteproductData = `action=delete_p&itemID=${encodeURIComponent(itemID)}&item=${encodeURIComponent(item)}`;
        
            inventory.sendRequest(deleteproductData, (response) => {
                inventory.handleResponse(response, "Product deleted successfully");
                ['ItemID', 'deleteProductItem'].forEach(id => document.getElementById(id).value = '');
            }, "Failed to delete product");
        }
        else{
            alert("Please fill all fields correctly.");
        }
    });

    inventory.subscribe("view_customer", () => {
        const data = "action=view_customer";
        inventory.sendRequest(data, (response) => {
            document.getElementById('customerTable').innerHTML = response;
            document.getElementById('closeCustomerButton').style.display = 'block';
        }, "Failed to load customers");
    });

    inventory.subscribe("add_customer", () => {
        const firstname = document.getElementById('customerFirstName').value.trim();
        const lastname = document.getElementById('customerLastName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();

        if (firstname && lastname && phone && email && address) {
            const customerData = `action=add&firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&address=${encodeURIComponent(address)}`;

            inventory.sendRequest(customerData, (response) => {
                inventory.handleResponse(response, "Customer added successfully");
                ['customerFirstName', 'customerLastName', 'customerPhone', 'customerEmail', 'customerAddress'].forEach(id => document.getElementById(id).value = '');
            }, "Failed to add customer");
        } else{
            alert("Please fill all fields correctly.");
        }
    });

    inventory.subscribe("delete_customer", () => {
        const user_id = parseInt(document.getElementById('deleteUserId').value.trim());
        const lastname = document.getElementById('deleteLastName').value.trim();

        if (!isNaN(user_id) && lastname) {
            const deleteData = `action=delete_c&user_id=${encodeURIComponent(user_id)}&lastname=${encodeURIComponent(lastname)}`;
        
            inventory.sendRequest(deleteData, (response) => {
                inventory.handleResponse(response, "Customer deleted successfully");
                ['deleteUserId', 'deleteLastName'].forEach(id => document.getElementById(id).value = '');
            }, "Failed to delete customer");
        }
        else{
            alert("Please fill all fields correctly.");
        }
    });

    document.getElementById("viewInventoryButton").addEventListener('click', () => inventory.notify("view_inventory"));
    document.getElementById("closeInventoryButton").addEventListener('click', () => document.getElementById('inventoryTable').innerHTML = '');
    
    document.getElementById("recordSaleButton").addEventListener('click', () => inventory.notify("record_sale"));
    document.getElementById("viewOrderButton").addEventListener('click', () => inventory.notify("view_order"));
    document.getElementById("closeOrderButton").addEventListener('click', () => document.getElementById('orderTable').innerHTML = '');

    document.getElementById("addProductButton").addEventListener('click', () => inventory.notify("add_product"));
    document.getElementById("deleteProductButton").addEventListener('click', () => inventory.notify("delete_product"));

    document.getElementById("viewCustomerButton").addEventListener('click', () => inventory.notify("view_customer"));
    document.getElementById("closeCustomerButton").addEventListener('click', () => document.getElementById('customerTable').innerHTML = '');
    document.getElementById("addCustomerButton").addEventListener('click', () => inventory.notify("add_customer"));
    document.getElementById('deleteCustomerButton').addEventListener('click', () => inventory.notify("delete_customer"));
    
});