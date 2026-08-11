```mermaid
erDiagram
    Role ||--o{ User : has
    ProductCategory ||--o{ Product : contains
    Warehouse ||--o{ Location : contains
    Warehouse ||--o{ StockMovement : receives
    Warehouse ||--o{ StockLevel : contains
    Warehouse ||--o{ InventoryCount : has
    Product ||--o{ StockMovement : moves
    Product ||--o{ StockLevel : tracks
    Product ||--o{ InventoryCountLine : counted
    InventoryCount ||--o{ InventoryCountLine : contains
    Location ||--o{ StockMovement : records

    Role {
        int id PK
        RoleName name UK
    }

    User {
        int id PK
        string fullName
        string email UK
        string passwordHash
        int roleId FK
    }

    ProductCategory {
        int id PK
        string name UK
    }

    Product {
        int id PK
        string reference UK
        string name
        int minStock
        int categoryId FK
    }

    Warehouse {
        int id PK
        string name
        WarehouseType type
        string description
    }

    Location {
        int id PK
        string code
        string name
        string description
        int warehouseId FK
    }

    StockMovement {
        int id PK
        StockMovementType type
        int quantity
        string reference
        int productId FK
        int warehouseId FK
        int locationId FK
        int relatedMovementId FK
        string reason
    }

    StockLevel {
        int id PK
        int productId FK
        int warehouseId FK
        int quantity
    }

    InventoryCount {
        int id PK
        int warehouseId FK
        string status
        datetime createdAt
        datetime validatedAt
    }

    InventoryCountLine {
        int id PK
        int inventoryCountId FK
        int productId FK
        int systemQty
        int countedQty
        int discrepancy
        string justification
    }

    AuditLog {
        int id PK
        string action
        string entity
        int entityId
        int userId FK
        string userEmail
        datetime createdAt
    }
