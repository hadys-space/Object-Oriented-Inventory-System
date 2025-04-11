<?php
class DatabaseConnection {
    private static $instance = null;
    private $connection;
    private $host = 'localhost';
    private $dbname = 'inventory database';
    private $username = 'root';
    private $password = '';
    

    private function __construct() {
        try {
            $this->connection = new PDO("mysql:host=$this->host;dbname=$this->dbname;charset=utf8mb4", $this->username, $this->password);
        } catch (PDOException $e) {
            die("Database Connection failed: " . $e->getMessage());
        }
        
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new DatabaseConnection();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}


?>