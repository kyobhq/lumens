CREATE USER dev with encrypted password 'secret';
CREATE DATABASE lumens_dev OWNER dev;
GRANT ALL PRIVILEGES ON DATABASE lumens_dev TO dev;

CREATE USER tester with encrypted password 'secret';
CREATE DATABASE lumens_test OWNER tester;
GRANT ALL PRIVILEGES ON DATABASE lumens_test TO tester;
