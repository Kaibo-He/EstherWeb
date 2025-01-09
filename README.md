Database setting
CREATE TABLE Works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    cover VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    cover VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES Works(id) ON DELETE CASCADE
);

CREATE TABLE ChapterDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    content TEXT NOT NULL,
    content_en TEXT,
    content_type ENUM('image', 'video', 'link', 'text') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(id) ON DELETE CASCADE
);

CREATE TABLE Characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    cover VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES Works(id) ON DELETE CASCADE
);

CREATE TABLE CharacterDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id INT NOT NULL,
    detail TEXT NOT NULL,
    detail_en TEXT,
    detail_type ENUM('image', 'video', 'link', 'text') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES Characters(id) ON DELETE CASCADE
);
