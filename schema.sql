--
-- PostgreSQL database dump
--

CREATE TABLE link_messages (
    ts decimal PRIMARY KEY,
    links text[] NOT NULL,
    message text NOT NULL,
    username text NOT NULL,
    channel text NOT NULL
);
