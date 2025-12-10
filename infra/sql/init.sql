CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    saldo DECIMAL(10,2),
    transacao DECIMAL(10,2),
    dividas DECIMAL(10,2),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_meta) REFERENCES meta(id_meta)
);


ALTER TABLE cliente ADD COLUMN status_cliente BOOLEAN DEFAULT TRUE
ALTER TABLE meta ADD COLUMN status_meta BOOLEAN DEFAULT TRUE
ALTER TABLE banco ADD COLUMN status_banco BOOLEAN DEFAULT TRUE


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


-- CREATE USUARIOS
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    nome VARCHAR(70) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(50) NOT NULL
);

-- Criar a função gerar_senha_padrao apenas se não existir
CREATE OR REPLACE FUNCTION gerar_senha_padrao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.senha := NEW.username || '1234';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar a trigger trigger_gerar_senha apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_gerar_senha') THEN
        CREATE TRIGGER trigger_gerar_senha
        BEFORE INSERT ON Usuario
        FOR EACH ROW
        EXECUTE FUNCTION gerar_senha_padrao();
    END IF;
END $$;

SELECT * FROM usuario


INSERT INTO usuario (nome, username, email) 
VALUES
('João Silva', 'joao.silva', 'joao.silva@email.com'),
('Maria Oliveira', 'maria.oliveira', 'maria.oliveira@email.com'),
('Carlos Souza', 'carlos.souza', 'carlos.souza@email.com');



ALTER TABLE usuario
ADD COLUMN status_usuario BOOLEAN DEFAULT true;

UPDATE usuario SET senha = encode(digest(senha, 'sha1'), 'hex');



ALTER TABLE usuario ADD COLUMN imagem_perfil VARCHAR(100);


ALTER TABLE usuario
ALTER COLUMN senha TYPE VARCHAR(255);

DROP TRIGGER IF EXISTS trigger_gerar_senha ON usuario;
DROP FUNCTION IF EXISTS gerar_senha_padrao;

ALTER TABLE usuario ALTER COLUMN imagem_perfil DROP NOT NULL;

ALTER TABLE Usuario ALTER COLUMN senha TYPE VARCHAR(100);


