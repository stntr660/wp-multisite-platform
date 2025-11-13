-- Create databases for all WordPress sites
CREATE DATABASE IF NOT EXISTS electroromanos_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS freshexpress_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS sabeel_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS sabeelacademy_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS sumo_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS yvesmorel_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS airarom_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE DATABASE IF NOT EXISTS zonemation_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

-- Create users and grant permissions
CREATE USER IF NOT EXISTS 'electroromanos_user'@'%' IDENTIFIED BY 'electroromanos_secure_password';
GRANT ALL PRIVILEGES ON electroromanos_wp.* TO 'electroromanos_user'@'%';

CREATE USER IF NOT EXISTS 'freshexpress_user'@'%' IDENTIFIED BY 'freshexpress_secure_password';
GRANT ALL PRIVILEGES ON freshexpress_wp.* TO 'freshexpress_user'@'%';

CREATE USER IF NOT EXISTS 'sabeel_user'@'%' IDENTIFIED BY 'sabeel_secure_password';
GRANT ALL PRIVILEGES ON sabeel_wp.* TO 'sabeel_user'@'%';

CREATE USER IF NOT EXISTS 'sabeelacademy_user'@'%' IDENTIFIED BY 'sabeelacademy_secure_password';
GRANT ALL PRIVILEGES ON sabeelacademy_wp.* TO 'sabeelacademy_user'@'%';

CREATE USER IF NOT EXISTS 'sumo_user'@'%' IDENTIFIED BY 'sumo_secure_password';
GRANT ALL PRIVILEGES ON sumo_wp.* TO 'sumo_user'@'%';

CREATE USER IF NOT EXISTS 'yvesmorel_user'@'%' IDENTIFIED BY 'yvesmorel_secure_password';
GRANT ALL PRIVILEGES ON yvesmorel_wp.* TO 'yvesmorel_user'@'%';

CREATE USER IF NOT EXISTS 'airarom_user'@'%' IDENTIFIED BY 'airarom_secure_password';
GRANT ALL PRIVILEGES ON airarom_wp.* TO 'airarom_user'@'%';

CREATE USER IF NOT EXISTS 'zonemation_user'@'%' IDENTIFIED BY 'zonemation_secure_password';
GRANT ALL PRIVILEGES ON zonemation_wp.* TO 'zonemation_user'@'%';

FLUSH PRIVILEGES;