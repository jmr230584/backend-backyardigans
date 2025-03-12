CREATE TABLE cliente(
    id_cliente SERIAL PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL
);

CREATE TABLE meta(
    id_meta SERIAL PRIMARY KEY,
    nome_meta VARCHAR(100) NOT NULL,
    data_inicial DATE NOT NULL,
    data_final DATE NOT NULL,
    categorizacao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL
);

CREATE TABLE banco(
    id_banco SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_meta INT NOT NULL,
    nome_banco VARCHAR(100) NOT NULL,
    saldo DECIMAL(10,2) NOT NULL,
    transacao DECIMAL(10,2) NOT NULL,
    dividas DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_meta) REFERENCES meta(id_meta)
);

INSERT INTO cliente (nome_cliente, data_nascimento, celular, email, senha) VALUES
('Percy Jackson', '1993-08-18', '16994569234', 'percy@olympus.com', 'trident123'),
('Hermione Granger', '1979-09-19', '16995604355', 'hermione@hogwarts.com', 'leviosa123'),
('Katniss Everdeen', '1990-05-10', '16991605340', 'katniss@district12.com', 'mockingjay123'),
('Tris Prior', '1995-08-03', '16998573706', 'tris@dauntless.com', 'divergente123'),
('Thomas', '1995-10-12', '16995427565', 'thomas@glade.com', 'maze123');

INSERT INTO meta (nome_meta, data_inicial, data_final, categorizacao, valor) VALUES
('comprar cabeça-medusa', '2025-01-01', '2025-12-31', 'Aventura', 50000.00),
('comprar varinha', '2025-02-01', '2025-06-30', 'Mistério', 25000.00),
('comprar um arco', '2025-03-01', '2025-05-31', 'Desafio', 30000.00),
('ajudar a irmã', '2025-04-01', '2025-09-30', 'Ação', 45000.00),
('comprar mapa-labirinto', '2025-05-01', '2025-12-01', 'Sobrevivência', 35000.00);

INSERT INTO banco (id_cliente, id_meta, nome_banco, saldo, transacao, dividas) VALUES
(1, 1, 'Banco Olímpico', 10000.00, 2000.00, 1500.00),
(2, 2, 'Gringotes', 12000.00, 3000.00, 800.00),
(3, 3, 'Banco Capitol', 15000.00, 2500.00, 1200.00),
(4, 4, 'Banco Dauntless', 11000.00, 1800.00, 700.00),
(5, 5, 'Banco Glade', 13000.00, 2200.00, 1000.00);
