CREATE TABLE comments(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_project_id INT DEFAULT 0,
    comment_body longtext NOT NULL,
    comment_parent INT DEFAULT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE words(
	bad_words text NOT NULL,	
	good_words text NOT NULL	
);