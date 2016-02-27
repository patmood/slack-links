--
-- PostgreSQL database dump
--

CREATE TABLE link_messages (
    id serial PRIMARY KEY,
    ts decimal NOT NULL,
    links text[] NOT NULL,
    message text NOT NULL,
    username text NOT NULL
);
