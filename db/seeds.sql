INSERT INTO departments (department_name)
VALUES
('Front of House'),
('Backroom'),
('Guitars'),
('Pro Audio and Pianos'),
('Drums and Percussion'),


INSERT INTO roles (title, salary, department_id)
VALUES
('Store Manager', 78000.00, 1),
('Inventory Manager', 65000.00, 2),
('Sales Manager', 55000.00, 1),
('Guitar Sales Rep', 36500.00, 3),
('Drum Tech', 36500.00, 5),
('Piano Sales Rep', 36500.00, 4),
('Pro Audio Sales Rep', 45000.00, 4),

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jared', 'Keeso', 1, 1),
('Nathan', 'Dales', 3, 1),
('Michelle', 'Mylett', 2, 2),
('Jacob', 'Tierney', 4, 3),
('Tyler', 'Johnston', 4, 3),
('Dylan', 'Playfair', 4, 3),
('Evan', 'Stern', 5, 5),
('Lisa', 'Codrington', 5, 5),
('Bryan', 'Carroll', 6, 4),
('Aaron', 'Marshall', 7, 4),
('Plini', 'Holgate', 7, 4),