CREATE USER developer with encrypted password 'secret';
CREATE DATABASE lumens_dev OWNER developer;
GRANT ALL PRIVILEGES ON DATABASE lumens_dev TO developer;

CREATE USER tester with encrypted password 'secret';
CREATE DATABASE lumens_test OWNER tester;
GRANT ALL PRIVILEGES ON DATABASE lumens_test TO tester;
