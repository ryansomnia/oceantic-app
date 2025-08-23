CREATE TABLE test_users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('PUTRA', 'PUTRI'),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    club_name VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20)
);

CREATE TABLE test_events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(100),
    event_date DATE,
    location VARCHAR(100),
    base_price DECIMAL(10,2)
);

CREATE TABLE test_strokes (
    stroke_id INT PRIMARY KEY AUTO_INCREMENT,
    stroke_name VARCHAR(50)
);

CREATE TABLE test_age_categories (
    age_category_id INT PRIMARY KEY AUTO_INCREMENT,
    age_min INT,
    age_max INT,
    category_name VARCHAR(10)
);

CREATE TABLE test_distances (
    distance_id INT PRIMARY KEY AUTO_INCREMENT,
    distance_meter INT
);

CREATE TABLE test_stroke_categories (
    stroke_category_id INT PRIMARY KEY AUTO_INCREMENT,
    stroke_id INT,
    age_category_id INT,
    distance_id INT,
    FOREIGN KEY (stroke_id) REFERENCES strokes(stroke_id),
    FOREIGN KEY (age_category_id) REFERENCES age_categories(age_category_id),
    FOREIGN KEY (distance_id) REFERENCES distances(distance_id)
);

CREATE TABLE test_registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    event_id INT,
    base_payment_status ENUM('Pending', 'Paid'),
    total_price DECIMAL(10,2),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE test_registration_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT,
    stroke_category_id INT,
    jenis_renang ENUM('PUTRA', 'PUTRI'),
    is_additional BOOLEAN,
    price DECIMAL(10,2),
    heat_number INT,
    lane_number INT,
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
    FOREIGN KEY (stroke_category_id) REFERENCES stroke_categories(stroke_category_id)
);
