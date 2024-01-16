INSERT INTO department (name)
VALUES
('Front of House'),
('Backroom');

INSERT INTO role (title, salary, department_id)
VALUES
('Store Manager', 78000.00, 1),
('Inventory Manager', 65000.00, 2),
('Sales Manager', 55000.00, 1),
('Guitar Sales Rep', 36500.00, 1),
('Guitar Merch', 36500.00, 2),
('Piano Sales Rep', 36500.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jared', 'Keeso', 1, NULL),
('Nathan', 'Dales', 3, NULL),
('Michelle', 'Mylett', 2, NULL),
('Jacob', 'Tierney', 4, 1),
('Tyler', 'Johnston', 5, 2),
('Bryan', 'Carroll', 6, 1),
('Aaron', 'Marshall', 4, 1),
('Plini', 'Holgate', 5, 2);