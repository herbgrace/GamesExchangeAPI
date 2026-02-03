CREATE DATABASE IF NOT EXISTS GamesExchangeDB;
USE GamesExchangeDB;

CREATE TABLE IF NOT EXISTS `Users` (
    id BIGINT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    UNIQUE KEY unique_username (username),
    UNIQUE KEY unique_email (email),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Games (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    releaseYear INT NOT NULL,
    releaseSystem VARCHAR(100) NOT NULL,
    `condition` ENUM('Mint', 'Good', 'Fair', 'Poor') NOT NULL,
    previousOwner BIGINT,
    FOREIGN KEY (previousOwner) REFERENCES `Users`(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Offers (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    requestedOwner BIGINT,
    offeredOwner BIGINT,
	gameRequested BIGINT,
	gameOffered BIGINT,
	`status` ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
	FOREIGN KEY (gameRequested) REFERENCES `Games`(id) ON DELETE CASCADE,
	FOREIGN KEY (gameOffered) REFERENCES `Games`(id) ON DELETE CASCADE,
    FOREIGN KEY (requestedOwner) REFERENCES `Users`(id) ON DELETE CASCADE,
    FOREIGN KEY (offeredOwner) REFERENCES `Users`(id) ON DELETE CASCADE
);

INSERT INTO Users (username, email, password, address) VALUES 
("Test Username", "thelen.alexander05@gmail.com", "AwesomePassword", "123 Main St. USA"),
("Another User", "athelen@student.neumont.edu", "Secure", "Something something st.");

INSERT INTO Games (`name`, publisher, releaseYear, releaseSystem, `condition`, previousOwner) VALUES
("Super Mario Bros.", "Nintendo", 1985, "NES", "Good", 1),
("Contra", "Konami", 1988, "NES", "Fair", 2);

INSERT INTO Offers (gameRequested, requestedOwner, gameOffered, offeredOwner) VALUES
(1, 1, 2, 2);