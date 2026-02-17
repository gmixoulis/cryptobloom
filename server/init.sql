CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    flower_name VARCHAR(255) NOT NULL,
    amount VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- 'ETH' or 'USD'
    tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
