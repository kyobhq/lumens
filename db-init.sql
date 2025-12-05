CREATE USER dev with encrypted password 'secret';
CREATE DATABASE monorepo_dev OWNER dev;
GRANT ALL PRIVILEGES ON DATABASE monorepo_dev TO dev;

CREATE USER tester with encrypted password 'secret';
CREATE DATABASE monorepo_test OWNER tester;
GRANT ALL PRIVILEGES ON DATABASE monorepo_test TO tester;
